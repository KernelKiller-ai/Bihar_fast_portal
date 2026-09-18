import os
import hmac
import logging
import hashlib
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta, time
from fastapi import APIRouter, HTTPException, Query, Request, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator
from database import get_db

logger = logging.getLogger("class10_quiz")
quiz_router = APIRouter(prefix="/api/quiz", tags=["Universal Exam & Quiz Engine"])

IST_ZONE = timezone(timedelta(hours=5, minutes=30))
DAILY_ATTEMPT_LIMIT = 6

bearer_scheme = HTTPBearer(auto_error=False)
ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "").strip()


# ==================== SECURITY & AUTHENTICATION ====================

def verify_quiz_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)
):
    """Admin Token verification for managing quizzes from frontend."""
    if not ADMIN_API_TOKEN:
        logger.critical("ADMIN_API_TOKEN is not configured on server!")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="ADMIN_API_TOKEN not configured"
        )
    if (
        not credentials 
        or credentials.scheme.lower() != "bearer" 
        or not hmac.compare_digest(credentials.credentials.strip(), ADMIN_API_TOKEN)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or missing admin token"
        )
    return True

def get_current_ist_time() -> datetime:
    return datetime.now(timezone.utc).astimezone(IST_ZONE)

def extract_client_ip(request: Request) -> str:
    cf_connecting_ip = request.headers.get("cf-connecting-ip")
    if cf_connecting_ip:
        return cf_connecting_ip.strip()

    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()

    return request.client.host if request.client else "unknown_ip"

def get_secure_ip_hash(ip_address: str, target_date: str) -> str:
    # Future-proof dynamic salt (changes automatically by year)
    secret_salt = f"BIHARFAST_IP_SHIELD_{target_date[:4]}"
    return hashlib.sha256(f"{secret_salt}:{ip_address}:{target_date}".encode()).hexdigest()

def enforce_ip_rate_limit(supabase, ip_hash: str, today_str: str) -> int:
    try:
        res = (
            supabase.table("quiz_ip_rate_limits")
            .select("attempt_count")
            .eq("ip_hash", ip_hash)
            .eq("attempt_date", today_str)
            .limit(1)
            .execute()
        )

        current_attempts = res.data[0]["attempt_count"] if res.data else 0

        if current_attempts >= DAILY_ATTEMPT_LIMIT:
            logger.warning(f"Rate limit exceeded for IP Hash {ip_hash[:10]}...")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"सुरक्षा सीमा समाप्त: आपके IP पते से आज के सभी {DAILY_ATTEMPT_LIMIT} टेस्ट प्रयास पूरे हो चुके हैं। कृपया कल पुनः प्रयास करें।"
            )

        new_count = current_attempts + 1
        supabase.table("quiz_ip_rate_limits").upsert({
            "ip_hash": ip_hash,
            "attempt_date": today_str,
            "attempt_count": new_count,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }, on_conflict="ip_hash,attempt_date").execute()

        return new_count

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"IP Rate limit check error: {e}")
        return 0


# ==================== PYDANTIC SCHEMAS ====================

class TimingStatus(BaseModel):
    is_live: bool = True
    active_slot: Optional[str] = "24x7_live"
    slot_name: Optional[str] = "Live Practice Set"
    message: str = "🟢 लाइव टेस्ट 24x7 सक्रिय है!"
    window_start: Optional[str] = "00:00"
    window_end: Optional[str] = "23:59"
    window_end_at: Optional[str] = None
    next_slot_time: Optional[str] = "Always Live"

class QuestionOut(BaseModel):
    id: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    order_index: int

class QuizMetadataOut(BaseModel):
    id: str
    title: str
    subject: str
    slot: str
    total_questions: int
    duration_minutes: int

class TodayQuizResponse(BaseModel):
    is_live: bool
    timing_status: TimingStatus
    quiz: Optional[QuizMetadataOut] = None
    questions: List[QuestionOut] = []
    message: Optional[str] = None

