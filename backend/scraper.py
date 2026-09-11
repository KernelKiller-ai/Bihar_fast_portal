import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Production safety: DO NOT override system/platform environment variables
load_dotenv(override=False)

API_SYNC_URL = os.getenv("API_SYNC_URL", "http://localhost:5000/api/posts/sync")
SYNC_SECRET = os.getenv("INTERNAL_SYNC_SECRET", "")

if not SYNC_SECRET:
    print("⚠️ WARNING: INTERNAL_SYNC_SECRET is not set in environment!")

# Official verified active notifications (AdSense compliance & initial seeding)
CURATED_OFFICIAL_POSTS = [
    {
        "title": "BPSC 71st Combined Competitive Preliminary Examination 2026",
        "department": "BPSC",
        "category": "job",
        "total_posts": "1450+ पद",
        "last_date": "15 नवंबर 2026",
        "eligibility": "Graduation Degree in Any Stream from Recognized University",
        "qualification_details": "स्नातक डिग्री उत्तीर्ण। पदवार विस्तृत शारीरिक व शैक्षणिक योग्यता आधिकारिक अधिसूचना में देखें।",
        "pdf_url": "https://bpsc.bihar.gov.in",
        "apply_url": "https://bpsc.bihar.gov.in"
    },
    {
        "title": "BPSC School Teacher TRE 4.0 Recruitment Notification & Vacancy Matrix",
        "department": "BPSC",
        "category": "job",
        "total_posts": "लगभग 85,000+ पद",
        "last_date": "30 अक्टूबर 2026",
        "eligibility": "B.Ed / D.El.Ed + CTET / STET Qualified",
        "qualification_details": "प्राथमिक, माध्यमिक एवं उच्च माध्यमिक शिक्षक पदवार अलग-अलग पात्रता मापदंड।",
        "pdf_url": "https://bpsc.bihar.gov.in",
        "apply_url": "https://bpsc.bihar.gov.in"
    },
    {
        "title": "CSBC Bihar Police Constable Written Exam Admit Card & Exam Date 2026",
        "department": "CSBC",
        "category": "admit_card",
        "total_posts": "21391 पद",
        "last_date": "सक्रिय सूचना",
        "eligibility": "12th Pass (Intermediate)",
        "qualification_details": "प्रवेश पत्र डाउनलोड करके परीक्षा केंद्र एवं शिफ्ट विवरण देखें।",
        "pdf_url": "https://csbc.bih.nic.in",
        "apply_url": "https://csbc.bih.nic.in"
    },
    {
        "title": "BPSSC Bihar Police Sub Inspector (Daroga) Advt 2026 Final Selection List",
        "department": "BPSSC",
        "category": "result",
        "total_posts": "1275 पद",
        "last_date": "परिणाम जारी",
        "eligibility": "Graduation in Any Stream",
        "qualification_details": "मुख्य लिखित परीक्षा एवं शारीरिक दक्षता परीक्षा उपरांत अंतिम चयन परिणाम।",
        "pdf_url": "https://bpssc.bih.nic.in",
        "apply_url": "https://bpssc.bih.nic.in"
    },
    {
        "title": "BSSC 2nd Inter Level Combined Competitive Examination Admit Card & Schedule",
        "department": "BSSC",
        "category": "admit_card",
        "total_posts": "12199 पद",
        "last_date": "परीक्षा तिथि देखें",
        "eligibility": "10+2 (Intermediate) Passed",
        "qualification_details": "कंप्यूटर टंकण एवं हिंदी/अंग्रेजी टाइपिंग दक्षता संबंधित पदों के लिए अनिवार्य।",
        "pdf_url": "https://bssc.bihar.gov.in",
        "apply_url": "https://bssc.bihar.gov.in"
    },
    {
        "title": "BSSC 4th Graduate Level (CGL-4) Upcoming Recruitment Circular",
        "department": "BSSC",
        "category": "job",
        "total_posts": "3200 पद (प्रत्याशित)",
        "last_date": "अधिसूचना शीघ्र",
        "eligibility": "Bachelor Degree in Any Stream",
        "qualification_details": "प्रखंड कल्याण पदाधिकारी, योजना सहायक एवं अन्य समकक्ष स्नातक स्तरीय पद।",
        "pdf_url": "https://bssc.bihar.gov.in",
        "apply_url": "https://bssc.bihar.gov.in"
    },
    {
        "title": "BTSC Bihar Female Health Worker (ANM) Document Verification & Cutoff Marks",
        "department": "BTSC",
        "category": "result",
        "total_posts": "10709 पद",
        "last_date": "सत्यापन सूचना",
        "eligibility": "ANM Diploma + Bihar Nursing Registration Council",
        "qualification_details": "काउंसलिंग एवं दस्तावेज सत्यापन कार्यक्रम विवरण आधिकारिक वेबसाइट पर।",
        "pdf_url": "https://btsc.bihar.gov.in",
        "apply_url": "https://btsc.bihar.gov.in"
    },
    {
        "title": "Bihar Board (BSEB) 10th Matric Annual Examination Answer Key & Result",
        "department": "BSEB",
        "category": "result",
        "total_posts": "वार्षिक परीक्षा",
        "last_date": "सक्रिय लिंक",
        "eligibility": "10th Appeared Students",
        "qualification_details": "बिहार विद्यालय परीक्षा समिति द्वारा जारी आधिकारिक परिणाम एवं मार्कशीट विवरण।",
        "pdf_url": "https://biharboardonline.bihar.gov.in",
        "apply_url": "https://biharboardonline.bihar.gov.in"
    },
    {
        "title": "Bihar Board (BSEB) 12th Intermediate Scrutiny & Compartmental Application",
        "department": "BSEB",
        "category": "job",
        "total_posts": "ऑनलाइन स्क्रूटिनी",
        "last_date": "आधिकारिक तिथि देखें",
        "eligibility": "12th Board Appeared",
        "qualification_details": "अंक सुधार एवं स्क्रूटिनी हेतु ऑनलाइन आवेदन प्रक्रिया।",
        "pdf_url": "https://biharboardonline.bihar.gov.in",
        "apply_url": "https://biharboardonline.bihar.gov.in"
    },
    {
        "title": "Bihar Mukhyamantri Udyami Yojana 2026 Online Registration & Project List",
        "department": "Udyami Bihar",
        "category": "job",
        "total_posts": "₹10 लाख वित्तीय सहायता (50% अनुदान)",
        "last_date": "सक्रिय पोर्टल",
        "eligibility": "12th / ITI / Diploma / Graduation",
        "qualification_details": "बिहार के स्थायी निवासी (SC, ST, EBC, युवा एवं महिला वर्ग) हेतु स्वरोजगार योजना।",
        "pdf_url": "https://udyami.bihar.gov.in",
        "apply_url": "https://udyami.bihar.gov.in"
    },
    {
        "title": "RTPS Bihar: Online Application for Caste, Income, Residential (EBC/OBC-NCL) Certificates",
        "department": "RTPS Bihar",
        "category": "job",
        "total_posts": "ई-प्रमाण पत्र सेवा",
        "last_date": "निरंतर सक्रिय",
        "eligibility": "Resident of Bihar",
        "qualification_details": "लोक सेवाओं का अधिकार (RTPS) के अंतर्गत जाति, आय, निवास एवं क्रीमीलेयर रहित प्रमाण पत्र ऑनलाइन बनाएं।",
        "pdf_url": "https://serviceonline.bihar.gov.in",
        "apply_url": "https://serviceonline.bihar.gov.in"
    },
    {
        "title": "Bihar Bhumi Dakhil Kharij (Mutation) & LPC Online Application Portal",
        "department": "Revenue Dept",
        "category": "job",
        "total_posts": "भू-अभिलेख सेवा",
        "last_date": "निरंतर सक्रिय",
        "eligibility": "Land Owners in Bihar",
        "qualification_details": "ऑनलाइन दाखिल खारिज, लगान भुगतान, जमाबंदी पंजी एवं एलपीसी निर्गमन।",
        "pdf_url": "https://biharbhumi.bihar.gov.in",
        "apply_url": "https://biharbhumi.bihar.gov.in"
    }
]

