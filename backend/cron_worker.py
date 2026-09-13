import os
import re
import sys
import time
import logging
import requests
import urllib3
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Suppress insecure SSL warnings for government portals
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("BiharFastCronWorker")

# Configurations
API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:5000").rstrip("/")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip('"\'')
TELEGRAM_CHANNEL_ID = (os.getenv("TELEGRAM_CHAT_ID") or os.getenv("TELEGRAM_CHANNEL_ID", "")).strip('"\'')

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Connection": "keep-alive"
}

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def detect_category(title: str) -> str:
    title_lower = title.lower()
    if any(k in title_lower for k in ["admit card", "hall ticket", "e-admit", "प्रवेश पत्र", "call letter"]):
        return "admit_card"
    if any(k in title_lower for k in ["result", "marks", "cutoff", "scorecard", "परिणाम", "merit list", "recommendation"]):
        return "results"
    return "jobs"

def send_telegram_alert(notice: dict):
    """Sends styled alerts strictly for new notices with rate-limit protection."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHANNEL_ID:
        return

    post_slug = notice.get("slug", "")
    post_url = f"https://www.biharfast.in/post/{post_slug}" if post_slug else "https://www.biharfast.in"

    cat = notice.get("category", "jobs")
    category_badge = (
        "🔥 नई भर्ती (New Job)" if cat == "jobs"
        else "🎫 एडमिट कार्ड (Admit Card)" if cat == "admit_card"
        else "📊 परीक्षा परिणाम (Result)"
    )

    message = (
        f"⚡ <b>BIHARFAST.IN OFFICIAL ALERT</b> ⚡\n\n"
        f"📌 <b>{notice.get('title')}</b>\n"
        f"🏢 <b>विभाग:</b> {notice.get('department', 'Govt of Bihar')}\n"
        f"📂 <b>श्रेणी:</b> {category_badge}\n"
        f"👥 <b>कुल पद:</b> {notice.get('total_posts', 'विज्ञप्ति देखें')}\n"
        f"📅 <b>अंतिम तिथि:</b> {notice.get('last_date', 'शीघ्र जारी')}\n"
        f"🎓 <b>योग्यता:</b> {notice.get('eligibility', 'विज्ञापन देखें')}\n\n"
        f"🔗 <b>पूरी जानकारी व ऑनलाइन आवेदन लिंक:</b>\n"
        f"{post_url}\n\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"🚀 <i>सबसे तेज व सटीक अपडेट: @biharfast_official</i>"
    )

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHANNEL_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }

    # Respect Telegram rate limit (Max 20/min) with automatic exponential wait
    for _ in range(2):
        try:
            res = requests.post(url, json=payload, timeout=10)
            if res.status_code == 200:
                logger.info(f"Telegram alert sent: {notice.get('title')[:30]}...")
                time.sleep(1.5)  # Safe delay between broadcasts
                return
            elif res.status_code == 429:
                retry_after = res.json().get("parameters", {}).get("retry_after", 15)
                logger.warning(f"Telegram rate limited. Waiting {retry_after}s...")
                time.sleep(retry_after + 1)
            else:
                logger.error(f"Telegram API Error ({res.status_code}): {res.text}")
                return
        except Exception as e:
            logger.error(f"Telegram post failed: {e}")
            return

# ==================== PORTAL SCRAPERS ====================

def scrape_csbc():
    notices = []
    url = "https://csbc.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr"):
                link_tag = row.find("a", href=True)
                if link_tag and ".pdf" in link_tag["href"].lower():
                    title_text = clean_text(row.get_text(separator=" "))
                    if len(title_text) > 12:
                        pdf_link = link_tag["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = url.rstrip("/") + "/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": title_text[:140],
                            "department": "CSBC Bihar",
                            "category": detect_category(title_text),
                            "total_posts": "विज्ञप्ति देखें",
                            "last_date": "विज्ञप्ति अनुसार",
                            "eligibility": "10th / 12th Pass",
                            "pdf_url": pdf_link,
                            "apply_url": "https://csbc.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"CSBC scraping error: {e}")
    return notices[:20]

def scrape_bpsc():
    notices = []
    url = "https://bpsc.bihar.gov.in/"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr"):
                    cols = row.find_all("td")
                    if len(cols) >= 2:
                        link_tag = row.find("a", href=True)
                        title_text = clean_text(row.get_text(separator=" "))
                        if link_tag and len(title_text) > 12:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://bpsc.bihar.gov.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": title_text[:140],
                                "department": "BPSC",
                                "category": detect_category(title_text),
                                "total_posts": "विज्ञप्ति देखें",
                                "last_date": "विज्ञप्ति अनुसार",
                                "eligibility": "Graduate / Relevant Field",
                                "pdf_url": pdf_link,
                                "apply_url": "https://bpsc.bihar.gov.in"
                            })
    except Exception as e:
        logger.warning(f"BPSC scraping error: {e}")
    return notices[:25]

def scrape_bpssc():
    notices = []
    url = "https://bpssc.bih.nic.in/"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=8, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr"):
                link_tag = row.find("a", href=True)
                if link_tag and ".pdf" in link_tag["href"].lower():
                    title_text = clean_text(row.get_text(separator=" "))
                    if len(title_text) > 12:
                        pdf_link = link_tag["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://bpssc.bih.nic.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": title_text[:140],
                            "department": "BPSSC (Bihar Police SI)",
                            "category": detect_category(title_text),
                            "total_posts": "विज्ञप्ति देखें",
                            "last_date": "विज्ञप्ति अनुसार",
                            "eligibility": "Graduation Pass",
                            "pdf_url": pdf_link,
                            "apply_url": "https://bpssc.bih.nic.in"
                        })
    except Exception as e:
        logger.warning(f"BPSSC server unreachable (Skipping): {e}")
    return notices[:15]

def scrape_bssc():
    notices = []
    url = "https://bssc.bihar.gov.in/NoticeBoard.aspx"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr"):
                    link_tag = row.find("a", href=True)
                    if link_tag and (".pdf" in link_tag["href"].lower() or "download" in link_tag["href"].lower()):
                        title_text = clean_text(row.get_text(separator=" "))
                        if len(title_text) > 12:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://bssc.bihar.gov.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": title_text[:140],
                                "department": "BSSC Bihar",
                                "category": detect_category(title_text),
                                "total_posts": "विज्ञप्ति देखें",
                                "last_date": "विज्ञप्ति अनुसार",
                                "eligibility": "12th / Graduation",
                                "pdf_url": pdf_link,
                                "apply_url": "https://bssc.bihar.gov.in"
                            })
    except Exception as e:
        logger.warning(f"BSSC scraping error: {e}")
    return notices[:20]

def scrape_btsc():
    notices = []
    url = "https://btsc.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                if ".pdf" in a["href"].lower():
                    title_text = clean_text(a.get_text())
                    if len(title_text) > 12:
                        pdf_link = a["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://btsc.bihar.gov.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": title_text[:140],
                            "department": "BTSC Bihar",
                            "category": detect_category(title_text),
                            "total_posts": "विज्ञप्ति देखें",
                            "last_date": "विज्ञप्ति अनुसार",
                            "eligibility": "Diploma / Degree / ITI",
                            "pdf_url": pdf_link,
                            "apply_url": "https://btsc.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"BTSC scraping error: {e}")
    return notices[:20]

def scrape_bceceb():
    notices = []
    url = "https://bceceboard.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                if ".pdf" in a["href"].lower() or "adv" in a["href"].lower():
                    title_text = clean_text(a.get_text())
                    if len(title_text) > 12:
                        pdf_link = a["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://bceceboard.bihar.gov.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": title_text[:140],
                            "department": "BCECEB Bihar",
                            "category": detect_category(title_text),
                            "total_posts": "विज्ञप्ति देखें",
                            "last_date": "विज्ञप्ति अनुसार",
                            "eligibility": "10th / Diploma / Graduate",
                            "pdf_url": pdf_link,
                            "apply_url": "https://bceceboard.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"BCECEB scraping error: {e}")
    return notices[:15]

def scrape_ssc():
    notices = []
    url = "https://ssc.gov.in"
    try:
        session = requests.Session()
        r = session.get(url, headers=BROWSER_HEADERS, timeout=10, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"].lower()
                text = clean_text(a.get_text())
                if (".pdf" in href or "notice" in href) and len(text) > 15:
                    pdf_link = a["href"]
                    if not pdf_link.startswith("http"):
                        pdf_link = "https://ssc.gov.in/" + pdf_link.lstrip("/")
                    notices.append({
                        "title": f"SSC: {text[:130]}",
                        "department": "SSC",
                        "category": detect_category(text),
                        "total_posts": "विज्ञप्ति देखें",
                        "last_date": "विज्ञप्ति अनुसार",
                        "eligibility": "10th / 12th / Graduate",
                        "pdf_url": pdf_link,
                        "apply_url": "https://ssc.gov.in"
                    })
    except Exception as e:
        logger.warning(f"SSC scraping skipped: {e}")
    return notices[:15]

def scrape_rrb_patna():
    notices = []
    url = "https://www.rrbpatna.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=10, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                if ".pdf" in a["href"].lower():
                    title_text = clean_text(a.get_text())
                    if len(title_text) > 15:
                        pdf_link = a["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://www.rrbpatna.gov.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": f"RRB Patna: {title_text[:130]}",
                            "department": "Railway (RRB Patna)",
                            "category": detect_category(title_text),
                            "total_posts": "विज्ञप्ति देखें",
                            "last_date": "विज्ञप्ति अनुसार",
                            "eligibility": "10th / ITI / Graduate",
                            "pdf_url": pdf_link,
                            "apply_url": "https://www.rrbpatna.gov.in"
                        })
    except Exception as e:
        logger.warning(f"RRB Patna scraping error: {e}")
    return notices[:15]

# ==================== SYNC & DEDUPLICATION ====================

def push_to_api_and_telegram(notice: dict):
    sync_endpoint = f"{API_BASE_URL}/api/posts/sync"
    
    headers = {
        "Content-Type": "application/json",
        "x-sync-secret": INTERNAL_SYNC_SECRET
    }

    try:
        res = requests.post(sync_endpoint, json=notice, headers=headers, timeout=15, allow_redirects=False)

        if res.status_code == 200:
            data = res.json()
            slug = data.get("slug")
            is_new = data.get("is_new", False)
            notice["slug"] = slug

            # DUPLICATE PROTECTION: Only alert Telegram if post was newly inserted
            if is_new:
                logger.info(f"[NEW POST] Synced & Alerting Telegram: {notice['title'][:40]}")
                send_telegram_alert(notice)
            else:
                logger.info(f"[EXISTS] DB up-to-date (Telegram skipped): {slug}")

        elif res.status_code == 401:
            logger.error("Sync API failed (401): INTERNAL_SYNC_SECRET mismatch!")
        elif res.status_code == 400:
            logger.error(f"Sync API failed (400 - Validation): {res.text}")
        else:
            logger.error(f"Sync API failed ({res.status_code}): {res.text}")
    except Exception as e:
        logger.error(f"Backend connection error: {e}")

def run_pipeline():
    logger.info("Starting BiharFast Smart Pipeline (Spam Protected)...")
    all_notices = []

    all_notices.extend(scrape_csbc())
    all_notices.extend(scrape_bpsc())
    all_notices.extend(scrape_bpssc())
    all_notices.extend(scrape_bssc())
    all_notices.extend(scrape_btsc())
    all_notices.extend(scrape_bceceb())
    all_notices.extend(scrape_ssc())
    all_notices.extend(scrape_rrb_patna())

    logger.info(f"Total notices extracted: {len(all_notices)}")

    # In-memory batch deduplication
    seen = set()
    for item in all_notices:
        t = item["title"].strip().lower()
        if t not in seen:
            seen.add(t)
            push_to_api_and_telegram(item)

if __name__ == "__main__":
    run_pipeline()