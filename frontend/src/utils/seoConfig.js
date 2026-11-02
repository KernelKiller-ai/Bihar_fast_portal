/**
 * Centralized SEO Configuration for BiharFast.in
 * Single source of truth for all static routes, aliases, and canonical mappings.
 */

export const SITE_URL = "https://biharfast.in";
export const DEFAULT_OG_IMAGE = "https://biharfast.in/logo-512.png";
export const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export function formatSeoTitle(title) {
  const normalizedTitle = String(title ?? "").trim().replace(/\s+/g, " ");
  if (normalizedTitle.length <= 65) return normalizedTitle;

  const brandSuffix = " - BiharFast";
  const hasBrandSuffix = normalizedTitle.endsWith(brandSuffix);
  const suffix = hasBrandSuffix ? brandSuffix : "";
  const titleText = hasBrandSuffix
    ? normalizedTitle.slice(0, -brandSuffix.length).trimEnd()
    : normalizedTitle;
  const maxTextLength = 65 - suffix.length;
  const titlePrefix = titleText.slice(0, maxTextLength);
  const lastSpace = titlePrefix.lastIndexOf(" ");
  const endsAtWordBoundary = titleText.length <= maxTextLength
    || /\s/.test(titleText[maxTextLength] || "");
  const shortenedText = !endsAtWordBoundary && lastSpace > 0
    ? titlePrefix.slice(0, lastSpace)
    : titlePrefix;

  return `${shortenedText.trimEnd()}${suffix}`;
}

