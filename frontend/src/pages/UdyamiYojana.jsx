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
  Building2,
  Banknote,
  CheckCircle2
} from "lucide-react";

export default function UdyamiYojana() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    document.title = "बिहार मुख्यमंत्री उद्यमी योजना 2026 | ₹10 लाख लोन व अनुदान स्टेटस - BiharFast";

    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag("name", "description", "बिहार मुख्यमंत्री उद्यमी योजना (SC/ST, EBC, महिला, युवा) ₹10 लाख सहायता राशि, फाइनल चयन सूची, DPR फॉर्मेट और ऑनलाइन आवेदन डायरेक्ट लिंक।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    setMetaTag("property", "og:title", "मुख्यमंत्री उद्यमी योजना 2026 - BiharFast");
    setMetaTag("property", "og:description", "Direct official link, project list, and selection list for Bihar Udyami Yojana.");
    setMetaTag("property", "og:url", "https://biharfast.in/udyami-yojana");
    setMetaTag("property", "og:type", "article");

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/udyami-yojana");

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Bihar Mukhyamantri Udyami Yojana Portal 2026",
      "description": "Information and fast server direct links for Bihar Mukhyamantri Udyami Yojana grant, selection list, project formats.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "मुख्यमंत्री उद्यमी योजना में कितना अनुदान (Subsidy) मिलता है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "कुल ₹10 लाख की परियोजना लागत में से 50% (अधिकतम ₹5 लाख) सीधे अनुदान/माफ होता है और शेष ₹5 लाख 1% ब्याज दर (महिलाओं के लिए 0% ब्याज) पर 84 किस्तों में चुकाना होता है।"
            }
          },
          {
            "@type": "Question",
            "name": "उद्यमी योजना के लिए आवश्यक दस्तावेज क्या हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "आधार कार्ड, पैन कार्ड, मूल निवास प्रमाण पत्र, जाति प्रमाण पत्र, 10वीं व 12वीं/इंटर/ITI/डिप्लोमा मार्कशीट, बैंक स्टेटमेंट/रद्द चेक और हस्ताक्षर।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "udyami-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("udyami-schema");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  const handleShare = () => {
    const text = `🚨 बिहार मुख्यमंत्री उद्यमी योजना ₹10 लाख आवेदन व चयन सूची डायरेक्ट लिंक: https://biharfast.in/udyami-yojana`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - Udyami Yojana", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-amber-800 via-orange-800 to-slate-900 text-white pt-8 pb-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> उद्योग विभाग, बिहार सरकार
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            बिहार मुख्यमंत्री उद्यमी योजना 2026 (₹10 लाख सहायता)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-amber-100">
            युवा, महिला, ईबीसी (EBC), अनुसूचित जाति/जनजाति (SC/ST) एवं अल्पसंख्यक वर्ग हेतु नया उद्योग स्थापित करने के लिए ₹5 लाख अनुदान व ₹5 लाख ऋण।
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
        {/* Status */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-800">पोर्टल स्थिति:</span> ऑफिशियल आवेदन व लिस्ट सर्वर सक्रिय
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            वर्ष: 2026
          </span>
        </div>

        {/* Action Gateways */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold">डायरेक्ट गेटवे लिंक (Direct Official Links)</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://udyami.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Primary Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">ऑनलाइन पंजीकरण / लॉगिन</div>
                <div className="text-xs text-slate-500 mt-0.5">Udyami Direct Candidate Login</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>

            <a
              href="https://udyami.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase">Selection List</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">फाइनल चयन सूची (Random Selection)</div>
                <div className="text-xs text-slate-500 mt-0.5">Category-Wise Selected List PDF</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            <a
              href="https://udyami.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase">Project Format</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">60+ स्वीकृत प्रोजेक्ट डीपीआर (DPR)</div>
                <div className="text-xs text-slate-500 mt-0.5">Project Estimation & DPR Download</div>
              </div>
              <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </a>

            <a
              href="https://state.bihar.gov.in/industries"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-purple-600 bg-slate-50/50 hover:bg-purple-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase">Department Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700">उद्योग विभाग आधिकारिक परिपत्र</div>
                <div className="text-xs text-slate-500 mt-0.5">Official Guidelines & Circulars</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </a>
          </div>
        </section>

        {/* Scheme Structure */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Banknote className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">अनुदान एवं लोन की संरचना (Financial Breakup)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
              <div className="text-xs font-bold text-amber-800 uppercase">कुल स्वीकृत राशि</div>
              <div className="text-xl font-black text-slate-900 mt-1">₹10,00,000</div>
              <div className="text-[11px] text-slate-600 mt-0.5">अधिकतम प्रोजेक्ट लागत</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <div className="text-xs font-bold text-emerald-800 uppercase">सरकारी अनुदान (माफ)</div>
              <div className="text-xl font-black text-emerald-700 mt-1">₹5,00,000</div>
              <div className="text-[11px] text-slate-600 mt-0.5">50% सीधी सब्सिडी (No Repayment)</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
              <div className="text-xs font-bold text-blue-800 uppercase">ऋण (Easy Installment)</div>
              <div className="text-xl font-black text-blue-700 mt-1">₹5,00,000</div>
              <div className="text-[11px] text-slate-600 mt-0.5">महिला: 0% ब्याज | अन्य: 1% ब्याज (84 किस्त)</div>
            </div>
          </div>
        </section>

        {/* Steps Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            आवेदन के लिए जरूरी दस्तावेज व योग्यता
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              बिहार का स्थायी निवासी प्रमाण पत्र (निवास)
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              10+2 / इंटरमीडिएट, ITI, पॉलिटेक्निक या डिप्लोमा पास
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              उम्र सीमा: 18 वर्ष से 50 वर्ष के बीच
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              जाति प्रमाण पत्र एवं पैन कार्ड अनिवार्य
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              आधार लिंक्ड एक्टिव सेविंग्स बैंक अकाउंट (बाद में चालू खाता)
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              पासपोर्ट साइज फोटो एवं हस्ताक्षर (100KB से कम)
            </li>
          </ul>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. चयन प्रक्रिया कैसे होती है? क्या परीक्षा देनी होती है?</h3>
              <p className="text-slate-600 mt-1">
                नहीं, कोई लिखित परीक्षा नहीं होती। उद्योग विभाग द्वारा कंप्यूटराइज्ड रैंडमाइजेशन (लॉटरी सिस्टम) के जरिए सभी योग्य आवेदकों में से पारदर्शी तरीके से चयन किया जाता है।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. लोन की राशि कितने किस्तों में मिलती है?</h3>
              <p className="text-slate-600 mt-1">
                चयन के बाद 2 सप्ताह का प्रशिक्षण (Training) होता है, जिसके बाद कार्य प्रगति और स्थल निरीक्षण के आधार पर कुल राशि 3 किस्तों (Installments) में सीधे बैंक खाते में ट्रांसफर की जाती है।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}