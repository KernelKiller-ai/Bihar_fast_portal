import PropTypes from "prop-types";
import { Award, Download, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResultLayout({ post }) {
  const resultUrl = post.applyUrl || post.pdfUrl || "#";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Top Header */}
      <header className="bg-linear-to-r from-purple-900 via-indigo-900 to-purple-900 text-white p-5 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono shadow-xs">
            परीक्षा परिणाम (Exam Result)
          </span>
          <Link to="/" className="text-xs text-indigo-200 hover:text-white flex items-center gap-1 font-bold transition">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">{post.title}</h1>
        <p className="text-xs text-indigo-200 mt-1 font-medium">विभाग: {post.department} • परिणाम एवं मेरिट सूची</p>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Scorecard / Merit Download Callout */}
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
            <ShieldCheck size={13} className="text-emerald-600" /> आधिकारिक सर्वर से सत्यापित सूची
          </p>
        </div>

        {/* Next Stages & Cutoff Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <Award size={15} /> चयन प्रक्रिया के आगामी चरण
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>दस्तावेज सत्यापन (Document Verification)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>चिकित्सा जांच (Medical Examination यदि लागू हो)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>अंतिम नियुक्ति पत्र (Final Joining Letter)</span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <FileSpreadsheet size={15} /> कट-ऑफ अंक की जांच कैसे करें?
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              चयनित उम्मीदवार डाउनलोड की गई PDF सूची में <strong>Ctrl + F</strong> दबाकर अपना अनुक्रमांक (Roll Number) या नाम खोजें। कट-ऑफ विवरण सूची के अंत में दिया गया है।
            </p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle size={17} className="shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">
            सफल अभ्यर्थियों को सूचित किया जाता है कि वे सभी मूल शैक्षणिक प्रमाण पत्र, जाति प्रमाण पत्र, और पहचान पत्र तैयार रखें।
          </p>
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
    pdfUrl: PropTypes.string,
  }).isRequired,
};