import logging
from typing import Dict, Any, List, Optional
from datetime import date
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field, constr
from database import get_db

logger = logging.getLogger("class10_quiz")
quiz_router = APIRouter(prefix="/api/quiz", tags=["Class 10 Quiz"])

# ==================== PYDANTIC SCHEMAS ====================

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
    quiz: Optional[QuizMetadataOut]
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


# ==================== ENDPOINTS ====================

@quiz_router.get(
    "/today",
    response_model=TodayQuizResponse,
    summary="Fetch current active quiz batch without answer leakage"
)
def get_today_quiz(
    slot: str = Query("slot_1", regex="^slot_[12]$", description="Slot identifier: slot_1 or slot_2"),
    subject: Optional[str] = Query(None, description="Optional subject filter (e.g. hindi, science)")
):
    supabase = get_db()
    if not supabase:
        logger.critical("Database connection unavailable during /today quiz fetch.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable"
        )

    today_str = date.today().isoformat()

    # 1. Attempt lookup for today's active slot
    try:
        query = (
            supabase.table("class10_quizzes")
            .select("id, title, subject, slot, total_questions, duration_minutes")
            .eq("quiz_date", today_str)
            .eq("slot", slot)
            .eq("is_active", True)
        )
        if subject:
            query = query.eq("subject", subject.strip().lower())
            
        q_res = query.limit(1).execute()
        quiz_data = q_res.data[0] if q_res.data else None
    except Exception as e:
        logger.error(f"Error querying active quiz for {today_str} [{slot}]: {e}")
        quiz_data = None

    # 2. Fallback to latest active quiz for this slot if no current record
    if not quiz_data:
        try:
            fallback_query = (
                supabase.table("class10_quizzes")
                .select("id, title, subject, slot, total_questions, duration_minutes")
                .eq("slot", slot)
                .eq("is_active", True)
            )
            if subject:
                fallback_query = fallback_query.eq("subject", subject.strip().lower())

            fallback_res = fallback_query.order("created_at", desc=True).limit(1).execute()
            if not fallback_res.data:
                return TodayQuizResponse(quiz=None, questions=[], message="No active mock quiz available.")
            quiz_data = fallback_res.data[0]
        except Exception as e:
            logger.error(f"Error executing fallback quiz query: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to load mock test"
            )

    # 3. Retrieve questions (Strict omission of correct_option & explanation)
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
        quiz=QuizMetadataOut(**quiz_data),
        questions=formatted_questions
    )


@quiz_router.post(
    "/submit",
    response_model=SubmitQuizResponse,
    summary="Evaluate candidate submissions with server-side validation"
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

    # 1. Fetch master answer key from backend database
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
        logger.error(f"Error loading questions for evaluation of quiz {clean_quiz_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate test answers"
        )

    if not db_questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found for the supplied quiz ID"
        )

    # 2. Strict evaluation logic
    total = len(db_questions)
    correct = 0
    wrong = 0
    detailed_breakdown = []

    for q in db_questions:
        q_id = str(q["id"])
        raw_user_ans = sub.answers.get(q_id)
        user_ans = raw_user_ans.strip().upper() if raw_user_ans else None
        
        # Normalize and guard expected answer
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
                explanation=q.get("explanation") or "NCERT मानक उत्तर कुंजी के अनुसार।"
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