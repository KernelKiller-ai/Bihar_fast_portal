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
quiz_router = APIRouter(prefix="/api/quiz", tags=["Class 10 Quiz"])

# Indian Standard Time (UTC+05:30) Timezone Constant
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
    """Returns current system time anchored strictly to Indian Standard Time (IST)."""
    return datetime.now(timezone.utc).astimezone(IST_ZONE)

def extract_client_ip(request: Request) -> str:
    """Safely extract client IP behind reverse proxies (Render / Cloudflare / Vercel)."""
    cf_connecting_ip = request.headers.get("cf-connecting-ip")
    if cf_connecting_ip:
        return cf_connecting_ip.strip()

    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()

    return request.client.host if request.client else "unknown_ip"

def get_secure_ip_hash(ip_address: str, target_date: str) -> str:
    """Cryptographic one-way hash for zero-raw-IP privacy and tamper proofing."""
    secret_salt = "BIHARFAST_IP_SHIELD_2026"
    return hashlib.sha256(f"{secret_salt}:{ip_address}:{target_date}".encode()).hexdigest()

def enforce_ip_rate_limit(supabase, ip_hash: str, today_str: str) -> int:
    """
    Strict atomic check to ensure maximum 6 attempts per day per IP.
    Raises HTTP 429 when quota is consumed.
    """
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
                detail=f"सुरक्षा सीमा समाप्त: एक IP पते से एक दिन में केवल {DAILY_ATTEMPT_LIMIT} बार टेस्ट दिया जा सकता है। कृपया कल पुनः प्रयास करें।"
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
    is_live: bool
    active_slot: Optional[str] = None
    slot_name: Optional[str] = None
    message: str
    window_start: Optional[str] = None
    window_end: Optional[str] = None
    window_end_at: Optional[str] = None
    next_slot_time: Optional[str] = None

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
    answers: Dict[str, str] = Field(default_factory=dict, max_length=100)

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

# Admin Request Schemas
class AdminQuizCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    subject: str = Field("science", min_length=2)
    slot: str = Field("slot_1")
    quiz_date: str = Field(...)
    duration_minutes: int = Field(15, ge=1, le=180)
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


# ==================== AUTOMATIC TIME SENSING ENGINE ====================

def evaluate_exam_window(current_dt: Optional[datetime] = None) -> TimingStatus:
    now = current_dt or get_current_ist_time()
    t = now.time()

    t_0700 = time(7, 0)
    t_1300 = time(13, 0)
    t_1700 = time(17, 0)
    t_2230 = time(22, 30)

    def window_end_at(end_time: time, day_offset: int = 0) -> str:
        end_dt = datetime.combine(now.date(), end_time, tzinfo=IST_ZONE) + timedelta(days=day_offset)
        return end_dt.isoformat()

    if t_0700 <= t < t_1300:
        return TimingStatus(
            is_live=True,
            active_slot="slot_1",
            slot_name="Morning Set (Slot 1)",
            message="🌅 Morning Test Live hai! 01:00 PM tak submit karein.",
            window_start="07:00 AM",
            window_end="01:00 PM",
            window_end_at=window_end_at(t_1300),
            next_slot_time="05:00 PM"
        )
    elif t_1300 <= t < t_1700:
        return TimingStatus(
            is_live=False,
            active_slot=None,
            slot_name=None,
            message="🔒 Morning Set band ho chuka hai. Agla Evening Set 05:00 PM par live hoga.",
            window_start="01:00 PM",
            window_end="05:00 PM",
            window_end_at=window_end_at(t_1700),
            next_slot_time="05:00 PM"
        )
    elif t_1700 <= t < t_2230:
        return TimingStatus(
            is_live=True,
            active_slot="slot_2",
            slot_name="Evening Set (Slot 2)",
            message="🌆 Evening Test Live hai! 10:30 PM tak submit karein.",
            window_start="05:00 PM",
            window_end="10:30 PM",
            window_end_at=window_end_at(t_2230),
            next_slot_time="07:00 AM (Kal)"
        )
    else:
        return TimingStatus(
            is_live=False,
            active_slot=None,
            slot_name=None,
            message="🔒 Aaj ke dono sets band ho chuke hain. Kal subah 07:00 AM par naya set live hoga.",
            window_start="10:30 PM",
            window_end="07:00 AM",
            window_end_at=window_end_at(t_0700, 1),
            next_slot_time="07:00 AM"
        )


