import PropTypes from "prop-types";
import { Search, ExternalLink, ArrowLeft, ShieldCheck, MapPin, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function BiharBhumiLayout({ post }) {
  const portalUrl = post.applyUrl || "https://biharbhumi.bihar.gov.in";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      <header className="bg-linear-to-r from-[#5B3924] via-[#78482A] to-[#5B3924] text-white p-5 border-b-4 border-amber-500">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono shadow-xs">
            राजस्व एवं भूमि सुधार (Land Records)
          </span>
          <Link to="/" className="text-xs text-amber-200 hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight">{post.title}</h1>
        <p className="text-xs text-amber-200 mt-1">विभाग: राजस्व एवं भूमि सुधार विभाग, बिहार • डिजिटल भू-अभिलेख पोर्टल</p>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Quick Portal Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <a
            href="https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi3.aspx"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition group flex items-start gap-3"
          >
            <div className="p-2.5 bg-[#78482A] text-white rounded-lg group-hover:scale-105 transition shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">जमाबंदी पंजी देखें (Jamabandi)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">खाता, खेसरा, जमाबंदी संख्या एवं पृष्ठ संख्या से खोजें</p>
            </div>
          </a>

          <a
            href="https://www.biharbhumi.bihar.gov.in/Biharbhumi/DakhilKharij/PublicReport.aspx"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition group flex items-start gap-3"
          >
            <div className="p-2.5 bg-emerald-700 text-white rounded-lg group-hover:scale-105 transition shrink-0">
              <Search size={18} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">दाखिल खारिज स्थिति (Mutation Status)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">केस नंबर या डीड नंबर डालकर स्टेटस ट्रैक करें</p>
            </div>
          </a>
        </div>

        {/* Direct Link to Main Portal */}
        <div className="bg-amber-50/60 border border-amber-300 rounded-2xl p-5 text-center space-y-2.5">
          <p className="text-xs font-bold text-amber-950">भू-लगान भुगतान (Online Tax Payment) एवं परिमार्जन पोर्टल</p>
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#78482A] hover:bg-[#5B3924] text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition active:scale-95"
          >
            <ExternalLink size={15} /> बिहार भूमि आधिकारिक पोर्टल पर जाएं
          </a>
          <p className="text-[10.5px] text-amber-800 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> सीधे बिहार सरकार के आधिकारिक सर्वर से कनेक्टेड
          </p>
        </div>

        {/* Guidelines */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs">
          <h3 className="font-black flex items-center gap-1.5 mb-2 text-[#0B3B66]">
            <MapPin size={15} /> आवश्यक जानकारी खोजने हेतु
          </h3>
          <p className="text-slate-600 leading-relaxed font-medium">
            ऑनलाइन जमाबंदी या भू-लगान रसीद देखने से पहले अपना <strong>जिला</strong>, <strong>अंचल (Block)</strong>, एवं <strong>मौजा / हल्का</strong> का चयन करें।
          </p>
        </div>
      </div>
    </article>
  );
}

BiharBhumiLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    applyUrl: PropTypes.string,
  }).isRequired,
};