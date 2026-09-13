import React, { useState, useEffect } from "react";
import { 
  ExternalLink, 
  Download, 
  Share2, 
  Server, 
  FileText, 
  Search, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function RtpsBihar() {
  const [appNumber, setAppNumber] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    document.title = "RTPS Bihar | जाति, आय, निवास प्रमाण पत्र डाउनलोड व स्टेटस 2026 - BiharFast";

    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag("name", "description", "RTPS Bihar (ServicePlus) जाति, आय, निवास, Non-Creamy Layer (NCL), EWS प्रमाण पत्र 1 मिनट में बिना लॉगिन डाउनलोड करें और स्टेटस ट्रैक करें।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    setMetaTag("property", "og:title", "RTPS Bihar Certificate Download & Status 2026 - BiharFast");
    setMetaTag("property", "og:description", "Direct certificate download and application tracking without login on RTPS Bihar.");
    setMetaTag("property", "og:url", "https://biharfast.in/rtps-bihar");
    setMetaTag("property", "og:type", "article");

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/rtps-bihar");

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "RTPS Bihar Fast Certificate Portal",
      "description": "Direct certificate download and application status tracker for Bihar caste, income, and residential certificates.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "बिना लॉगिन RTPS प्रमाण पत्र कैसे डाउनलोड करें?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "RTPS के 'Download Certificate' डायरेक्ट लिंक पर जाएं, अपनी Application Reference Number (जैसे BICCO/...) और आवेदक का अंग्रेजी में नाम दर्ज करें और 1 सेकंड में PDF डाउनलोड करें।"
            }
          },
          {
            "@type": "Question",
            "name": "जाति, आय और निवास बनने में कितने कार्य दिवस लगते हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "सामान्यतः अंचल (Block) स्तर पर निवास व आय 10 कार्य दिवस और जाति प्रमाण पत्र 10 से 14 कार्य दिवस में जारी होता है। तत्काल सेवा में यह 1 से 2 दिन में जारी किया जा सकता है।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "rtps-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("rtps-schema");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  const handleShare = () => {
    const text = `🚨 RTPS बिहार: जाति, आय, निवास प्रमाण पत्र बिना लॉगिन सीधे डाउनलोड करने का फास्ट लिंक: https://biharfast.in/rtps-bihar`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - RTPS Hub", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-teal-800 via-cyan-900 to-slate-950 text-white pt-8 pb-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> लोक सेवाओं का अधिकार (Right to Public Services)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            RTPS बिहार: जाति, आय, निवास प्रमाण पत्र पोर्टल
          </h1>
          <p className="mt-2 text-sm sm:text-base text-cyan-100">
            बिना पासवर्ड/लॉगिन के सीधा प्रमाण पत्र डाउनलोड करें, आवेदन स्थिति (Track Application Status) जांचें और तत्काल सेवा का लाभ लें।
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
              <span className="font-semibold text-slate-800">RTPS Server 1 & 2:</span> Operational (Direct Download Active)
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            ServicePlus 2026
          </span>
        </div>

        {/* Direct Action Gateways */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold">डायरेक्ट फास्ट लिंक्स (Direct Action Gateways)</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://serviceonline.bihar.gov.in/serviceDelivery/downloadCertificate.do"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/60 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase">Fastest (No Login)</div>
                <div className="text-sm font-black text-slate-800 group-hover:text-emerald-800">सर्टिफिकेट डाउनलोड (सीधा PDF)</div>
                <div className="text-xs text-slate-500 mt-0.5">Reference No. + Name डालकर तुरंत पाएं</div>
              </div>
              <Download className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition" />
            </a>

            <a
              href="https://serviceonline.bihar.gov.in/serviceDelivery/viewApplicationStatus.do"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50/60 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-blue-700 uppercase">Real-Time Tracker</div>
                <div className="text-sm font-black text-slate-800 group-hover:text-blue-800">आवेदन स्थिति ट्रैक करें (Track Status)</div>
                <div className="text-xs text-slate-500 mt-0.5">अंचल अधिकारी (CO) / RO स्तर की जांच</div>
              </div>
              <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
            </a>

            <a
              href="https://serviceonline.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-purple-600 bg-slate-50/50 hover:bg-purple-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase">Official Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700">ServiceOnline Bihar मुख्य पेज</div>
                <div className="text-xs text-slate-500 mt-0.5">New Registration & Citizen Login</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </a>

            <a
              href="https://serviceonline.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Self Apply (राजस्व अधिकारी स्तर)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">नया प्रमाण पत्र ऑनलाइन आवेदन</div>
                <div className="text-xs text-slate-500 mt-0.5">जाति, आय, निवास, NCL, EWS फॉर्म</div>
              </div>
              <FileText className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>
          </div>
        </section>

        {/* Certificate Breakdown Grid */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">प्रमाण पत्र के प्रकार एवं जारी समय सीमा</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-teal-700">निवास प्रमाण पत्र</div>
              <div className="text-sm font-black text-slate-800 mt-1">Residential Cert.</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10 कार्य दिवस
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-emerald-700">जाति प्रमाण पत्र</div>
              <div className="text-sm font-black text-slate-800 mt-1">Caste Certificate</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10-14 कार्य दिवस
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-amber-700">आय प्रमाण पत्र</div>
              <div className="text-sm font-black text-slate-800 mt-1">Income Certificate</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10 कार्य दिवस (वैधता: 1 वर्ष)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-indigo-700">NCL / EWS</div>
              <div className="text-sm font-black text-slate-800 mt-1">Non-Creamy / EWS</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 15-21 कार्य दिवस
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Direct Download Guide */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600" />
            बिना लॉगिन 1 मिनट में प्रमाण पत्र डाउनलोड कैसे करें?
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>ऊपर दिए गए <strong>सर्टिफिकेट डाउनलोड (सीधा PDF)</strong> बटन पर क्लिक करें।</li>
            <li><strong>Select Service</strong> में RTPS चुनें।</li>
            <li>अपनी पावती रसीद (Acknowlegement Slip) से देखकर <strong>Application Ref. Number</strong> (जैसे BICCO/2026/XXXXX) दर्ज करें।</li>
            <li><strong>Applicant Name in English</strong> में वही नाम लिखें जो आवेदन करते समय दिया था।</li>
            <li><strong>Download Certificate</strong> पर क्लिक करते ही आपका डिजिटल रूप से हस्ताक्षरित (Digitally Signed) ओरिजिनल सर्टिफिकेट तुरंत डाउनलोड हो जाएगा।</li>
          </ol>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-600" />
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. यदि तय समय सीमा बीत जाने के बाद भी स्टेटस "Under Process" दिखे तो क्या करें?</h3>
              <p className="text-slate-600 mt-1">
                यदि कार्य दिवस पूरे हो चुके हैं, तो आप अपनी पावती रसीद लेकर अपने संबंधित प्रखंड (Block) के RTPS काउंटर या राजस्व अधिकारी (RO) के कार्यालय में संपर्क कर सकते हैं, वे उसी दिन अप्रूवल दे देते हैं।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. क्या ऑनलाइन डाउनलोड प्रमाण पत्र में ब्लॉक की मुहर (Physical Stamp) लगवाना जरूरी है?</h3>
              <p className="text-slate-600 mt-1">
                बिल्कुल नहीं। RTPS द्वारा जारी सभी प्रमाण पत्रों पर राजस्व अधिकारी का डिजिटल हस्ताक्षर (Digital Signature) और QR कोड होता है, जो कानूनन हर सरकारी नौकरी, कॉलेज एडमिशन और योजना में 100% मान्य है।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}