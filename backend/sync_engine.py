import os
import asyncio
import hashlib
from dotenv import load_dotenv
from supabase import create_client, Client
from scrapers.bpsc import scrape_bpsc
from data.curated_posts import CURATED_OFFICIAL_POSTS

load_dotenv(override=False)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def make_slug(title: str, c_hash: str) -> str:
    clean = "".join([c if c.isalnum() else "-" for c in title.lower()]).strip("-")
    clean = "-".join(filter(None, clean.split("-")))[:50]
    return f"{clean}-{c_hash[:6]}"

def sync_to_dedicated_tables():
    print("🚀 Syncing data directly to dedicated tables...\n")

    # 1. BPSC Scraper -> jobs / results_admit_cards
    print("📡 [1/2] Processing BPSC Live Notices...")
    bpsc_data = asyncio.run(scrape_bpsc(limit=5)) if asyncio.iscoroutinefunction(scrape_bpsc) else scrape_bpsc(limit=5)
    
    for item in bpsc_data:
        c_hash = item["content_hash"]
        slug = make_slug(item["title"], c_hash)
        cat = item["category"].upper()

        if cat in ["RESULT", "ADMIT_CARD"]:
            payload = {
                "slug": slug,
                "title": item["title"],
                "department": "BPSC",
                "type": cat,
                "download_url": item["apply_url"] or item["pdf_url"],
                "pdf_url": item["pdf_url"],
                "content_hash": c_hash,
                "is_active": True
            }
            supabase.table("results_admit_cards").upsert(payload, on_conflict="content_hash").execute()
            print(f"  ✅ Result/AdmitCard: {item['title'][:40]}...")
        else:
            payload = {
                "slug": slug,
                "title": item["title"],
                "department": "BPSC",
                "total_posts": "अधिसूचना देखें",
                "eligibility": "विज्ञापन पीडीएफ देखें",
                "pdf_url": item["pdf_url"],
                "apply_url": item["apply_url"],
                "content_hash": c_hash,
                "is_active": True
            }
            supabase.table("jobs").upsert(payload, on_conflict="content_hash").execute()
            print(f"  ✅ Job: {item['title'][:40]}...")

    # 2. Curated Posts -> schemes / citizen_services
    print("\n📦 [2/2] Processing Curated Entries...")
    for post in CURATED_OFFICIAL_POSTS:
        c_hash = hashlib.sha256(post["title"].strip().encode()).hexdigest()
        slug = make_slug(post["title"], c_hash)
        cat = post.get("category", "")

        if cat == "schemes":
            payload = {
                "slug": slug,
                "title": post["title"],
                "department": post.get("department", "बिहार सरकार"),
                "benefit_amount": "₹10 लाख तक (50% अनुदान)",
                "beneficiary_type": "युवा, महिला, SC/ST, EBC",
                "eligibility": post.get("eligibility", "बिहार निवासी"),
                "apply_url": post.get("apply_url", "https://udyami.bihar.gov.in"),
                "guideline_pdf": post.get("pdf_url"),
                "content_hash": c_hash,
                "is_active": True
            }
            supabase.table("schemes").upsert(payload, on_conflict="content_hash").execute()
            print(f"  ✅ Scheme: {post['title'][:40]}...")
        else:
            payload = {
                "slug": slug,
                "title": post["title"],
                "department": post.get("department", "लोक सेवा अधिकार"),
                "service_type": "rtps" if "rtps" in cat.lower() else "bihar_bhumi",
                "processing_time": "10 से 15 कार्य दिवस",
                "portal_url": post.get("apply_url", "https://serviceonline.bihar.gov.in"),
                "procedure_guide": post.get("qualification_details"),
                "content_hash": c_hash,
                "is_active": True
            }
            supabase.table("citizen_services").upsert(payload, on_conflict="content_hash").execute()
            print(f"  ✅ Service: {post['title'][:40]}...")

    print("\n🎉 Dedicated tables me data successfully sync ho gaya!")

if __name__ == "__main__":
    sync_to_dedicated_tables()