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
  GraduationCap,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export default function CuetUgAdmission() {
  const [isCopied, setIsCopied] = useState(false);

  // Pure Native SEO Management (Zero external package required)
  useEffect(() => {
    // 1. Dynamic Page Title
    document.title = "CUET UG Admission 2026 | Direct NTA Application Link & Syllabus - BiharFast";

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
    setMetaTag("name", "description", "NTA CUET UG 2026 ऑनलाइन आवेदन, एडमिट कार्ड, परीक्षा पैटर्न, और CUSB, BHU, DU एडमिशन प्रक्रिया। डायरेक्ट फास्ट लिंक और विषय चयन गाइड।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    // 3. OpenGraph / Social Meta
    setMetaTag("property", "og:title", "CUET UG Admission 2026 | Direct Fast Portal - BiharFast");
    setMetaTag("property", "og:description", "NTA CUET UG direct official servers, admit card, scorecard, and university admission guide.");
    setMetaTag("property", "og:url", "https://biharfast.in/cuet-ug-admission");
    setMetaTag("property", "og:type", "article");
    setMetaTag("property", "og:image", "https://biharfast.in/og-cuet-ug.png");

    // 4. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/cuet-ug-admission");

    // 5. Schema Markup (FAQ + WebPage)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "CUET UG Admission Portal 2026",
      "description": "Comprehensive NTA CUET UG admission hub, online form direct links, eligibility, and Central University cutoffs.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "CUET UG 2026 का ऑनलाइन फॉर्म कैसे भरें?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NTA के आधिकारिक पोर्टल exams.nta.ac.in/CUET-UG पर जाएं या BiharFast के Gateway 1 पर क्लिक करें, न्यू रजिस्ट्रेशन करें, विषय और यूनिवर्सिटी चुनें और शुल्क भुगतान करें।"
            }
          },
          {
            "@type": "Question",
            "name": "बिहार के छात्रों के लिए CUET के तहत प्रमुख विश्वविद्यालय कौन से हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "दक्षिण बिहार केंद्रीय विश्वविद्यालय (CUSB Gaya), महात्मा गांधी केंद्रीय विश्वविद्यालय (MGCU Motihari), BHU वाराणसी, और दिल्ली विश्वविद्यालय (DU) प्रमुख विकल्प हैं।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "cuet-ug-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("cuet-ug-schema");
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleShare = () => {
    const text = `🚨 NTA CUET UG 2026 Direct Application & Result Fast Link! बिना किसी झंझट के यहाँ देखें: https://biharfast.in/cuet-ug-admission`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - CUET UG Hub", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-violet-800 via-purple-800 to-indigo-950 text-white pt-8 pb-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> National Testing Agency (NTA)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            CUET (UG) 2026 एडमिशन, एग्जाम सिटी & रिजल्ट पोर्टल
          </h1>
          <p className="mt-2 text-sm sm:text-base text-purple-100">
            Central University of South Bihar (Gaya), BHU, DU सहित देश के सभी शीर्ष विश्वविद्यालयों में स्नातक (BA, B.Sc, B.Com, LLB) प्रवेश के लिए डायरेक्ट गेटवे।
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
              <span className="font-semibold text-slate-800">पोर्टल स्टेटस:</span> NTA CUET Dedicated Mirror Active
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            Updated: 2026
          </span>
        </div>

        {/* Multi-Server Mirror Gateways */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-bold">डायरेक्ट सर्वर गेटवे (Direct Action Links)</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://exams.nta.ac.in/CUET-UG/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-purple-600 bg-slate-50/50 hover:bg-purple-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase">Gateway 1 (Primary)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700">ऑनलाइन आवेदन / लॉगिन पोर्टल</div>
                <div className="text-xs text-slate-500 mt-0.5">Official NTA Registration Server</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </a>

            <a
              href="https://cuetug.ntaonline.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-600 bg-slate-50/50 hover:bg-indigo-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase">Gateway 2 (Candidate Login)</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">एडमिट कार्ड & सिटी स्लिप</div>
                <div className="text-xs text-slate-500 mt-0.5">Fast Direct Roll Number Login</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </a>

            <a
              href="https://www.cusb.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase">Bihar Central University</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">CUSB गया - एडमिशन पोर्टल</div>
                <div className="text-xs text-slate-500 mt-0.5">Cut-Off & Counselling Portal</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </a>

            <a
              href="https://exams.nta.ac.in/CUET-UG/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Official Material</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">सिलेबस & PYQ (Hindi/Eng PDF)</div>
                <div className="text-xs text-slate-500 mt-0.5">All Domain Subjects Syllabus</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>
          </div>
        </section>

        {/* Clean AdSense Slot */}
        <div className="my-6 p-3 bg-slate-100 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
          [ Clean In-Article Responsive Ad Slot - Google AdSense ]
        </div>

        {/* Subject Selection Guide (Bihar Specific Value) */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">सब्जेक्ट कॉम्बिनेशन कैसे चुनें? (छात्रों के लिए गाइड)</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            CUET में गलत विषय चुनने से फॉर्म रिजेक्ट नहीं होता, लेकिन संबंधित कॉलेज में एडमिशन रद्द हो जाता है। अपने 12th स्ट्रीम के अनुसार सही कॉम्बिनेशन चुनें:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="text-xs font-bold text-purple-800 uppercase">B.A. (ऑनर्स / आर्ट्स)</div>
              <ul className="text-xs text-slate-700 mt-2 space-y-1 text-left">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> भाषा: हिंदी या अंग्रेजी</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> डोमेन: History, Pol Sci, Geo</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> सामान्य परीक्षण: General Test</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="text-xs font-bold text-blue-800 uppercase">B.Sc. (साइंस)</div>
              <ul className="text-xs text-slate-700 mt-2 space-y-1 text-left">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> भाषा: English (Qualifying)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> डोमेन: Physics, Chemistry</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> ऐच्छिक: Math / Biology</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase">B.Com. (कॉमर्स)</div>
              <ul className="text-xs text-slate-700 mt-2 space-y-1 text-left">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> भाषा: हिंदी या अंग्रेजी</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> डोमेन: Accountancy, BST</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> सामान्य: General Test / Eco</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Schedule Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">CUET UG 2026 महत्वपूर्ण तिथियां (Schedule)</h2>
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
                  <td className="py-3 px-4 font-medium">ऑनलाइन आवेदन फॉर्म शुरू</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">फरवरी अंतिम सप्ताह</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">आवेदन की अंतिम तिथि</td>
                  <td className="py-3 px-4">मार्च अंतिम सप्ताह</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">फॉर्म करेक्शन विंडो (Correction)</td>
                  <td className="py-3 px-4 text-amber-600">अप्रैल प्रथम सप्ताह</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">एग्जाम सिटी इंटिमेशन स्लिप</td>
                  <td className="py-3 px-4">मई प्रथम सप्ताह</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">फाइनल एडमिट कार्ड डाउनलोड</td>
                  <td className="py-3 px-4">परीक्षा से 3 दिन पहले</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">CUET UG परीक्षा तिथि</td>
                  <td className="py-3 px-4 font-bold text-purple-700">मई से जून 2026</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">NTA स्कोरकार्ड & रिजल्ट</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">जुलाई 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            आवेदन फॉर्म भरने की आसान प्रक्रिया (Step-by-Step)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>ऊपर दिए गए <strong>Gateway 1 (Primary)</strong> लिंक पर क्लिक करके NTA पोर्टल खोलें।</li>
            <li><strong>New Registration</strong> पर क्लिक करें और अपना नाम, मोबाइल नंबर व ईमेल आईडी डालकर OTP वेरीफाई करें।</li>
            <li>लॉगिन करने के बाद व्यक्तिगत विवरण, 10वीं और 12th रोल कोड/मार्क्स भरें।</li>
            <li><strong>University & Programme Selection</strong> में अपनी पसंदीदा यूनिवर्सिटीज (जैसे CUSB Gaya, BHU, DU) चुनें।</li>
            <li>संबंधित कोर्स के लिए <strong>Domain Subjects</strong> और <strong>General Test</strong> का चयन करें।</li>
            <li>फोटो और हस्ताक्षर (20KB - 50KB) अपलोड करें (हमारे टूल का उपयोग कर सकते हैं)।</li>
            <li>ऑनलाइन फीस जमा करके कंफर्मेशन पेज PDF डाउनलोड कर सुरक्षित रख लें।</li>
          </ol>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. क्या बिहार बोर्ड 12th अपीयरिंग (रिजल्ट से पहले) छात्र आवेदन कर सकते हैं?</h3>
              <p className="text-slate-600 mt-1">
                हाँ, जो छात्र 2026 में 12वीं की परीक्षा दे रहे हैं, वे 'Appearing' चुनकर बिना रोल नंबर/मार्क्स आए भी फॉर्म भर सकते हैं। काउंसलिंग के समय मार्कशीट देनी होती है।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. CUSB (गया) में एडमिशन के लिए जनरल टेस्ट देना अनिवार्य है?</h3>
              <p className="text-slate-600 mt-1">
                अधिकतर एकीकृत कोर्सेज (जैसे 4-Year B.A. B.Ed, B.Sc B.Ed, या 5-Year Integrated BA LLB) के लिए संबंधित डोमेन विषय के साथ जनरल टेस्ट (Section III) अनिवार्य होता है।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}