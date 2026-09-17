import os
import re
import hashlib
import logging
from urllib.parse import urlparse
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, timezone, timedelta, date
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(override=False)

logger = logging.getLogger("biharfast_db")

# Indian Standard Time (UTC+05:30) Timezone
IST_ZONE = timezone(timedelta(hours=5, minutes=30))

def get_current_ist_date() -> str:
    """Returns the current date formatted as YYYY-MM-DD anchored strictly to Indian Standard Time (IST)."""
    return datetime.now(timezone.utc).astimezone(IST_ZONE).date().isoformat()

# ==================== SUPABASE CLIENT CONFIGURATION ====================

SUPABASE_URL = (os.getenv("SUPABASE_URL") or "").strip()
SUPABASE_KEY = (
    os.getenv("SUPABASE_SECRET_KEY")
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_KEY")
    or ""
).strip()

_supabase_client: Optional[Client] = None

def init_supabase() -> Optional[Client]:
    """Initializes and returns a cached Supabase client singleton."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.error("SUPABASE_URL or SUPABASE_KEY missing from environment configuration!")
        return None

    try:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
        return _supabase_client
    except Exception as e:
        logger.critical(f"Failed to connect to Supabase: {e}", exc_info=True)
        return None

def get_db() -> Optional[Client]:
    """FastAPI dependency or internal accessor for Supabase DB client."""
    global _supabase_client
    if _supabase_client is None:
        return init_supabase()
    return _supabase_client

# Initialize on module import
init_supabase()

# ==================== CONSTANTS & STRING UTILITIES ====================

HOME_FEED_COLUMNS = (
    "id, slug, title, department, category, total_posts, last_date, "
    "eligibility, fees, apply_url, pdf_url, created_at, status"
)

OFFICIAL_ALLOWED_DOMAINS = {
    "bceceboard.bihar.gov.in", "bpsc.bih.nic.in", "bpsc.bihar.gov.in",
    "onlinebpsc.bihar.gov.in", "csbc.bih.nic.in", "csbc.bihar.gov.in",
    "bpssc.bih.nic.in", "bssc.bihar.gov.in", "btsc.bihar.gov.in",
    "biharboardonline.bihar.gov.in", "patnahighcourt.gov.in", "dlrs.bihar.gov.in",
    "rrbpatna.gov.in", "ssc.gov.in", "upsc.gov.in", "upsconline.nic.in",
    "ibps.in", "sbi.co.in", "rbi.org.in", "indianrailways.gov.in",
    "rrbapply.gov.in", "indiapostgdsonline.gov.in", "nta.ac.in",
    "joinindianarmy.nic.in", "joinindiannavy.gov.in", "agnipathvayu.cdac.in",
    "crpf.gov.in", "bsf.gov.in", "cisf.gov.in", "itbpolice.nic.in", "ssb.gov.in"
}

def is_official_https_url(url: Optional[str]) -> bool:
    if not url:
        return True
    try:
        parsed = urlparse(url.strip())
        hostname = (parsed.hostname or "").lower()
        return (
            parsed.scheme == "https"
            and bool(parsed.netloc)
            and any(hostname == domain or hostname.endswith("." + domain) for domain in OFFICIAL_ALLOWED_DOMAINS)
        )
    except Exception:
        return False

def compute_content_hash(
    title: str,
    dept: str,
    pdf_url: Optional[str] = None,
    apply_url: Optional[str] = None,
) -> str:
    """Creates the stable key used by the scraped inbox unique constraint."""
    clean_title = re.sub(r"\s+", " ", title or "").strip().lower()
    clean_dept = (dept or "").strip().lower()
    clean_pdf = (pdf_url or "").strip().lower()
    clean_apply = (apply_url or "").strip().lower()
    raw_str = f"{clean_dept}:{clean_title}:{clean_pdf}:{clean_apply}"
    return hashlib.md5(raw_str.encode("utf-8")).hexdigest()

def generate_expected_slug(title: str, dept: str) -> str:
    """Generates an SEO-safe canonical slug matching live published notices."""
    combined = f"{dept}-{title}"
    slug = re.sub(r"[^\w\s-]", "", combined.lower()).strip()
    return re.sub(r"[\s_-]+", "-", slug)[:90]

# ==================== SCRAPED INBOX (RAW NOTICES PIPELINE) ====================

def insert_inbox_notice(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    title = (record.get("title") or "").strip()
    dept = (record.get("department") or "").strip()
    pdf_url = record.get("pdf_url")
    apply_url = record.get("apply_url")

    if not title:
        return None
    if not is_official_https_url(pdf_url) or not is_official_https_url(apply_url):
        raise ValueError("Only approved HTTPS official URLs may be stored")

    inbox_payload = {
        "title": title,
        "department": dept,
        "category": record.get("category", "jobs"),
        "pdf_url": pdf_url,
        "apply_url": apply_url,
        "content_hash": compute_content_hash(title, dept, pdf_url, apply_url),
        "status": "unprocessed"
    }

    try:
        res = client.table("scraped_inbox").upsert(
            inbox_payload,
            on_conflict="content_hash",
            ignore_duplicates=True,
        ).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.warning(f"Skipping inbox notice insert: {e}")
        return None

def fetch_inbox_notices(status: str = "unprocessed", limit: int = 100) -> List[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    query = client.table("scraped_inbox").select("*")
    if status:
        query = query.eq("status", status)

    res = query.order("created_at", desc=True).limit(limit).execute()
    inbox_items = res.data or []
    if not inbox_items:
        return []

    live_slugs = set()
    live_titles = set()
    try:
        live_res = client.table("notices").select("slug, title").limit(1000).execute()
        for row in (live_res.data or []):
            if row.get("slug"):
                live_slugs.add(row["slug"])
            if row.get("title"):
                live_titles.add(row["title"].strip().lower())
    except Exception as e:
        logger.error(f"Error fetching live notices for cross-verification: {e}")

    for item in inbox_items:
        expected_slug = generate_expected_slug(item.get("title", ""), item.get("department", ""))
        clean_title = (item.get("title") or "").strip().lower()
        item["is_already_published"] = (expected_slug in live_slugs) or (clean_title in live_titles)
        item["expected_slug"] = expected_slug

    return inbox_items

def fetch_inbox_item_by_id(item_id: str) -> Optional[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")
    res = client.table("scraped_inbox").select("*").eq("id", item_id).limit(1).execute()
    return res.data[0] if res.data else None

def update_inbox_status(item_id: str, status: str) -> Optional[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")
    res = client.table("scraped_inbox").update({"status": status}).eq("id", item_id).execute()
    return res.data[0] if res.data else None

# ==================== DAILY AI USAGE LEDGER ====================

def check_and_increment_daily_llm_quota(max_limit: int = 10) -> bool:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    today_str = get_current_ist_date()
    try:
        result = client.rpc(
            "increment_daily_llm_quota",
            {"p_usage_date": today_str, "p_max_limit": max_limit},
        ).execute()
    except Exception as exc:
        logger.error("Atomic AI quota reservation failed: %s", exc)
        raise RuntimeError("AI quota service unavailable") from exc

    return bool(result.data)

def get_today_llm_usage() -> Dict[str, int]:
    client = get_db()
    if not client:
        return {"used": 0, "remaining": 10, "limit": 10}

    today_str = get_current_ist_date()
    res = client.table("ai_usage_ledger").select("posts_generated").eq("usage_date", today_str).limit(1).execute()
    used = res.data[0].get("posts_generated", 0) if res.data else 0
    return {
        "used": used,
        "remaining": max(0, 10 - used),
        "limit": 10
    }

# ==================== RECRUITMENT NOTICES (PUBLIC & ADMIN) ====================

def fetch_feed_notices(category: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    query = (
        client.table("notices")
        .select(HOME_FEED_COLUMNS)
        .eq("is_active", True)
        .eq("status", "published")
    )

    if category:
        query = query.eq("category", category)
    else:
        query = query.in_("category", ["jobs", "admit_card", "results"])

    res = query.order("created_at", desc=True).limit(limit).execute()
    return res.data or []

def fetch_notice_by_slug(slug: str, include_unapproved: bool = False) -> Optional[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    query = client.table("notices").select("*").eq("slug", slug)
    if not include_unapproved:
        query = query.eq("status", "published")

    res = query.limit(1).execute()
    return res.data[0] if res.data else None

def fetch_all_slugs_for_sitemap() -> List[Dict[str, Any]]:
    client = get_db()
    if not client:
        return []

    try:
        res = (
            client.table("notices")
            .select("slug, updated_at, created_at")
            .eq("is_active", True)
            .eq("status", "published")
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []
    except Exception as e:
        logger.error(f"Error fetching slugs for sitemap: {e}")
        return []

def fetch_admin_notices(status: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    query = client.table("notices").select("*")
    if status:
        query = query.eq("status", status)

    res = query.order("created_at", desc=True).limit(limit).execute()
    return res.data or []

def fetch_notice_by_id(post_id: str) -> Optional[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")
    res = client.table("notices").select("*").eq("id", post_id).limit(1).execute()
    return res.data[0] if res.data else None

def update_notice_by_id(post_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    updates = dict(updates)
    for url_field in ("apply_url", "pdf_url"):
        if url_field in updates and not is_official_https_url(updates[url_field]):
            raise ValueError(f"{url_field} must be an approved HTTPS official URL")

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    updates["last_edited_by"] = "admin"

    res = client.table("notices").update(updates).eq("id", post_id).execute()
    return res.data[0] if res.data else None

def upsert_notice(record: Dict[str, Any]) -> Any:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")
    if not is_official_https_url(record.get("apply_url")) or not is_official_https_url(record.get("pdf_url")):
        raise ValueError("Only approved HTTPS official URLs may be stored")
    return client.table("notices").upsert(record, on_conflict="slug").execute()

def add_subscriber(email: str) -> Any:
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")
    return client.table("subscribers").upsert({"email": email.strip().lower()}, on_conflict="email").execute()

# ==================== CLASS 10TH MOCK TEST CORE ENGINE ====================

def fetch_today_quiz_record(slot: str = "slot_1", subject: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieves today's quiz metadata using Indian Standard Time (IST) or the latest active quiz fallback."""
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    today_str = get_current_ist_date()
    query = (
        client.table("class10_quizzes")
        .select("id, title, subject, slot, quiz_date, total_questions, duration_minutes, is_active")
        .eq("quiz_date", today_str)
        .eq("slot", slot)
        .eq("is_active", True)
    )
    if subject:
        query = query.eq("subject", subject.strip().lower())

    res = query.limit(1).execute()
    if res.data:
        return res.data[0]

    # Fallback to latest active quiz across slots
    fallback_query = (
        client.table("class10_quizzes")
        .select("id, title, subject, slot, quiz_date, total_questions, duration_minutes, is_active")
        .eq("is_active", True)
    )
    if subject:
        fallback_query = fallback_query.eq("subject", subject.strip().lower())

    fallback_res = fallback_query.order("created_at", desc=True).limit(1).execute()
    return fallback_res.data[0] if fallback_res.data else None

