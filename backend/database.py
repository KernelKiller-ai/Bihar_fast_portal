import os
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, date
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(override=False)

logger = logging.getLogger("biharfast_db")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SECRET_KEY") 
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY") 
    or os.getenv("SUPABASE_KEY")
)

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Connected to Supabase successfully.")
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
else:
    logger.warning("SUPABASE_URL or SUPABASE_KEY is missing in environment!")

HOME_FEED_COLUMNS = "id, slug, title, department, category, total_posts, last_date, eligibility, fees, apply_url, pdf_url, created_at, status"

def get_db() -> Optional[Client]:
    return supabase

# ==================== SCRAPED INBOX (RAW NOTICES - ZERO LLM TOKENS) ====================

def insert_inbox_notice(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Raw scraped notice ko bina kisi LLM processing ke inbox table me daalna."""
    if not supabase:
        raise RuntimeError("Database client not initialized")

    title = record.get("title", "").strip()
    dept = record.get("department", "").strip()

    # Deduplication check: Title aur department match hone par dubara insert na ho
    existing = (
        supabase.table("scraped_inbox")
        .select("id")
        .eq("title", title)
        .eq("department", dept)
        .limit(1)
        .execute()
    )
    if existing.data:
        return None

    inbox_payload = {
        "title": title,
        "department": dept,
        "category": record.get("category", "jobs"),
        "pdf_url": record.get("pdf_url"),
        "apply_url": record.get("apply_url"),
        "status": "unprocessed"
    }

    res = supabase.table("scraped_inbox").insert(inbox_payload).execute()
    return res.data[0] if res.data else None

def fetch_inbox_notices(status: str = "unprocessed", limit: int = 50) -> List[Dict[str, Any]]:
    """Admin review ke liye inbox ke raw notices nikalna."""
    if not supabase:
        raise RuntimeError("Database not configured")

    query = supabase.table("scraped_inbox").select("*")
    if status:
        query = query.eq("status", status)
    res = query.order("created_at", desc=True).limit(limit).execute()
    return res.data or []

def fetch_inbox_item_by_id(item_id: str) -> Optional[Dict[str, Any]]:
    """Single raw item detail fetch karna."""
    if not supabase:
        raise RuntimeError("Database not configured")
    res = supabase.table("scraped_inbox").select("*").eq("id", item_id).limit(1).execute()
    return res.data[0] if res.data else None

def update_inbox_status(item_id: str, status: str) -> Optional[Dict[str, Any]]:
    """Status badalna: 'unprocessed', 'enriched', ya 'rejected'."""
    if not supabase:
        raise RuntimeError("Database not configured")
    res = supabase.table("scraped_inbox").update({"status": status}).eq("id", item_id).execute()
    return res.data[0] if res.data else None

# ==================== STRICT 10-POST DAILY LLM QUOTA ENGINE ====================

def check_and_increment_daily_llm_quota(max_limit: int = 10) -> bool:
    """
    Check karta hai ki aaj 10 posts generate hui hain ya nahi.
    Agar quota bacha hai toh counter +1 karke True return karega, warna False.
    """
    if not supabase:
        raise RuntimeError("Database not configured")

    today_str = date.today().isoformat()
    
    res = supabase.table("ai_usage_ledger").select("posts_generated").eq("usage_date", today_str).limit(1).execute()

    if not res.data:
        # Aaj ka pehla post
        supabase.table("ai_usage_ledger").insert({"usage_date": today_str, "posts_generated": 1}).execute()
        return True

    current_count = res.data[0].get("posts_generated", 0)
    if current_count >= max_limit:
        return False  # Limit reached! No more LLM calls allowed today.

    # Increment counter
    supabase.table("ai_usage_ledger").update({"posts_generated": current_count + 1}).eq("usage_date", today_str).execute()
    return True

def get_today_llm_usage() -> Dict[str, int]:
    """Admin dashboard me dikhane ke liye aaj ka LLM count return karta hai."""
    if not supabase:
        return {"used": 0, "remaining": 10, "limit": 10}

    today_str = date.today().isoformat()
    res = supabase.table("ai_usage_ledger").select("posts_generated").eq("usage_date", today_str).limit(1).execute()
    used = res.data[0].get("posts_generated", 0) if res.data else 0
    return {
        "used": used,
        "remaining": max(0, 10 - used),
        "limit": 10
    }

# ==================== PUBLIC ENDPOINTS QUERY HELPERS ====================

def fetch_feed_notices(category: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError("Database not configured")

    query = (
        supabase.table("notices")
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
    if not supabase:
        raise RuntimeError("Database not configured")

    query = supabase.table("notices").select("*").eq("slug", slug)
    if not include_unapproved:
        query = query.eq("status", "published")

    res = query.limit(1).execute()
    return res.data[0] if res.data else None

def fetch_all_slugs_for_sitemap() -> List[Dict[str, Any]]:
    if not supabase:
        logger.error("Supabase client not initialized for sitemap query.")
        return []

    try:
        res = (
            supabase.table("notices")
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

# ==================== ADMIN MANAGEMENT HELPERS ====================

def fetch_admin_notices(status: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError("Database not configured")

    query = supabase.table("notices").select("*")
    if status:
        query = query.eq("status", status)

    res = query.order("created_at", desc=True).limit(limit).execute()
    return res.data or []

def fetch_notice_by_id(post_id: str) -> Optional[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError("Database not configured")

    res = supabase.table("notices").select("*").eq("id", post_id).limit(1).execute()
    return res.data[0] if res.data else None

def update_notice_by_id(post_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError("Database not configured")

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    updates["last_edited_by"] = "admin"

    res = supabase.table("notices").update(updates).eq("id", post_id).execute()
    return res.data[0] if res.data else None

def upsert_notice(record: Dict[str, Any]) -> Any:
    if not supabase:
        raise RuntimeError("Database client not initialized")

    return supabase.table("notices").upsert(record, on_conflict="slug").execute()

def add_subscriber(email: str) -> Any:
    if not supabase:
        raise RuntimeError("Database not configured")

    return supabase.table("subscribers").upsert({"email": email}, on_conflict="email").execute()