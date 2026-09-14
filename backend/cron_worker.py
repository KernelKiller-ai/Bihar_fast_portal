import os
import re
import sys
import time
import logging
import requests
import urllib3
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Disable SSL warning notices for older state-board certificates
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("BiharFastAllIndiaScraper")

# Safe URL & Secret normalization (removes trailing slashes & accidental whitespace)
RAW_API_URL = os.getenv("API_BASE_URL", "https://bihar-fast-portal.onrender.com")
API_BASE_URL = RAW_API_URL.strip().rstrip("/")
INTERNAL_SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET", "").strip()

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

# ==================== ALL INDIA CENTRAL RECRUITMENT SCRAPERS ====================

def scrape_upsc():
    """UPSC All India Civil, CDS, NDA, Engineering & Medical Services"""
    notices = []
    url = "https://upsc.gov.in/whats-new"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for row in soup.find_all("tr"):
                link_tag = row.find("a", href=True)
                if link_tag:
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
    """Staff Selection Commission (CGL, CHSL, MTS, GD, CPO)"""
    notices = []
    url = "https://ssc.gov.in"
    try:
        session = requests.Session()
        r = session.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"].lower()
                text = clean_text(a.get_text())
                if (".pdf" in href or "notice" in href) and len(text) > 12:
                    pdf_link = a["href"]
                    if not pdf_link.startswith("http"):
                        pdf_link = "https://ssc.gov.in/" + pdf_link.lstrip("/")
                    notices.append({
                        "title": f"SSC: {text[:140]}",
                        "department": "SSC (All India)",
                        "category": detect_category(text),
                        "pdf_url": pdf_link,
                        "apply_url": "https://ssc.gov.in"
                    })
    except Exception as e:
        logger.warning(f"SSC scraping skipped: {e}")
    return notices[:20]

def scrape_ibps():
    """IBPS Banking (PO, Clerk, SO, RRB Scale I/II/III)"""
    notices = []
    url = "https://www.ibps.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                text = clean_text(a.get_text())
                if any(k in text.lower() for k in ["crp", "po", "clerk", "specialist", "rrb", "recruitment"]) and len(text) > 15:
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
    """Railway Recruitment Control Board Central Application Portal"""
    notices = []
    url = "https://www.rrbapply.gov.in"
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=12, verify=False)
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
                                "pdf_url": pdf_link,
                                "apply_url": "https://bpsc.bihar.gov.in"
                            })
    except Exception as e:
        logger.warning(f"BPSC scraping error: {e}")
    return notices[:20]

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
                            "pdf_url": pdf_link,
                            "apply_url": "https://csbc.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"CSBC scraping error: {e}")
    return notices[:20]

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
                            "pdf_url": pdf_link,
                            "apply_url": "https://bpssc.bih.nic.in"
                        })
    except Exception as e:
        logger.warning(f"BPSSC scraping skipped: {e}")
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
                            "pdf_url": pdf_link,
                            "apply_url": "https://bceceboard.bihar.gov.in"
                        })
    except Exception as e:
        logger.warning(f"BCECEB scraping error: {e}")
    return notices[:15]

# ==================== PUSH RAW NOTICES TO SCRAPED_INBOX ====================

def push_to_inbox(notice: dict):
    """Pushes raw notice directly into backend scraped_inbox (ZERO LLM tokens spent)."""
    base = API_BASE_URL.rstrip("/")
    sync_endpoint = f"{base}/api/inbox/sync"

    headers = {
        "Content-Type": "application/json",
        "x-sync-secret": INTERNAL_SYNC_SECRET
    }

    try:
        res = requests.post(sync_endpoint, json=notice, headers=headers, timeout=20)
        if res.status_code == 200:
            logger.info(f"[INBOX SAVED] {notice['department']} -> {notice['title'][:40]}")
        elif res.status_code == 401:
            logger.error("Inbox sync unauthorized: INTERNAL_SYNC_SECRET mismatch!")
        elif res.status_code == 409:
            logger.debug(f"[ALREADY IN INBOX] {notice['title'][:35]}")
        else:
            logger.warning(f"Inbox sync status {res.status_code}: {res.text}")
    except Exception as e:
        logger.error(f"Backend inbox connection error: {e}")

def run_pipeline():
    logger.info(f"Connecting to Backend Endpoint: {API_BASE_URL}/api/inbox/sync")
    logger.info("Starting BiharFast All-India + State Scraper Engine...")
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

    logger.info(f"Total raw notices gathered: {len(all_notices)}")

    seen = set()
    for item in all_notices:
        title_key = item["title"].strip().lower()
        if title_key not in seen:
            seen.add(title_key)
            push_to_inbox(item)

if __name__ == "__main__":
    run_pipeline()