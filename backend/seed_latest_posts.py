import os
import re
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SECRET_KEY") 
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY") 
    or os.getenv("SUPABASE_KEY")
)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def slugify(title: str, dept: str) -> str:
    combined = f"{dept}-{title}"
    slug = re.sub(r"[^\w\s-]", "", combined.lower()).strip()
    return re.sub(r"[\s_-]+", "-", slug)[:90]

latest_posts = [
    # --- BIHAR GOVT JOBS ---
    {
        "title": "BPSC 71st Combined Competitive Preliminary Exam 2026",
        "department": "BPSC",
        "category": "job",
        "total_posts": "1,450+ पद",
        "last_date": "15 नवंबर 2026",
        "eligibility": "Graduation (Any Stream)",
        "qualification_details": "किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री। न्यूनतम आयु 20/21/22 वर्ष (पद अनुसार)।",
        "apply_url": "https://bpsc.bihar.gov.in",
        "pdf_url": "https://bpsc.bihar.gov.in"
    },
    {
        "title": "Bihar School Teacher TRE 4.0 Recruitment 2026",
        "department": "BPSC / Education Dept",
        "category": "job",
        "total_posts": "85,000+ पद",
        "last_date": "30 अक्टूबर 2026",
        "eligibility": "D.El.Ed / B.Ed + CTET / BTET",
        "qualification_details": "प्राथमिक (1-5), मध्य (6-8), माध्यमिक (9-10) एवं उच्च माध्यमिक (11-12) अध्यापक पात्रता।",
        "apply_url": "https://bpsc.bihar.gov.in",
        "pdf_url": "https://bpsc.bihar.gov.in"
    },
    {
        "title": "Bihar Police Constable Driver Recruitment 2026",
        "department": "CSBC",
        "category": "job",
        "total_posts": "3,450 पद",
        "last_date": "25 अक्टूबर 2026",
        "eligibility": "12th Pass + Valid Driving License (LMV/HMV)",
        "qualification_details": "इंटरमीडिएट (10+2) उत्तीर्ण तथा विज्ञापन तिथि से कम से कम 1 वर्ष पूर्व का ड्राइविंग लाइसेंस।",
        "apply_url": "https://csbc.bihar.gov.in",
        "pdf_url": "https://csbc.bihar.gov.in"
    },
    {
        "title": "Bihar Police Sub Inspector (SI / Daroga) Vacancy 2026",
        "department": "BPSSC",
        "category": "job",
        "total_posts": "2,100 पद",
        "last_date": "18 नवंबर 2026",
        "eligibility": "Graduation (Any Stream)",
        "qualification_details": "स्नातक उत्तीर्ण। शारीरिक दक्षता परीक्षा (PET) और सीना/लंबाई मापदंड अनिवार्य।",
        "apply_url": "https://bpssc.bih.nic.in",
        "pdf_url": "https://bpssc.bih.nic.in"
    },
    {
        "title": "BSSC 2nd Inter Level Combined Exam 2026",
        "department": "BSSC",
        "category": "job",
        "total_posts": "12,199 पद",
        "last_date": "सक्रिय सूचना / संशोधन",
        "eligibility": "12th Pass + Hindi/English Typing + DCA/ADCA",
        "qualification_details": "इंटरमीडिएट पास, राजस्व कर्मचारी, पंचायत सचिव एवं लिपिक पदों हेतु कंप्यूटर दक्षता आवश्यक।",
        "apply_url": "https://bssc.bihar.gov.in",
        "pdf_url": "https://bssc.bihar.gov.in"
    },
    {
        "title": "BSSC 4th Graduate Level Combined Competitive Exam (CGL-4)",
        "department": "BSSC",
        "category": "job",
        "total_posts": "3,200 पद",
        "last_date": "28 नवंबर 2026",
        "eligibility": "Graduation (Any Discipline)",
        "qualification_details": "प्रखंड कल्याण पदाधिकारी, अंकेक्षक, उद्योग विस्तार पदाधिकारी पदों हेतु स्नातक।",
        "apply_url": "https://bssc.bihar.gov.in",
        "pdf_url": "https://bssc.bihar.gov.in"
    },
    {
        "title": "Bihar BTSC General Duty Medical Officer (GDMO) & Specialist",
        "department": "BTSC",
        "category": "job",
        "total_posts": "4,120 पद",
        "last_date": "12 अक्टूबर 2026",
        "eligibility": "MBBS / MD / MS",
        "qualification_details": "MCI द्वारा मान्यता प्राप्त संस्थान से MBBS डिग्री एवं बिहार मेडिकल काउंसिल में निबंधन।",
        "apply_url": "https://btsc.bihar.gov.in",
        "pdf_url": "https://btsc.bihar.gov.in"
    },
    {
        "title": "Bihar BTSC Female Health Worker (ANM) Recruitment",
        "department": "BTSC Health Dept",
        "category": "job",
        "total_posts": "10,709 पद",
        "last_date": "अधिसूचना जारी",
        "eligibility": "ANM Diploma + Registration",
        "qualification_details": "मान्यता प्राप्त संस्थान से एएनएम नर्सिंग कोर्स एवं बिहार नर्सिंग काउंसिल में निबंधन अनिवार्य।",
        "apply_url": "https://btsc.bihar.gov.in",
        "pdf_url": "https://btsc.bihar.gov.in"
    },
    {
        "title": "Patna High Court Mazdoor / Peon (Group D) Recruitment",
        "department": "Patna High Court",
        "category": "job",
        "total_posts": "850 पद",
        "last_date": "20 अक्टूबर 2026",
        "eligibility": "10th Pass (Matriculation)",
        "qualification_details": "मान्यता प्राप्त बोर्ड से 10वीं पास तथा साइकिल चलाने का ज्ञान।",
        "apply_url": "https://patnahighcourt.gov.in",
        "pdf_url": "https://patnahighcourt.gov.in"
    },
    {
        "title": "Patna High Court Assistant (Group B) Recruitment 2026",
        "department": "Patna High Court",
        "category": "job",
        "total_posts": "550 पद",
        "last_date": "05 नवंबर 2026",
        "eligibility": "Graduation + 6 Months Computer Diploma",
        "qualification_details": "किसी भी विषय में स्नातक डिग्री तथा न्यूनतम 6 माह का कंप्यूटर एप्लीकेशन सर्टिफिकेट कोर्स।",
        "apply_url": "https://patnahighcourt.gov.in",
        "pdf_url": "https://patnahighcourt.gov.in"
    },
    {
        "title": "Bihar Library Eligibility Test (BLET) Online Form 2026",
        "department": "BSEB",
        "category": "job",
        "total_posts": "7,000+ संभावित",
        "last_date": "21 अक्टूबर 2026",
        "eligibility": "B.Lib / M.Lib Degree",
        "qualification_details": "पुस्तकालय एवं सूचना विज्ञान में स्नातक (BLIS) डिग्रीधारक पात्रता परीक्षा हेतु पात्र।",
        "apply_url": "https://biharboardonline.bihar.gov.in",
        "pdf_url": "https://biharboardonline.bihar.gov.in"
    },
    {
        "title": "Bihar Amin & Kanungo Special Survey Recruitment",
        "department": "DLRS Bihar",
        "category": "job",
        "total_posts": "10,101 पद",
        "last_date": "सक्रिय सूचना",
        "eligibility": "Diploma in Civil Engg / Graduation",
        "qualification_details": "विशेष सर्वेक्षण सहायक बंदोबस्त पदाधिकारी, कानूनगो, अमीन एवं लिपिक पद।",
        "apply_url": "https://dlrs.bihar.gov.in",
        "pdf_url": "https://dlrs.bihar.gov.in"
    },

    # --- ALL INDIA / CENTRAL RECRUITMENTS (BIHAR ASPIRANTS FOCUSED) ---
    {
        "title": "Railway RRB Non-Technical Popular Categories (NTPC) 2026",
        "department": "Railway RRB",
        "category": "job",
        "total_posts": "11,558 पद",
        "last_date": "15 नवंबर 2026",
        "eligibility": "12th Pass / Graduate (Posts Wise)",
        "qualification_details": "क्लर्क, टिकट कलेक्टर, स्टेशन मास्टर, गुड्स गार्ड पदों हेतु आवेदन।",
        "apply_url": "https://www.rrbpatna.gov.in",
        "pdf_url": "https://www.rrbpatna.gov.in"
    },
    {
        "title": "Railway RRB Paramedical Categories CEN 05/2026",
        "department": "Railway RRB",
        "category": "job",
        "total_posts": "1,376 पद",
        "last_date": "14 अक्टूबर 2026",
        "eligibility": "GNM / B.Sc Nursing / D.Pharma / Lab Tech",
        "qualification_details": "स्टाफ नर्स, फार्मासिस्ट, लैब तकनीशियन एवं रेडियोग्राफर पदों हेतु।",
        "apply_url": "https://www.rrbpatna.gov.in",
        "pdf_url": "https://www.rrbpatna.gov.in"
    },
    {
        "title": "Railway RRB Group D (Level-1 Track Maintainer) 2026",
        "department": "Railway RRC",
        "category": "job",
        "total_posts": "32,000+ पद",
        "last_date": "30 नवंबर 2026",
        "eligibility": "10th Pass + ITI (NCVT/SCVT)",
        "qualification_details": "10वीं उत्तीर्ण एवं संबंधित ट्रेड में ITI अथवा नेशनल अप्रेंटिसशिप सर्टिफिकेट (NAC)।",
        "apply_url": "https://www.rrbpatna.gov.in",
        "pdf_url": "https://www.rrbpatna.gov.in"
    },
    {
        "title": "SSC Combined Graduate Level Exam (CGL) 2026",
        "department": "SSC",
        "category": "job",
        "total_posts": "17,727 पद",
        "last_date": "25 अक्टूबर 2026",
        "eligibility": "Bachelor's Degree in Any Stream",
        "qualification_details": "केंद्रीय मंत्रालयों में इंस्पेक्टर, ASO, ऑडिटर, टैक्स असिस्टेंट के ग्रुप बी व सी पद।",
        "apply_url": "https://ssc.gov.in",
        "pdf_url": "https://ssc.gov.in"
    },
    {
        "title": "SSC Combined Higher Secondary Level (CHSL 10+2) 2026",
        "department": "SSC",
        "category": "job",
        "total_posts": "3,712 पद",
        "last_date": "07 अक्टूबर 2026",
        "eligibility": "12th Standard Passed",
        "qualification_details": "LDC, JSA और Data Entry Operator (DEO) पदों हेतु चयन।",
        "apply_url": "https://ssc.gov.in",
        "pdf_url": "https://ssc.gov.in"
    },
    {
        "title": "SSC General Duty (GD) Constable in CAPF, NIA, SSF 2026",
        "department": "SSC",
        "category": "job",
        "total_posts": "39,481 पद",
        "last_date": "31 दिसंबर 2026",
        "eligibility": "10th Class (Matric) Passed",
        "qualification_details": "BSF, CISF, CRPF, SSB, ITBP, AR में राइफलमैन और सिपाही भर्ती।",
        "apply_url": "https://ssc.gov.in",
        "pdf_url": "https://ssc.gov.in"
    },
    {
        "title": "India Post Gramin Dak Sevak (GDS) Schedule II 2026",
        "department": "Department of Posts",
        "category": "job",
        "total_posts": "44,228 पद",
        "last_date": "सक्रिय मेरिट लिस्ट",
        "eligibility": "10th Pass with Maths & English + Local Language",
        "qualification_details": "बिना परीक्षा सीधे 10वीं के अंकों की मेरिट सूची पर चयन।",
        "apply_url": "https://indiapostgdsonline.gov.in",
        "pdf_url": "https://indiapostgdsonline.gov.in"
    },
    {
        "title": "IBPS PO / Management Trainee XVI Recruitment 2026",
        "department": "IBPS",
        "category": "job",
        "total_posts": "4,455 पद",
        "last_date": "20 अक्टूबर 2026",
        "eligibility": "Graduation (Any Stream)",
        "qualification_details": "सरकारी बैंकों (PNB, BOB, Canara आदि) में प्रोबेशनरी ऑफिसर भर्ती।",
        "apply_url": "https://www.ibps.in",
        "pdf_url": "https://www.ibps.in"
    },
    {
        "title": "IBPS Clerk XVI Customer Support Associate Recruitment",
        "department": "IBPS",
        "category": "job",
        "total_posts": "6,128 पद",
        "last_date": "15 अक्टूबर 2026",
        "eligibility": "Degree + Local Language Proficiency",
        "qualification_details": "राष्ट्रीयकृत बैंकों में लिपिक संवर्ग (Clerk) पद हेतु ऑनलाइन परीक्षा।",
        "apply_url": "https://www.ibps.in",
        "pdf_url": "https://www.ibps.in"
    },

    # --- BIHAR GOVT SCHEMES & WELFARE (EVERGREEN ACTIVE) ---
    {
        "title": "Bihar Mukhymantri Udyami Yojana 2026-27 (₹10 Lakh Loan & Subsidy)",
        "department": "Industries Dept Bihar",
        "category": "job",
        "total_posts": "8,000+ लाभार्थी",
        "last_date": "31 अक्टूबर 2026",
        "eligibility": "12th / ITI / Polytechnic Pass (Age 18-50)",
        "qualification_details": "नया उद्योग लगाने के लिए ₹10 लाख: ₹5 लाख अनुदान (माफ) + ₹5 लाख ब्याजमुक्त/1% ऋण।",
        "apply_url": "https://udyami.bihar.gov.in",
        "pdf_url": "https://udyami.bihar.gov.in"
    },
    {
        "title": "Bihar Laghu Udyami Yojana 2026 (₹2 Lakh Free Financial Aid)",
        "department": "Industries Dept Bihar",
        "category": "job",
        "total_posts": "94 लाख परिवार लक्षित",
        "last_date": "सक्रिय आवेदन",
        "eligibility": "पारिवारिक मासिक आय ₹6,000 से कम",
        "qualification_details": "जाति आधारित गणना के गरीब परिवारों को स्वरोजगार हेतु ₹2-₹2 लाख की 3 किस्तों में पूर्ण अनुदान।",
        "apply_url": "https://udyami.bihar.gov.in",
        "pdf_url": "https://udyami.bihar.gov.in"
    },
    {
        "title": "Bihar Student Credit Card Scheme (Up to ₹4 Lakh Education Loan)",
        "department": "Education Dept / MNSSBY",
        "category": "job",
        "total_posts": "सभी पात्र छात्र",
        "last_date": "वर्ष भर खुला (Open 365 Days)",
        "eligibility": "12th Pass Pursuing Higher Education",
        "qualification_details": "B.Tech, MBBS, BCA, BBA, Diploma आदि उच्च शिक्षा हेतु 1% (महिला/दिव्यांग) या 4% ब्याज दर पर ऋण।",
        "apply_url": "https://www.7nischay-yuvaupmission.bihar.gov.in",
        "pdf_url": "https://www.7nischay-yuvaupmission.bihar.gov.in"
    },
    {
        "title": "Bihar Mukhyamantri Kanya Utthan Yojana (Graduation ₹50,000)",
        "department": "Education Dept Bihar",
        "category": "job",
        "total_posts": "सभी उत्तीर्ण छात्राएं",
        "last_date": "सक्रिय पोर्टल",
        "eligibility": "Graduate Pass Unmarried/Married Girl Student",
        "qualification_details": "बिहार के किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक उत्तीर्ण छात्राओं को एकमुश्त ₹50,000 की प्रोत्साहन राशि।",
        "apply_url": "https://medhasoft.bih.nic.in",
        "pdf_url": "https://medhasoft.bih.nic.in"
    },
    {
        "title": "Bihar Post Matric Scholarship (PMS) SC / ST / BC / EBC 2026",
        "department": "Backward Classes & EBC Welfare",
        "category": "job",
        "total_posts": "लाखों छात्र-छात्राएं",
        "last_date": "30 नवंबर 2026",
        "eligibility": "Post-Matric (11th, 12th, ITI, Diploma, Degree)",
        "qualification_details": "बिहार के स्थायी निवासी छात्र जिनका पारिवारिक आय प्रमाण पत्र ₹3 लाख से कम हो।",
        "apply_url": "https://pmsonline.bih.nic.in",
        "pdf_url": "https://pmsonline.bih.nic.in"
    },
    {
        "title": "Bihar RTPS Jati, Niwas, Aay & NCL Certificate Online",
        "department": "General Administration Dept",
        "category": "job",
        "total_posts": "नागरिक सेवाएं",
        "last_date": "24x7 ऑनलाइन सेवा",
        "eligibility": "बिहार के सभी स्थायी निवासी नागरिक",
        "qualification_details": "जाति, आवासीय, आय, Non-Creamy Layer (NCL) एवं EWS प्रमाण पत्र सीधे घर बैठे बनाएं।",
        "apply_url": "https://serviceonline.bihar.gov.in",
        "pdf_url": "https://serviceonline.bihar.gov.in"
    },

    # --- ADMIT CARDS & RESULTS (DEDICATED DYNAMIC LAYOUT TEST) ---
    {
        "title": "BPSC Teacher TRE Written Examination E-Admit Card",
        "department": "BPSC",
        "category": "admit_card",
        "total_posts": "परीक्षा केंद्र सूचना",
        "last_date": "परीक्षा तिथि: 12-16 अक्टूबर 2026",
        "eligibility": "पंजीकृत अभ्यर्थी",
        "qualification_details": "पासपोर्ट फोटो अपलोड करने के बाद डैशबोर्ड से ई-एडमिट कार्ड डाउनलोड करें।",
        "apply_url": "https://bpsc.bihar.gov.in",
        "pdf_url": "https://bpsc.bihar.gov.in"
    },
    {
        "title": "Bihar Police Constable Written Exam Admit Card 2026",
        "department": "CSBC",
        "category": "admit_card",
        "total_posts": "21,391 पद",
        "last_date": "परीक्षा शिफ्ट: सुबह 10 बजे एवं दोपहर 2 बजे",
        "eligibility": "पंजीकृत अभ्यर्थी",
        "qualification_details": "मूल पहचान पत्र तथा एडमिट कार्ड की रंगीन प्रति परीक्षा केंद्र पर साथ लाना अनिवार्य है।",
        "apply_url": "https://csbc.bih.nic.in",
        "pdf_url": "https://csbc.bih.nic.in"
    },
    {
        "title": "BSSC Inter Level Preliminary Exam Result & Merit Cutoff",
        "department": "BSSC",
        "category": "results",
        "total_posts": "12,199 पद",
        "last_date": "मेरिट लिस्ट जारी",
        "eligibility": "लिखित परीक्षा में शामिल अभ्यर्थी",
        "qualification_details": "मुख्य परीक्षा (Mains) हेतु शॉर्टलिस्ट किए गए अभ्यर्थियों का अनुक्रमांक सूची में देखें।",
        "apply_url": "https://bssc.bihar.gov.in",
        "pdf_url": "https://bssc.bihar.gov.in"
    }
]

def seed():
    print(f"🚀 Seeding {len(latest_posts)} long-term active posts into Supabase...")
    for item in latest_posts:
        slug = slugify(item["title"], item["department"])
        payload = {
            "slug": slug,
            "title": item["title"],
            "department": item["department"],
            "category": item["category"],
            "total_posts": item["total_posts"],
            "last_date": item["last_date"],
            "eligibility": item["eligibility"],
            "qualification_details": item["qualification_details"],
            "pdf_url": item["pdf_url"],
            "apply_url": item["apply_url"],
            "is_active": True
        }
        try:
            supabase.table("posts").upsert(payload, on_conflict="slug").execute()
            print(f"✅ Synced: {payload['title'][:45]}...")
        except Exception as e:
            print(f"❌ Error inserting {slug}: {e}")
            
    print("\n🎉 Seeding complete! Cache flush trigger karne ke liye server refresh karein.")

if __name__ == "__main__":
    seed()