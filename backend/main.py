import os
import re
import json
import logging
from urllib.parse import urlparse
from typing import Optional, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from upstash_redis import Redis
from dotenv import load_dotenv

from telegram_bot import send_telegram_alert

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

# Supabase Initialization
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Connected to Supabase successfully.")
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
else:
    logger.warning("SUPABASE_URL or SUPABASE_KEY is missing in environment!")

# Upstash Redis Initialization
redis: Optional[Redis] = None
if UPSTASH_URL and UPSTASH_TOKEN:
    try:
        redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        logger.info("Connected to Upstash Redis.")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

app = FastAPI(title="BiharFast Multi-Table API Engine", version="3.1")

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

def flush_cache(table_name: Optional[str] = None, slug: Optional[str] = None):
    if redis:
        try:
            redis.delete("home:latest_posts")
            if table_name:
                redis.delete(f"feed:{table_name}")
            if slug:
                redis.delete(f"post:{slug}")
        except Exception as e:
            logger.error(f"Redis flush error: {e}")

def fetch_table_data(table_name: str, limit: int = 30):
    cache_key = f"feed:{table_name}"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                return {"success": True, "source": "redis_cache", "data": safe_json_parse(cached)}
        except Exception as e:
            logger.warning(f"Redis read error: {e}")

    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        res = (
            supabase.table(table_name)
            .select("*")
            .eq("is_active", True)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        data = res.data or []
    except Exception as err:
        logger.error(f"Error reading {table_name}: {err}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch {table_name}")

    if redis and data:
        try:
            redis.set(cache_key, json.dumps(data, ensure_ascii=False), ex=300)
        except Exception as e:
            logger.warning(f"Redis write error: {e}")

    return {"success": True, "source": "database", "data": data}

# ==================== CORE ENDPOINTS ====================

@app.get("/")
def health_check():
    return {
        "status": "active",
        "portal": "BiharFast High-Speed Dedicated API",
        "supabase_connected": supabase is not None,
        "redis_connected": redis is not None
    }

@app.get("/api/jobs")
def get_jobs(limit: int = Query(30, ge=1, le=100)):
    return fetch_table_data("jobs", limit)

@app.get("/api/schemes")
def get_schemes(limit: int = Query(30, ge=1, le=100)):
    return fetch_table_data("schemes", limit)

@app.get("/api/services")
def get_services(limit: int = Query(30, ge=1, le=100)):
    return fetch_table_data("citizen_services", limit)

@app.get("/api/admissions")
def get_admissions(limit: int = Query(30, ge=1, le=100)):
    return fetch_table_data("admissions", limit)

@app.get("/api/results")
def get_results(limit: int = Query(30, ge=1, le=100)):
    return fetch_table_data("results_admit_cards", limit)

# FRONTEND MAIN FEED: Merges jobs, results, schemes & services
@app.get("/api/notices")
@app.get("/api/posts")
def get_all_posts():
    cache_key = "home:latest_posts"

    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                return {"success": True, "source": "redis_cache", "data": safe_json_parse(cached)}
        except Exception as e:
            logger.warning(f"Redis error: {e}")

    if not supabase:
        return {"success": False, "message": "Database not initialized", "data": []}

    combined_data = []

    # 1. Fetch from jobs
    try:
        j_res = supabase.table("jobs").select("*").eq("is_active", True).order("created_at", desc=True).limit(20).execute()
        for j in (j_res.data or []):
            j["category"] = "job"
            combined_data.append(j)
    except Exception as e:
        logger.warning(f"Jobs query warning: {e}")

    # 2. Fetch from results_admit_cards
    try:
        r_res = supabase.table("results_admit_cards").select("*").eq("is_active", True).order("created_at", desc=True).limit(20).execute()
        for r in (r_res.data or []):
            cat_val = (r.get("type") or "RESULT").lower()
            combined_data.append({
                "id": r.get("id"),
                "slug": r.get("slug"),
                "title": r.get("title"),
                "department": r.get("department"),
                "category": cat_val,
                "total_posts": "सूचना देखें",
                "last_date": "घोषित",
                "eligibility": "विवरण देखें",
                "pdf_url": r.get("pdf_url"),
                "apply_url": r.get("download_url"),
                "created_at": r.get("created_at"),
                "is_active": True
            })
    except Exception as e:
        logger.warning(f"Results/Admit query warning: {e}")

    # 3. Fetch from schemes
    try:
        s_res = supabase.table("schemes").select("*").eq("is_active", True).order("created_at", desc=True).limit(10).execute()
        for s in (s_res.data or []):
            combined_data.append({
                "id": s.get("id"),
                "slug": s.get("slug"),
                "title": s.get("title"),
                "department": s.get("department"),
                "category": "scheme",
                "total_posts": s.get("benefit_amount") or "अनुदान",
                "last_date": s.get("last_date") or "सक्रिय",
                "eligibility": s.get("eligibility") or "बिहार निवासी",
                "pdf_url": s.get("guideline_pdf"),
                "apply_url": s.get("apply_url"),
                "created_at": s.get("created_at"),
                "is_active": True
            })
    except Exception as e:
        logger.warning(f"Schemes query warning: {e}")

    # 4. Fetch from citizen_services
    try:
        c_res = supabase.table("citizen_services").select("*").eq("is_active", True).order("created_at", desc=True).limit(10).execute()
        for c in (c_res.data or []):
            combined_data.append({
                "id": c.get("id"),
                "slug": c.get("slug"),
                "title": c.get("title"),
                "department": c.get("department"),
                "category": "service",
                "total_posts": c.get("processing_time") or "ऑनलाइन सेवा",
                "last_date": "सक्रिय सेवा",
                "eligibility": "नागरिक सेवा",
                "apply_url": c.get("portal_url"),
                "created_at": c.get("created_at"),
                "is_active": True
            })
    except Exception as e:
        logger.warning(f"Services query warning: {e}")

    # Sort combined notices by created_at desc
    combined_data.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)

    if redis and combined_data:
        try:
            redis.set(cache_key, json.dumps(combined_data, ensure_ascii=False), ex=300)
        except Exception as e:
            logger.warning(f"Redis write cache failed: {e}")

    return {"success": True, "source": "database", "data": combined_data}

