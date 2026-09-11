import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            विधिक अनुबंध
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            नियम एवं शर्तें (Terms & Conditions of Use)
          </h1>
          <p className="text-slate-500 text-xs mt-1">अंतिम अद्यतन: 2026</p>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. सेवा की स्वीकृति (Binding Acceptance)</h2>
            <p>
              BiharFast.in वेबसाइट अथवा इसके किसी भी टूल, डेटा या सूचना का उपयोग करके आप बिना किसी शर्त इन नियमों एवं शर्तों से पूर्णतः आबद्ध होने की स्वीकृति प्रदान करते हैं। यदि आप इन शर्तों के किसी भी भाग से असहमत हैं, तो आपको इस पोर्टल का उपयोग तत्काल बंद कर देना चाहिए।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. मध्यस्थ संरक्षण (Protection Under Information Technology Act)</h2>
            <p>
              BiharFast.in भारतीय सूचना प्रौद्योगिकी अधिनियम, 2000 (Information Technology Act, 2000) एवं इसके अंतर्गत संशोधित मध्यस्थ दिशा-निर्देशों (Intermediary Guidelines) के तहत एक तटस्थ सूचना मंच (Neutral Information Facilitator) के रूप में कार्य करता है। सार्वजनिक स्रोतों द्वारा प्रसारित विज्ञप्तियों, परिपत्रों या परिणाम तालिकाओं की अंतर्वस्तु के लिए पोर्टल धारा 79 के प्रावधानों के अंतर्गत सुरक्षित है।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. बौद्धिक संपदा एवं सामग्री का उपयोग (Intellectual Property & Fair Use)</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                BiharFast का मूल लोगो, वेबसाइट का सोर्स कोड, UI आर्किटेक्चर, आर्टिकल संरचना तथा इन-हाउस क्लाइंट-साइड टूल्स (Age Calculator, Photo Resizer) हमारी निजी बौद्धिक संपदा हैं।
              </li>
              <li>
                किसी भी तृतीय पक्ष द्वारा बिना पूर्व लिखित अनुमति के इस मंच से थोक डेटा स्क्रैपिंग (Bulk Web Scraping), ऑटोमेटेड डेटा माइनिंग, अथवा व्यावसायिक पुनर्प्रकाशन करना पूर्णतः निषिद्ध एवं कॉपीराइट उल्लंघन माना जाएगा।
              </li>
              <li>
                सभी सरकारी ट्रेडमार्क, लोगो, और आधिकारिक परिपत्र उनके संबंधित विभागों एवं स्वायत्त निकायों की संपत्ति हैं, जिन्हें यहाँ केवल पहचान एवं विधिक संदर्भ हेतु प्रदर्शित किया गया है।
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. पोर्टल की उपलब्धता एवं तकनीकी त्रुटियां (Availability & Downtime)</h2>
            <p>
              हम सर्वर की 24/7 निर्बाध उपलब्धता सुनिश्चित करने का प्रयास करते हैं, किंतु इंटरनेट कनेक्टिविटी में व्यवधान, थर्ड-पार्टी होस्टिंग प्रदाता की खराबी, अथवा नियमित सर्वर रखरखाव के कारण पोर्टल अस्थायी रूप से अनुपलब्ध हो सकता है। ऐसी स्थिति में हुई किसी भी असुविधा या समय-सीमा चूक के लिए पोर्टल पर कोई विधिक क्षतिपूर्ति दावा मान्य नहीं होगा।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. शर्तों में संशोधन का अधिकार (Right to Modify)</h2>
            <p>
              BiharFast.in के पास बिना किसी पूर्व सूचना के इन नियमों एवं शर्तों को अद्यतन अथवा संशोधित करने का अनन्य अधिकार सुरक्षित है। उपयोगकर्ताओं को सलाह दी जाती है कि वे समय-समय पर इस पृष्ठ का पुनरावलोकन करते रहें।
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