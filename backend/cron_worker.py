import os
import re
import sys
import time
import logging
import urllib3
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from datetime import datetime, date, timedelta
from typing import Optional, Dict, Any, List
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# Suppress self-signed certificate warnings from government servers
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("BiharFastAllIndiaScraper")

# Endpoint & Auth Normalization
RAW_API_URL = os.getenv("API_BASE_URL", "https://bihar-fast-portal.onrender.com")
API_BASE_URL = RAW_API_URL.strip().rstrip("/")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET", "").strip()

# Telegram Auto-Broadcast Config
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID", "").strip()

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Connection": "keep-alive"
}

# Robust Scraper Session with Automatic Retries
scraper_session = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[500, 502, 503, 504],
    raise_on_status=False
)
scraper_session.mount("https://", HTTPAdapter(max_retries=retries))
scraper_session.mount("http://", HTTPAdapter(max_retries=retries))

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()

def detect_category(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["admit card", "hall ticket", "e-admit", "प्रवेश पत्र", "call letter"]):
        return "admit_card"
    if any(k in t for k in ["result", "marks", "cutoff", "scorecard", "परिणाम", "merit list"]):
        return "results"
    return "jobs"

# ==================== DATE-AWARE ENGINE (FRESHNESS FILTER) ====================

def parse_notice_date(text: str) -> Optional[date]:
    """Extracts date from patterns like DD-MM-YYYY, DD/MM/YYYY, or DD Mon YYYY."""
    if not text:
        return None
        
    m1 = re.search(r"(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})", text)
    if m1:
        d, m, y = m1.groups()
        try:
            return date(int(y), int(m), int(d))
        except ValueError:
            pass

    m2 = re.search(r"(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})", text)
    if m2:
        d, mon_str, y = m2.groups()
        for fmt in ("%b", "%B"):
            try:
                return datetime.strptime(f"{d} {mon_str} {y}", f"%d {fmt} %Y").date()
            except ValueError:
                continue
    return None

def is_fresh_notice(notice_date: Optional[date], max_age_days: int = 5) -> bool:
    """Returns True if the notice is within the last `max_age_days` days."""
    if not notice_date:
        return True
    age = (date.today() - notice_date).days
    return 0 <= age <= max_age_days

# ==================== TELEGRAM BROADCASTER ====================

def broadcast_to_telegram(notice: dict):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHANNEL_ID:
        return

    title = notice.get("title", "New Notification")
    dept = notice.get("department", "Govt Department")
    cat = notice.get("category", "jobs").upper()
    pdf_url = notice.get("pdf_url")
    apply_url = notice.get("apply_url") or "https://www.biharfast.in"

    msg = (
        f"📢 *नया सरकारी अपडेट: {dept}*\n\n"
        f"📌 *{title}*\n"
        f"🏷️ श्रेणी: #{cat}\n\n"
    )
    if pdf_url:
        msg += f"📄 [ऑफिशियल PDF देखें]({pdf_url})\n"
    if apply_url:
        msg += f"🌐 [ऑनलाइन पोर्टल लिंक]({apply_url})\n"

    msg += "\n⚡ *सबसे तेज़ अपडेट्स:* @biharfast"

    endpoint = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHANNEL_ID,
        "text": msg,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }

    try:
        r = requests.post(endpoint, json=payload, timeout=8)
        if r.status_code == 200:
            logger.info(f"[TELEGRAM BROADCASTED] {title[:35]}")
        else:
            logger.warning(f"Telegram API warning: {r.text}")
    except Exception as e:
        logger.warning(f"Telegram broadcast error: {e}")

# ==================== ALL INDIA CENTRAL RECRUITMENT SCRAPERS ====================