class SubmitAnswersRequest(BaseModel):
    quiz_id: str = Field(..., min_length=1, max_length=100)
    student_name: str = Field("छात्र", min_length=2, max_length=50)
    district: str = Field("बिहार", min_length=2, max_length=50)
    phone: Optional[str] = Field(None, max_length=15)
    answers: Dict[str, str] = Field(default_factory=dict, max_length=150)

    @field_validator("student_name", "district")
    @classmethod
    def sanitize_text(cls, value: str) -> str:
        clean = re.sub(r"[<>\"'%;()&+]", "", value).strip()
        return clean if clean else "परीक्षार्थी"

    @field_validator("answers")
    @classmethod
    def validate_answers(cls, value: Dict[str, str]) -> Dict[str, str]:
        normalized = {}
        for question_id, answer in value.items():
            clean_id = str(question_id).strip()
            clean_answer = str(answer).strip().upper()
            if not clean_id or len(clean_id) > 100:
                raise ValueError("Invalid question ID")
            if clean_answer not in {"A", "B", "C", "D"}:
                raise ValueError("Answers must be A, B, C, or D")
            normalized[clean_id] = clean_answer
        return normalized

class QuestionResultItem(BaseModel):
    id: str
    question_text: str
    user_choice: Optional[str]
    correct_option: str
    is_correct: bool
    explanation: Optional[str]

class SubmitQuizResponse(BaseModel):
    total_questions: int
    attempted: int
    correct_count: int
    wrong_count: int
    score: int
    accuracy_percentage: float
    remaining_attempts_today: int
    results: List[QuestionResultItem]

class LeaderboardEntry(BaseModel):
    rank: int
    student_name: str
    district: str
    score: int
    total_questions: int
    accuracy: float
    submitted_at: str

class AdminQuizCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    subject: str = Field("class_10", min_length=2)
    slot: str = Field("slot_1")
    quiz_date: str = Field(...)
    duration_minutes: int = Field(15, ge=1, le=240)
    is_active: bool = True

