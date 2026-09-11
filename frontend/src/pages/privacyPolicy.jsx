import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            गोपनीयता नीति
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            प्राइवेसी पॉलिसी (Privacy Policy)
          </h1>
          <p className="text-slate-500 text-xs mt-1">अंतिम अद्यतन: 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. सूचनाओं का संकलन</h2>
          <p>
            हम अपने सामान्य पाठकों से कोई भी व्यक्तिगत डेटा (जैसे पहचान संख्या, बैंक विवरण, या पासवर्ड) न तो मांगते हैं और न ही स्टोर करते हैं। यदि आप हमसे संपर्क करते हैं, तो सिर्फ आपका नाम और ईमेल पता समाधान हेतु उपयोग किया जाता है।
          </p>

          <h2 className="text-base font-bold text-slate-900">2. स्मार्ट टूल्स प्राइवेसी (Photo Resizer & Age Calculator)</h2>
          <p>
            हमारे पोर्टल पर उपलब्ध <strong>फोटो & हस्ताक्षर रिसाइज़र</strong> पूरी तरह से ब्राउज़र-बेस्ड (Client-Side) कार्य करता है। आपकी कोई भी फोटो हमारे सर्वर पर अपलोड या सेव नहीं होती। प्रक्रिया पूर्ण होते ही डेटा आपके डिवाइस की मेमोरी से स्वतः हट जाता है।
          </p>

          <h2 className="text-base font-bold text-slate-900">3. कुकीज़ एवं गूगल एडसेंस (Cookies & Google AdSense)</h2>
          <p>
            यह वेबसाइट तीसरे पक्ष के विज्ञापनदाताओं (जैसे Google AdSense) का उपयोग कर सकती है, जो उपयोगकर्ताओं की रुचि के अनुकूल प्रासंगिक विज्ञापन प्रदर्शित करने हेतु DART कुकीज़ का उपयोग कर सकते हैं। आप चाहें तो अपने ब्राउज़र सेटिंग्स से कुकीज़ को बंद कर सकते हैं।
          </p>

          <h2 className="text-base font-bold text-slate-900">4. बाहरी वेबसाइटों के लिंक्स (External Links)</h2>
          <p>
            हमारे पोर्टल पर बिहार सरकार की विभिन्न अधिकृत वेबसाइटों के लिंक्स दिए गए हैं। उन बाहरी पोर्टलों की गोपनीयता नीतियां अलग हो सकती हैं, जिनके संचालन पर हमारा नियंत्रण नहीं है।
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