def fetch_quiz_questions_for_student(quiz_id: str) -> List[Dict[str, Any]]:
    """Fetches questions strictly masking correct_option and explanation for candidate safety."""
    client = get_db()
    if not client:
        raise RuntimeError("Database client not available")

    res = (
        client.table("class10_questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, order_index")
        .eq("quiz_id", quiz_id.strip())
        .order("order_index", desc=False)
        .execute()
    )
    return res.data or []

def insert_leaderboard_record(
    quiz_id: str,
    student_name: str,
    district: str,
    score: int,
    total_questions: int,
    accuracy: float,
    phone: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """Inserts candidate score record into the district-based leaderboard."""
    client = get_db()
    if not client:
        return None

    try:
        res = client.table("class10_leaderboard").insert({
            "quiz_id": quiz_id.strip(),
            "student_name": student_name.strip() or "छात्र",
            "district": district.strip() or "बिहार",
            "phone": phone.strip() if phone else None,
            "score": score,
            "total_questions": total_questions,
            "accuracy": accuracy
        }).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"Failed to record leaderboard entry: {e}")
        return None

def fetch_quiz_leaderboard_db(quiz_id: str, limit: int = 25) -> List[Dict[str, Any]]:
    """Retrieves sorted district leaderboard rankers for a quiz."""
    client = get_db()
    if not client:
        return []

    try:
        res = (
            client.table("class10_leaderboard")
            .select("student_name, district, score, total_questions, accuracy, created_at")
            .eq("quiz_id", quiz_id.strip())
            .order("score", desc=True)
            .order("created_at", desc=False)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as e:
        logger.error(f"Failed to fetch leaderboard from DB: {e}")
        return []

# ==================== ADMIN QUIZ MANAGEMENT HELPERS ====================

def admin_fetch_all_quizzes_db(limit: int = 50) -> List[Dict[str, Any]]:
    """Fetches all quiz slots with status for the admin panel."""
    client = get_db()
    if not client:
        return []

    try:
        res = (
            client.table("class10_quizzes")
            .select("id, title, subject, slot, quiz_date, total_questions, duration_minutes, is_active, created_at")
            .order("quiz_date", desc=True)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as e:
        logger.error(f"Admin fetch all quizzes DB error: {e}")
        return []

def admin_create_quiz_db(
    title: str,
    subject: str,
    slot: str,
    quiz_date: str,
    duration_minutes: int,
    is_active: bool = True
) -> Optional[Dict[str, Any]]:
    """Admin: Creates and schedules a new quiz slot."""
    client = get_db()
    if not client:
        return None

    try:
        payload = {
            "title": title.strip(),
            "subject": subject.strip().lower(),
            "slot": slot.strip(),
            "quiz_date": quiz_date,
            "duration_minutes": duration_minutes,
            "total_questions": 0,
            "is_active": is_active
        }
        res = client.table("class10_quizzes").insert(payload).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"Admin create quiz DB error: {e}")
        return None

def admin_toggle_quiz_status_db(quiz_id: str, is_active: bool) -> bool:
    """Admin: Toggles is_active status of any quiz."""
    client = get_db()
    if not client:
        return False

    try:
        client.table("class10_quizzes").update({"is_active": is_active}).eq("id", quiz_id.strip()).execute()
        return True
    except Exception as e:
        logger.error(f"Admin toggle quiz DB error: {e}")
        return False

def admin_add_questions_batch_db(quiz_id: str, questions: List[Dict[str, Any]]) -> int:
    """Admin: Batch inserts questions and updates total_questions count atomically."""
    client = get_db()
    if not client or not questions:
        return 0

    clean_quiz_id = quiz_id.strip()
    try:
        # Get existing count for index offset
        cnt_res = client.table("class10_questions").select("id", count="exact").eq("quiz_id", clean_quiz_id).execute()
        offset = cnt_res.count or 0

        formatted = []
        for idx, q in enumerate(questions, start=offset + 1):
            formatted.append({
                "quiz_id": clean_quiz_id,
                "question_text": q["question_text"].strip(),
                "option_a": q["option_a"].strip(),
                "option_b": q["option_b"].strip(),
                "option_c": q["option_c"].strip(),
                "option_d": q["option_d"].strip(),
                "correct_option": q["correct_option"].strip().upper(),
                "explanation": q.get("explanation", "").strip() or "NCERT आधिकारिक मॉडल उत्तर।",
                "order_index": idx
            })

        client.table("class10_questions").insert(formatted).execute()
        new_total = offset + len(formatted)
        client.table("class10_quizzes").update({"total_questions": new_total}).eq("id", clean_quiz_id).execute()
        return len(formatted)
    except Exception as e:
        logger.error(f"Admin add questions batch DB error: {e}")
        return 0