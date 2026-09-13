import os
import re
import sys
import logging
import requests
import urllib3
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Disable insecure SSL warnings for state NIC portals
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("BiharFastCronWorker")

# Server & Sync Settings
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
    if any(k in title_lower for k in ["result", "marks", "cutoff", "scorecard", "परिणाम", "final recommendation", "merit list"]):
        return "results"
    return "jobs"

def send_telegram_alert(notice: dict):
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
        f"👥 <b>कुल पद:</b> {notice.get('total_posts', 'अधिसूचना देखें')}\n"
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

    try:
        res = requests.post(url, json=payload, timeout=10)
        if res.status_code == 200:
            logger.info(f"Telegram alert sent: {notice.get('title')[:30]}...")
        else:
            logger.error(f"Telegram API error ({res.status_code}): {res.text}")
    except Exception as e:
        logger.error(f"Telegram post failed: {e}")

# ==================== BIHAR STATE SCRAPERS ====================

def scrape_csbc():
    """CSBC Bihar Police Constable / Driver"""
    notices = []
    url = "https://csbc.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr")[:8]:
                link_tag = row.find("a", href=True)
                if link_tag and ".pdf" in link_tag["href"].lower():
                    title_text = clean_text(row.get_text(separator=" "))
                    if len(title_text) > 15:
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
    return notices

def scrape_bpsc():
    """BPSC (Bihar Public Service Commission)"""
    notices = []
    url = "https://bpsc.bihar.gov.in/"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr")[:10]:
                    cols = row.find_all("td")
                    if len(cols) >= 2:
                        link_tag = row.find("a", href=True)
                        title_text = clean_text(row.get_text(separator=" "))
                        if link_tag and len(title_text) > 15:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://bpsc.bihar.gov.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": title_text[:140],
                                "department": "BPSC",
                                "category": detect_category(title_text),
                                "total_posts": "विज्ञप्ति देखें",
                                "last_date": "विज्ञप्ति अनुसार",
                                "eligibility": "Graduate / Relevant Degree",
                                "pdf_url": pdf_link,
                                "apply_url": "https://bpsc.bihar.gov.in"
                            })
    except Exception as e:
        logger.warning(f"BPSC scraping error: {e}")
    return notices

def scrape_bpssc():
    """BPSSC (Bihar Police SI / Daroga)"""
    notices = []
    url = "https://bpssc.bih.nic.in/"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr")[:8]:
                link_tag = row.find("a", href=True)
                if link_tag and ".pdf" in link_tag["href"].lower():
                    title_text = clean_text(row.get_text(separator=" "))
                    if len(title_text) > 15:
                        pdf_link = link_tag["href"]
                        if not pdf_link.startswith("http"):
                            pdf_link = "https://bpssc.bih.nic.in/" + pdf_link.lstrip("/")
                        notices.append({
                            "title": title_text[:140],
                            "department": "BPSSC (Bihar Police SI)",
                            "category": detect_category(title_text),
                            "total_posts": "विज्ञप्ति देखें",
                            "last_date": "विज्ञप्ति अनुसार",
                            "eligibility": "Graduation in any stream",
                            "pdf_url": pdf_link,
                            "apply_url": "https://bpssc.bih.nic.in"
                        })
    except Exception as e:
        logger.warning(f"BPSSC scraping error: {e}")
    return notices

def scrape_bssc():
    """BSSC (Bihar Staff Selection Commission - CGL / Inter Level)"""
    notices = []
    url = "https://bssc.bihar.gov.in/NoticeBoard.aspx"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr")[:8]:
                    link_tag = row.find("a", href=True)
                    if link_tag and (".pdf" in link_tag["href"].lower() or "download" in link_tag["href"].lower()):
                        title_text = clean_text(row.get_text(separator=" "))
                        if len(title_text) > 15:
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
    return notices

def scrape_btsc():
    """BTSC (Bihar Technical Service Commission - JE, ANM, Medical)"""
    notices = []
    url = "https://btsc.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True)[:15]:
                if ".pdf" in a["href"].lower():
                    title_text = clean_text(a.get_text())
                    if len(title_text) > 15:
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
    return notices

