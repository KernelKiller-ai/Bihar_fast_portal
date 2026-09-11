import os
import re
import json
import logging
from urllib.parse import urlparse
from typing import Optional, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from upstash_redis import Redis
from dotenv import load_dotenv

from telegram_bot import send_telegram_alert

# Setup structured logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("biharfast")

load_dotenv(override=False)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SECRET_KEY") 
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY") 
    or os.getenv("SUPABASE_KEY")
)

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET")

# Supabase Client Initialization
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Connected to Supabase successfully.")
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
else:
    logger.warning("SUPABASE_URL or SUPABASE_KEY is missing in environment!")

# Upstash Redis Client Initialization
redis: Optional[Redis] = None
if UPSTASH_URL and UPSTASH_TOKEN:
    try:
        redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        logger.info("Connected to Upstash Redis.")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

# FastAPI App Engine
app = FastAPI(title="BiharFast API Engine", version="2.3")

# Robust CORS Setup with Vercel Subdomain Support
raw_origins = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://bihar-fast-portal.vercel.app"
)
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://bihar-fast-portal.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Strict Canonical Domain Whitelist
OFFICIAL_ALLOWED_DOMAINS = {
    "bceceboard.bihar.gov.in",
    "bpsc.bih.nic.in",
    "bpsc.bihar.gov.in",
    "csbc.bih.nic.in",
    "csbc.bihar.gov.in",
    "bpssc.bih.nic.in",
    "bssc.bihar.gov.in",
    "btsc.bihar.gov.in",
    "biharboardonline.bihar.gov.in",
    "serviceonline.bihar.gov.in",
    "biharbhumi.bihar.gov.in",
    "udyami.bihar.gov.in",
    "pmsonline.bih.nic.in",
    "medhasoft.bih.nic.in",
    "7nischay-yuvaupmission.bihar.gov.in",
    "patnahighcourt.gov.in",
    "dlrs.bihar.gov.in",
    "rrbpatna.gov.in",
    "ssc.gov.in",
    "ibps.in",
    "indiapostgdsonline.gov.in"
}

class PostPayload(BaseModel):
    title: str
    department: str
    category: Optional[str] = "job"
    total_posts: Optional[str] = "अधिसूचना देखें"
    last_date: Optional[str] = "सक्रिय सूचना"
    eligibility: Optional[str] = "विज्ञापन पीडीएफ देखें"
    qualification_details: Optional[str] = None
    pdf_url: Optional[str] = None
    apply_url: Optional[str] = None

class SubscribePayload(BaseModel):
    email: str

def slugify(title: str, dept: str) -> str:
    combined = f"{dept}-{title}"
    slug = re.sub(r"[^\w\s-]", "", combined.lower()).strip()
    return re.sub(r"[\s_-]+", "-", slug)[:90]

def is_url_whitelisted(url: Optional[str]) -> bool:
    if not url or url.strip() == "#":
        return True
    try:
        parsed = urlparse(url.strip())
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = (parsed.hostname or "").lower()
        if not hostname:
            return False
        return any(hostname == d or hostname.endswith("." + d) for d in OFFICIAL_ALLOWED_DOMAINS)
    except Exception:
        return False

def safe_json_parse(data: Any) -> Any:
    if isinstance(data, str):
        try:
            return json.loads(data)
        except Exception:
            return data
    return data

def flush_cache(slug: Optional[str] = None):
    if redis:
        try:
            redis.delete("home:latest_posts")
            if slug:
                redis.delete(f"post:{slug}")
        except Exception as e:
            logger.error(f"Redis cache flush error: {e}")

# ==================== ENDPOINTS ====================

@app.get("/")
def health_check():
    return {
        "status": "active",
        "portal": "BiharFast High-Speed API",
        "supabase_connected": supabase is not None,
        "redis_connected": redis is not None
    }

