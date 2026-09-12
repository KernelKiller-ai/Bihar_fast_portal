# backend/seed_latest_updates.py
import os
import hashlib
from dotenv import load_dotenv
from supabase import create_client, Client
from scrapers.bpsc import scrape_bpsc

load_dotenv(override=False)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SECRET_KEY") 
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY") 
    or os.getenv("SUPABASE_KEY")
)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Supabase credentials missing!")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def gen_hash(text: str) -> str:
    return hashlib.sha256(text.strip().encode()).hexdigest()

def make_slug(dept: str, title: str, c_hash: str) -> str:
    clean = "".join([c if c.isalnum() else "-" for c in f"{dept}-{title}".lower()]).strip("-")
    clean = "-".join(filter(None, clean.split("-")))[:60]
    return f"{clean}-{c_hash[:6]}"

# ==========================================================
# 1. BIHAR MULTI-BOARD LATEST JOBS DATA
# ==========================================================
LATEST_BIHAR_JOBS = [
    {
        "department": "BSSC",
        "title": "BSSC 4th Graduate Level Combined Competitive Exam 2026",
        "total_posts": "2,640 पद",
        "eligibility": "Graduation from Recognized University",
        "qualification_details": "बिहार सचिवालय सहायक, योजना सहायक एवं अन्य अराजपत्रित पदों हेतु संयुक्त परीक्षा।",
        "pdf_url": "https://bssc.bihar.gov.in",
        "apply_url": "https://bssc.bihar.gov.in"
    },
    {
        "department": "CSBC",
        "title": "Bihar Police Constable (Sipahi) Recruitment 2026",
        "total_posts": "19,850 पद",
        "eligibility": "12th (Intermediate) Passed",
        "qualification_details": "बिहार विशेष सशस्त्र पुलिस एवं जिला पुलिस बल में सिपाhi संवर्ग भर्ती।",
        "pdf_url": "https://csbc.bihar.gov.in",
        "apply_url": "https://csbc.bihar.gov.in"
    },
    {
        "department": "BPSSC",
        "title": "Bihar Police Sub-Inspector (Daroga) Advt 2026",
        "total_posts": "1,875 पद",
        "eligibility": "Graduation in any discipline",
        "qualification_details": "बिहार पुलिस अवर सेवा आयोग अंतर्गत पुलिस सब-इंस्पेक्टर पदों पर भर्ती।",
        "pdf_url": "https://bpssc.bih.nic.in",
        "apply_url": "https://bpssc.bih.nic.in"
    },
    {
        "department": "BTSC",
        "title": "BTSC Bihar Staff Nurse Grade A & ANM Recruitment 2026",
        "total_posts": "4,320 पद",
        "eligibility": "GNM / B.Sc Nursing / ANM Certificate",
        "qualification_details": "स्वास्थ्य विभाग, बिहार सरकार के अधीन विभिन्न अस्पतालों हेतु तकनीकी संवर्ग भर्ती।",
        "pdf_url": "https://btsc.bihar.gov.in",
        "apply_url": "https://btsc.bihar.gov.in"
    },
    {
        "department": "Patna High Court",
        "title": "Patna High Court Assistant & Translator Group B Exam 2026",
        "total_posts": "480 पद",
        "eligibility": "Bachelor Degree with Computer Certificate (6 months)",
        "qualification_details": "उच्च न्यायालय पटना स्थापना अंतर्गत सहायक (Group-B) पदों पर सीधी भर्ती।",
        "pdf_url": "https://patnahighcourt.gov.in",
        "apply_url": "https://patnahighcourt.gov.in"
    }
]

