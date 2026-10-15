"""
BiharFast.in — Phase 3.3 Full Deep SEO & Render Verification Script.
Conducts:
1. Complete Raw HTTP inspection (status, redirects, headers, X-Robots-Tag, raw HTML tags)
2. Real Headless Chrome DOM rendering (rendered title, canonical, meta robots, H1, main content words)
3. Production robots.txt audit on both Vercel frontend and Render backend
"""
import sys
import os
import json
import time
import subprocess
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding="utf-8")

URLS = [
    "https://biharfast.in/",
    "https://biharfast.in/jobs",
    "https://biharfast.in/admit-card",
    "https://biharfast.in/results",
    "https://biharfast.in/sitemap",
    "https://biharfast.in/mock-test",
    "https://biharfast.in/useful-tools",
    "https://biharfast.in/upcoming-2026",
    "https://biharfast.in/download",
    "https://biharfast.in/bseb-matric-10th",
    "https://biharfast.in/bseb-inter-12th",
    "https://biharfast.in/cuet-ug-admission",
    "https://biharfast.in/rtps-bihar",
    "https://biharfast.in/udyami-yojana",
    "https://biharfast.in/kyp-bihar",
    "https://biharfast.in/student-credit-card",
    "https://biharfast.in/category/welfare-schemes",
    "https://biharfast.in/category/scholarships",
    "https://biharfast.in/category/bpsc-jobs",
    "https://biharfast.in/category/bihar-police",
    "https://biharfast.in/category/teacher-recruitment",
    "https://biharfast.in/category/health-department",
    "https://biharfast.in/category/panchayati-raj",
    "https://biharfast.in/category/student-schemes",
    "https://biharfast.in/category/social-welfare",
    "https://biharfast.in/about",
    "https://biharfast.in/contact",
    "https://biharfast.in/privacy-policy",
    "https://biharfast.in/terms",
    "https://biharfast.in/disclaimer",
]

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
}

def inspect_raw_http(url: str) -> dict:
    session = requests.Session()
    try:
        resp = session.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        redirect_history = [
            {"status_code": r.status_code, "url": r.url, "location": r.headers.get("Location")}
            for r in resp.history
        ]
        
        soup = BeautifulSoup(resp.text, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else None
        
        meta_desc = None
        desc_el = soup.find("meta", attrs={"name": "description"})
        if desc_el and desc_el.get("content"):
            meta_desc = desc_el.get("content").strip()
            
        canonical = None
        canon_el = soup.find("link", attrs={"rel": "canonical"})
        if canon_el and canon_el.get("href"):
            canonical = canon_el.get("href").strip()
            
        robots_meta = []
        for r_el in soup.find_all("meta", attrs={"name": "robots"}):
            if r_el.get("content"):
                robots_meta.append(r_el.get("content").strip())
                
        return {
            "requested_url": url,
            "http_status": resp.status_code,
            "redirect_history": redirect_history,
            "final_url": resp.url,
            "content_type": resp.headers.get("Content-Type"),
            "x_robots_tag": resp.headers.get("X-Robots-Tag"),
            "raw_title": title,
            "raw_meta_description": meta_desc,
            "raw_canonical": canonical,
            "raw_robots": robots_meta,
            "raw_html_length": len(resp.text),
            "http_error": None
        }
    except Exception as e:
        return {
            "requested_url": url,
            "http_status": None,
            "redirect_history": [],
            "final_url": None,
            "content_type": None,
            "x_robots_tag": None,
            "raw_title": None,
            "raw_meta_description": None,
            "raw_canonical": None,
            "raw_robots": [],
            "raw_html_length": 0,
            "http_error": str(e)
        }

def inspect_rendered_dom(url: str) -> dict:
    try:
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--virtual-time-budget=5000",
            "--dump-dom",
            url
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=25)
        if result.returncode != 0:
            return {
                "rendered_success": False,
                "render_error": f"Chrome exited with code {result.returncode}: {result.stderr[:200]}"
            }
        dom_html = result.stdout
        soup = BeautifulSoup(dom_html, "html.parser")
        
        title = soup.title.string.strip() if soup.title and soup.title.string else None
        
        canonical = None
        canon_el = soup.find("link", attrs={"rel": "canonical"})
        if canon_el and canon_el.get("href"):
            canonical = canon_el.get("href").strip()
            
        robots_meta = []
        for r_el in soup.find_all("meta", attrs={"name": "robots"}):
            if r_el.get("content"):
                robots_meta.append(r_el.get("content").strip())
                
        h1_tags = [h.get_text(strip=True) for h in soup.find_all("h1")]
        
        main_el = soup.find("main") or soup.find("body")
        main_text = main_el.get_text(separator=" ", strip=True) if main_el else ""
        word_count = len(main_text.split())
        content_preview = (main_text[:140] + "...") if len(main_text) > 140 else main_text
        
        return {
            "rendered_success": True,
            "rendered_title": title,
            "rendered_canonical": canonical,
            "rendered_robots": robots_meta,
            "rendered_h1": h1_tags,
            "word_count": word_count,
            "content_preview": content_preview,
            "render_error": None
        }
    except Exception as e:
        return {
            "rendered_success": False,
            "render_error": str(e)
        }

def audit_url(idx_url):
    idx, url = idx_url
    print(f"[{idx+1}/30] Auditing {url}...")
    raw = inspect_raw_http(url)
    dom = inspect_rendered_dom(url)
    return {
        "index": idx + 1,
        **raw,
        **dom
    }

def main():
    print("Starting full audit of 30 URLs...")
    t0 = time.time()
    
    # Run with 3 threads for optimal speed without throttling
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(audit_url, enumerate(URLS)))
        
    results.sort(key=lambda x: x["index"])
    
    output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "verification_30_urls_result.json"))
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        
    print(f"\nVerification complete in {time.time() - t0:.2f}s.")
    print(f"Saved full JSON output to: {output_json_path}")
    
    # Audit robots.txt on both hosts
    print("\n--- AUDITING ROBOTS.TXT ---")
    try:
        r_vercel = requests.get("https://biharfast.in/robots.txt", timeout=10)
        print("Vercel (https://biharfast.in/robots.txt):")
        print(f"Status: {r_vercel.status_code}")
        print(r_vercel.text.strip())
    except Exception as e:
        print(f"Vercel robots.txt error: {e}")
        
    print("\n" + "="*50)
    try:
        r_render = requests.get("https://bihar-fast-portal.onrender.com/robots.txt", timeout=10)
        print("Render (https://bihar-fast-portal.onrender.com/robots.txt):")
        print(f"Status: {r_render.status_code}")
        print(r_render.text.strip())
    except Exception as e:
        print(f"Render robots.txt error: {e}")

if __name__ == "__main__":
    main()