@app.get("/api/posts/{slug}")
def get_post_detail(slug: str):
    cache_key = f"post:{slug}"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                return {"success": True, "source": "redis_cache", "data": safe_json_parse(cached)}
        except Exception as e:
            logger.warning(f"Redis lookup error: {e}")

    if not supabase:
        raise HTTPException(status_code=500, detail="Database service unavailable")

    tables_to_check = ["jobs", "results_admit_cards", "schemes", "citizen_services", "admissions", "posts"]
    post_data = None

    for tbl in tables_to_check:
        try:
            res = supabase.table(tbl).select("*").eq("slug", slug).limit(1).execute()
            if res.data:
                post_data = res.data[0]
                post_data["_table"] = tbl
                break
        except Exception:
            continue

    if not post_data:
        raise HTTPException(status_code=404, detail="Notification not found")

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
    cat = (payload.category or "job").lower()

    if "scheme" in cat:
        target_table = "schemes"
        record = {
            "slug": slug,
            "title": payload.title,
            "department": payload.department,
            "eligibility": payload.eligibility,
            "guideline_pdf": payload.pdf_url,
            "apply_url": payload.apply_url or "#",
            "is_active": True
        }
    elif "service" in cat or "rtps" in cat:
        target_table = "citizen_services"
        record = {
            "slug": slug,
            "title": payload.title,
            "department": payload.department,
            "service_type": "rtps" if "rtps" in cat else "service",
            "portal_url": payload.apply_url or "#",
            "procedure_guide": payload.qualification_details,
            "is_active": True
        }
    elif "result" in cat or "admit" in cat:
        target_table = "results_admit_cards"
        record = {
            "slug": slug,
            "title": payload.title,
            "department": payload.department,
            "type": "RESULT" if "result" in cat else "ADMIT_CARD",
            "download_url": payload.apply_url or payload.pdf_url or "#",
            "pdf_url": payload.pdf_url,
            "is_active": True
        }
    else:
        target_table = "jobs"
        record = {
            "slug": slug,
            "title": payload.title,
            "department": payload.department,
            "total_posts": payload.total_posts,
            "eligibility": payload.eligibility,
            "qualification_details": payload.qualification_details,
            "pdf_url": payload.pdf_url,
            "apply_url": payload.apply_url,
            "is_active": True
        }

    try:
        res = supabase.table(target_table).upsert(record, on_conflict="slug").execute()
    except Exception as err:
        logger.error(f"Database upsert error on {target_table}: {err}")
        raise HTTPException(status_code=500, detail=f"Failed to store notification in {target_table}")

    bg.add_task(flush_cache, table_name=target_table, slug=slug)
    bg.add_task(send_telegram_alert, payload.model_dump())

    return {"success": True, "table": target_table, "slug": slug, "data": res.data}

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