def scrape_upsc():
    notices = []
    url = "https://upsc.gov.in/whats-new"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr"):
                link_tag = row.find("a", href=True)
                if link_tag:
                    raw_row_text = row.get_text(separator=" ")
                    n_date = parse_notice_date(raw_row_text)
                    if not is_fresh_notice(n_date, max_age_days=5):
                        continue

                    title_text = clean_text(link_tag.get_text())
                    if len(title_text) > 12:
                        pdf_link = link_tag["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://upsc.gov.in" + pdf_link
                        notices.append({
                            "title": f"UPSC: {title_text[:140]}",
                            "department": "UPSC (All India)",
                            "category": detect_category(title_text),
                            "pdf_url": pdf_link,
                            "apply_url": "https://upsconline.nic.in"
                        })
    except Exception as e:
        logger.warning(f"UPSC scraping error: {e}")
    return notices[:20]

def scrape_ssc():
    notices = []
    api_url = "https://ssc.gov.in/api/notice"
    try:
        r = scraper_session.get(api_url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            data = r.json()
            items = data.get("data", []) if isinstance(data, dict) else []
            for item in items[:15]:
                title = item.get("noticeTitle") or item.get("title") or ""
                doc_path = item.get("attachmentPath") or item.get("filePath") or ""
                n_date = parse_notice_date(str(item.get("noticeDate") or ""))
                if not is_fresh_notice(n_date, max_age_days=5):
                    continue

                if title:
                    pdf_url = f"https://ssc.gov.in/{doc_path.lstrip('/')}" if doc_path else "https://ssc.gov.in"
                    notices.append({
                        "title": f"SSC: {clean_text(title)[:140]}",
                        "department": "SSC (All India)",
                        "category": detect_category(title),
                        "pdf_url": pdf_url,
                        "apply_url": "https://ssc.gov.in"
                    })
    except Exception:
        pass

    if not notices:
        try:
            r = scraper_session.get("https://ssc.gov.in", headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, "html.parser")
                for a in soup.find_all("a", href=True):
                    href = a["href"].lower()
                    text = clean_text(a.get_text())
                    if (".pdf" in href or "notice" in href) and len(text) > 12:
                        pdf_link = a["href"] if a["href"].startswith("http") else "https://ssc.gov.in/" + a["href"].lstrip("/")
                        notices.append({
                            "title": f"SSC: {text[:140]}",
                            "department": "SSC (All India)",
                            "category": detect_category(text),
                            "pdf_url": pdf_link,
                            "apply_url": "https://ssc.gov.in"
                        })
        except Exception as e:
            logger.warning(f"SSC fallback scraping skipped: {e}")
            
    return notices[:20]

def scrape_ibps():
    notices = []
    url = "https://www.ibps.in"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                text = clean_text(a.get_text())
                if any(k in text.lower() for k in ["crp", "po", "clerk", "specialist", "rrb", "recruitment"]) and len(text) > 15:
                    n_date = parse_notice_date(text)
                    if not is_fresh_notice(n_date, max_age_days=5):
                        continue

                    link = a["href"] if a["href"].startswith("http") else f"https://www.ibps.in/{a['href'].lstrip('/')}"
                    notices.append({
                        "title": f"IBPS Banking: {text[:140]}",
                        "department": "IBPS Banking",
                        "category": detect_category(text),
                        "pdf_url": link if ".pdf" in link.lower() else None,
                        "apply_url": "https://www.ibps.in"
                    })
    except Exception as e:
        logger.warning(f"IBPS scraping error: {e}")
    return notices[:20]

def scrape_rrb_central():
    notices = []
    url = "https://www.rrbapply.gov.in"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                text = clean_text(a.get_text())
                href = a["href"].lower()
                if (".pdf" in href or "cen" in href or "notification" in text.lower()) and len(text) > 10:
                    link = a["href"] if a["href"].startswith("http") else f"https://www.rrbapply.gov.in/{a['href'].lstrip('/')}"
                    notices.append({
                        "title": f"Railway: {text[:140]}",
                        "department": "Railway RRB (Central)",
                        "category": detect_category(text),
                        "pdf_url": link if ".pdf" in link.lower() else None,
                        "apply_url": "https://www.rrbapply.gov.in"
                    })
    except Exception as e:
        logger.warning(f"RRB Central scraping error: {e}")
    return notices[:15]

# ==================== BIHAR STATE LEVEL RECRUITMENT SCRAPERS ====================

def scrape_bpsc():
    notices = []
    url = "https://bpsc.bihar.gov.in/"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr"):
                    cols = row.find_all("td")
                    if len(cols) >= 2:
                        date_str = clean_text(cols[0].get_text())
                        n_date = parse_notice_date(date_str)
                        if not is_fresh_notice(n_date, max_age_days=5):
                            continue

                        link_tag = row.find("a", href=True)
                        title_text = clean_text(row.get_text(separator=" "))
                        if link_tag and len(title_text) > 10:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://bpsc.bihar.gov.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": title_text[:140],
                                "department": "BPSC",
                                "category": detect_category(title_text),
                                "pdf_url": pdf_link,
                                "apply_url": "https://bpsc.bihar.gov.in"
                            })
    except Exception as e:
        logger.warning(f"BPSC scraping error: {e}")
    return notices[:15]

