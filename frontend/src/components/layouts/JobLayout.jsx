import PropTypes from "prop-types";
import { 
  Calendar, 
  GraduationCap, 
  ExternalLink, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  Users 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function JobLayout({ post }) {
  const applyLink = post.applyUrl || post.link || "#";
  const pdfLink = post.pdfUrl || "#";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Top Header */}
      <header className="bg-linear-to-r from-[#073663] via-[#0B4F8A] to-[#073663] text-white p-5 sm:p-6 border-b-4 border-amber-500">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono shadow-xs">
            सरकारी भर्ती (Govt Job)
          </span>
          <Link to="/" className="text-xs text-sky-200 hover:text-white flex items-center gap-1 font-bold transition">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">{post.title}</h1>
        <p className="text-xs text-sky-200 mt-1 font-medium">विभाग: {post.department} • आधिकारिक रोजगार सूचना</p>
      </header>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Important Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block">कुल पद (Total Posts)</span>
            <strong className="text-slate-900 text-sm font-black mt-0.5 block">{post.totalPosts || "विभागीय सूचना देखें"}</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block">अंतिम तिथि (Last Date)</span>
            <strong className="text-rose-600 text-sm font-black mt-0.5 block">{post.lastDate || "सक्रिय सूचना"}</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block">योग्यता (Eligibility)</span>
            <strong className="text-slate-900 text-xs font-bold mt-0.5 block leading-tight">{post.eligibility || "विज्ञापन पीडीएफ देखें"}</strong>
          </div>
        </div>

        {/* Detailed Info Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <Calendar size={15} /> महत्वपूर्ण तिथियां (Important Dates)
            </h3>
            <ul className="space-y-2 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-500 font-medium">आवेदन प्रारंभ:</span>
                <strong className="text-slate-900">विभागीय पोर्टल पर देखें</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">आवेदन की अंतिम तिथि:</span>
                <strong className="text-slate-900">{post.lastDate || "यथाशीघ्र"}</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">परीक्षा तिथि:</span>
                <strong className="text-slate-900">यथासमय सूचित की जाएगी</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <GraduationCap size={15} /> पात्रता एवं शैक्षणिक विवरण
            </h3>
            <div className="space-y-2">
              <p className="text-slate-700 font-medium leading-relaxed">
                {post.qualification_details || post.eligibility || "उम्मीदवार आधिकारिक अधिसूचना में दिए गए नियमों को ध्यानपूर्वक पढ़ें।"}
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-1 text-slate-500 font-semibold">
                <Users size={13} className="text-slate-400" /> आयु सीमा में छूट बिहार सरकार के नियमानुसार मान्य।
              </div>
            </div>
          </div>
        </div>

        {/* Direct Action Hub */}
        <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-5 text-center space-y-3">
          <p className="text-xs font-bold text-blue-950">आधिकारिक लिंक से सीधे आवेदन करें एवं नोटिफिकेशन डाउनलोड करें</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={applyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#0B4F8A] hover:bg-[#073663] text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <ExternalLink size={15} /> ऑनलाइन आवेदन करें (Apply Online)
            </a>
            {pdfLink !== "#" && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Download size={15} /> आधिकारिक विज्ञापन (PDF)
              </a>
            )}
          </div>
          <p className="text-[10.5px] text-blue-800/80 font-medium flex items-center justify-center gap-1 pt-1">
            <ShieldCheck size={13} className="text-emerald-600" /> केवल आधिकारिक NIC एवं विभागीय सर्वर लिंक
          </p>
        </div>
      </div>
    </article>
  );
}

JobLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    department: PropTypes.string,
    totalPosts: PropTypes.string,
    lastDate: PropTypes.string,
    eligibility: PropTypes.string,
    qualification_details: PropTypes.string,
    applyUrl: PropTypes.string,
    link: PropTypes.string,
    pdfUrl: PropTypes.string,
  }).isRequired,
};