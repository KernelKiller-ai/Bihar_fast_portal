import React, { useState, useEffect } from "react";
import { 
  ExternalLink, 
  Download, 
  Share2, 
  Server, 
  FileText, 
  Calendar, 
  HelpCircle, 
  Sparkles,
  Award,
  BookOpen
} from "lucide-react";

export default function BsebInter() {
  const [isCopied, setIsCopied] = useState(false);

  // Pure Native SEO Management (Zero external package required)
  useEffect(() => {
    // 1. Dynamic Page Title
    document.title = "BSEB Bihar Board 12th Inter Result & Admit Card 2026 | Direct Fast Server - BiharFast";

    // Helper to safely upsert meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. SEO Meta Description & Robots
    setMetaTag("name", "description", "बिहार बोर्ड 12वीं इंटर रिजल्ट 2026, डमी एडमिट कार्ड, और साइंस/आर्ट्स/कॉमर्स डायरेक्ट रिजल्ट लिंक। सर्वर डाउन होने पर भी यहाँ 1 सेकंड में चेक करें।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    // 3. OpenGraph / Social Meta
    setMetaTag("property", "og:title", "BSEB Bihar Board 12th Inter Result & Admit Card 2026 - BiharFast");
    setMetaTag("property", "og:description", "Direct working mirror server links for Bihar Board 12th Intermediate 2026.");
    setMetaTag("property", "og:url", "https://biharfast.in/bseb-inter-12th");
    setMetaTag("property", "og:type", "article");
    setMetaTag("property", "og:image", "https://biharfast.in/og-bseb-12th.png");

    // 4. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/bseb-inter-12th");

    // 5. Schema Markup (FAQ + WebPage)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "BSEB Bihar Board 12th Inter Result & Admit Card 2026",
      "description": "Direct fast server mirrors for Bihar Board 12th Inter examination results, Science, Arts, Commerce marksheets.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "बिहार बोर्ड 12वीं (इंटर) रिजल्ट 2026 कब जारी होगा?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "बिहार बोर्ड इंटरमीडिएट परीक्षा का परिणाम मार्च 2026 के अंतिम सप्ताह में आधिकारिक प्रेस कॉन्फ्रेंस के बाद जारी किया जाएगा।"
            }
          },
          {
            "@type": "Question",
            "name": "इंटर रिजल्ट चेक करने के लिए किन चीजों की आवश्यकता होगी?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "छात्रों को अपने एडमिट कार्ड में दिया गया 5 अंकों का Roll Code और Roll Number दर्ज करना होगा।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "bseb-inter-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("bseb-inter-schema");
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleShare = () => {
    const text = `🚨 BSEB 12th Inter Result & Admit Card Fast Link! बिना सर्वर हैंग हुए यहाँ देखें: https://biharfast.in/bseb-inter-12th`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - BSEB 12th Hub", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white pt-8 pb-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Bihar School Examination Board (BSEB)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            बिहार बोर्ड 12वीं (इंटरमीडिएट) रिजल्ट & एडमिट कार्ड 2026
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100">
            Science, Arts & Commerce — आधिकारिक सर्वर क्रैश होने पर भी डायरेक्ट बैकएंड गेटवे से डिजिटल मार्कशीट तुरंत चेक करें।
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
        {/* Real-time Status Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-800">सर्वर स्टेटस:</span> 12th Inter Dedicated Gateway Active
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            Updated: 2026
          </span>
        </div>

        {/* Multi-Server Mirror Gateways */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold">डायरेक्ट सर्वर गेटवे (12th Inter Result / Admit Card)</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="http://results.biharboardonline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase">Server 1 (Primary NIC)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">सर्वर 1 (All Streams Result)</div>
                <div className="text-xs text-slate-500 mt-0.5">Science | Arts | Commerce Direct</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            <a
              href="http://interbseb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-teal-600 bg-slate-50/50 hover:bg-teal-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-teal-600 uppercase">Server 2 (Inter Portal)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-teal-700">सर्वर 2 (Inter Official Portal)</div>
                <div className="text-xs text-slate-500 mt-0.5">Backup Fast Mirror Server</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
            </a>

            <a
              href="https://biharboardonline.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase">Official Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">BSEB मुख्य वेबसाइट</div>
                <div className="text-xs text-slate-500 mt-0.5">Press Releases & Scrutiny Form</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </a>

            <a
              href="http://medhasoft.bih.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Scholarship Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">कन्या उत्थान ₹25,000 पोर्टल</div>
                <div className="text-xs text-slate-500 mt-0.5">Medhasoft Direct Application Link</div>
              </div>
              <Award className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>
          </div>
        </section>

        {/* In-Article Ad Slot */}
        <div className="my-6 p-3 bg-slate-100 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
          [ Clean In-Article Responsive Ad Slot - Google AdSense ]
        </div>

        {/* Stream-wise Details */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">संकायवार (Stream-Wise) परिणाम विवरण</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-700 uppercase">Science (विज्ञान)</div>
              <div className="text-sm font-black text-slate-800 mt-1">Direct Link Ready</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Physics, Chem, Math/Bio</div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="text-xs font-bold text-blue-700 uppercase">Arts (कला संकाय)</div>
              <div className="text-sm font-black text-slate-800 mt-1">Direct Link Ready</div>
              <div className="text-[11px] text-slate-500 mt-0.5">History, Pol Sci, Geog</div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="text-xs font-bold text-amber-700 uppercase">Commerce (वाणिज्य)</div>
              <div className="text-sm font-black text-slate-800 mt-1">Direct Link Ready</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Accounts, BST, Eco</div>
            </div>
          </div>
        </section>

        {/* Schedule Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">महत्वपूर्ण तिथियां (Important Schedule 2026)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">इवेंट (Event)</th>
                  <th className="py-3 px-4">तारीख / स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-medium">डमी एडमिट कार्ड डाउनलोड</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">सक्रिय (Available)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">12वीं इंटर थ्योरी परीक्षा</td>
                  <td className="py-3 px-4">1 फरवरी से 12 फरवरी 2026</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">ऑफिशियल आंसर की (50% MCQs)</td>
                  <td className="py-3 px-4 text-amber-600">मार्च प्रथम सप्ताह</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">इंटर रिजल्ट 2026 घोषणा</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">मार्च अंतिम सप्ताह</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">कन्या उत्थान योजना ₹25,000 आवेदन</td>
                  <td className="py-3 px-4 text-emerald-600">रिजल्ट के तुरंत बाद</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            इंटर रिजल्ट देखने का आसान तरीका
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>ऊपर दिए गए <strong>सर्वर 1 (Primary NIC)</strong> या <strong>सर्वर 2</strong> पर क्लिक करें।</li>
            <li>एडमिट कार्ड के अनुसार अपना 5 अंकों का <strong>Roll Code</strong> टाइप करें।</li>
            <li>इसके बाद अपना 8 अंकों का <strong>Roll Number</strong> दर्ज करें।</li>
            <li>सुरक्षा कैप्चा कोड (जैसे 12 + 5 = 17) भरें।</li>
            <li><strong>View / Submit</strong> बटन पर क्लिक करते ही आपकी विषयवार डिजिटल मार्कशीट खुल जाएगी।</li>
          </ol>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            इंटरमीडिएट परीक्षा - अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. यदि किसी विषय में कम अंक आएं तो क्या विकल्प है?</h3>
              <p className="text-slate-600 mt-1">
                रिजल्ट के 2 से 3 दिन के भीतर स्क्रूटनी (री-चेकिंग) के लिए प्रति विषय आवेदन लिया जाता है। इसके अलावा एक या दो विषय में फेल होने पर कंपार्टमेंटल परीक्षा का विकल्प मिलता है।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. मुख्यमंत्री कन्या उत्थान योजना ₹25,000 किसे मिलता है?</h3>
              <p className="text-slate-600 mt-1">
                बिहार बोर्ड से इंटरमीडिएट (12वीं) प्रथम (1st) अथवा द्वितीय (2nd) श्रेणी से उत्तीर्ण सभी अविवाहित छात्राओं को सरकार द्वारा ₹25,000 की प्रोत्साहन राशि सीधे बैंक खाते में दी जाती है।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}