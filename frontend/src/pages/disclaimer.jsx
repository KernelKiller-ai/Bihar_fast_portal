import { AlertOctagon, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            कानूनी सुरक्षा घोषणा (Legal Safeguard)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            पूर्ण अस्वीकरण (Comprehensive Legal Disclaimer)
          </h1>
          <p className="text-slate-500 text-xs mt-1">अंतिम अद्यतन: 2026</p>
        </div>

        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertOctagon className="text-rose-600 shrink-0 mt-0.5" size={22} />
          <div className="text-xs text-rose-950 space-y-1.5 leading-relaxed">
            <strong className="block text-sm font-black text-rose-800">
              गैर-सरकारी मंच की स्पष्ट घोषणा (Strict Non-Affiliation Declaration):
            </strong>
            <p>
              <strong>BiharFast.in</strong> एक पूर्णतः स्वतंत्र, निजी एवं गैर-सरकारी (Non-Governmental) सूचना पोर्टल है। इस पोर्टल का बिहार सरकार, केंद्र सरकार, किसी भी मंत्रालय, भर्ती आयोग (यथा BPSC, CSBC, BPSSC, BSSC, BTSC आदि), अथवा किसी सरकारी उपक्रम से कोई सीधा या परोक्ष संबंध, आधिकारिक अनुबंध अथवा संबद्धता नहीं है।
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. केवल शैक्षणिक एवं सूचनात्मक उद्देश्य (Purely Informational Purpose)</h2>
            <p>
              इस पोर्टल पर प्रकाशित सभी रोजगार समाचार, परीक्षा कार्यक्रम, परिणाम, पाठ्यक्रम तथा सरकारी योजनाओं के विवरण केवल जन-जागरूकता एवं शैक्षणिक सुविधा हेतु संकलित किए जाते हैं। यद्यपि हम अधिकृत सरकारी परिपत्रों के आधार पर सटीक जानकारी प्रस्तुत करने का हरसंभव प्रयास करते हैं, तथापि मानवीय भूल, मुद्रण दोष अथवा संबंधित विभाग द्वारा अंतिम समय में किए गए परिवर्तनों के लिए BiharFast.in अथवा इसके संचालक किसी भी रूप में विधिक रूप से उत्तरदायी नहीं होंगे।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. अभ्यर्थियों के लिए अनिवार्य सत्यापन दायित्व (Mandatory Verification Obligation)</h2>
            <p>
              किसी भी भर्ती परीक्षा अथवा योजना में ऑनलाइन/ऑफलाइन आवेदन पत्र प्रस्तुत करने अथवा परीक्षा शुल्क जमा करने से पूर्व उम्मीदवार संबंधित आयोग या विभाग की मूल आधिकारिक वेबसाइट पर जाकर जारी मूल विज्ञापन (PDF) का स्वयं मिलान एवं सत्यापन करने हेतु 100% बाध्य हैं। आधिकारिक अधिसूचना में वर्णित नियम, शर्तें, तिथियां और पात्रता ही अंतिम एवं विधिक रूप से मान्य होंगी।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. शून्य वित्तीय दायित्व एवं बिचौलिया रहित नीति (Zero Financial Liability)</h2>
            <p>
              BiharFast.in किसी भी अभ्यर्थी से किसी भी भर्ती, प्रवेश पत्र, रिजल्ट अथवा सेवा के एवज में कोई शुल्क, डोनेशन अथवा गुप्त राशि नहीं मांगता। समस्त ऑनलाइन आवेदन शुल्क का भुगतान सीधे संबंधित आयोग/विभाग के आधिकारिक बैंक पेमेंट गेटवे पर ही किया जाना चाहिए। किसी भी अनधिकृत लिंक, साइबर धोखाधड़ी, वित्तीय हानि, फॉर्म रिजेक्शन या बैंक ट्रांजैक्शन विफलता के लिए हमारा पोर्टल उत्तरदायी नहीं होगा।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. बाह्य हाइपरलिंक्स पर अस्वीकरण (Third-Party External Links)</h2>
            <p>
              हमारे पोर्टल पर दिए गए अधिकांश लिंक्स उपयोगकर्ताओं की सुविधा हेतु अधिकृत सरकारी सर्वर (जैसे .gov.in, .nic.in) से सीधे जोड़े गए हैं। एक बार जब उपयोगकर्ता हमारे पोर्टल से रीडायरेक्ट होकर बाहरी वेबसाइट पर प्रवेश करता है, तो उस सर्वर की उपलब्धता, सुरक्षा, कुकी नीतियों अथवा सामग्री के लिए हमारी कोई जिम्मेदारी नहीं होती।
            </p>
          </section>

          <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldAlert size={18} className="shrink-0 text-slate-500 mt-0.5" />
            <p>
              <strong>विधिक अधिकार क्षेत्र:</strong> BiharFast.in के उपयोग से उत्पन्न होने वाले किसी भी विवाद, दावे अथवा विधिक संदर्भ का निपटारा केवल भारत गणराज्य के विधायी नियमों तथा बिहार राज्य के क्षेत्राधिकार वाले न्यायालयों के अधीन ही विचारणीय होगा।
            </p>
          </section>
        </div>

        <div className="pt-2">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    </div>
  );
}