def scrape_csbc():
    notices = []
    url = "https://csbc.bihar.gov.in"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr"):
                raw_row_text = row.get_text(separator=" ")
                n_date = parse_notice_date(raw_row_text)
                if not is_fresh_notice(n_date, max_age_days=5):
                    continue

                link_tag = row.find("a", href=True)
                if link_tag and ".pdf" in link_tag["href"].lower():
                    title_text = clean_text(raw_row_text)
                    if len(title_text) > 12:
                        pdf_link = link_tag["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = url.rstrip("/") + "/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": title_text[:140],
                            "department": "CSBC Bihar",
                            "category": detect_category(title_text),
                            "pdf_url": pdf_link,
                            "apply_url": "https://csbc.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"CSBC scraping error: {e}")
    return notices[:20]

def scrape_bpssc():
    """BPSSC - Uses longer timeout and HTTP fallback to bypass firewall drops."""
    notices = []
    for url in ["https://bpssc.bih.nic.in/", "http://bpssc.bih.nic.in/"]:
        try:
            r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(10, 25), verify=False)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, "html.parser")
                for row in soup.find_all("tr"):
                    raw_row_text = row.get_text(separator=" ")
                    n_date = parse_notice_date(raw_row_text)
                    if not is_fresh_notice(n_date, max_age_days=5):
                        continue

                    link_tag = row.find("a", href=True)
                    if link_tag and ".pdf" in link_tag["href"].lower():
                        title_text = clean_text(raw_row_text)
                        if len(title_text) > 12:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://bpssc.bih.nic.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": title_text[:140],
                                "department": "BPSSC (Bihar Police SI)",
                                "category": detect_category(title_text),
                                "pdf_url": pdf_link,
                                "apply_url": "https://bpssc.bih.nic.in"
                            })
                if notices:
                    break
        except Exception as e:
            logger.warning(f"BPSSC attempt on {url} skipped: {e}")
    return notices[:15]

def scrape_bssc():
    notices = []
    url = "https://bssc.bihar.gov.in/NoticeBoard.aspx"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr"):
                    raw_row_text = row.get_text(separator=" ")
                    n_date = parse_notice_date(raw_row_text)
                    if not is_fresh_notice(n_date, max_age_days=5):
                        continue

                    link_tag = row.find("a", href=True)
                    if link_tag and (".pdf" in link_tag["href"].lower() or "download" in link_tag["href"].lower()):
                        title_text = clean_text(raw_row_text)
                        if len(title_text) > 12:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://bssc.bihar.gov.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": title_text[:140],
                                "department": "BSSC Bihar",
                                "category": detect_category(title_text),
                                "pdf_url": pdf_link,
                                "apply_url": "https://bssc.bihar.gov.in"
                            })
    except Exception as e:
        logger.warning(f"BSSC scraping error: {e}")
    return notices[:15]