@app.get("/api/notices")
@app.get("/api/posts")
def get_posts():
    cache_key = "home:latest_posts"

    # 1. Fetch from Redis Cache
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                parsed_data = safe_json_parse(cached)
                return {"success": True, "source": "redis_cache", "data": parsed_data}
        except Exception as e:
            logger.warning(f"Redis lookup error: {e}")

    # 2. Database Fallback Query
    if not supabase:
        return {"success": False, "message": "Database not configured", "data": []}

    try:
        res = supabase.table("posts").select("*").eq("is_active", True).order("created_at", desc=True).limit(40).execute()
        data = res.data or []
    except Exception as err:
        logger.error(f"Database query error: {err}")
        return {"success": False, "message": "Failed to fetch notices", "data": []}

    # 3. Cache in Redis (10 mins TTL)
    if redis and data:
        try:
            redis.set(cache_key, json.dumps(data, ensure_ascii=False), ex=600)
        except Exception as e:
            logger.warning(f"Redis write error: {e}")

    return {"success": True, "source": "database", "data": data}

@app.get("/api/posts/{slug}")
def get_post_detail(slug: str):
    cache_key = f"post:{slug}"

    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                parsed_post = safe_json_parse(cached)
                return {"success": True, "source": "redis_cache", "data": parsed_post}
        except Exception as e:
            logger.warning(f"Redis lookup error: {e}")

    if not supabase:
        raise HTTPException(status_code=500, detail="Database service unavailable")

    try:
        res = supabase.table("posts").select("*").eq("slug", slug).limit(1).execute()
    except Exception as err:
        logger.error(f"Database query failed for slug {slug}: {err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve notification")

    if not res.data:
        raise HTTPException(status_code=404, detail="Notification not found")

    post_data = res.data[0]

    if redis:
        try:
            redis.set(cache_key, json.dumps(post_data, ensure_ascii=False), ex=1800)
        except Exception as e:
            logger.warning(f"Redis write error: {e}")

    return {"success": True, "source": "database", "data": post_data}

@app.post("/api/posts/sync")
def sync_post(
    payload: PostPayload, 
    bg: BackgroundTasks, 
    x_sync_secret: Optional[str] = Header(None)
):
    if not INTERNAL_SYNC_SECRET or x_sync_secret != INTERNAL_SYNC_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized sync request. Valid secret header required."
        )

    if not is_url_whitelisted(payload.pdf_url) or not is_url_whitelisted(payload.apply_url):
        raise HTTPException(status_code=400, detail="Domain not in official Bihar NIC whitelist")

    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    slug = slugify(payload.title, payload.department)

    record = {
        "slug": slug,
        "title": payload.title,
        "department": payload.department,
        "category": payload.category,
        "total_posts": payload.total_posts,
        "last_date": payload.last_date,
        "eligibility": payload.eligibility,
        "qualification_details": payload.qualification_details,
        "pdf_url": payload.pdf_url,
        "apply_url": payload.apply_url,
        "is_active": True
    }

    try:
        res = supabase.table("posts").upsert(record, on_conflict="slug").execute()
    except Exception as err:
        logger.error(f"Database upsert error: {err}")
        raise HTTPException(status_code=500, detail="Failed to store notification")

    bg.add_task(flush_cache, slug=slug)
    bg.add_task(send_telegram_alert, record)

    return {"success": True, "slug": slug, "data": res.data}

@app.post("/api/subscribe")
def subscribe_newsletter(payload: SubscribePayload):
    email = payload.email.strip().lower()

    if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
        raise HTTPException(status_code=400, detail="कृपया वैध ईमेल दर्ज करें।")

    if not supabase:
        raise HTTPException(status_code=500, detail="Database service unavailable")

    try:
        supabase.table("subscribers").upsert({"email": email}, on_conflict="email").execute()
        return {"success": True, "message": "धन्यवाद! आपका ईमेल सफलतापूर्वक रजिस्टर हो गया।"}
    except Exception as e:
        logger.error(f"Subscribe error: {e}")
        return {"success": True, "message": "धन्यवाद! आपका ईमेल पहले से पंजीकृत है।"}