def scrape_bceceb():
    """BCECEB (Bihar Combined Entrance & DLRS LRC Amin / Revenue)"""
    notices = []
    url = "https://bceceboard.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True)[:12]:
                if ".pdf" in a["href"].lower() or "adv" in a["href"].lower():
                    title_text = clean_text(a.get_text())
                    if len(title_text) > 15:
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
    return notices

def scrape_patna_high_court():
    """Patna High Court Recruitment Notices"""
    notices = []
    url = "https://patnahighcourt.gov.in/Recruitments"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            table = soup.find("table")
            if table:
                for row in table.find_all("tr")[:6]:
                    link_tag = row.find("a", href=True)
                    if link_tag and ".pdf" in link_tag["href"].lower():
                        title_text = clean_text(row.get_text(separator=" "))
                        if len(title_text) > 15:
                            pdf_link = link_tag["href"]
                            if not pdf_link.startswith("http"):
                                pdf_link = "https://patnahighcourt.gov.in/" + pdf_link.lstrip("/")
                            notices.append({
                                "title": f"Patna HC: {title_text[:120]}",
                                "department": "Patna High Court",
                                "category": detect_category(title_text),
                                "total_posts": "विज्ञप्ति देखें",
                                "last_date": "विज्ञप्ति अनुसार",
                                "eligibility": "12th / Graduate / Law",
                                "pdf_url": pdf_link,
                                "apply_url": "https://patnahighcourt.gov.in"
                            })
    except Exception as e:
        logger.warning(f"Patna HC scraping error: {e}")
    return notices

def scrape_bseb():
    """Bihar School Examination Board (STET, D.El.Ed & Staff Recruitments)"""
    notices = []
    url = "https://biharboardonline.bihar.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True)[:10]:
                href = a["href"].lower()
                text = clean_text(a.get_text())
                if (".pdf" in href or "stet" in href or "notice" in href) and len(text) > 15:
                    pdf_link = a["href"]
                    if not pdf_link.startswith("http"):
                        pdf_link = "https://biharboardonline.bihar.gov.in/" + pdf_link.lstrip("/")
                    notices.append({
                        "title": f"BSEB: {text[:130]}",
                        "department": "BSEB Bihar",
                        "category": detect_category(text),
                        "total_posts": "विज्ञप्ति देखें",
                        "last_date": "विज्ञप्ति अनुसार",
                        "eligibility": "B.Ed / D.El.Ed / Graduate",
                        "pdf_url": pdf_link,
                        "apply_url": "https://biharboardonline.bihar.gov.in"
                    })
    except Exception as e:
        logger.warning(f"BSEB scraping error: {e}")
    return notices

# ==================== CENTRAL & RAILWAY SCRAPERS ====================

def scrape_ssc():
    """Staff Selection Commission (SSC Central Portal)"""
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
                if (".pdf" in href or "notice" in href) and len(text) > 20:
                    pdf_link = a["href"]
                    if not pdf_link.startswith("http"):
                        pdf_link = "https://ssc.gov.in/" + pdf_link.lstrip("/")
                    notices.append({
                        "title": f"SSC: {text[:130]}",
                        "department": "Staff Selection Commission (SSC)",
                        "category": detect_category(text),
                        "total_posts": "विज्ञप्ति देखें",
                        "last_date": "विज्ञप्ति अनुसार",
                        "eligibility": "10th / 12th / Graduate",
                        "pdf_url": pdf_link,
                        "apply_url": "https://ssc.gov.in"
                    })
                    if len(notices) >= 4:
                        break
    except Exception as e:
        logger.warning(f"SSC scraping skipped: {e}")
    return notices

def scrape_rrb_patna():
    """Railway Recruitment Board (RRB Patna)"""
    notices = []
    url = "https://www.rrbpatna.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
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
                        if len(notices) >= 4:
                            break
    except Exception as e:
        logger.warning(f"RRB Patna scraping error: {e}")
    return notices