session = requests.Session()

def push_to_api(payload: dict) -> bool:
    if not SYNC_SECRET:
        print("❌ Cannot push: INTERNAL_SYNC_SECRET is empty.")
        return False

    headers = {
        "x-sync-secret": SYNC_SECRET,
        "Content-Type": "application/json"
    }
    try:
        r = session.post(API_SYNC_URL, json=payload, headers=headers, timeout=12)
        return r.status_code == 200
    except Exception as err:
        print(f"❌ Sync error for {payload.get('title', '')[:30]}: {err}")
        return False

def scrape_bpsc_live() -> int:
    url = "https://bpsc.bihar.gov.in"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36"
    }
    synced = 0
    try:
        # Standard TLS verification enabled (verify=True default)
        resp = session.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.content, "html.parser")
        
        links = soup.find_all("a", href=True)
        for a in links:
            href = a["href"].strip()
            text = a.get_text(strip=True)
            if href.lower().endswith(".pdf") and len(text) > 15:
                pdf_link = href if href.startswith("http") else f"{url.rstrip('/')}/{href.lstrip('/')}"
                
                cat = "job"
                if "admit" in text.lower():
                    cat = "admit_card"
                elif "result" in text.lower() or "merit" in text.lower():
                    cat = "result"

                payload = {
                    "title": text[:150],
                    "department": "BPSC",
                    "category": cat,
                    "total_posts": "विभागीय सूचना देखें",
                    "last_date": "सक्रिय सूचना",
                    "eligibility": "विस्तृत विज्ञापन देखें",
                    "qualification_details": "संबंधित पद अनुसार आधिकारिक पीडीएफ देखें।",
                    "pdf_url": pdf_link,
                    "apply_url": url
                }
                if push_to_api(payload):
                    synced += 1
                    print(f"✅ Live Scraped: {text[:40]}...")
                    if synced >= 5:
                        break
    except Exception as e:
        print(f"⚠️ Live scrape skipped (NIC portal may be throttled): {e}")
    return synced

def run_sync():
    print("🚀 Starting BiharFast Sync Engine...")
    live_count = scrape_bpsc_live()
    
    print("\n📦 Syncing curated high-value official posts...")
    curated_synced = 0
    for post in CURATED_OFFICIAL_POSTS:
        if push_to_api(post):
            curated_synced += 1
            print(f"✅ Synced [{post['department']}]: {post['title'][:45]}...")

    total = live_count + curated_synced
    print(f"\n🎉 Pipeline Complete! Total {total} high-quality posts synced.")

if __name__ == "__main__":
    run_sync()