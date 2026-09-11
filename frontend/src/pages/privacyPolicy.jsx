import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            डेटा सुरक्षा एवं कुकी नीति
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <p className="text-slate-500 text-xs mt-1">अंतिम अद्यतन: 2026</p>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. व्यक्तिगत डेटा संग्रह न करने की नीति (Zero Sensitive Data Collection)</h2>
            <p>
              BiharFast.in पर सामान्य पठन अथवा नोटिफिकेशन एक्सेस करने के लिए किसी प्रकार के व्यक्तिगत पंजीकरण, आधार संख्या, पैन कार्ड, बैंक खाता या पासवर्ड की आवश्यकता नहीं होती। हम उपयोगकर्ताओं का कोई भी संवेदनशील व्यक्तिगत डेटा (Personally Identifiable Information - PII) अपने सर्वर पर न तो मांगते हैं और न ही स्थायी रूप से संग्रहित करते हैं।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. गूगल एडसेंस एवं तृतीय-पक्ष विज्ञापनदाता (Google AdSense & DoubleClick DART Cookies)</h2>
            <p>
              यह वेबसाइट विज्ञापन सेवा हेतु <strong>Google AdSense</strong> सहित तृतीय-पक्ष विज्ञापन नेटवर्क का उपयोग कर सकती है।
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                गूगल, एक तृतीय-पक्ष विक्रेता के रूप में, इस वेबसाइट पर विज्ञापनों को प्रदर्शित करने के लिए कुकीज़ (जैसे DART कुकी) का उपयोग करता है।
              </li>
              <li>
                DART कुकी का उपयोग गूगल एवं उसके भागीदारों को हमारे उपयोगकर्ताओं द्वारा इस साइट तथा इंटरनेट पर अन्य साइटों पर उनकी विजिट के आधार पर प्रासंगिक विज्ञापन दिखाने में सक्षम बनाता है।
              </li>
              <li>
                उपयोगकर्ता गूगल विज्ञापन सेटिंग्स अथवा 
                <a 
                  href="https://policies.google.com/technologies/ads" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 underline font-semibold ml-1"
                >
                  Google Privacy & Terms
                </a> पर जाकर रुचि-आधारित विज्ञापनों हेतु DART कुकी के उपयोग से ऑप्ट-आउट (सहमति वापस) कर सकते हैं।
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. क्लाइंट-साइड स्मार्ट टूल्स प्राइवेसी गारंटी (Photo & Signature Resizer)</h2>
            <p>
              पोर्टल पर उपलब्ध ऑनलाइन टूल्स (जैसे Photo & Signature Resizer अथवा Age Calculator) शत-प्रतिशत <strong>क्लाइंट-साइड (Client-Side HTML5 Canvas / WebAssembly)</strong> तकनीक पर आधारित हैं। इसका अर्थ यह है कि आपकी कोई भी तस्वीर, हस्ताक्षर या व्यक्तिगत इनपुट किसी रिमोट सर्वर पर अपलोड नहीं होता। सारी प्रोसेसिंग आपके स्वयं के ब्राउज़र मेमोरी में संपन्न होती है तथा टैब बंद होते ही डेटा स्वतः समाप्त हो जाता है।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. लॉग फाइल्स एवं वेब एनालिटिक्स (Log Files & Analytics)</h2>
            <p>
              अधिकांश मानक सर्वरों की भांति, हमारी होस्टिंग अवसंरचना (Vercel / Cloudflare) गैर-व्यक्तिगत तकनीकी डेटा जैसे इंटरनेट प्रोटोकॉल (IP) एड्रेस, ब्राउज़र प्रकार, इंटरनेट सेवा प्रदाता (ISP), रेफ़रिंग/एग्जिट पेजेस, एवं विज़िट टाइमस्टैम्प को केवल सुरक्षा ऑडिट, डीडीओएस रोकथाम तथा साइट परफॉरमेंस अनुकूलन हेतु स्वतः लॉग कर सकती है।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. बच्चों की ऑनलाइन सुरक्षा (Children&apos;s Privacy Protection)</h2>
            <p>
              हम 13 वर्ष से कम आयु के बच्चों से जानबूझकर कोई भी व्यक्तिगत पहचान योग्य जानकारी एकत्रित नहीं करते हैं। यदि किसी अभिभावक को यह ज्ञात होता है कि उनके बच्चे ने अनजाने में हमें कोई विवरण प्रदान किया है, तो वे तुरंत हमसे संपर्क कर सकते हैं ताकि उस डेटा को तुरंत हटाया जा सके।
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