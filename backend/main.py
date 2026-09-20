import os
import re
import json
import hmac
import logging
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import Optional, Any, List, Dict
import urllib.request
import urllib.parse

from fastapi import Depends, FastAPI, HTTPException, BackgroundTasks, Query, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from upstash_redis import Redis
from dotenv import load_dotenv
import orjson

import database as db
from quiz_router import quiz_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("biharfast")

load_dotenv(override=False)

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "").strip()

# Telegram Channel Integration Keys
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID", "").strip()  # e.g. "@biharfast_official" ya chat id

bearer_scheme = HTTPBearer(auto_error=False)

MAX_ADMIN_ATTEMPTS = 5
ADMIN_LOCKOUT_SECONDS = 3600
_MEMORY_ATTEMPTS: Dict[str, Dict[str, Any]] = {}

# ----------------- INFRASTRUCTURE CLIENTS -----------------
redis: Optional[Redis] = None
if UPSTASH_URL and UPSTASH_TOKEN:
    try:
        redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        logger.info("Connected to Upstash Redis Engine.")
    except Exception as e:
        logger.error(f"Redis initialization error (fallback active): {e}")

# ----------------- FASTAPI APP -----------------
app = FastAPI(
    title="BiharFast Portal Engine",
    version="7.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://biharfast.in",
    "https://www.biharfast.in",
    "https://bihar-fast-portal.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$|^https?://.*biharfast\.in.*$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {exc}", exc_info=True)
    req_origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={"success": False, "detail": str(exc), "path": request.url.path},
        headers={
            "Access-Control-Allow-Origin": req_origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

app.include_router(quiz_router)

# ----------------- PYDANTIC SCHEMAS -----------------
class PostCreateRequest(BaseModel):
    title: str
    slug: Optional[str] = None
    department: str = "BPSC"
    category: str = "jobs"
    total_posts: Optional[str] = "अधिसूचना देखें"
    last_date: Optional[str] = "सक्रिय सूचना"
    eligibility: Optional[str] = "विज्ञापन देखें"
    apply_url: Optional[str] = None
    pdf_url: Optional[str] = None
    short_desc: Optional[str] = None
    content: str  # 800+ words detailed article
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None
    faqs: Optional[List[Dict[str, Any]]] = []
    how_to_apply: Optional[List[str]] = []
    selection_process: Optional[List[str]] = []

class PostUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    total_posts: Optional[str] = None
    last_date: Optional[str] = None
    eligibility: Optional[str] = None
    apply_url: Optional[str] = None
    pdf_url: Optional[str] = None
    short_desc: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None
    faqs: Optional[List[Dict[str, Any]]] = None
    selection_process: Optional[List[str]] = None
    how_to_apply: Optional[List[str]] = None
    status: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    status: str

# ----------------- SECURITY & AUTH -----------------
def extract_client_ip(request: Request) -> str:
    cf_connecting_ip = request.headers.get("cf-connecting-ip")
    if cf_connecting_ip:
        return cf_connecting_ip.strip()
    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown_client"

def check_admin_lockout(client_ip: str):
    cache_key = f"admin_lock:{client_ip}"
    attempts = 0
    if redis:
        try:
            val = redis.get(cache_key)
            if val is not None:
                attempts = int(val)
        except Exception:
            pass
    else:
        record = _MEMORY_ATTEMPTS.get(client_ip)
        if record:
            if datetime.now(timezone.utc).timestamp() < record["locked_until"]:
                attempts = record["count"]
            else:
                _MEMORY_ATTEMPTS.pop(client_ip, None)

    if attempts >= MAX_ADMIN_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Suraksha Lock: Adhik galat prayas. IP temporary blocked."
        )

def record_failed_attempt(client_ip: str):
    cache_key = f"admin_lock:{client_ip}"
    current_attempts = 1
    if redis:
        try:
            current = redis.incr(cache_key)
            current_attempts = int(current)
            if current_attempts == 1:
                redis.expire(cache_key, ADMIN_LOCKOUT_SECONDS)
        except Exception:
            pass
    else:
        now = datetime.now(timezone.utc).timestamp()
        record = _MEMORY_ATTEMPTS.get(client_ip, {"count": 0, "locked_until": now + ADMIN_LOCKOUT_SECONDS})
        record["count"] += 1
        record["locked_until"] = now + ADMIN_LOCKOUT_SECONDS
        _MEMORY_ATTEMPTS[client_ip] = record
        current_attempts = record["count"]

    remaining = max(0, MAX_ADMIN_ATTEMPTS - current_attempts)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Galat Admin Token! {remaining} prayas shesh hain."
    )