# ==========================================================
# 2. BIHAR LATEST RESULTS & ADMIT CARDS DATA
# ==========================================================
LATEST_RESULTS_ADMIT_CARDS = [
    {
        "department": "CSBC",
        "title": "CSBC Bihar Police Constable Written Exam Admit Card 2026",
        "type": "ADMIT_CARD",
        "download_url": "https://csbc.bihar.gov.in",
        "pdf_url": "https://csbc.bihar.gov.in"
    },
    {
        "department": "BSSC",
        "title": "BSSC Inter Level (10+2) Preliminary Exam Result & Cutoff 2026",
        "type": "RESULT",
        "download_url": "https://bssc.bihar.gov.in",
        "pdf_url": "https://bssc.bihar.gov.in"
    },
    {
        "department": "BPSSC",
        "title": "Bihar Police SI Main Exam Admit Card & Center Allotment 2026",
        "type": "ADMIT_CARD",
        "download_url": "https://bpssc.bih.nic.in",
        "pdf_url": "https://bpssc.bih.nic.in"
    },
    {
        "department": "BPSC",
        "title": "BPSC 70th CCE Final Merit List & Cutoff Marks Notice",
        "type": "RESULT",
        "download_url": "https://bpsc.bihar.gov.in",
        "pdf_url": "https://bpsc.bihar.gov.in"
    },
    {
        "department": "BTSC",
        "title": "BTSC Bihar Junior Engineer (Civil/Mechanical) Score Card & Merit",
        "type": "RESULT",
        "download_url": "https://btsc.bihar.gov.in",
        "pdf_url": "https://btsc.bihar.gov.in"
    }
]

def run_mass_sync():
    print("🚀 Starting Bihar Multi-Board Mass Sync...\n")

    # 1. Live BPSC Scrape Ingestion
    print("📡 [1/3] Scraping Live BPSC Data...")
    try:
        bpsc_live = scrape_bpsc(limit=5)
        for item in bpsc_live:
            c_hash = item["content_hash"]
            slug = make_slug(item["department"], item["title"], c_hash)
            cat = item["category"].upper()

            if cat in ["RESULT", "ADMIT_CARD"]:
                row = {
                    "slug": slug,
                    "title": item["title"],
                    "department": "BPSC",
                    "type": cat,
                    "download_url": item["apply_url"] or item["pdf_url"],
                    "pdf_url": item["pdf_url"],
                    "content_hash": c_hash,
                    "is_active": True
                }
                supabase.table("results_admit_cards").upsert(row, on_conflict="content_hash").execute()
                print(f"  ✅ [BPSC {cat}] {item['title'][:40]}...")
            else:
                row = {
                    "slug": slug,
                    "title": item["title"],
                    "department": "BPSC",
                    "total_posts": "अधिसूचना देखें",
                    "eligibility": "विज्ञापन देखें",
                    "pdf_url": item["pdf_url"],
                    "apply_url": item["apply_url"],
                    "content_hash": c_hash,
                    "is_active": True
                }
                supabase.table("jobs").upsert(row, on_conflict="content_hash").execute()
                print(f"  ✅ [BPSC Job] {item['title'][:40]}...")
    except Exception as e:
        print(f"⚠️ BPSC live scrape notice: {e}")

    # 2. Multi-Board Jobs Ingestion
    print("\n🏢 [2/3] Seeding Multi-Board Jobs (CSBC, BSSC, BPSSC, BTSC)...")
    for job in LATEST_BIHAR_JOBS:
        c_hash = gen_hash(job["title"] + job["department"])
        slug = make_slug(job["department"], job["title"], c_hash)
        row = {
            "slug": slug,
            "title": job["title"],
            "department": job["department"],
            "total_posts": job["total_posts"],
            "eligibility": job["eligibility"],
            "qualification_details": job["qualification_details"],
            "pdf_url": job["pdf_url"],
            "apply_url": job["apply_url"],
            "content_hash": c_hash,
            "is_active": True
        }
        supabase.table("jobs").upsert(row, on_conflict="content_hash").execute()
        print(f"  ✅ [Job Added] {job['department']} - {job['title'][:40]}...")

    # 3. Multi-Board Admit Cards & Results Ingestion
    print("\n📄 [3/3] Seeding Latest Results & Admit Cards...")
    for item in LATEST_RESULTS_ADMIT_CARDS:
        c_hash = gen_hash(item["title"] + item["type"])
        slug = make_slug(item["department"], item["title"], c_hash)
        row = {
            "slug": slug,
            "title": item["title"],
            "department": item["department"],
            "type": item["type"],
            "download_url": item["download_url"],
            "pdf_url": item["pdf_url"],
            "content_hash": c_hash,
            "is_active": True
        }
        supabase.table("results_admit_cards").upsert(row, on_conflict="content_hash").execute()
        print(f"  ✅ [{item['type']}] {item['department']} - {item['title'][:40]}...")

    print("\n🎉 Mass Sync Completed! Database tables fully populated.")

if __name__ == "__main__":
    run_mass_sync()