def scrape_btsc():
    notices = []
    url = "https://btsc.bihar.gov.in"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                if ".pdf" in a["href"].lower():
                    text = clean_text(a.get_text())
                    n_date = parse_notice_date(text)
                    if not is_fresh_notice(n_date, max_age_days=5):
                        continue

                    if len(text) > 12:
                        pdf_link = a["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://btsc.bihar.gov.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": text[:140],
                            "department": "BTSC Bihar",
                            "category": detect_category(text),
                            "pdf_url": pdf_link,
                            "apply_url": "https://btsc.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"BTSC scraping error: {e}")
    return notices[:15]

def scrape_bceceb():
    notices = []
    url = "https://bceceboard.bihar.gov.in"
    try:
        r = scraper_session.get(url, headers=BROWSER_HEADERS, timeout=(6, 18), verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                if ".pdf" in a["href"].lower() or "adv" in a["href"].lower():
                    text = clean_text(a.get_text())
                    n_date = parse_notice_date(text)
                    if not is_fresh_notice(n_date, max_age_days=5):
                        continue

                    if len(text) > 12:
                        pdf_link = a["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://bceceboard.bihar.gov.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": text[:140],
                            "department": "BCECEB Bihar",
                            "category": detect_category(text),
                            "pdf_url": pdf_link,
                            "apply_url": "https://bceceboard.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"BCECEB scraping error: {e}")
    return notices[:15]

# ==================== PUSH RAW NOTICES TO SCRAPED_INBOX & TELEGRAM ====================

def push_to_inbox(notice: dict):
    base = API_BASE_URL.rstrip("/")
    sync_endpoint = f"{base}/api/inbox/sync"

    headers = {
        "Content-Type": "application/json",
        "x-sync-secret": INTERNAL_SYNC_SECRET
    }

    try:
        # Timeout increased to 65s to comfortably absorb Render cold-start boots
        res = scraper_session.post(sync_endpoint, json=notice, headers=headers, timeout=65)
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == "duplicate_skipped":
                logger.info(f"[ALREADY SYNCED] {notice['title'][:35]}")
            else:
                logger.info(f"[INBOX SAVED] {notice['department']} -> {notice['title'][:40]}")
                broadcast_to_telegram(notice)
        elif res.status_code == 401:
            logger.error("Inbox sync unauthorized: INTERNAL_SYNC_SECRET mismatch!")
        else:
            logger.warning(f"Inbox sync status {res.status_code}: {res.text}")
    except requests.exceptions.Timeout:
        logger.error(f"Sync timed out for '{notice['title'][:30]}' (Render is booting, retrying next)")
    except Exception as e:
        logger.error(f"Backend inbox connection error: {e}")

def run_pipeline():
    logger.info(f"Connecting to Backend Endpoint: {API_BASE_URL}/api/inbox/sync")
    logger.info("Starting BiharFast Date-Aware Scraper + Telegram Engine...")
    all_notices = []

    # Central Recruitments
    all_notices.extend(scrape_upsc())
    all_notices.extend(scrape_ssc())
    all_notices.extend(scrape_ibps())
    all_notices.extend(scrape_rrb_central())

    # Bihar State Boards
    all_notices.extend(scrape_bpsc())
    all_notices.extend(scrape_csbc())
    all_notices.extend(scrape_bpssc())
    all_notices.extend(scrape_bssc())
    all_notices.extend(scrape_btsc())
    all_notices.extend(scrape_bceceb())

    logger.info(f"Total fresh notices gathered: {len(all_notices)}")

    seen = set()
    for item in all_notices:
        title_key = item["title"].strip().lower()
        if title_key not in seen:
            seen.add(title_key)
            push_to_inbox(item)

if __name__ == "__main__":
    run_pipeline()