class AdminQuestionItem(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    explanation: Optional[str] = ""

class AdminBatchQuestionRequest(BaseModel):
    quiz_id: str
    questions: List[AdminQuestionItem]


# ==================== 24x7 ACTIVE ENGINE ====================

def evaluate_exam_window(current_dt: Optional[datetime] = None) -> TimingStatus:
    return TimingStatus(
        is_live=True,
        active_slot="anytime",
        slot_name="24x7 Live Mock Test",
        message="🟢 टेस्ट 24x7 सक्रिय है! कभी भी टेस्ट दें और अपनी तैयारी परखें।",
        window_start="00:00 AM",
        window_end="11:59 PM",
        window_end_at=None,
        next_slot_time="Always Live"
    )


# ==================== PUBLIC ENDPOINTS (FUTURE-PROOF SELECTION) ====================

@quiz_router.get(
    "/available",
    summary="Get all available live tests for student selection cards"
)
def get_available_quizzes():
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        res = (
            supabase.table("class10_quizzes")
            .select("id, title, subject, slot, quiz_date, total_questions, duration_minutes")
            .eq("is_active", True)
            .order("quiz_date", desc=True)
            .order("created_at", desc=True)
            .execute()
        )
        return {"success": True, "data": res.data or []}
    except Exception as e:
        logger.error(f"Error fetching available quizzes: {e}")
        return {"success": False, "data": []}


@quiz_router.get(
    "/today",
    response_model=TodayQuizResponse,
    summary="Fetch chosen test or latest active fallback with zero random jumping"
)
def get_today_quiz(
    quiz_id: Optional[str] = Query(None, description="Direct Quiz UUID selected by student"),
    subject: Optional[str] = Query(None, description="Exam ID (e.g. bseb_10_110, bihar_police_constable)")
):
    timing = evaluate_exam_window()
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    now_ist = get_current_ist_time()
    today_str = now_ist.date().isoformat()
    clean_quiz_id = quiz_id.strip() if quiz_id else None
    clean_subject = subject.strip().lower() if subject else None

    quiz_data = None
    try:
        # 1. User chose specific quiz card (Highest Priority)
        if clean_quiz_id:
            q_res = (
                supabase.table("class10_quizzes")
                .select("id, title, subject, slot, total_questions, duration_minutes")
                .eq("id", clean_quiz_id)
                .eq("is_active", True)
                .limit(1)
                .execute()
            )
            quiz_data = q_res.data[0] if q_res.data else None

        # 2. User chose specific subject/stream
        elif clean_subject:
            # Look for today's active quiz for this exact subject
            q_res = (
                supabase.table("class10_quizzes")
                .select("id, title, subject, slot, total_questions, duration_minutes")
                .eq("subject", clean_subject)
                .eq("quiz_date", today_str)
                .eq("is_active", True)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            quiz_data = q_res.data[0] if q_res.data else None

            # Fallback to latest active quiz for this exact subject
            if not quiz_data:
                fb_res = (
                    supabase.table("class10_quizzes")
                    .select("id, title, subject, slot, total_questions, duration_minutes")
                    .eq("subject", clean_subject)
                    .eq("is_active", True)
                    .order("quiz_date", desc=True)
                    .order("created_at", desc=True)
                    .limit(1)
                    .execute()
                )
                quiz_data = fb_res.data[0] if fb_res.data else None

        # 3. Default fallback if nothing passed
        else:
            fb_res = (
                supabase.table("class10_quizzes")
                .select("id, title, subject, slot, total_questions, duration_minutes")
                .eq("is_active", True)
                .order("quiz_date", desc=True)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            quiz_data = fb_res.data[0] if fb_res.data else None

    except Exception as e:
        logger.error(f"Error querying active quiz: {e}")
        quiz_data = None

    if not quiz_data:
        timing.is_live = False
        return TodayQuizResponse(
            is_live=False,
            timing_status=timing,
            quiz=None,
            questions=[],
            message="इस परीक्षा के लिए वर्तमान में कोई टेस्ट सक्रिय नहीं है।"
        )

    try:
        q_res = (
            supabase.table("class10_questions")
            .select("id, question_text, option_a, option_b, option_c, option_d, order_index")
            .eq("quiz_id", quiz_data["id"])
            .order("order_index", desc=False)
            .execute()
        )
        raw_questions = q_res.data or []
    except Exception as e:
        logger.error(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve test questions")

    if not raw_questions:
        timing.is_live = False
        return TodayQuizResponse(
            is_live=False,
            timing_status=timing,
            quiz=None,
            questions=[],
            message="इस टेस्ट में अभी कोई प्रश्न अपलोड नहीं किए गए हैं।"
        )

    formatted_questions = [
        QuestionOut(
            id=str(q["id"]),
            question_text=q["question_text"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            order_index=q.get("order_index", 0)
        )
        for q in raw_questions
    ]

    return TodayQuizResponse(
        is_live=True,
        timing_status=timing,
        quiz=QuizMetadataOut(**quiz_data),
        questions=formatted_questions,
        message=timing.message
    )


@quiz_router.post(
    "/submit",
    response_model=SubmitQuizResponse,
    summary="Evaluate candidate submissions with 6 attempts/day limit"
)
def submit_quiz_answers(sub: SubmitAnswersRequest, request: Request):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")

    now_ist = get_current_ist_time()
    today_str = now_ist.date().isoformat()

    client_ip = extract_client_ip(request)
    ip_hash = get_secure_ip_hash(client_ip, today_str)
    attempts_used = enforce_ip_rate_limit(supabase, ip_hash, today_str)
    remaining_attempts = max(0, DAILY_ATTEMPT_LIMIT - attempts_used)

    clean_quiz_id = sub.quiz_id.strip()

    try:
        db_res = (
            supabase.table("class10_questions")
            .select("id, question_text, correct_option, explanation, order_index")
            .eq("quiz_id", clean_quiz_id)
            .order("order_index", desc=False)
            .execute()
        )
        db_questions = db_res.data or []
    except Exception as e:
        logger.error(f"Error loading questions: {e}")
        raise HTTPException(status_code=500, detail="Failed to evaluate test answers")

    if not db_questions:
        raise HTTPException(status_code=404, detail="No questions found for the supplied quiz ID")

    question_ids = {str(question["id"]) for question in db_questions}
    unknown_question_ids = set(sub.answers) - question_ids
    if unknown_question_ids:
        raise HTTPException(status_code=422, detail="Answers contain invalid question IDs")

    total = len(db_questions)
    correct = 0
    wrong = 0
    attempted = 0
    detailed_breakdown = []

    for q in db_questions:
        q_id = str(q["id"])
        user_ans = sub.answers.get(q_id)
        actual_ans = str(q.get("correct_option", "")).strip().upper()
        
        is_attempted = user_ans is not None
        is_correct = (user_ans == actual_ans) if is_attempted else False

        if is_attempted:
            attempted += 1
            if is_correct:
                correct += 1
            else:
                wrong += 1

        detailed_breakdown.append(
            QuestionResultItem(
                id=q_id,
                question_text=q["question_text"],
                user_choice=user_ans,
                correct_option=actual_ans,
                is_correct=is_correct,
                explanation=q.get("explanation") or "NCERT आधिकारिक मॉडल उत्तर।"
            )
        )

    accuracy = round((correct / (correct + wrong)) * 100, 1) if (correct + wrong) > 0 else 0.0

    try:
        supabase.table("class10_leaderboard").insert({
            "quiz_id": clean_quiz_id,
            "student_name": sub.student_name,
            "district": sub.district,
            "phone": sub.phone,
            "score": correct,
            "total_questions": total,
            "accuracy": accuracy
        }).execute()
    except Exception as err:
        logger.warning(f"Leaderboard insert error: {err}")

    return SubmitQuizResponse(
        total_questions=total,
        attempted=attempted,
        correct_count=correct,
        wrong_count=wrong,
        score=correct,
        accuracy_percentage=accuracy,
        remaining_attempts_today=remaining_attempts,
        results=detailed_breakdown
    )


@quiz_router.get(
    "/leaderboard/{quiz_id}",
    response_model=List[LeaderboardEntry],
    summary="Get top rankers for a quiz"
)
def get_quiz_leaderboard(quiz_id: str, limit: int = 25):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        res = (
            supabase.table("class10_leaderboard")
            .select("student_name, district, score, total_questions, accuracy, created_at")
            .eq("quiz_id", quiz_id.strip())
            .order("score", desc=True)
            .order("created_at", desc=False)
            .limit(limit)
            .execute()
        )
        data = res.data or []

        leaderboard = []
        for index, item in enumerate(data, start=1):
            leaderboard.append(
                LeaderboardEntry(
                    rank=index,
                    student_name=item["student_name"],
                    district=item.get("district") or "बिहार",
                    score=item["score"],
                    total_questions=item["total_questions"],
                    accuracy=float(item.get("accuracy", 0.0)),
                    submitted_at=str(item["created_at"])[:16].replace("T", " ")
                )
            )
        return leaderboard
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {e}")
        return []


# ==================== ADMIN FULL-CONTROL SUITE ====================

@quiz_router.get("/admin/all-quizzes", summary="Admin: Fetch all test slots")
def admin_get_all_quizzes(_: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        res = (
            supabase.table("class10_quizzes")
            .select("id, title, subject, slot, quiz_date, total_questions, duration_minutes, is_active, created_at")
            .order("quiz_date", desc=True)
            .limit(100)
            .execute()
        )
        return {"success": True, "data": res.data or []}
    except Exception as e:
        logger.error(f"Error fetching admin quizzes: {e}")
        return {"success": True, "data": []}


@quiz_router.get("/admin/quiz-questions/{quiz_id}", summary="Admin: Fetch questions of a quiz")
def admin_get_quiz_questions(quiz_id: str, _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")
    try:
        res = (
            supabase.table("class10_questions")
            .select("*")
            .eq("quiz_id", quiz_id.strip())
            .order("order_index", desc=False)
            .execute()
        )
        return {"success": True, "data": res.data or []}
    except Exception as e:
        logger.error(f"Error fetching quiz questions: {e}")
        return {"success": True, "data": []}


@quiz_router.post("/admin/create-quiz", summary="Admin: Create or schedule new quiz slot")
def admin_create_quiz(payload: AdminQuizCreateRequest, _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    data = {
        "title": payload.title.strip(),
        "subject": payload.subject.strip().lower(),
        "slot": payload.slot.strip(),
        "quiz_date": payload.quiz_date,
        "duration_minutes": payload.duration_minutes,
        "total_questions": 0,
        "is_active": payload.is_active
    }
    
    try:
        res = supabase.table("class10_quizzes").insert(data).execute()
        return {"success": True, "data": res.data[0] if res.data else None}
    except Exception as e:
        logger.error(f"Error creating quiz: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create quiz: {e}")


@quiz_router.post("/admin/toggle-status/{quiz_id}", summary="Admin: Turn ON/OFF test")
def admin_toggle_quiz_status(quiz_id: str, is_active: bool = Query(...), _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        supabase.table("class10_quizzes").update({"is_active": is_active}).eq("id", quiz_id.strip()).execute()
        return {"success": True, "message": f"Quiz status updated to {is_active}"}
    except Exception as e:
        logger.error(f"Error toggling quiz status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")


@quiz_router.delete("/admin/question/{question_id}", summary="Admin: Delete a specific question")
def admin_delete_question(question_id: str, quiz_id: str = Query(...), _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")
    try:
        clean_quiz_id = quiz_id.strip()
        supabase.table("class10_questions").delete().eq("id", question_id.strip()).execute()
        
        cnt_res = supabase.table("class10_questions").select("id", count="exact").eq("quiz_id", clean_quiz_id).execute()
        new_count = cnt_res.count or 0
        supabase.table("class10_quizzes").update({"total_questions": new_count}).eq("id", clean_quiz_id).execute()
        
        return {"success": True, "remaining": new_count}
    except Exception as e:
        logger.error(f"Error deleting question: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete question")


@quiz_router.delete("/admin/quiz/{quiz_id}", summary="Admin: Delete entire quiz")
def admin_delete_entire_quiz(quiz_id: str, _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")
    try:
        supabase.table("class10_quizzes").delete().eq("id", quiz_id.strip()).execute()
        return {"success": True, "message": "Quiz deleted permanently"}
    except Exception as e:
        logger.error(f"Error deleting entire quiz: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete quiz")


@quiz_router.post("/admin/add-questions", summary="Admin: Add questions batch")
def admin_add_questions_batch(payload: AdminBatchQuestionRequest, _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    clean_quiz_id = payload.quiz_id.strip()

    try:
        count_res = supabase.table("class10_questions").select("id", count="exact").eq("quiz_id", clean_quiz_id).execute()
        existing_count = count_res.count or 0
    except Exception:
        existing_count = 0

    formatted = []
    for idx, q in enumerate(payload.questions, start=existing_count + 1):
        formatted.append({
            "quiz_id": clean_quiz_id,
            "question_text": q.question_text.strip(),
            "option_a": q.option_a.strip(),
            "option_b": q.option_b.strip(),
            "option_c": q.option_c.strip(),
            "option_d": q.option_d.strip(),
            "correct_option": q.correct_option.strip().upper(),
            "explanation": q.explanation.strip() if q.explanation else "NCERT आधिकारिक मॉडल उत्तर।",
            "order_index": idx
        })

    if formatted:
        try:
            supabase.table("class10_questions").insert(formatted).execute()
            supabase.table("class10_quizzes").update({"total_questions": existing_count + len(formatted)}).eq("id", clean_quiz_id).execute()
        except Exception as e:
            logger.error(f"Error saving questions: {e}")
            raise HTTPException(status_code=500, detail="Failed to save questions")

    return {"success": True, "count": len(formatted)}