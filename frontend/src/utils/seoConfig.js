/**
 * Centralized SEO Configuration for BiharFast.in
 * Single source of truth for all static routes, aliases, and canonical mappings.
 */

export const SITE_URL = "https://biharfast.in";
export const DEFAULT_OG_IMAGE = "https://biharfast.in/logo-512.png";
export const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export const STATIC_ROUTE_METADATA = {
  "/": {
    title: "BiharFast™: बिहार सरकारी नौकरी, एडमिट कार्ड व परीक्षा परिणाम | Direct Official Link",
    description: "⚡ बिहार की सभी सरकारी भर्तियां (BPSC, CSBC, SSC, Railway), एडमिट कार्ड, रिजल्ट व मेरिट लिस्ट सबसे तेज। सीधे ऑफिशियल PDF व ऑनलाइन आवेदन लिंक 1-क्लिक में पाएं।",
    canonical: `${SITE_URL}/`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/jobs": {
    title: "सरकारी नौकरी (Govt Jobs in Bihar 2026) | Latest Vacancies - BiharFast",
    description: "बिहार की नवीनतम सरकारी नौकरियां, BPSC, CSBC, BTSC, BSSC एवं रेलवे भर्ती की विस्तृत जानकारी और डायरेक्ट ऑनलाइन आवेदन लिंक।",
    canonical: `${SITE_URL}/jobs`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/admit-card": {
    title: "एडमिट कार्ड (Admit Card 2026) | Direct Hall Ticket Download - BiharFast",
    description: "बिहार सरकार, BPSC, CSBC, BSEB, और प्रतियोगी परीक्षाओं के एडमिट कार्ड डाउनलोड करने के लिए आधिकारिक व डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/admit-card`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/results": {
    title: "परीक्षा परिणाम (Exam Results 2026) | Score Card & Merit List - BiharFast",
    description: "बिहार बोर्ड, BPSC, SSC, पुलिस कांस्टेबल एवं प्रतियोगी परीक्षाओं के परिणाम, कट-ऑफ और मेरिट लिस्ट सबसे पहले देखें।",
    canonical: `${SITE_URL}/results`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/sitemap": {
    title: "साइटमैप (HTML Sitemap) | All BiharFast Pages & Updates - BiharFast",
    description: "BiharFast का संपूर्ण डायरेक्टरी आर्काइव। बिहार की सभी सरकारी नौकरियों, एडमिट कार्ड, रिजल्ट और योजनाओं की सूची एक जगह।",
    canonical: `${SITE_URL}/sitemap`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/all-updates": {
    title: "साइटमैप (HTML Sitemap) | All BiharFast Pages & Updates - BiharFast",
    description: "BiharFast का संपूर्ण डायरेक्टरी आर्काइव। बिहार की सभी सरकारी नौकरियों, एडमिट कार्ड, रिजल्ट और योजनाओं की सूची एक जगह।",
    canonical: `${SITE_URL}/sitemap`, // Alias canonically points to /sitemap
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/mock-test": {
    title: "Bihar All Exam Free Live Mock Test & Leaderboard | BiharFast",
    description: "बिहार बोर्ड 10वीं, BPSC, बिहार पुलिस व प्रतियोगी परीक्षाओं के लिए फ्री ऑनलाइन मॉक टेस्ट, लाइव क्विज और जिलावार लीडरबोर्ड।",
    canonical: `${SITE_URL}/mock-test`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/class-10-quiz": {
    title: "Bihar All Exam Free Live Mock Test & Leaderboard | BiharFast",
    description: "बिहार बोर्ड 10वीं, BPSC, बिहार पुलिस व प्रतियोगी परीक्षाओं के लिए फ्री ऑनलाइन मॉक टेस्ट, लाइव क्विज और जिलावार लीडरबोर्ड।",
    canonical: `${SITE_URL}/mock-test`, // Alias points to /mock-test
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/mock-test/class-10": {
    title: "Bihar All Exam Free Live Mock Test & Leaderboard | BiharFast",
    description: "बिहार बोर्ड 10वीं, BPSC, बिहार पुलिस व प्रतियोगी परीक्षाओं के लिए फ्री ऑनलाइन मॉक टेस्ट, लाइव क्विज और जिलावार लीडरबोर्ड।",
    canonical: `${SITE_URL}/mock-test`, // Alias points to /mock-test
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/useful-tools": {
    title: "Useful Tools for Bihar Exams | Age Calculator & Photo Resizer - BiharFast",
    description: "बिहार प्रतियोगी परीक्षाओं के लिए फ्री ऑनलाइन टूल्स: उम्र पात्रता कैलकुलेटर और फॉर्म के लिए फोटो व सिग्नेचर रिसाइजर (20–50 KB)।",
    canonical: `${SITE_URL}/useful-tools`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/upcoming-2026": {
    title: "Bihar Upcoming Govt Jobs & Exam Calendar 2026 | BiharFast",
    description: "बिहार की आगामी सरकारी भर्तियां 2026: BPSC 71st CCE, बिहार पुलिस दारोगा, सिपाही एवं अन्य विभागों की संभावित रिक्तियों का कैलेंडर।",
    canonical: `${SITE_URL}/upcoming-2026`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/download": {
    title: "Download BiharFast Official Android App (APK) | BiharFast",
    description: "BiharFast ऑफिशियल एंड्रॉइड ऐप डाउनलोड करें। बिहार सरकारी नौकरी, एडमिट कार्ड व रिजल्ट की हर सूचना सीधे अपने फोन पर सबसे पहले पाएं।",
    canonical: `${SITE_URL}/download`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/bseb-matric-10th": {
    title: "BSEB Bihar Board 10th Result 2027 & Admit Card | BiharFast",
    description: "बिहार बोर्ड 10वीं मैट्रिक रिजल्ट 2027, एडमिट कार्ड, मॉडल पेपर और आधिकारिक अपडेट्स के लिए BiharFast का भरोसेमंद हब।",
    canonical: `${SITE_URL}/bseb-matric-10th`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/bseb-inter-12th": {
    title: "BSEB Bihar Board 12th Inter Result & Admit Card 2026 | Direct Fast Server - BiharFast",
    description: "बिहार बोर्ड 12वीं इंटर रिजल्ट 2026, एडमिट कार्ड, स्क्रूटनी एवं कंपार्टमेंटल परीक्षा की त्वरित सूचना व डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/bseb-inter-12th`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/cuet-ug-admission": {
    title: "CUET UG Admission 2026 | Direct NTA Application Link & Syllabus - BiharFast",
    description: "CUET UG 2026 एडमिशन, एग्जाम सिटी इंटीमेशन, एडमिट कार्ड एवं आंसर की की आधिकारिक सूचना और डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/cuet-ug-admission`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/rtps-bihar": {
    title: "RTPS Bihar | जाति, आय, निवास प्रमाण पत्र डाउनलोड व स्टेटस 2026 - BiharFast",
    description: "RTPS बिहार पोर्टल (ServicePlus) से जाति, आय, निवास और EWS प्रमाण पत्र ऑनलाइन आवेदन, डाउनलोड और स्टेटस चेक करने के डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/rtps-bihar`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/udyami-yojana": {
    title: "बिहार मुख्यमंत्री उद्यमी योजना 2026 | ₹10 लाख लोन व अनुदान स्टेटस - BiharFast",
    description: "मुख्यमंत्री उद्यमी योजना 2026: बिहार के युवाओं, महिलाओं, SC/ST, EBC के लिए ₹10 लाख की सहायता (50% सब्सिडी), आवेदन और चयन सूची।",
    canonical: `${SITE_URL}/udyami-yojana`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/kyp-bihar": {
    title: "KYP Bihar कुशल युवा कार्यक्रम 2026 | सर्टिफिकेट डाउनलोड & रजिस्ट्रेशन - BiharFast",
    description: "कुशल युवा कार्यक्रम (KYP) बिहार: BSDM सर्टिफिकेट वेरिफिकेशन, ऑनलाइन रजिस्ट्रेशन और सेंटर लिस्ट की पूरी जानकारी।",
    canonical: `${SITE_URL}/kyp-bihar`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/student-credit-card": {
    title: "बिहार स्टूडेंट क्रेडिट कार्ड योजना 2026 | ₹4 लाख शिक्षा ऋण आवेदन & स्टेटस - BiharFast",
    description: "बिहार स्टूडेंट क्रेडिट कार्ड (MNSSBY): उच्च शिक्षा हेतु ₹4 लाख तक का शून्य/कम ब्याज शिक्षा ऋण, पात्रता, आवेदन और कॉलेज सूची।",
    canonical: `${SITE_URL}/student-credit-card`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/category/welfare-schemes": {
    title: "Bihar Welfare Schemes Updates - BiharFast",
    description: "Browse Bihar government welfare schemes, public benefits, and citizen services on BiharFast.",
    canonical: `${SITE_URL}/category/welfare-schemes`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/scholarships": {
    title: "Scholarships in Bihar Updates - BiharFast",
    description: "Find scholarship announcements and education support updates for students in Bihar on BiharFast.",
    canonical: `${SITE_URL}/category/scholarships`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/bpsc-jobs": {
    title: "BPSC Jobs and Updates - BiharFast",
    description: "Latest Bihar Public Service Commission (BPSC) recruitment, notifications, and examination updates on BiharFast.",
    canonical: `${SITE_URL}/category/bpsc-jobs`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/bihar-police": {
    title: "Bihar Police Recruitment Updates - BiharFast",
    description: "Browse Bihar Police recruitment, Constable, Sub-Inspector (SI), admit card, and exam updates on BiharFast.",
    canonical: `${SITE_URL}/category/bihar-police`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/teacher-recruitment": {
    title: "Teacher Recruitment in Bihar Updates - BiharFast",
    description: "Latest Bihar teacher recruitment, TRE updates, eligibility, and examination notices on BiharFast.",
    canonical: `${SITE_URL}/category/teacher-recruitment`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/health-department": {
    title: "Bihar Health Department Jobs Updates - BiharFast",
    description: "Health department recruitment, doctor, nurse, ANM, and public health updates in Bihar on BiharFast.",
    canonical: `${SITE_URL}/category/health-department`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/panchayati-raj": {
    title: "Bihar Panchayati Raj Updates - BiharFast",
    description: "Panchayati Raj department recruitment and public service updates in Bihar on BiharFast.",
    canonical: `${SITE_URL}/category/panchayati-raj`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/student-schemes": {
    title: "Student Schemes in Bihar Updates - BiharFast",
    description: "Government schemes, scholarships, education loans, and benefits for students in Bihar on BiharFast.",
    canonical: `${SITE_URL}/category/student-schemes`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/category/social-welfare": {
    title: "Bihar Social Welfare Updates - BiharFast",
    description: "Social welfare schemes, pension, benefits, and related government notifications in Bihar on BiharFast.",
    canonical: `${SITE_URL}/category/social-welfare`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/about": {
    title: "हमारे बारे में (About BiharFast.in) - BiharFast",
    description: "BiharFast.in के बारे में जानें। बिहार का स्वतंत्र और भरोसेमंद शैक्षणिक व रोजगार सूचना पोर्टल, जो छात्रों और नागरिकों को सटीक अपडेट देता है।",
    canonical: `${SITE_URL}/about`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/about-us": {
    title: "हमारे बारे में (About BiharFast.in) - BiharFast",
    description: "BiharFast.in के बारे में जानें। बिहार का स्वतंत्र और भरोसेमंद शैक्षणिक व रोजगार सूचना पोर्टल, जो छात्रों और नागरिकों को सटीक अपडेट देता है।",
    canonical: `${SITE_URL}/about`, // Alias canonically points to /about
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/contact": {
    title: "संपर्क करें (Contact & Grievance Redressal) - BiharFast",
    description: "BiharFast टीम से संपर्क करें। किसी भी सुझाव, त्रुटि सुधार या शिकायत निवारण के लिए हमारी सपोर्ट टीम से जुड़ें।",
    canonical: `${SITE_URL}/contact`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/contact-us": {
    title: "संपर्क करें (Contact & Grievance Redressal) - BiharFast",
    description: "BiharFast टीम से संपर्क करें। किसी भी सुझाव, त्रुटि सुधार या शिकायत निवारण के लिए हमारी सपोर्ट टीम से जुड़ें।",
    canonical: `${SITE_URL}/contact`, // Alias canonically points to /contact
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/privacy-policy": {
    title: "गोपनीयता नीति (Privacy Policy) - BiharFast",
    description: "BiharFast की प्राइवेसी पॉलिसी: जानें कि हम उपयोगकर्ताओं के डेटा की सुरक्षा, कुकीज और गोपनीयता का कैसे ध्यान रखते हैं।",
    canonical: `${SITE_URL}/privacy-policy`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/privacy": {
    title: "गोपनीयता नीति (Privacy Policy) - BiharFast",
    description: "BiharFast की प्राइवेसी पॉलिसी: जानें कि हम उपयोगकर्ताओं के डेटा की सुरक्षा, कुकीज और गोपनीयता का कैसे ध्यान रखते हैं।",
    canonical: `${SITE_URL}/privacy-policy`, // Alias points to /privacy-policy
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/terms": {
    title: "उपयोग की शर्तें (Terms & Conditions) - BiharFast",
    description: "BiharFast.in के नियम और शर्तें: वेबसाइट के उपयोग, सामग्री अधिकार और कानूनी दिशा-निर्देशों की जानकारी।",
    canonical: `${SITE_URL}/terms`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/terms-and-conditions": {
    title: "उपयोग की शर्तें (Terms & Conditions) - BiharFast",
    description: "BiharFast.in के नियम और शर्तें: वेबसाइट के उपयोग, सामग्री अधिकार और कानूनी दिशा-निर्देशों की जानकारी।",
    canonical: `${SITE_URL}/terms`, // Alias points to /terms
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/disclaimer": {
    title: "अस्वीकरण (Disclaimer & Non-Government Notice) - BiharFast",
    description: "BiharFast का स्पष्ट अस्वीकरण: यह एक स्वतंत्र सूचना पोर्टल है और किसी भी सरकारी निकाय से संबद्ध नहीं है।",
    canonical: `${SITE_URL}/disclaimer`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  }
};

/**
 * Returns metadata config for a given pathname, or null if not a registered static route.
 */
export function getMetadataForPath(pathname) {
  if (!pathname) return null;
  // Normalize pathname: strip trailing slash except for root '/'
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return STATIC_ROUTE_METADATA[normalized] || null;
}