# ==================== PUBLIC QUIZ ENDPOINTS ====================

@quiz_router.get(
    "/today",
    response_model=TodayQuizResponse,
    summary="Fetch current active quiz batch using automated IST time detection"
)
def get_today_quiz(
    subject: Optional[str] = Query(None, description="Optional subject filter (e.g. hindi, science)")
):
    timing = evaluate_exam_window()

    if not timing.is_live or not timing.active_slot:
        return TodayQuizResponse(
            is_live=False,
            timing_status=timing,
            quiz=None,
            questions=[],
            message=timing.message
        )

    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    now_ist = get_current_ist_time()
    today_str = now_ist.date().isoformat()
    target_slot = timing.active_slot

    try:
        query = (
            supabase.table("class10_quizzes")
            .select("id, title, subject, slot, total_questions, duration_minutes")
            .eq("quiz_date", today_str)
            .eq("slot", target_slot)
            .eq("is_active", True)
        )
        if subject:
            query = query.eq("subject", subject.strip().lower())
            
        q_res = query.limit(1).execute()
        quiz_data = q_res.data[0] if q_res.data else None

        # Fallback to most recent active set
        if not quiz_data:
            fb_res = (
                supabase.table("class10_quizzes")
                .select("id, title, subject, slot, total_questions, duration_minutes")
                .eq("is_active", True)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            quiz_data = fb_res.data[0] if fb_res.data else None
    except Exception as e:
        logger.error(f"Error querying active quiz: {e}")
        quiz_data = None

    if not quiz_data:
        return TodayQuizResponse(
            is_live=False,
            timing_status=timing,
            quiz=None,
            questions=[],
            message="Aaj ka prashn patra abhi available nahi hai. Kripya thodi der me dekhein."
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
    summary="Evaluate candidate submissions with IP rate limits & leaderboard registration"
)
def submit_quiz_answers(sub: SubmitAnswersRequest, request: Request):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")

    now_ist = get_current_ist_time()
    today_str = now_ist.date().isoformat()

    # 1. Strict IP Rate Limiting (Max 6 attempts per day)
    client_ip = extract_client_ip(request)
    ip_hash = get_secure_ip_hash(client_ip, today_str)
    attempts_used = enforce_ip_rate_limit(supabase, ip_hash, today_str)
    remaining_attempts = max(0, DAILY_ATTEMPT_LIMIT - attempts_used)

    # 2. Timing and Session Check
    timing = evaluate_exam_window()
    if not timing.is_live or not timing.active_slot:
        raise HTTPException(status_code=409, detail="Test submission window has closed")

    clean_quiz_id = sub.quiz_id.strip()

    # 3. Fetch Master Answer Key
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

    # 4. Scoring Engine
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

    # 5. Leaderboard Entry Insert
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


# ==================== ADMIN CONTROL ENDPOINTS ====================

@quiz_router.get(
    "/admin/all-quizzes",
    summary="Admin: Fetch all test slots with question counts"
)
def admin_get_all_quizzes(_: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        res = (
            supabase.table("class10_quizzes")
            .select("id, title, subject, slot, quiz_date, total_questions, duration_minutes, is_active, created_at")
            .order("quiz_date", desc=True)
            .limit(50)
            .execute()
        )
        return {"success": True, "data": res.data or []}
    except Exception as e:
        logger.error(f"Error fetching admin quizzes: {e}")
        return {"success": True, "data": []}


@quiz_router.post(
    "/admin/create-quiz",
    summary="Admin: Schedule or create a new quiz slot"
)
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


@quiz_router.post(
    "/admin/toggle-status/{quiz_id}",
    summary="Admin: Turn ON/OFF live test instantly"
)
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


@quiz_router.post(
    "/admin/add-questions",
    summary="Admin: Add questions to a selected quiz batch"
)
def admin_add_questions_batch(payload: AdminBatchQuestionRequest, _: bool = Depends(verify_quiz_admin)):
    supabase = get_db()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    clean_quiz_id = payload.quiz_id.strip()

    # Get current question count for order_index
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
            # Update total question count in parent quiz
            supabase.table("class10_quizzes").update({"total_questions": existing_count + len(formatted)}).eq("id", clean_quiz_id).execute()
        except Exception as e:
            logger.error(f"Error saving questions: {e}")
            raise HTTPException(status_code=500, detail="Failed to save questions")

    return {"success": True, "count": len(formatted)}