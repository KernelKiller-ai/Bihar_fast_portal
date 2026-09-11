import { ShieldCheck, Zap, Users, Target, HeartHandshake, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        
        <header className="border-b border-slate-100 pb-6">
          <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-[#0B4F8A] px-3 py-1 rounded-full border border-blue-200">
            About BiharFast Platform
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            हमारे बारे में (About BiharFast.in)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            सटीक सूचना, पारदर्शी मार्गदर्शन • A Community-Driven Information Hub
          </p>
        </header>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          <p>
            <strong className="text-slate-900">BiharFast.in</strong> बिहार राज्य के युवाओं, प्रतियोगी छात्रों तथा आम नागरिकों को समर्पित एक स्वतंत्र, आधुनिक एवं सुगम सार्वजनिक सूचना मंच है। इस मंच की स्थापना का प्राथमिक उद्देश्य राज्य एवं केंद्र सरकार द्वारा समय-समय पर जारी की जाने वाली विभिन्न प्रतियोगी परीक्षाओं, भर्ती प्रक्रियाओं, एडमिट कार्ड, परीक्षा परिणाम तथा जनकल्याणकारी योजनाओं की जटिल अधिसूचनाओं को सरल, स्पष्ट एवं अविलंब रूप में जन-जन तक पहुंचाना है।
          </p>
          <p>
            वर्तमान समय में इंटरनेट पर फैली भ्रामक जानकारियों, क्लिकबेट थंबनेल्स और भारी विज्ञापनों से भरे धीमे पोर्टल्स के कारण ग्रामीण क्षेत्रों के छात्रों को समय पर सटीक जानकारी जुटाने में भारी कठिनाई का सामना करना पड़ता है। BiharFast को इसी समस्या के समाधान के रूप में विकसित किया गया है — एक ऐसा अल्ट्रा-फास्ट वेब पोर्टल जो धीमी इंटरनेट स्पीड पर भी सेकंडों में लोड होकर केवल काम की और सत्यापित जानकारी प्रदर्शित करता है।
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-[#0B4F8A] text-white flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">केवल अधिकृत लिंक्स</h3>
            <p className="text-xs text-slate-500 mt-1">प्रत्येक भर्ती का लिंक सीधे विभाग अथवा NIC के आधिकारिक सर्वर से जुड़ा होता है।</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Zap size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">अल्ट्रा-फास्ट PWA आर्किटेक्चर</h3>
            <p className="text-xs text-slate-500 mt-1">आधुनिक वेब मानकों पर निर्मित, जो न्यूनतम डेटा और बैटरी खपत में कार्य करता है।</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-3">
              <Users size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">छात्र-केंद्रित दृष्टिकोण</h3>
            <p className="text-xs text-slate-500 mt-1">जटिल सरकारी विज्ञापनों का आसान हिंदी में सारांश, ताकि हर छात्र आसानी से समझ सके।</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Target size={18} className="text-[#0B4F8A]" /> हमारा विजन एवं लक्ष्य
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            हमारा लक्ष्य राज्य के दूरदराज के गांवों से लेकर शहरों तक के प्रत्येक अभ्यर्थी के लिए सूचना की खाई को पाटना है। चाहे वह BPSC, CSBC, BPSSC, SSC, रेलवे की तैयारी कर रहा हो अथवा मुख्यमंत्री उद्यमी योजना जैसी स्वरोजगार योजना का लाभ लेना चाहता हो — BiharFast एक निष्पक्ष, पारदर्शी और व्यवस्थित कैटलॉग की भूमिका निभाता है।
          </p>
        </section>

        <section className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <HeartHandshake size={20} className="shrink-0 text-amber-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-black text-amber-900 mb-1">सार्वजनिक एवं विधिक स्थिति (Legal Clarity):</strong>
            BiharFast.in पूर्णतः स्वतंत्र तकनीकी एवं शैक्षणिक शोधकर्ताओं द्वारा संचालित एक सूचना मंच है। हमारा किसी भी राजनीतिक दल, सरकारी एजेंसी अथवा आयोग से कोई प्रत्यक्ष संबंध नहीं है। हम कोई भी सरकारी सेवा प्रदान करने का दावा नहीं करते, बल्कि केवल आधिकारिक सार्वजनिक डोमेन में उपलब्ध सूचनाओं का प्रसार करते हैं।
          </div>
        </section>

        <div className="pt-2">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>

      </div>
    </main>
  );
}