import os
import re
import json
import logging
from urllib.parse import urlparse
from typing import Optional, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from upstash_redis import Redis
from dotenv import load_dotenv

import database as db

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("biharfast")

load_dotenv(override=False)

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET")

# Upstash Redis Initialization
redis: Optional[Redis] = None
if UPSTASH_URL and UPSTASH_TOKEN:
    try:
        redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        logger.info("Connected to Upstash Redis.")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

app = FastAPI(title="BiharFast Ultra-Low Latency Engine", version="4.0")

# CORS Setup
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://biharfast.in",
    "https://www.biharfast.in",
    "https://bihar-fast-portal.vercel.app"
]
env_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
allowed_origins = list(set(default_origins + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(.*\.)?biharfast\.in$|^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    category: Optional[str] = "jobs"
    total_posts: Optional[str] = "अधिसूचना देखें"
    last_date: Optional[str] = "सक्रिय सूचना"
    eligibility: Optional[str] = "विज्ञापन देखें"
    fees: Optional[str] = "निःशुल्क (₹0)"
    pdf_url: Optional[str] = None
    apply_url: Optional[str] = None
    short_desc: Optional[str] = None
    important_dates: Optional[dict] = {}
    application_fees: Optional[dict] = {}
    age_limit: Optional[dict] = {}
    selection_process: Optional[list[str]] = []
    how_to_apply: Optional[list[str]] = []
    extra_links: Optional[list[dict]] = []

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
            redis.delete("feed:jobs")
            redis.delete("feed:admit_card")
            redis.delete("feed:results")
            if slug:
                redis.delete(f"post:{slug}")
        except Exception as e:
            logger.error(f"Redis flush error: {e}")

# ==================== CORE API ENDPOINTS ====================

@app.get("/")
def health_check():
    return {
        "status": "active",
        "engine": "BiharFast Modular Engine",
        "supabase_connected": db.get_db() is not None,
        "redis_connected": redis is not None
    }

@app.get("/api/notices")
@app.get("/api/posts")
def get_all_posts(response: Response, limit: int = Query(50, ge=1, le=100)):
    cache_key = "home:latest_posts"

    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=120"
                return {"success": True, "source": "redis_cache", "data": safe_json_parse(cached)}
        except Exception as e:
            logger.warning(f"Redis read error: {e}")

    try:
        data = db.fetch_feed_notices(category=None, limit=limit)
    except Exception as err:
        logger.error(f"Error reading notices: {err}")
        raise HTTPException(status_code=500, detail="Failed to fetch notices")

    if redis and data:
        try:
            redis.set(cache_key, json.dumps(data, ensure_ascii=False), ex=300)
        except Exception as e:
            logger.warning(f"Redis write error: {e}")

    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=120"
    return {"success": True, "source": "database", "data": data}

@app.get("/api/jobs")
def get_jobs(response: Response, limit: int = Query(30, ge=1, le=100)):
    return get_category_feed("jobs", response, limit)

@app.get("/api/admit-cards")
def get_admit_cards(response: Response, limit: int = Query(30, ge=1, le=100)):
    return get_category_feed("admit_card", response, limit)

@app.get("/api/results")
def get_results(response: Response, limit: int = Query(30, ge=1, le=100)):
    return get_category_feed("results", response, limit)

def get_category_feed(category: str, response: Response, limit: int = 30):
    cache_key = f"feed:{category}"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=120"
                return {"success": True, "source": "redis_cache", "data": safe_json_parse(cached)}
        except Exception as e:
            logger.warning(f"Redis lookup error on {category}: {e}")

    try:
        data = db.fetch_feed_notices(category=category, limit=limit)
    except Exception as err:
        logger.error(f"Error querying {category}: {err}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch {category}")

    if redis and data:
        try:
            redis.set(cache_key, json.dumps(data, ensure_ascii=False), ex=300)
        except Exception as e:
            logger.warning(f"Redis write error: {e}")

    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=120"
    return {"success": True, "source": "database", "data": data}

@app.get("/api/posts/{slug}")
def get_post_detail(slug: str, response: Response):
    cache_key = f"post:{slug}"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=600"
                return {"success": True, "source": "redis_cache", "data": safe_json_parse(cached)}
        except Exception as e:
            logger.warning(f"Redis lookup error for slug {slug}: {e}")

    try:
        post_data = db.fetch_notice_by_slug(slug)
    except Exception as err:
        logger.error(f"Error querying post {slug}: {err}")
        raise HTTPException(status_code=500, detail="Error fetching notice detail")

    if not post_data:
        raise HTTPException(status_code=404, detail="Notification not found")

    if redis:
        try:
            redis.set(cache_key, json.dumps(post_data, ensure_ascii=False), ex=1800)
        except Exception as e:
            logger.warning(f"Redis write error: {e}")

    response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=600"
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

    slug = slugify(payload.title, payload.department)
    cat = (payload.category or "jobs").lower().strip()

    if "result" in cat:
        normalized_cat = "results"
    elif "admit" in cat:
        normalized_cat = "admit_card"
    else:
        normalized_cat = "jobs"

    record = {
        "slug": slug,
        "title": payload.title,
        "department": payload.department,
        "category": normalized_cat,
        "total_posts": payload.total_posts or "अधिसूचना देखें",
        "last_date": payload.last_date or "सक्रिय सूचना",
        "eligibility": payload.eligibility or "विज्ञापन देखें",
        "fees": payload.fees or "निःशुल्क (₹0)",
        "apply_url": payload.apply_url or "#",
        "pdf_url": payload.pdf_url,
        "short_desc": payload.short_desc,
        "important_dates": payload.important_dates or {},
        "application_fees": payload.application_fees or {},
        "age_limit": payload.age_limit or {},
        "selection_process": payload.selection_process or [],
        "how_to_apply": payload.how_to_apply or [],
        "extra_links": payload.extra_links or [],
        "is_active": True
    }

    try:
        res = db.upsert_notice(record)
    except Exception as err:
        logger.error(f"Database upsert error on notices: {err}")
        raise HTTPException(status_code=500, detail="Failed to store notification in notices table")

    bg.add_task(flush_cache, slug=slug)

    return {"success": True, "table": "notices", "slug": slug, "data": res.data}

@app.post("/api/subscribe")
def subscribe_newsletter(payload: SubscribePayload):
    email = payload.email.strip().lower()

    if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
        raise HTTPException(status_code=400, detail="कृपया वैध ईमेल दर्ज करें।")

    try:
        db.add_subscriber(email)
        return {"success": True, "message": "धन्यवाद! आपका ईमेल सफलतापूर्वक रजिस्टर हो गया।"}
    except Exception as e:
        logger.error(f"Subscribe error: {e}")
        return {"success": True, "message": "धन्यवाद! आपका ईमेल पहले से पंजीकृत है।"}