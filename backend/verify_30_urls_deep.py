import urllib.request
import ssl
import re
import time

ctx = ssl.create_default_context()

urls = [
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

print("Index | Status | Latency | Redirect? | Raw Title (First 35 chars) | Raw Canonical | Raw Meta Robots")
print("-" * 110)

for idx, u in enumerate(urls, 1):
    req = urllib.request.Request(
        u,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
        }
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=12, context=ctx) as resp:
            elapsed = int((time.time() - t0) * 1000)
            code = resp.getcode()
            final_url = resp.geturl()
            html = resp.read().decode("utf-8", errors="replace")
            
            # Extract raw title
            title_m = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
            raw_title = title_m.group(1).strip()[:35] if title_m else "NONE"
            
            # Extract raw canonical
            canon_m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', html, re.IGNORECASE)
            raw_canon = canon_m.group(1).strip() if canon_m else "MISSING"
            
            # Extract raw meta robots
            robots_m = re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']', html, re.IGNORECASE)
            raw_robots = robots_m.group(1).strip()[:30] if robots_m else "NONE"
            
            redirected = "NO" if final_url == u else f"YES -> {final_url}"
            print(f"{idx:02d} | {code} | {elapsed:>4}ms | {redirected:7} | {raw_title:35} | {raw_canon:20} | {raw_robots}")
    except Exception as e:
        elapsed = int((time.time() - t0) * 1000)
        print(f"{idx:02d} | ERR | {elapsed:>4}ms | NO      | ERROR: {str(e)[:40]} | N/A | N/A")

