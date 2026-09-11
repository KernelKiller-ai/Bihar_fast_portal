import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            कानूनी सूचना
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            अस्वीकरण (Disclaimer)
          </h1>
          <p className="text-slate-500 text-xs mt-1">अंतिम अद्यतन: 2026</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <p className="text-xs text-amber-900 font-semibold leading-relaxed">
            <strong>महत्वपूर्ण स्पष्टीकरण:</strong> BiharFast Portal किसी भी सरकारी विभाग, मंत्रालय, या भर्ती आयोग (BPSC, CSBC, BPSSC, BTSC आदि) का आधिकारिक पोर्टल नहीं है। यह एक स्वतंत्र सूचना एग्रीगेटर पोर्टल है।
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. सूचना का स्रोत</h2>
          <p>
            इस पोर्टल पर प्रदर्शित सभी सूचनाएं, तिथियां, पीडीएफ परिपत्र और डायरेक्ट लिंक्स संबंधित आयोगों एवं विभागों की अधिकृत सार्वजनिक वेबसाइटों से केवल जनहित व सुविधा के उद्देश्य से संकलित किए जाते हैं।
          </p>

          <h2 className="text-base font-bold text-slate-900">2. प्रामाणिकता एवं सत्यापन</h2>
          <p>
            यद्यपि हम सूचनाओं की सटीकता सुनिश्चित करने का हरसंभव प्रयास करते हैं, फिर भी किसी भी प्रकार की अनजाने में हुई टाइपिंग त्रुटि या विभाग द्वारा किए गए अचानक बदलावों के लिए यह पोर्टल उत्तरदायी नहीं होगा। उम्मीदवारों से निवेदन है कि आवेदन करने या शुल्क जमा करने से पहले अधिकृत सरकारी पीडीएफ अवश्य पढ़ें।
          </p>

          <h2 className="text-base font-bold text-slate-900">3. शुल्क व भुगतान</h2>
          <p>
            BiharFast Portal कभी भी किसी अभ्यर्थी से भर्ती, फॉर्म भरने या नौकरी लगवाने के नाम पर कोई शुल्क नहीं मांगता। समस्त ऑनलाइन आवेदन शुल्क सिर्फ और सिर्फ आयोग के आधिकारिक पेमेंट गेटवे पर ही जमा करें।
          </p>
        </div>

        <div className="pt-4">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    </div>
  );
}