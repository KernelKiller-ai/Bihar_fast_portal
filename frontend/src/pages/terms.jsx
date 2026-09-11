import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            नियम एवं शर्तें
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            नियम व शर्तें (Terms & Conditions)
          </h1>
          <p className="text-slate-500 text-xs mt-1">अंतिम अद्यतन: 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. सेवा की स्वीकृति</h2>
          <p>
            BiharFast पोर्टल का उपयोग करके आप इन नियमों व शर्तों से बाध्य होने की सहमति देते हैं। यदि आप इन शर्तों से असहमत हैं, तो पोर्टल का उपयोग न करें।
          </p>

          <h2 className="text-base font-bold text-slate-900">2. बौद्धिक संपदा अधिकार</h2>
          <p>
            BiharFast का लोगो, डिज़ाइन, ब्रांडिंग और कस्टम साइबर टूल्स इस पोर्टल की बौद्धिक संपदा हैं। सरकारी परिपत्र, अधिसूचनाएं और आयोगों के लोगो उनके संबंधित सरकारी विभागों की संपत्ति हैं।
          </p>

          <h2 className="text-base font-bold text-slate-900">3. अनुचित उपयोग पर प्रतिबंध</h2>
          <p>
            पोर्टल पर किसी भी प्रकार का स्वचालित बॉट अटैक, डेटा स्क्रैपिंग या अनधिकृत हस्तक्षेप करना वर्जित है जिससे पोर्टल के सामान्य संचालन में बाधा पहुंचे।
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