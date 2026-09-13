import os
import logging
from typing import Optional, List, Dict, Any
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

HOME_FEED_COLUMNS = "id, slug, title, department, category, total_posts, last_date, eligibility, fees, apply_url, pdf_url, created_at"

def get_db() -> Optional[Client]:
    return supabase

def fetch_feed_notices(category: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError("Database not configured")

    query = (
        supabase.table("notices")
        .select(HOME_FEED_COLUMNS)
        .eq("is_active", True)
    )

    if category:
        query = query.eq("category", category)
    else:
        query = query.in_("category", ["jobs", "admit_card", "results"])

    res = query.order("created_at", desc=True).limit(limit).execute()
    return res.data or []

def fetch_notice_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError("Database not configured")

    res = supabase.table("notices").select("*").eq("slug", slug).limit(1).execute()
    return res.data[0] if res.data else None

def upsert_notice(record: Dict[str, Any]) -> Any:
    if not supabase:
        raise RuntimeError("Database client not initialized")

    return supabase.table("notices").upsert(record, on_conflict="slug").execute()

def add_subscriber(email: str) -> Any:
    if not supabase:
        raise RuntimeError("Database not configured")

    return supabase.table("subscribers").upsert({"email": email}, on_conflict="email").execute()