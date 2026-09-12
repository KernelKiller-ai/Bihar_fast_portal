import PropTypes from "prop-types";
import { Award, Download, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function ResultLayout({ post }) {
  const resultUrl = post.applyUrl || post.download_url || post.pdfUrl || "#";
  const title = post.title || "परीक्षा परिणाम एवं कट-ऑफ सूची";
  const dept = post.department || "बिहार सरकार आयोग";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      <header className="bg-linear-to-r from-purple-900 via-indigo-900 to-purple-900 text-white p-5 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono shadow-xs">
            परीक्षा परिणाम (Exam Result)
          </span>
          <Link to="/" className="text-xs text-indigo-200 hover:text-white flex items-center gap-1 font-bold transition">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">{title}</h1>
        <p className="text-xs text-indigo-200 mt-1 font-medium">विभाग: {dept} • परिणाम एवं मेरिट सूची</p>
      </header>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Dynamic Post Share & Telegram/WhatsApp Channels */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Scorecard Download Callout */}
        <div className="bg-purple-50 border-2 border-purple-400 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-purple-950 mb-2">मेरिट लिस्ट एवं चयनित अभ्यर्थियों का रिजल्ट देखें</p>
          <a
            href={resultUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Download size={16} /> रिजल्ट / मेरिट लिस्ट PDF डाउनलोड करें
          </a>
          <p className="text-[10.5px] text-purple-800 font-semibold mt-2 flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> आधिकारिक आयोग सर्वर से सत्यापित मेरिट लिस्ट
          </p>
        </div>

        {/* Steps to Check Result */}
        <section className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs sm:text-sm text-slate-700 space-y-2">
          <h2 className="font-black text-[#0B3B66] text-sm sm:text-base flex items-center gap-2">
            <FileSpreadsheet size={16} /> रिजल्ट और कट-ऑफ चेक करने की विधि
          </h2>
          <p className="leading-relaxed">
            1. ऊपर दिए गए <strong>&apos;रिजल्ट / मेरिट लिस्ट PDF डाउनलोड करें&apos;</strong> बटन पर क्लिक करके आधिकारिक पीडीएफ खोलें।
          </p>
          <p className="leading-relaxed">
            2. यदि आप मोबाइल में देख रहे हैं तो PDF व्यूअर के <strong>Search Icon</strong> पर क्लिक करें, या कंप्यूटर पर <strong>Ctrl + F</strong> दबाकर अपना रोल नंबर टाइप करें।
          </p>
          <p className="leading-relaxed">
            3. यदि आपका रोल नंबर हाइलाइट होता है, तो आपका चयन अगले चरण (दस्तावेज सत्यापन / मुख्य परीक्षा) हेतु सफल घोषित हुआ है।
          </p>
        </section>

        {/* Next Stages */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs">
          <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
            <Award size={15} /> चयन प्रक्रिया के आगामी चरण (Next Selection Stages)
          </h3>
          <ul className="space-y-2 text-slate-700 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>दस्तावेज सत्यापन (Document Verification - DV)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>चिकित्सा जांच (Medical Examination यदि लागू हो)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>अंतिम नियुक्ति पत्र (Final Appointment Letter)</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}

ResultLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    department: PropTypes.string,
    applyUrl: PropTypes.string,
    download_url: PropTypes.string,
    pdfUrl: PropTypes.string,
  }).isRequired,
};