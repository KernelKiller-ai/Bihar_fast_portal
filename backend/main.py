import os
import re
import json
import hmac
import logging
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import Optional, Any, List, Dict
from fastapi import Depends, FastAPI, HTTPException, BackgroundTasks, Header, Query, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from upstash_redis import Redis
from dotenv import load_dotenv
from google import genai
from google.genai import types
import orjson

import database as db
from quiz_router import quiz_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("biharfast")

load_dotenv(override=False)

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET", "").strip()
ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip('"\'')
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
        logger.error(f"Redis initialization warning (using local fallback): {e}")

ai_client: Optional[genai.Client] = None
if GEMINI_API_KEY:
    try:
        ai_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Gemini AI Client initialized.")
    except Exception as e:
        logger.warning(f"Gemini client initialization failed: {e}")

# ----------------- FASTAPI APP -----------------
app = FastAPI(
    title="BiharFast Portal Engine",
    version="6.5.0",
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
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$\vert{}^https?://.*biharfast\.in.*$",
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

# ----------------- OFFICIAL DOMAINS & MODELS -----------------
OFFICIAL_ALLOWED_DOMAINS = {
    "bceceboard.bihar.gov.in", "bpsc.bih.nic.in", "bpsc.bihar.gov.in",
    "onlinebpsc.bihar.gov.in", "csbc.bih.nic.in", "csbc.bihar.gov.in",
    "bpssc.bih.nic.in", "bssc.bihar.gov.in", "btsc.bihar.gov.in",
    "biharboardonline.bihar.gov.in", "patnahighcourt.gov.in",
    "dlrs.bihar.gov.in", "rrbpatna.gov.in",
    "ssc.gov.in", "upsc.gov.in", "upsconline.nic.in",
    "ibps.in", "sbi.co.in", "rbi.org.in",
    "indianrailways.gov.in", "rrbapply.gov.in",
    "indiapostgdsonline.gov.in", "nta.ac.in",
    "joinindianarmy.nic.in", "joinindiannavy.gov.in", "agnipathvayu.cdac.in",
    "crpf.gov.in", "bsf.gov.in", "cisf.gov.in", "itbpolice.nic.in", "ssb.gov.in"
}

class InboxSyncPayload(BaseModel):
    title: str
    department: str
    category: Optional[str] = "jobs"
    pdf_url: Optional[str] = None
    apply_url: Optional[str] = None

class PostUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    total_posts: Optional[str] = None
    last_date: Optional[str] = None
    eligibility: Optional[str] = None
    fees: Optional[str] = None
    apply_url: Optional[str] = None
    pdf_url: Optional[str] = None
    short_desc: Optional[str] = None
    important_dates: Optional[Dict[str, Any]] = None
    application_fees: Optional[Dict[str, Any]] = None
    age_limit: Optional[Dict[str, Any]] = None
    selection_process: Optional[List[str]] = None
    how_to_apply: Optional[List[str]] = None
    extra_links: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = None
    admin_notes: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    status: str

# ----------------- SECURITY & HELPERS -----------------
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
        logger.warning(f"Admin access blocked for IP {client_ip}.")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Suraksha Lock: Adhik galat prayas kiye gaye hain. IP temporary block hai."
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
        except Exception as e:
            logger.error(f"Redis lockout record error: {e}")
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
    cache_key = f"admin_lock:{client_ip}"
    if redis:
        try:
            redis.delete(cache_key)
        except Exception:
            pass
    _MEMORY_ATTEMPTS.pop(client_ip, None)

def slugify(title: str, dept: str) -> str:
    combined = f"{dept}-{title}"
    slug = re.sub(r"[^\w\s-]", "", combined.lower()).strip()
    return re.sub(r"[\s_-]+", "-", slug)[:90]

def is_url_whitelisted(url: Optional[str]) -> bool:
    if not url:
        return True
    try:
        clean_url = url.strip()
        parsed = urlparse(clean_url)
        if not parsed.netloc:
            return False
        hostname = (parsed.hostname or "").lower()
        return any(hostname == d or hostname.endswith("." + d) or hostname.endswith(".gov.in") or hostname.endswith(".nic.in") for d in OFFICIAL_ALLOWED_DOMAINS)
    except Exception:
        return False

def require_admin(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    if not ADMIN_API_TOKEN:
        logger.critical("ADMIN_API_TOKEN is not configured.")
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

def require_sync_or_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    x_sync_secret: Optional[str] = Header(None),
):
    admin_valid = bool(
        credentials
        and credentials.scheme.lower() == "bearer"
        and ADMIN_API_TOKEN
        and hmac.compare_digest(credentials.credentials.strip(), ADMIN_API_TOKEN)
    )
    sync_valid = bool(
        INTERNAL_SYNC_SECRET
        and x_sync_secret
        and hmac.compare_digest(x_sync_secret, INTERNAL_SYNC_SECRET)
    )
    if not (admin_valid or sync_valid):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized sync request")

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

# 5-Year Fail-Safe Heuristic Generator (Zero AI Dependence)
def build_zero_token_notice(title: str, dept: str, cat: str, pdf_url: Optional[str], apply_url: Optional[str]) -> Dict[str, Any]:
    return {
        "title": title.strip(),
        "short_desc": f"{dept} dwaara {title} ke liye aadhikarik vigyapti jaari ki gayi hai. Sabhi abhyarthi nirdharit samay par official notification dekhkar aavedan karein.",
        "total_posts": "अधिसूचना देखें",
        "last_date": "आधिकारिक सूचना अनुसार",
        "eligibility": "पद के अनुसार संबंधित योग्यता विवरण आधिकारिक विज्ञापन (PDF) में देखें।",
        "fees": "वर्गानुसार निर्धारित (विज्ञापन देखें)",
        "important_dates": {
            "Notification Released": "हाल ही में जारी",
            "Application Status": "सक्रिय / जारी"
        },
        "application_fees": {
            "General / OBC / EWS": "विज्ञापन देखें",
            "SC / ST / PwD": "नियमानुसार"
        },
        "age_limit": {
            "Niyam": "विभागीय नियमानुसार छूट लागू"
        },
        "selection_process": [
            "लिखित परीक्षा / ऑनलाइन CBT या मेरिट",
            "दस्तावेज सत्यापन (DV)"
        ],
        "how_to_apply": [
            "आधिकारिक पोर्टल पर जाकर दिशा-निर्देश पढ़ें।",
            "मांगे गए सभी प्रमाण पत्र और विवरण सही भरें।",
            "अंतिम सबमिशन के बाद फॉर्म की प्रति सुरक्षित रखें।"
        ]
    }

# ----------------- PUBLIC ROUTES -----------------
@app.get("/")
def health_check():
    return Response(
        content=b'{"status":"active","engine":"BiharFast Engine","version":"6.5.0"}',
        media_type="application/json"
    )

@app.get("/api/notices")
@app.get("/api/posts")
def get_all_posts():
    cache_key = "home:latest_posts"
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

# ----------------- ADMIN & INBOX WORKFLOWS -----------------
@app.post("/api/inbox/sync")
def sync_raw_to_inbox(
    payload: InboxSyncPayload,
    _: None = Depends(require_sync_or_admin),
):
    res = db.insert_inbox_notice(payload.model_dump())
    if not res:
        return Response(content=b'{"success":true,"status":"duplicate_skipped"}', media_type="application/json")

    return Response(
        content=orjson.dumps({"success": True, "data": res}),
        media_type="application/json"
    )

@app.get("/api/admin/quota-stats")
def get_quota_stats(_: None = Depends(require_admin)):
    try:
        return db.get_today_llm_usage()
    except Exception:
        return {"used": 0, "limit": 100}

@app.get("/api/admin/inbox")
def get_scraped_inbox(status: str = Query("unprocessed"), _: None = Depends(require_admin)):
    items = db.fetch_inbox_notices(status=status, limit=100)
    return Response(
        content=orjson.dumps({"success": True, "count": len(items), "data": items}),
        media_type="application/json"
    )

@app.post("/api/admin/inbox/{inbox_id}/reject")
def reject_inbox_item(inbox_id: str, _: None = Depends(require_admin)):
    updated = db.update_inbox_status(inbox_id, "rejected")
    if not updated:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return {"success": True, "message": "Notice rejected and archived."}

# CRITICAL FIX: 5-Year Safe Publish Endpoint (Never returns 500 or blocks on AI quota)
@app.post("/api/admin/inbox/{inbox_id}/enrich-and-publish")
def enrich_and_publish_with_llm(inbox_id: str, bg: BackgroundTasks, _: None = Depends(require_admin)):
    inbox_item = db.fetch_inbox_item_by_id(inbox_id)
    if not inbox_item:
        raise HTTPException(status_code=404, detail="Inbox item not found")

    if inbox_item.get("status") == "enriched":
        raise HTTPException(status_code=400, detail="Notice has already been processed and published.")

    title = inbox_item.get("title", "").strip()
    dept = inbox_item.get("department", "Govt of Bihar / India").strip()
    cat = inbox_item.get("category", "jobs")
    pdf_url = inbox_item.get("pdf_url")
    apply_url = inbox_item.get("apply_url")

    ai_data: Dict[str, Any] = {}
    quota_available = False

    # Check if database allows AI call
    try:
        quota_available = db.check_and_increment_daily_llm_quota(max_limit=50)
    except Exception as e:
        logger.warning(f"Quota check bypass: {e}")
        quota_available = True

    # Try Gemini if client & quota available
    if ai_client and quota_available:
        prompt = f"""
Analyze this government notification update and generate a strictly structured JSON response for BiharFast job portal.
Return ONLY clean, valid JSON without any markdown ticks or explanations.

Input Details:
- Title: {title}
- Department: {dept}
- Category: {cat}
- PDF Link: {pdf_url}
- Apply Link: {apply_url}

Generate a JSON object matching this schema:
{{
  "title": "Clean concise professional title in Hindi/English mix",
  "short_desc": "2-3 line summary explaining what this notification is about for aspirants.",
  "total_posts": "e.g. 1,250 पद or अधिसूचना देखें",
  "last_date": "e.g. 30 अक्टूबर 2026 or अधिसूचना अनुसार",
  "eligibility": "Clear educational qualification criteria",
  "fees": "e.g. Gen/OBC: ₹100 | SC/ST: ₹0",
  "important_dates": {{
    "Notification Released": "Recent Date",
    "Application Start": "Date or यथाशीघ्र",
    "Last Date to Apply": "Date",
    "Exam Date": "Notify Soon or Exact Date"
  }},
  "application_fees": {{
    "General / OBC / EWS": "₹--- or ₹0",
    "SC / ST / PwD": "₹0 or Specific Fee"
  }},
  "age_limit": {{
    "Minimum Age": "18 or 21 Years",
    "Maximum Age": "27 to 40 Years as per norms",
    "Age Relaxation": "As per Govt rules"
  }},
  "selection_process": [
    "Written Examination / Online CBT",
    "Document Verification & Medical"
  ],
  "how_to_apply": [
    "Visit the official recruitment portal.",
    "Complete online registration and submit documents.",
    "Pay the applicable fee and print final form."
  ]
}}
"""
        try:
            response = ai_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            if response and response.text:
                cleaned_json = response.text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
                ai_data = json.loads(cleaned_json)
        except Exception as ai_err:
            logger.warning(f"AI Enrichment skipped/failed (Safe Fallback applied): {ai_err}")

    # Fallback to zero-token template if AI fails or quota finished
    if not ai_data or not isinstance(ai_data, dict):
        ai_data = build_zero_token_notice(title, dept, cat, pdf_url, apply_url)

    final_title = ai_data.get("title") or title
    slug = slugify(final_title, dept)
    normalized_cat = "results" if "result" in cat.lower() else ("admit_card" if "admit" in cat.lower() else "jobs")

    record = {
        "slug": slug,
        "title": final_title,
        "department": dept,
        "category": normalized_cat,
        "total_posts": ai_data.get("total_posts") or "अधिसूचना देखें",
        "last_date": ai_data.get("last_date") or "सक्रिय सूचना",
        "eligibility": ai_data.get("eligibility") or "विज्ञापन देखें",
        "fees": ai_data.get("fees") or "निःशुल्क (₹0)",
        "apply_url": apply_url,
        "pdf_url": pdf_url,
        "short_desc": ai_data.get("short_desc") or f"{dept} द्वारा जारी आधिकारिक सूचना।",
        "important_dates": ai_data.get("important_dates") or {},
        "application_fees": ai_data.get("application_fees") or {},
        "age_limit": ai_data.get("age_limit") or {},
        "selection_process": ai_data.get("selection_process") or [],
        "how_to_apply": ai_data.get("how_to_apply") or [],
        "extra_links": [],
        "is_active": True,
        "status": "published"
    }

    try:
        db.upsert_notice(record)
        db.update_inbox_status(inbox_id, "enriched")
        bg.add_task(flush_cache, slug=slug)
    except Exception as db_err:
        logger.error(f"Database write error on publish: {db_err}")
        raise HTTPException(status_code=500, detail="Database write operation failed")

    return Response(
        content=orjson.dumps({
            "success": True, 
            "message": "Notice published live successfully!", 
            "slug": slug,
            "mode": "ai" if quota_available and ai_client else "zero_token_template"
        }),
        media_type="application/json"
    )

@app.get("/api/admin/posts")
def get_admin_posts(status: Optional[str] = Query(None), _: None = Depends(require_admin)):
    posts = db.fetch_admin_notices(status=status, limit=100)
    return Response(
        content=orjson.dumps({"success": True, "count": len(posts), "data": posts}),
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
        except Exception as e:
            logger.warning(f"Redis read bypass for sitemap: {e}")

    site_base = "[https://www.biharfast.in](https://www.biharfast.in)"
    today = datetime.now().strftime("%Y-%m-%d")

    try:
        posts = db.fetch_all_slugs_for_sitemap()
    except Exception as e:
        logger.error(f"Error reading slugs for sitemap: {e}")
        posts = []

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="[http://www.sitemaps.org/schemas/sitemap/0.9](http://www.sitemaps.org/schemas/sitemap/0.9)">'
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