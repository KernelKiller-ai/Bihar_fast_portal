import React, { useState, useEffect } from "react";
import { 
  ExternalLink, 
  Download, 
  Share2, 
  Server, 
  FileText, 
  HelpCircle, 
  Sparkles,
  Monitor,
  CheckCircle2,
  Award
} from "lucide-react";

export default function KushalYuvaProgram() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    document.title = "KYP Bihar कुशल युवा कार्यक्रम 2026 | सर्टिफिकेट डाउनलोड & रजिस्ट्रेशन - BiharFast";

    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag("name", "description", "बिहार कुशल युवा कार्यक्रम (KYP) 2026 ऑनलाइन रजिस्ट्रेशन, सर्टिफिकेट वेरिफिकेशन, DRCC स्टेटस और कोर्स विवरण (BS-CIT, BS-CLS, BS-CSS) डायरेक्ट फास्ट लिंक।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    setMetaTag("property", "og:title", "KYP Bihar Kushal Yuva Program Hub 2026 - BiharFast");
    setMetaTag("property", "og:description", "Direct certificate download, student login, and verification for Kushal Yuva Program Bihar.");
    setMetaTag("property", "og:url", "https://biharfast.in/kyp-bihar");
    setMetaTag("property", "og:type", "article");

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/kyp-bihar");

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Bihar Kushal Yuva Program (KYP) Portal",
      "description": "Comprehensive portal for KYP registration, BSDM certificate verification, and DRCC counselling guide.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "KYP का सर्टिफिकेट ऑनलाइन कैसे डाउनलोड करें?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "BSDM के आधिकारिक पोर्टल पर जाएं या BiharFast के Gateway 2 पर क्लिक करें, अपना Learner Code या Roll Number और Centre Code दर्ज कर 1 क्लिक में सर्टिफिकेट वेरिफाई व डाउनलोड करें।"
            }
          },
          {
            "@type": "Question",
            "name": "कुशल युवा कार्यक्रम (KYP) में कौन-कौन से कोर्स कराए जाते हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "KYP में कुल 240 घंटे का प्रशिक्षण होता है जिसमें BS-CIT (कंप्यूटर कौशल), BS-CLS (भाषा व संवाद कौशल - हिंदी/अंग्रेजी), और BS-CSS (सॉफ्ट स्किल्स व व्यक्तित्व विकास) शामिल हैं।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "kyp-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("kyp-schema");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  const handleShare = () => {
    const text = `🚨 बिहार कुशल युवा कार्यक्रम (KYP) सर्टिफिकेट डाउनलोड और रजिस्ट्रेशन स्टेटस डायरेक्ट लिंक: https://biharfast.in/kyp-bihar`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - KYP Hub", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="bg-linear-to-r from-blue-800 via-indigo-900 to-slate-950 text-white pt-8 pb-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> बिहार कौशल विकास मिशन (BSDM)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            कुशल युवा कार्यक्रम (KYP) 2026: सर्टिफिकेट & रजिस्ट्रेशन पोर्टल
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100">
            7 निश्चय योजना के तहत 10वीं/12वीं पास युवाओं के लिए 3 माह का निःशुल्क कंप्यूटर, भाषा व संवाद कौशल प्रशिक्षण।
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" /> {isCopied ? "लिंक कॉपी हो गया!" : "दोस्तों के साथ शेयर करें"}
            </button>
            <a
              href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              📲 WhatsApp अलर्ट ग्रुप
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-800">BSDM Server:</span> Active (Verification & Direct Login Online)
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            KYP Session 2026
          </span>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold">डायरेक्ट फास्ट गेटवे (Official Action Links)</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://skillmissionbihar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase">Gateway 1 (BSDM Main)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">ऑनलाइन रजिस्ट्रेशन / कैंडिडेट लॉगिन</div>
                <div className="text-xs text-slate-500 mt-0.5">New Student Registration Form</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </a>

            <a
              href="https://skillmissionbihar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase">Gateway 2 (Verify)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">सर्टिफिकेट डाउनलोड & वेरिफिकेशन</div>
                <div className="text-xs text-slate-500 mt-0.5">Learner Code से Certificate Check</div>
              </div>
              <Award className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            <a
              href="https://www.7nishchay-yuvaupmission.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-600 bg-slate-50/50 hover:bg-indigo-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase">MNSSBY Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">DRCC एप्लीकेशन स्टेटस ट्रैक करें</div>
                <div className="text-xs text-slate-500 mt-0.5">District Registration Status</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </a>

            <a
              href="https://skillmissionbihar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Center Locator</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">नजदीकी KYP सेंटर खोजें (Block-Wise)</div>
                <div className="text-xs text-slate-500 mt-0.5">Find Active Skill Center Address</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">3 मुख्य कोर्स मॉड्यूल (240 घंटे का प्रशिक्षण)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="text-xs font-bold text-blue-700 uppercase">BS-CIT (120 घंटे)</div>
              <div className="text-sm font-black text-slate-800 mt-1">Information Technology</div>
              <p className="text-xs text-slate-600 mt-1">
                MS Word, Excel, PowerPoint, Internet, Email, Cyber Security और ऑनलाइन सेवाएं।
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-700 uppercase">BS-CLS (80 घंटे)</div>
              <div className="text-sm font-black text-slate-800 mt-1">Language Skills</div>
              <p className="text-xs text-slate-600 mt-1">
                दैनिक बोलचाल में हिंदी और बेसिक अंग्रेजी बोलना, सुनना, पढ़ना और सही संवाद।
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="text-xs font-bold text-amber-700 uppercase">BS-CSS (40 घंटे)</div>
              <div className="text-sm font-black text-slate-800 mt-1">Soft Skills</div>
              <p className="text-xs text-slate-600 mt-1">
                इंटरव्यू की तैयारी, टाइम मैनेजमेंट, टीमवर्क और आत्मविश्वास निर्माण।
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            पात्रता एवं DRCC वेरिफिकेशन हेतु आवश्यक दस्तावेज
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              योग्यता: न्यूनतम 10वीं (मैट्रिक) या 12वीं पास
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              उम्र सीमा: 15 से 28 वर्ष (आरक्षित वर्ग हेतु नियमानुसार छूट)
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              बिहार का मूल निवास प्रमाण पत्र एवं आधार कार्ड
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              10वीं / 12वीं का मूल अंकपत्र (Original Marksheet)
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              बैंक पासबुक की छायाप्रति (IFSC Code व A/C No.)
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              ₹1,000 रिफंडेबल सिक्योरिटी डिपॉजिट (कोर्स पूरा होने पर बैंक में वापस)
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. क्या ट्रेनिंग पूरी होने पर ₹1,000 वापस मिल जाता है?</h3>
              <p className="text-slate-600 mt-1">
                हाँ। प्रशिक्षण सफलतापूर्वक पूर्ण करने और अंतिम ऑनलाइन परीक्षा उत्तीर्ण करने के बाद सिक्योरिटी डिपॉजिट ₹1,000 सीधे आपके बैंक खाते में ट्रांसफर हो जाता है।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. क्या KYP सर्टिफिकेट सरकारी या प्राइवेट नौकरी में मान्य है?</h3>
              <p className="text-slate-600 mt-1">
                हाँ। बिहार सरकार के विभिन्न विभागों, संविदा भर्तियों और प्राइवेट कंपनियों में बेसिक कंप्यूटर ज्ञान के प्रमाण पत्र के रूप में BSDM का यह सर्टिफिकेट पूरी तरह मान्य है।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}