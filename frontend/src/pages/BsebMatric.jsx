import { useState, useEffect } from "react";
import { 
  ExternalLink, 
  Download, 
  Share2, 
  Server, 
  FileText, 
  Calendar, 
  HelpCircle, 
  Sparkles
} from "lucide-react";

export default function BsebMatric() {
  const [isCopied, setIsCopied] = useState(false);

  // Pure Native SEO Management (Zero external library dependency)
  useEffect(() => {
    // 1. Title
    document.title = "BSEB Bihar Board 10th Result 2027 & Admit Card | BiharFast";

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

    // 2. SEO & Crawl Directives
    setMetaTag("name", "description", "बिहार बोर्ड 10वीं मैट्रिक रिजल्ट 2027, एडमिट कार्ड, मॉडल पेपर और आधिकारिक अपडेट्स के लिए BiharFast का भरोसेमंद हब।");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");

    // 3. Social / OpenGraph Meta Tags
    setMetaTag("property", "og:title", "BSEB Bihar Board 10th Result 2027 & Admit Card - BiharFast");
    setMetaTag("property", "og:description", "Bihar Board Matric 2027 result, admit card and official updates.");
    setMetaTag("property", "og:url", "https://biharfast.in/bseb-matric-10th");
    setMetaTag("property", "og:type", "article");
    setMetaTag("property", "og:image", "https://biharfast.in/og-bseb-10th.png");

    // 4. Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", "https://biharfast.in/bseb-matric-10th");

    // 5. Structured Data (JSON-LD Schema)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "BSEB Bihar Board 10th Matric Result 2027 & Admit Card",
      "description": "Bihar School Examination Board (BSEB) Matric 10th Result 2027, Admit Card, Dummy Registration, and Official Answer Key updates.",
      "publisher": {
        "@type": "Organization",
        "name": "BiharFast"
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "बिहार बोर्ड 10वीं मैट्रिक रिजल्ट कैसे चेक करें?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "रिजल्ट जारी होने के बाद BiharFast पर दिए गए आधिकारिक लिंक से Roll Code और Roll Number दर्ज करके रिजल्ट देखें।"
            }
          },
          {
            "@type": "Question",
            "name": "बिहार बोर्ड मैट्रिक एडमिट कार्ड डाउनलोड करने के लिए क्या विवरण चाहिए?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "एडमिट कार्ड जारी होने के बाद स्कूल कोड, रजिस्ट्रेशन नंबर और जन्मतिथि जैसे विवरण की आवश्यकता हो सकती है।"
            }
          }
        ]
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "bseb-matric-schema";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("bseb-matric-schema");
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleShare = () => {
    const text = `BSEB 10th Matric Result 2027 और Admit Card के आधिकारिक अपडेट्स: https://biharfast.in/bseb-matric-10th`;
    if (navigator.share) {
      navigator.share({ title: "BiharFast - BSEB 10th Hub", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-[#063B66] via-blue-800 to-[#0E7490] text-white pt-8 pb-12 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> BSEB MATRIC 2027 • OFFICIAL UPDATES
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            बिहार बोर्ड 10वीं (मैट्रिक) रिजल्ट 2027 & एडमिट कार्ड
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100">
            परीक्षा, एडमिट कार्ड और रिजल्ट से जुड़े verified updates एक ही जगह पाएं। रिजल्ट जारी होते ही official link यहाँ उपलब्ध होगा।
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
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
              <span className="font-semibold text-slate-800">अपडेट स्टेटस:</span> 2027 तैयारी जारी है
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded">
            SESSION: 2027
          </span>
        </div>

        {/* Multi-Server Mirror Gateways */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold">BSEB 2027 अपडेट्स और आधिकारिक लिंक</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://results.biharboardonline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase">Result Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">रिजल्ट लिंक</div>
                <div className="text-xs text-slate-500 mt-0.5">रिजल्ट जारी होने पर सक्रिय होगा</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </a>

            <a
              href="https://secondary.biharboardonline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase">Admit Card</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">एडमिट कार्ड अपडेट</div>
                <div className="text-xs text-slate-500 mt-0.5">आधिकारिक सूचना का इंतजार है</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            <a
              href="https://biharboardonline.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-600 bg-slate-50/50 hover:bg-indigo-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase">Official Portal</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">आधिकारिक वेबसाइट</div>
                <div className="text-xs text-slate-500 mt-0.5">Notification & Press Release</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </a>

            <a
              href="#"
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase">Coming Soon</div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">मॉडल पेपर और आंसर की</div>
                <div className="text-xs text-slate-500 mt-0.5">2027 सामग्री जल्द उपलब्ध होगी</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </a>
          </div>
        </section>

        {/* Clean AdSense Slot Placeholder */}
        <div className="my-6 p-3 bg-slate-100 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
          [ Clean In-Article Responsive Ad Slot - Google AdSense ]
        </div>

        {/* Important Dates Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">महत्वपूर्ण तिथियां (Important Schedule)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">इवेंट (Event)</th>
                  <th className="py-3 px-4">तारीख / स्टेटस</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-medium">डमी एडमिट कार्ड जारी</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">Coming Soon</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">फाइनल थ्योरी परीक्षा तिथि</td>
                  <td className="py-3 px-4">फरवरी 2027 (संभावित)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">ऑफिशियल आंसर की</td>
                  <td className="py-3 px-4 text-amber-600">परीक्षा के बाद जारी होगी</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">वार्षिक परीक्षा रिजल्ट 2027</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">Coming Soon</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            रिजल्ट कैसे चेक करें (Step-by-Step Guide)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>रिजल्ट जारी होने के बाद ऊपर दिए गए आधिकारिक result link पर क्लिक करें।</li>
            <li>अपने एडमिट कार्ड से देखकर 5 अंकों का <strong>Roll Code</strong> दर्ज करें।</li>
            <li>अपना <strong>Roll Number</strong> सही-सही भरें।</li>
            <li>स्क्रीन पर दिया गया आसान गणितीय कैप्चा (Captcha) हल करें।</li>
            <li><strong>Search Result</strong> बटन दबाएं। आपकी डिजिटल मार्कशीट स्क्रीन पर प्रदर्शित हो जाएगी, जिसे आप PDF के रूप में सहेज सकते हैं।</li>
          </ol>
        </section>

        {/* Frequently Asked Questions */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-800">प्र. सर्वर '504 Gateway Timeout' दिखाए तो क्या करें?</h3>
              <p className="text-slate-600 mt-1">
                रिजल्ट जारी होने के समय सर्वर पर लोड बढ़ सकता है। आधिकारिक लिंक उपलब्ध होते ही इस पेज पर अपडेट किया जाएगा।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">प्र. क्या इंटरनेट से डाउनलोड मार्कशीट ओरिजिनल मानी जाएगी?</h3>
              <p className="text-slate-600 mt-1">
                ऑनलाइन रिजल्ट जारी होने के बाद भी मूल अंकपत्र आपके संबंधित स्कूल द्वारा वितरित किया जाता है।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}