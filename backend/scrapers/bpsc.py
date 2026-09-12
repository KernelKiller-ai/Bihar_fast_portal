import httpx
from bs4 import BeautifulSoup
import re
import hashlib

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def generate_hash(title: str, url: str) -> str:
    return hashlib.sha256(f"{title.strip().lower()}_{url.strip()}".encode()).hexdigest()

def scrape_bpsc(limit: int = 5):
    notices = []
    url = "https://bpsc.bihar.gov.in"
    
    try:
        with httpx.Client(verify=False, timeout=15.0) as client:
            res = client.get(url, headers=HEADERS)
            if res.status_code != 200:
                print(f"[BPSC Scraper] Status Error: {res.status_code}")
                return []
            
            soup = BeautifulSoup(res.text, "html.parser")
            seen_links = set()

            for a in soup.find_all("a"):
                href = a.get("href", "").strip()
                title = a.get_text(strip=True)
                
                if href and ".pdf" in href.lower() and len(title) > 10:
                    if href in seen_links:
                        continue
                    seen_links.add(href)
                    
                    full_pdf = href if href.startswith("http") else f"{url.rstrip('/')}/{href.lstrip('/')}"
                    clean_title = re.sub(r"^(important notice\s*[:\-\s]*)+", "", title, flags=re.IGNORECASE).strip()
                    if not clean_title:
                        clean_title = title

                    t_lower = clean_title.lower()
                    if "result" in t_lower or "marks" in t_lower or "merit" in t_lower:
                        cat = "RESULT"
                    elif "admit" in t_lower or "exam program" in t_lower or "programme" in t_lower:
                        cat = "ADMIT_CARD"
                    else:
                        cat = "JOB"
                    
                    content_hash = generate_hash(clean_title, full_pdf)
                    
                    notices.append({
                        "title": clean_title[:200],
                        "department": "BPSC",
                        "category": cat,
                        "pdf_url": full_pdf,
                        "apply_url": "https://onlinebpsc.bihar.gov.in",
                        "content_hash": content_hash
                    })
                    
                    if len(notices) >= limit:
                        break
                        
    except Exception as e:
        print(f"[BPSC Scraper Failure]: {e}")
        
    return notices