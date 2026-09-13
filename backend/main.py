import os
import re
import logging
from urllib.parse import urlparse
from typing import Optional, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from upstash_redis import Redis
from dotenv import load_dotenv
import orjson

import database as db

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("biharfast")

load_dotenv(override=False)

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET")

# Persistent Redis Client
redis: Optional[Redis] = None
if UPSTASH_URL and UPSTASH_TOKEN:
    try:
        redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        logger.info("Connected to Upstash Redis Engine.")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

app = FastAPI(title="BiharFast Sub-20ms Engine", version="5.0")

# 1. Gzip compression (Payload shrink karta hai, transfer latency drastically kam hoti hai)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 2. Optimized CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OFFICIAL_ALLOWED_DOMAINS = {
    "bceceboard.bihar.gov.in", "bpsc.bih.nic.in", "bpsc.bihar.gov.in",
    "onlinebpsc.bihar.gov.in", "csbc.bih.nic.in", "csbc.bihar.gov.in",
    "bpssc.bih.nic.in", "bssc.bihar.gov.in", "btsc.bihar.gov.in",
    "biharboardonline.bihar.gov.in", "patnahighcourt.gov.in",
    "dlrs.bihar.gov.in", "rrbpatna.gov.in", "ssc.gov.in",
    "ibps.in", "indiapostgdsonline.gov.in"
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

def slugify(title: str, dept: str) -> str:
    combined = f"{dept}-{title}"
    slug = re.sub(r"[^\w\s-]", "", combined.lower()).strip()
    return re.sub(r"[\s_-]+", "-", slug)[:90]

def is_url_whitelisted(url: Optional[str]) -> bool:
    if not url or url.strip() == "#":
        return True
    try:
        parsed = urlparse(url.strip())
        hostname = (parsed.hostname or "").lower()
        return any(hostname == d or hostname.endswith("." + d) for d in OFFICIAL_ALLOWED_DOMAINS)
    except Exception:
        return False

def flush_cache(slug: Optional[str] = None):
    if redis:
        try:
            keys = ["home:latest_posts", "feed:jobs", "feed:admit_card", "feed:results"]
            if slug:
                keys.append(f"post:{slug}")
            for k in keys:
                redis.delete(k)
        except Exception as e:
            logger.error(f"Redis flush error: {e}")

# ==================== ULTRA-LOW LATENCY ENDPOINTS ====================

@app.get("/")
def health_check():
    return Response(
        content=b'{"status":"active","engine":"BiharFast Sub-20ms Engine"}',
        media_type="application/json"
    )

@app.get("/api/notices")
@app.get("/api/posts")
def get_all_posts():
    cache_key = "home:latest_posts"

    # Step 1: Redis Hit (Zero CPU decoding, direct binary pipe) -> ~10-15ms
    if redis:
        try:
            cached_bytes = redis.get(cache_key)
            if cached_bytes:
                return Response(
                    content=cached_bytes if isinstance(cached_bytes, (str, bytes)) else orjson.dumps(cached_bytes),
                    media_type="application/json",
                    headers={"Cache-Control": "public, max-age=60, s-maxage=300"}
                )
        except Exception as e:
            logger.warning(f"Redis read bypass: {e}")

    # Step 2: DB Fallback
    data = db.fetch_feed_notices(category=None, limit=50)
    json_bytes = orjson.dumps({"success": True, "source": "database", "data": data})

    if redis and data:
        try:
            redis.set(cache_key, json_bytes.decode("utf-8"), ex=300)
        except Exception:
            pass

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Cache-Control": "public, max-age=60, s-maxage=300"}
    )

@app.get("/api/jobs")
def get_jobs():
    return get_category_feed("jobs")

@app.get("/api/admit-cards")
def get_admit_cards():
    return get_category_feed("admit_card")

@app.get("/api/results")
def get_results():
    return get_category_feed("results")

def get_category_feed(category: str):
    cache_key = f"feed:{category}"
    if redis:
        try:
            cached_bytes = redis.get(cache_key)
            if cached_bytes:
                return Response(
                    content=cached_bytes if isinstance(cached_bytes, (str, bytes)) else orjson.dumps(cached_bytes),
                    media_type="application/json",
                    headers={"Cache-Control": "public, max-age=60, s-maxage=300"}
                )
        except Exception:
            pass

    data = db.fetch_feed_notices(category=category, limit=30)
    json_bytes = orjson.dumps({"success": True, "source": "database", "data": data})

    if redis and data:
        try:
            redis.set(cache_key, json_bytes.decode("utf-8"), ex=300)
        except Exception:
            pass

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Cache-Control": "public, max-age=60, s-maxage=300"}
    )

@app.get("/api/posts/{slug}")
def get_post_detail(slug: str):
    cache_key = f"post:{slug}"
    if redis:
        try:
            cached_bytes = redis.get(cache_key)
            if cached_bytes:
                return Response(
                    content=cached_bytes if isinstance(cached_bytes, (str, bytes)) else orjson.dumps(cached_bytes),
                    media_type="application/json",
                    headers={"Cache-Control": "public, max-age=300, s-maxage=1800"}
                )
        except Exception:
            pass

    post_data = db.fetch_notice_by_slug(slug)
    if not post_data:
        raise HTTPException(status_code=404, detail="Notification not found")

    json_bytes = orjson.dumps({"success": True, "source": "database", "data": post_data})

    if redis:
        try:
            redis.set(cache_key, json_bytes.decode("utf-8"), ex=1800)
        except Exception:
            pass

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Cache-Control": "public, max-age=300, s-maxage=1800"}
    )

@app.post("/api/posts/sync")
def sync_post(
    payload: PostPayload, 
    bg: BackgroundTasks, 
    x_sync_secret: Optional[str] = Header(None)
):
    if not INTERNAL_SYNC_SECRET or x_sync_secret != INTERNAL_SYNC_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized sync request.")

    if not is_url_whitelisted(payload.pdf_url) or not is_url_whitelisted(payload.apply_url):
        raise HTTPException(status_code=400, detail="Domain not in official whitelist")

    slug = slugify(payload.title, payload.department)
    cat = (payload.category or "jobs").lower().strip()
    normalized_cat = "results" if "result" in cat else ("admit_card" if "admit" in cat else "jobs")

    existing_record = db.fetch_notice_by_slug(slug)
    is_new_post = existing_record is None

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
        logger.error(f"Database upsert error: {err}")
        raise HTTPException(status_code=500, detail="Failed to store notification")

    bg.add_task(flush_cache, slug=slug)

    return Response(
        content=orjson.dumps({"success": True, "slug": slug, "is_new": is_new_post}),
        media_type="application/json"
    )