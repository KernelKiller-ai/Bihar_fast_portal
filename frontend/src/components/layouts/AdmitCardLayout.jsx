import PropTypes from "prop-types";
import { Calendar, AlertTriangle, Download, FileCheck, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function AdmitCardLayout({ post }) {
  const downloadUrl = post.applyUrl || post.pdfUrl || "#";
  const title = post.title || "प्रवेश पत्र डाउनलोड";
  const dept = post.department || "बिहार परीक्षा बोर्ड";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Top Header */}
      <header className="bg-[#0B3B66] text-white p-5 border-b-4 border-amber-500">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-mono">
            प्रवेश पत्र (Admit Card)
          </span>
          <Link to="/" className="text-xs text-sky-200 hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight">{title}</h1>
        <p className="text-xs text-sky-200 mt-1">विभाग: {dept} • परीक्षा केंद्र एवं रोल नंबर विवरण</p>
      </header>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Dynamic Post Share & Telegram/WhatsApp Channels */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Direct Download Callout */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 text-center">
          <p className="text-xs font-bold text-emerald-900 mb-2">आधिकारिक सर्वर से सीधा प्रवेश पत्र डाउनलोड करें</p>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow transition active:scale-95"
          >
            <Download size={16} /> डाउनलोड एडमिट कार्ड (Official Direct Server)
          </a>
          <p className="text-[10px] text-emerald-700 font-semibold mt-2 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" /> आधिकारिक लिंक • नो थर्ड-पार्टी रीडायरेक्ट
          </p>
        </div>

        {/* Schedule & Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <Calendar size={15} /> परीक्षा कार्यक्रम (Exam Schedule)
            </h3>
            <ul className="space-y-2 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-500 font-medium">परीक्षा तिथि / स्थिति:</span>
                <strong className="text-slate-900">{post.lastDate || post.last_date || "आधिकारिक सूचना देखें"}</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">रिपोर्टिंग समय:</span>
                <strong className="text-slate-900">एडमिट कार्ड स्लिप पर अंकित</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">परीक्षा केंद्र:</span>
                <strong className="text-slate-900">आवंटित जिला व केंद्र</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <FileCheck size={15} /> परीक्षा केंद्र पर ले जाने हेतु दस्तावेज
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
              <li>साफ प्रिंटेड ई-एडमिट कार्ड (A4 साइज)</li>
              <li>मूल फोटो पहचान पत्र (Voter ID / PAN / Driving License)</li>
              <li>2 हालिया पासपोर्ट साइज रंगीन फोटोग्राफ</li>
              <li>पारदर्शी नीला या काला बॉल पेन</li>
            </ul>
          </div>
        </div>

        {/* Step-by-Step Instructions (AdSense Rich-Text) */}
        <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-black text-slate-900">एडमिट कार्ड डाउनलोड करने की चरणबद्ध प्रक्रिया</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>ऊपर दिए गए <strong>&quot;डाउनलोड एडमिट कार्ड&quot;</strong> आधिकारिक सर्वर लिंक पर क्लिक करें।</li>
            <li>लॉगिन पृष्ठ पर अपना रजिस्ट्रेशन नंबर / रोल नंबर तथा जन्म तिथि (DD/MM/YYYY) अथवा पासवर्ड दर्ज करें।</li>
            <li>स्क्रीन पर प्रदर्शित सुरक्षा कैप्चा कोड भरकर &apos;Submit&apos; बटन पर क्लिक करें।</li>
            <li>आपका एडमिट कार्ड स्क्रीन पर प्रदर्शित हो जाएगा। उसमें अपना नाम, पिता का नाम, परीक्षा केंद्र और तिथि का मिलान कर लें।</li>
            <li>भविष्य के संदर्भ हेतु एडमिट कार्ड का 2 रंगीन प्रिंटआउट अवश्य निकाल लें।</li>
          </ol>
        </section>

        {/* Advisory Box */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">
            उम्मीदवारों को सलाह दी जाती है कि वे परीक्षा शुरू होने से कम से कम 1 घंटा पूर्व केंद्र पर पहुंचे। मुख्य द्वार बंद होने के बाद किसी भी परिस्थिति में परीक्षा हॉल में प्रवेश की अनुमति नहीं होगी।
          </p>
        </div>
      </div>
    </article>
  );
}

AdmitCardLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    department: PropTypes.string,
    lastDate: PropTypes.string,
    last_date: PropTypes.string,
    applyUrl: PropTypes.string,
    pdfUrl: PropTypes.string,
  }).isRequired,
};