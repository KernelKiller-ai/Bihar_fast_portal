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
  CreditCard,
  CheckCircle2,
  GraduationCap
} from "lucide-react";

export default function StudentCreditCard() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    document.title = "बिहार स्टूडेंट क्रेडिट कार्ड योजना 2026 | ₹4 लाख शिक्षा ऋण आवेदन & स्टेटस - BiharFast";

    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag("name", "description", "बिहार स्टूडेंट क्रेडिट कार्ड योजना (MNSSBY) 2026: उच्च शिक्षा हेतु ₹4 लाख तक 0%-1% ब्याज पर शिक्षा ऋण। ऑनलाइन आवेदन, कॉलेज अप्रूवल लिस्ट और DRCC स्टेटस डायरेक्ट लिंक।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    setMetaTag("property", "og:title", "बिहार स्टूडेंट क्रेडिट कार्ड योजना 2026 - BiharFast");
    setMetaTag("property", "og:description", "Direct application link, college search, and DRCC status tracker for Bihar Student Credit Card (BSCC).");
    setMetaTag("property", "og:url", "https://biharfast.in/student-credit-card");
    setMetaTag("property", "og:type", "article");

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/student-credit-card");

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Bihar Student Credit Card (BSCC) Scheme Portal",
      "description": "Direct application and tracking hub for MNSSBY Bihar Student Credit Card up to 4 Lakh education loan.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "स्टूडेंट क्रेडिट कार्ड पर ब्याज दर (Interest Rate) कितनी होती है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "छात्राओं, दिव्यांगों और ट्रांसजेंडर विद्यार्थियों के लिए मात्र 1% साधारण ब्याज दर है, जबकि सामान्य व अन्य छात्रों के लिए 4% साधारण ब्याज दर होती है। कोर्स पूरा होने के 1 वर्ष बाद तक कोई ब्याज नहीं लगता (Moratorium Period)।"
            }
          },
          {
            "@type": "Question",
            "name": "स्टूडेंट क्रेडिट कार्ड योजना के तहत कौन-कौन से कोर्स शामिल हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "B.Tech, MBBS, B.Sc Nursing, BCA, BBA, BA, B.Sc, B.Com, MBA, Polytechnic, B.Ed सहित 40 से अधिक सामान्य एवं तकनीकी डिग्री कोर्सेज शामिल हैं।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "bscc-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("bscc-schema");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  const handleShare = () => {
    const text = `🚨 बिहार स्टूडेंट क्रेडिट कार्ड योजना ₹4 लाख शिक्षा ऋण आवेदन व स्टेटस डायरेक्ट लिंक: https://biharfast.in/student-credit-card`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - Student Credit Card Hub", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="bg-linear-to-r from-emerald-800 via-cyan-900 to-slate-950 text-white pt-8 pb-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> बिहार राज्य शिक्षा वित्त निगम (BSEFC)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            बिहार स्टूडेंट क्रेडिट कार्ड (BSCC) 2026: ₹4 लाख शिक्षा ऋण
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100">
            12वीं पास छात्रों को बीटेक, मेडिकल, नर्सिंग, सामान्य स्नातक व प्रबंधन कोर्सेज की पढ़ाई के लिए बिना किसी गारंटी के 4 लाख तक का ऋण।
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
              <span className="font-semibold text-slate-800">MNSSBY Server:</span> Live (Online Registration & College Approval Search)
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            Session: 2026-27
          </span>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold">डायरेक्ट आवेदन व स्टेटस गेटवे (Direct Links)</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://www.7nishchay-yuvaupmission.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-emerald-50/20 hover:bg-emerald-50/50 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase">MNSSBY Direct</div>
                <div className="text-sm font-black text-slate-800 group-hover:text-emerald-800">नया आवेदक पंजीकरण (New Applicant)</div>
                <div className="text-xs text-slate-500 mt-0.5">Registration Form for 12th Pass Students</div>
              </div>
              <ExternalLink className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition" />
            </a>

            <a
              href="https://www.7nishchay-yuvaupmission.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-blue-50/20 hover:bg-blue-50/50 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-blue-700 uppercase">Application Tracker</div>
                <div className="text-sm font-black text-slate-800 group-hover:text-blue-800">DRCC आवेदन स्थिति जांचें (Track Status)</div>
                <div className="text-xs text-slate-500 mt-0.5">Check Verification & Third Party Status</div>
              </div>
              <FileText className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
            </a>

            <a
              href="https://www.7nishchay-yuvaupmission.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-purple-600 bg-slate-50/50 hover:bg-purple-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase">Approved Colleges</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700">मान्यता प्राप्त कॉलेज लिस्ट (NAAC / NBA)</div>
                <div className="text-xs text-slate-500 mt-0.5">Eligible Institute Search Across India</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </a>

            <a
              href="https://bsefc.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Finance Corporation</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">बिहार राज्य शिक्षा वित्त निगम पोर्टल</div>
                <div className="text-xs text-slate-500 mt-0.5">Loan Disbursal & Agreement Updates</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">ऋण राशि एवं ब्याज दर विवरण (Loan Terms)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase">अधिकतम लोन राशि</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹4,00,000</div>
              <div className="text-[11px] text-slate-600 mt-0.5">ट्यूशन फीस, हॉस्टल, लैपटॉप व किताबें</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="text-xs font-bold text-blue-800 uppercase">छात्रा व दिव्यांग ब्याज</div>
              <div className="text-2xl font-black text-blue-700 mt-1">1%</div>
              <div className="text-[11px] text-slate-600 mt-0.5">साधारण वार्षिक ब्याज दर (Simple Interest)</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs font-bold text-amber-800 uppercase">छात्र (पुरुष) ब्याज</div>
              <div className="text-2xl font-black text-amber-700 mt-1">4%</div>
              <div className="text-[11px] text-slate-600 mt-0.5">कोर्स समाप्ति के 1 साल बाद से चुकौती शुरू</div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            DRCC जाने से पहले आवश्यक दस्तावेज
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              विद्यार्थी एवं सह-आवेदक (माता/पिता) का आधार कार्ड
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              10वीं और 12वीं का मूल अंकपत्र व प्रमाण पत्र
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              कॉलेज का बोनाफाइड सर्टिफिकेट (Bonafide)
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              कॉलेज का फीस स्ट्रक्चर (Fee Structure on Letterhead)
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              बिहार का मूल निवास प्रमाण पत्र
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              छात्र व माता/पिता का बैंक पासबुक (6 माह का स्टेटमेंट)
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. यदि कोर्स पूरा होने के बाद भी नौकरी न लगे तो क्या लोन चुकाना होगा?</h3>
              <p className="text-slate-600 mt-1">
                कोर्स पूरा होने के बाद 1 वर्ष का मोराटोरियम पीरियड मिलता है। यदि इस दौरान रोजगार नहीं मिलता है, तो डीआरसीसी में बेरोजगारी का स्व-घोषणा पत्र जमा करके चुकौती अवधि आगे बढ़वाई जा सकती है।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. क्या दूसरे राज्य (जैसे दिल्ली, कर्नाटक, पंजाब) के कॉलेज में पढ़ने पर लोन मिलेगा?</h3>
              <p className="text-slate-600 mt-1">
                हाँ, बशर्ते वह संस्थान संबंधित विनियामक संस्था (AICTE, UGC, MCI, INC आदि) से संबद्ध हो तथा NAAC ‘A’ ग्रेड या NIRF रैंकिंग के तहत पात्र सूची में आता हो।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}