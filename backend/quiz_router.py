import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta, time
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from database import get_db

logger = logging.getLogger("class10_quiz")
quiz_router = APIRouter(prefix="/api/quiz", tags=["Class 10 Quiz"])

# Indian Standard Time (UTC+05:30) Timezone Constant
IST_ZONE = timezone(timedelta(hours=5, minutes=30))

# ==================== PYDANTIC SCHEMAS ====================

class TimingStatus(BaseModel):
    is_live: bool
    active_slot: Optional[str] = None
    slot_name: Optional[str] = None
    message: str
    window_start: Optional[str] = None
    window_end: Optional[str] = None
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
    quiz_id: str = Field(..., description="UUID of the quiz batch")
    answers: Dict[str, str] = Field(
        default_factory=dict, 
        description="Map of question_id to selected option (A, B, C, D)"
    )

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
    results: List[QuestionResultItem]


# ==================== AUTOMATIC TIME SENSING ENGINE ====================

def get_current_ist_time() -> datetime:
    """Returns current system time anchored strictly to Indian Standard Time (IST)."""
    return datetime.now(timezone.utc).astimezone(IST_ZONE)

def evaluate_exam_window(current_dt: Optional[datetime] = None) -> TimingStatus:
    """
    Automatic slot detection according to BSEB daily schedule:
    - Morning Slot (slot_1): 07:00 AM to 01:00 PM IST
    - Afternoon Break (Locked): 01:00 PM to 05:00 PM IST
    - Evening Slot (slot_2): 05:00 PM to 10:30 PM IST
    - Night Lock: 10:30 PM to 07:00 AM IST
    """
    now = current_dt or get_current_ist_time()
    t = now.time()

    # Time Boundaries
    t_0700 = time(7, 0)
    t_1300 = time(13, 0)
    t_1700 = time(17, 0)
    t_2230 = time(22, 30)

    # 1. Morning Slot (07:00 AM - 01:00 PM)
    if t_0700 <= t < t_1300:
        return TimingStatus(
            is_live=True,
            active_slot="slot_1",
            slot_name="Morning Set (Slot 1)",
            message="🌅 Morning Test Live hai! 01:00 PM tak submit karein.",
            window_start="07:00 AM",
            window_end="01:00 PM",
            next_slot_time="05:00 PM"
        )

    # 2. Afternoon Window (01:00 PM - 05:00 PM)
    elif t_1300 <= t < t_1700:
        return TimingStatus(
            is_live=False,
            active_slot=None,
            slot_name=None,
            message="🔒 Morning Set band ho chuka hai. Agla Evening Set 05:00 PM par live hoga.",
            window_start="01:00 PM",
            window_end="05:00 PM",
            next_slot_time="05:00 PM"
        )

    # 3. Evening Slot (05:00 PM - 10:30 PM)
    elif t_1700 <= t < t_2230:
        return TimingStatus(
            is_live=True,
            active_slot="slot_2",
            slot_name="Evening Set (Slot 2)",
            message="🌆 Evening Test Live hai! 10:30 PM tak submit karein.",
            window_start="05:00 PM",
            window_end="10:30 PM",
            next_slot_time="07:00 AM (Kal)"
        )

    # 4. Night Window (10:30 PM - 07:00 AM)
    else:
        return TimingStatus(
            is_live=False,
            active_slot=None,
            slot_name=None,
            message="🔒 Aaj ke dono sets band ho chuke hain. Kal subah 07:00 AM par naya set live hoga.",
            window_start="10:30 PM",
            window_end="07:00 AM",
            next_slot_time="07:00 AM"
        )


# ==================== ENDPOINTS ====================

@quiz_router.get(
    "/today",
    response_model=TodayQuizResponse,
    summary="Fetch current active quiz batch using automated IST time detection"
)
def get_today_quiz(
    subject: Optional[str] = Query(None, description="Optional subject filter (e.g. hindi, science)")
):
    timing = evaluate_exam_window()

    # Agar test window band hai, sawal deliver nahi kiye jayenge
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
        logger.critical("Database connection unavailable during /today quiz fetch.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable"
        )

    now_ist = get_current_ist_time()
    today_str = now_ist.date().isoformat()
    target_slot = timing.active_slot

    # 1. Lookup quiz for today's date & detected slot
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
    except Exception as e:
        logger.error(f"Error querying active quiz for {today_str} [{target_slot}]: {e}")
        quiz_data = None

    # 2. Resilient fallback to most recent active quiz in this slot
    if not quiz_data:
        try:
            fallback_query = (
                supabase.table("class10_quizzes")
                .select("id, title, subject, slot, total_questions, duration_minutes")
                .eq("slot", target_slot)
                .eq("is_active", True)
            )
            if subject:
                fallback_query = fallback_query.eq("subject", subject.strip().lower())

            fallback_res = fallback_query.order("created_at", desc=True).limit(1).execute()
            if not fallback_res.data:
                return TodayQuizResponse(
                    is_live=False,
                    timing_status=timing,
                    quiz=None,
                    questions=[],
                    message="Prashn patra update kiya ja raha hai. Kripya thodi der me dekhein."
                )
            quiz_data = fallback_res.data[0]
        except Exception as e:
            logger.error(f"Error executing fallback quiz query: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to load mock test"
            )

    # 3. Fetch questions (Strict exclusion of correct_option & explanation)
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
        logger.error(f"Error fetching questions for quiz {quiz_data['id']}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve test questions"
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
    summary="Evaluate candidate submissions with server-side scoring"
)
def submit_quiz_answers(sub: SubmitAnswersRequest):
    supabase = get_db()
    if not supabase:
        logger.critical("Database connection unavailable during test submission.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Scoring engine temporarily unreachable"
        )

    clean_quiz_id = sub.quiz_id.strip()
    if not clean_quiz_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid or missing quiz_id"
        )

    # 1. Fetch master answer key
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
        logger.error(f"Error loading questions for quiz {clean_quiz_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate test answers"
        )

    if not db_questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found for the supplied quiz ID"
        )

    # 2. Server-side validation
    total = len(db_questions)
    correct = 0
    wrong = 0
    detailed_breakdown = []

    for q in db_questions:
        q_id = str(q["id"])
        raw_user_ans = sub.answers.get(q_id)
        user_ans = raw_user_ans.strip().upper() if raw_user_ans else None
        
        actual_ans = str(q.get("correct_option", "")).strip().upper()
        
        is_attempted = bool(user_ans)
        is_correct = (user_ans == actual_ans) if is_attempted else False

        if is_attempted:
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
                explanation=q.get("explanation") or "NCERT आधिकारिक मॉडल उत्तर कुंजी।"
            )
        )

    accuracy = round((correct / (correct + wrong)) * 100, 1) if (correct + wrong) > 0 else 0.0

    return SubmitQuizResponse(
        total_questions=total,
        attempted=len([v for v in sub.answers.values() if v and v.strip()]),
        correct_count=correct,
        wrong_count=wrong,
        score=correct,
        accuracy_percentage=accuracy,
        results=detailed_breakdown
    )