def scrape_ibps():
    """IBPS (Bank PO / Clerk / SO)"""
    notices = []
    url = "https://www.ibps.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                text = clean_text(a.get_text())
                if any(k in text.lower() for k in ["crp", "recruitment", "result", "scorecard", "admit"]) and len(text) > 20:
                    link = a["href"]
                    if not link.startswith("http"):
                        link = "https://www.ibps.in/" + link.lstrip("/")
                    notices.append({
                        "title": f"IBPS: {text[:130]}",
                        "department": "Banking (IBPS)",
                        "category": detect_category(text),
                        "total_posts": "विज्ञप्ति देखें",
                        "last_date": "विज्ञप्ति अनुसार",
                        "eligibility": "Graduate (Any Stream)",
                        "pdf_url": link if ".pdf" in link.lower() else None,
                        "apply_url": "https://www.ibps.in"
                    })
                    if len(notices) >= 3:
                        break
    except Exception as e:
        logger.warning(f"IBPS scraping error: {e}")
    return notices

def scrape_india_post():
    """India Post Gramin Dak Sevak (GDS)"""
    notices = []
    url = "https://indiapostgdsonline.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                text = clean_text(a.get_text())
                if any(k in text.lower() for k in ["gds", "merit", "circle", "notification"]) and len(text) > 15:
                    link = a["href"]
                    if not link.startswith("http"):
                        link = "https://indiapostgdsonline.gov.in/" + link.lstrip("/")
                    notices.append({
                        "title": f"Dak Vibhag: {text[:130]}",
                        "department": "India Post GDS",
                        "category": detect_category(text),
                        "total_posts": "विज्ञप्ति देखें",
                        "last_date": "विज्ञप्ति अनुसार",
                        "eligibility": "10th Pass (With Math & English)",
                        "pdf_url": link if ".pdf" in link.lower() else None,
                        "apply_url": "https://indiapostgdsonline.gov.in"
                    })
                    if len(notices) >= 2:
                        break
    except Exception as e:
        logger.warning(f"India Post GDS scraping error: {e}")
    return notices

# ==================== SYNC ENGINE ====================

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
            notice["slug"] = slug
            logger.info(f"DB Synced: {notice['title'][:40]} -> {slug}")
            send_telegram_alert(notice)
        elif res.status_code == 401:
            logger.error("Sync API failed (401): INTERNAL_SYNC_SECRET mismatch!")
        elif res.status_code == 400:
            logger.error(f"Sync API failed (400 - Validation): {res.text}")
        elif res.status_code in (301, 302, 307, 308, 405):
            logger.error(f"Sync API failed ({res.status_code}): Check API_BASE_URL: {sync_endpoint}")
        else:
            logger.error(f"Sync API failed ({res.status_code}): {res.text}")
    except Exception as e:
        logger.error(f"Backend connection error: {e}")

def run_pipeline():
    logger.info("Starting BiharFast Universal Govt Scraper Pipeline...")
    all_notices = []

    # 1. State Commissions & Boards
    all_notices.extend(scrape_csbc())
    all_notices.extend(scrape_bpsc())
    all_notices.extend(scrape_bpssc())
    all_notices.extend(scrape_bssc())
    all_notices.extend(scrape_btsc())
    all_notices.extend(scrape_bceceb())
    all_notices.extend(scrape_patna_high_court())
    all_notices.extend(scrape_bseb())

    # 2. Central & Railway Commissions
    all_notices.extend(scrape_ssc())
    all_notices.extend(scrape_rrb_patna())
    all_notices.extend(scrape_ibps())
    all_notices.extend(scrape_india_post())

    logger.info(f"Total notices extracted across all 11+ departments: {len(all_notices)}")

    # 3. Deduplicate by title & sync
    seen = set()
    for item in all_notices:
        t = item["title"].strip().lower()
        if t not in seen:
            seen.add(t)
            push_to_api_and_telegram(item)

if __name__ == "__main__":
    run_pipeline()