export const STATIC_ROUTE_METADATA = {
  "/": {
    title: "BiharFast | Bihar Student Tools, RTPS Guides & Exam Resources",
    description: "Free Bihar student utilities: exam photo resizer, MNSSBY student credit card calculator, RTPS service guide and CUET UG PYQ resources, with official-source verification guidance.",
    canonical: `${SITE_URL}/`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/bihar-district-wise-recruitment": {
    title: "Bihar District Recruitment Updates 2026 - BiharFast",
    description: "बिहार के सभी 38 जिलों (Araria, Begusarai, Sheikhpura, Patna, Gaya आदि) की ब्लॉक, समाहरणालय और संविदा आधारित ताजा भर्ती सूचनाएं, पात्रता और आवेदन लिंक।",
    canonical: `${SITE_URL}/bihar-district-wise-recruitment`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/jobs": {
    title: "Latest Government Jobs in Bihar 2026 - BiharFast",
    description: "बिहार की नवीनतम सरकारी नौकरियां, BPSC, CSBC, BTSC, BSSC एवं रेलवे भर्ती की विस्तृत जानकारी और डायरेक्ट ऑनलाइन आवेदन लिंक।",
    canonical: `${SITE_URL}/jobs`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/admit-card": {
    title: "Bihar Exam Admit Card 2026 Download - BiharFast",
    description: "बिहार सरकार, BPSC, CSBC, BSEB, और प्रतियोगी परीक्षाओं के एडमिट कार्ड डाउनलोड करने के लिए आधिकारिक व डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/admit-card`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/results": {
    title: "Bihar Exam Results 2026 Merit List - BiharFast",
    description: "बिहार बोर्ड, BPSC, SSC, पुलिस कांस्टेबल एवं प्रतियोगी परीक्षाओं के परिणाम, कट-ऑफ और मेरिट लिस्ट सबसे पहले देखें।",
    canonical: `${SITE_URL}/results`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/sitemap": {
    title: "BiharFast Sitemap: Pages & Latest Updates",
    description: "BiharFast का संपूर्ण डायरेक्टरी आर्काइव। बिहार की सभी सरकारी नौकरियों, एडमिट कार्ड, रिजल्ट और योजनाओं की सूची एक जगह।",
    canonical: `${SITE_URL}/sitemap`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/all-updates": {
    title: "BiharFast Sitemap: Pages & Latest Updates",
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
    title: "Student Utilities & Calculators - BiharFast",
    description: "बिहार प्रतियोगी परीक्षाओं के लिए फ्री ऑनलाइन टूल्स: उम्र पात्रता कैलकुलेटर और फॉर्म के लिए फोटो व सिग्नेचर रिसाइजर (20–50 KB)।",
    canonical: `${SITE_URL}/useful-tools`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/tools/photo-resizer": {
    title: "Exam Photo & Signature Resizer - BiharFast",
    description: "Resize and compress exam photos and signatures in your browser with suggested BPSC, Bihar Police, and SSC size presets. Images stay on your device.",
    canonical: `${SITE_URL}/tools/photo-resizer`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/tools/credit-card-calculator": {
    title: "Bihar Student Credit Card EMI Calculator | MNSSBY - BiharFast",
    description: "Estimate Bihar Student Credit Card EMI, moratorium interest, and total repayment with an independent MNSSBY calculator and application guide.",
    canonical: `${SITE_URL}/tools/credit-card-calculator`,
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
    title: "BSEB Inter 12th Exam Form & Routine - BiharFast",
    description: "बिहार बोर्ड 12वीं इंटर रिजल्ट 2026, एडमिट कार्ड, स्क्रूटनी एवं कंपार्टमेंटल परीक्षा की त्वरित सूचना व डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/bseb-inter-12th`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/cuet-ug-admission": {
    title: "CUET UG Admission Guide & Syllabus - BiharFast",
    description: "CUET UG 2026 एडमिशन, एग्जाम सिटी इंटीमेशन, एडमिट कार्ड एवं आंसर की की आधिकारिक सूचना और डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/cuet-ug-admission`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/rtps-bihar": {
    title: "RTPS Bihar Caste, Income & Niwas Guide - BiharFast",
    description: "RTPS बिहार पोर्टल (ServicePlus) से जाति, आय, निवास और EWS प्रमाण पत्र ऑनलाइन आवेदन, डाउनलोड और स्टेटस चेक करने के डायरेक्ट लिंक।",
    canonical: `${SITE_URL}/rtps-bihar`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/udyami-yojana": {
    title: "Bihar Udyami Yojana Scheme Guide - BiharFast",
    description: "मुख्यमंत्री उद्यमी योजना 2026: बिहार के युवाओं, महिलाओं, SC/ST, EBC के लिए ₹10 लाख की सहायता (50% सब्सिडी), आवेदन और चयन सूची।",
    canonical: `${SITE_URL}/udyami-yojana`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/kyp-bihar": {
    title: "Kushal Yuva Program (KYP) Guide - BiharFast",
    description: "कुशल युवा कार्यक्रम (KYP) बिहार: BSDM सर्टिफिकेट वेरिफिकेशन, ऑनलाइन रजिस्ट्रेशन और सेंटर लिस्ट की पूरी जानकारी।",
    canonical: `${SITE_URL}/kyp-bihar`,
    robots: DEFAULT_ROBOTS,
    ogType: "article"
  },
  "/student-credit-card": {
    title: "Bihar Student Credit Card (MNSSBY) - BiharFast",
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
    title: "BPSC Jobs & Exam Updates - BiharFast",
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
    title: "About BiharFast | Bihar Student Education & Public Information",
    description: "Learn about BiharFast's mission as an independent educational utility and state administrative guide for Bihar students, including our editorial and source-verification standards.",
    canonical: `${SITE_URL}/about`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/about-us": {
    title: "About BiharFast | Bihar Student Education & Public Information",
    description: "Learn about BiharFast's mission as an independent educational utility and state administrative guide for Bihar students, including our editorial and source-verification standards.",
    canonical: `${SITE_URL}/about`, // Alias canonically points to /about
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/contact": {
    title: "Contact BiharFast | Feedback & Grievance Redressal",
    description: "Contact BiharFast for feedback, factual corrections, technical support, privacy requests, copyright concerns, and grievances. Expected acknowledgement: 24–48 hours.",
    canonical: `${SITE_URL}/contact`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/contact-us": {
    title: "Contact BiharFast | Feedback & Grievance Redressal",
    description: "Contact BiharFast for feedback, factual corrections, technical support, privacy requests, copyright concerns, and grievances. Expected acknowledgement: 24–48 hours.",
    canonical: `${SITE_URL}/contact`, // Alias canonically points to /contact
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/privacy-policy": {
    title: "Privacy Policy | Cookies, Google AdSense & Data Protection",
    description: "Read how BiharFast handles contact details, server logs, Google Analytics, AdSense cookies, notifications, privacy requests, and locally processed photo-resizer and calculator inputs.",
    canonical: `${SITE_URL}/privacy-policy`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/privacy": {
    title: "Privacy Policy | Cookies, Google AdSense & Data Protection",
    description: "Read how BiharFast handles contact details, server logs, Google Analytics, AdSense cookies, notifications, privacy requests, and locally processed photo-resizer and calculator inputs.",
    canonical: `${SITE_URL}/privacy-policy`, // Alias points to /privacy-policy
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/terms": {
    title: "Terms and Conditions of Service - BiharFast",
    description: "Review BiharFast terms covering educational use, intellectual property, acceptable conduct, external links, disclaimers, limitations, and contact procedures.",
    canonical: `${SITE_URL}/terms`,
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/terms-conditions": {
    title: "Terms and Conditions of Service - BiharFast",
    description: "Review BiharFast terms covering educational use, intellectual property, acceptable conduct, external links, disclaimers, limitations, and contact procedures.",
    canonical: `${SITE_URL}/terms`, // Alias points to /terms
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/terms-and-conditions": {
    title: "Terms and Conditions of Service - BiharFast",
    description: "Review BiharFast terms covering educational use, intellectual property, acceptable conduct, external links, disclaimers, limitations, and contact procedures.",
    canonical: `${SITE_URL}/terms`, // Alias points to /terms
    robots: DEFAULT_ROBOTS,
    ogType: "website"
  },
  "/disclaimer": {
    title: "Government Affiliation Disclaimer | BiharFast",
    description: "BiharFast is an independent private informational portal, not affiliated with the Government of Bihar. Verify exam dates, eligibility, and instructions on official portals.",
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