def reset_failed_attempts(client_ip: str):
    if redis:
        try:
            redis.delete(f"admin_lock:{client_ip}")
        except Exception:
            pass
    _MEMORY_ATTEMPTS.pop(client_ip, None)

def require_admin(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    if not ADMIN_API_TOKEN:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Admin token missing")

    client_ip = extract_client_ip(request)
    check_admin_lockout(client_ip)

    if (
        not credentials
        or credentials.scheme.lower() != "bearer"
        or not hmac.compare_digest(credentials.credentials.strip(), ADMIN_API_TOKEN)
    ):
        record_failed_attempt(client_ip)

    reset_failed_attempts(client_ip)
    return True

def slugify(title: str, dept: str) -> str:
    combined = f"{dept}-{title}"
    slug = re.sub(r"[^\w\s-]", "", combined.lower()).strip()
    return re.sub(r"[\s_-]+", "-", slug)[:90]

def flush_cache(slug: Optional[str] = None):
    if redis:
        try:
            keys = [
                "home:latest_posts", 
                "feed:jobs", 
                "feed:admit_card", 
                "feed:results", 
                "seo:dynamic_sitemap"
            ]
            if slug:
                keys.append(f"post:{slug}")
            for k in keys:
                redis.delete(k)
        except Exception as e:
            logger.error(f"Redis flush error: {e}")

# ----------------- TELEGRAM BROADCASTER -----------------
def send_telegram_alert(title: str, dept: str, total_posts: str, last_date: str, slug: str):
    """Broadcasts newly published post to official Telegram channel."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHANNEL_ID:
        logger.info("Telegram notification skipped (Keys not configured in .env).")
        return

    post_url = f"https://biharfast.in/post/{slug}"
    message_text = (
        f"📢 *नयी सरकारी भर्ती अपडेट - BiharFast*\n\n"
        f"📌 *पद / शीर्षक:* {title}\n"
        f"🏢 *विभाग:* {dept}\n"
        f"🔢 *कुल पद:* {total_posts}\n"
        f"🗓 *अंतिम तिथि:* {last_date}\n\n"
        f"🔗 *पूरी जानकारी एवं ऑनलाइन आवेदन लिंक:*\n"
        f"{post_url}\n\n"
        f"⚡ _सबसे तेज व आधिकारिक अपडेट के लिए BiharFast से जुड़े रहें।_"
    )

    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHANNEL_ID,
            "text": message_text,
            "parse_mode": "Markdown",
            "disable_web_page_preview": False
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                logger.info(f"Telegram alert sent successfully for slug: {slug}")
    except Exception as err:
        logger.error(f"Telegram broadcast error: {err}")

# ----------------- PUBLIC ROUTES -----------------
@app.get("/")
def health_check():
    return Response(
        content=b'{"status":"active","engine":"BiharFast Engine","version":"7.0.0"}',
        media_type="application/json"
    )

@app.get("/api/notices")
@app.get("/api/posts")
def get_all_posts():
    cache_key = "home:latest_posts"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                return Response(
                    content=cached if isinstance(cached, (str, bytes)) else orjson.dumps(cached),
                    media_type="application/json",
                    headers={"Cache-Control": "public, max-age=60, s-maxage=300"}
                )
        except Exception:
            pass

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

@app.get("/api/posts/{slug}")
def get_post_detail(slug: str):
    cache_key = f"post:{slug}"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                return Response(
                    content=cached if isinstance(cached, (str, bytes)) else orjson.dumps(cached),
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

# ----------------- ADMIN ROUTES (100% MANUAL PUBLISHING) -----------------
@app.get("/api/admin/posts")
def get_admin_posts(status: Optional[str] = Query(None), _: None = Depends(require_admin)):
    posts = db.fetch_admin_notices(status=status, limit=100)
    return Response(
        content=orjson.dumps({"success": True, "count": len(posts), "data": posts}),
        media_type="application/json"
    )

@app.post("/api/admin/posts")
def create_manual_post(payload: PostCreateRequest, bg: BackgroundTasks, _: None = Depends(require_admin)):
    """Creates an in-depth, human-verified post and broadcasts it to Telegram."""
    slug = payload.slug.strip() if payload.slug else slugify(payload.title, payload.department)
    cat = payload.category.lower().strip()
    normalized_cat = "results" if "result" in cat else ("admit_card" if "admit" in cat else ("schemes" if "scheme" in cat else "jobs"))

    record = {
        "slug": slug,
        "title": payload.title.strip(),
        "department": payload.department.strip(),
        "category": normalized_cat,
        "total_posts": payload.total_posts or "अधिसूचना देखें",
        "last_date": payload.last_date or "सक्रिय सूचना",
        "eligibility": payload.eligibility or "विज्ञापन देखें",
        "apply_url": payload.apply_url,
        "pdf_url": payload.pdf_url,
        "short_desc": payload.short_desc,
        "content": payload.content,
        "meta_title": payload.meta_title or payload.title,
        "meta_desc": payload.meta_desc or payload.short_desc,
        "faqs": payload.faqs or [],
        "how_to_apply": payload.how_to_apply or [],
        "selection_process": payload.selection_process or [],
        "is_active": True,
        "status": "published"
    }

    try:
        db.upsert_notice(record)
        bg.add_task(flush_cache, slug=slug)
        # Trigger Telegram post in background
        bg.add_task(
            send_telegram_alert,
            title=record["title"],
            dept=record["department"],
            total_posts=record["total_posts"],
            last_date=record["last_date"],
            slug=slug
        )
    except Exception as e:
        logger.error(f"Error saving manual post: {e}")
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")

    return Response(
        content=orjson.dumps({"success": True, "message": "Article published live & Telegram alert queued!", "slug": slug}),
        media_type="application/json"
    )

@app.put("/api/admin/posts/{post_id}")
def update_existing_post(post_id: str, payload: PostUpdateRequest, bg: BackgroundTasks, _: None = Depends(require_admin)):
    existing = db.fetch_notice_by_id(post_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    update_dict = {k: v for k, v in payload.model_dump().items() if v is not None}
    
    if "category" in update_dict:
        cat = update_dict["category"].lower().strip()
        update_dict["category"] = "results" if "result" in cat else ("admit_card" if "admit" in cat else "jobs")

    updated_post = db.update_notice_by_id(post_id, update_dict)
    bg.add_task(flush_cache, slug=existing.get("slug"))

    return Response(
        content=orjson.dumps({"success": True, "message": "Post updated successfully", "data": updated_post}),
        media_type="application/json"
    )

@app.post("/api/admin/posts/{post_id}/status")
def change_post_status(post_id: str, payload: StatusUpdateRequest, bg: BackgroundTasks, _: None = Depends(require_admin)):
    existing = db.fetch_notice_by_id(post_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    updated_post = db.update_notice_by_id(post_id, {"status": payload.status})
    bg.add_task(flush_cache, slug=existing.get("slug"))

    return Response(
        content=orjson.dumps({"success": True, "message": f"Status changed to {payload.status}", "data": updated_post}),
        media_type="application/json"
    )

# ----------------- CLEAN DYNAMIC SITEMAP -----------------
@app.get("/api/sitemap-posts.xml")
def dynamic_posts_sitemap():
    cache_key = "seo:dynamic_sitemap"
    if redis:
        try:
            cached_xml = redis.get(cache_key)
            if cached_xml:
                return Response(
                    content=cached_xml if isinstance(cached_xml, (str, bytes)) else str(cached_xml),
                    media_type="application/xml",
                    headers={"Cache-Control": "public, max-age=3600, s-maxage=7200"}
                )
        except Exception:
            pass

    site_base = "https://biharfast.in"
    today = datetime.now().strftime("%Y-%m-%d")

    try:
        posts = db.fetch_all_slugs_for_sitemap()
    except Exception as e:
        logger.error(f"Error reading slugs for sitemap: {e}")
        posts = []

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    for item in posts:
        slug = item.get("slug")
        if slug:
            raw_time = item.get("updated_at")
            lastmod = raw_time.split("T")[0] if raw_time and "T" in raw_time else today
            xml_lines.append(f"""  <url>
    <loc>{site_base}/post/{slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>""")

    xml_lines.append('</urlset>')
    sitemap_xml = "\n".join(xml_lines)

    if redis and posts:
        try:
            redis.set(cache_key, sitemap_xml, ex=3600)
        except Exception:
            pass

    return Response(
        content=sitemap_xml,
        media_type="application/xml",
        headers={"Cache-Control": "public, max-age=3600, s-maxage=7200"}
    )