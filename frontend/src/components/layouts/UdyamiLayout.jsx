import PropTypes from "prop-types";
import { FileText, CheckCircle2, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function UdyamiLayout({ post }) {
  const portalUrl = post.applyUrl || "https://udyami.bihar.gov.in";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      <header className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-800 text-white p-5 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono shadow-xs">
            स्वरोजगार अनुदान (Welfare Scheme)
          </span>
          <Link to="/" className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">{post.title}</h1>
        <p className="text-xs text-emerald-200 mt-1">विभाग: उद्योग विभाग, बिहार सरकार • मुख्यमंत्री उद्यमी योजना</p>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Loan & Subsidy Split Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-700 font-bold block">कुल परियोजना लागत</span>
            <strong className="text-emerald-950 text-base font-black mt-1 block">₹10,00,000 तक</strong>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-700 font-bold block">सरकारी अनुदान (माफ)</span>
            <strong className="text-amber-950 text-base font-black mt-1 block">50% (₹5 लाख तक)</strong>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-blue-700 font-bold block">ऋण वापसी शर्त</span>
            <strong className="text-blue-950 text-xs font-bold mt-1 block leading-tight">
              ब्याजमुक्त (महिला/SC/ST) / 1% (अन्य)
            </strong>
          </div>
        </div>

        {/* Action Callout */}
        <div className="bg-teal-50/70 border-2 border-teal-300 rounded-2xl p-5 text-center space-y-3">
          <p className="text-xs font-bold text-teal-950">मुख्यमंत्री उद्यमी योजना आधिकारिक पोर्टल</p>
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <ExternalLink size={15} /> पोर्टल पर पंजीकरण / लॉगिन करें
          </a>
          <p className="text-[10.5px] text-teal-800 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> चयन पूर्णतः कंप्यूटरीकृत लॉटरी प्रणाली द्वारा
          </p>
        </div>

        {/* Documents & Eligibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <CheckCircle2 size={15} className="text-emerald-600" /> पात्रता (Eligibility)
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li>बिहार का स्थायी निवासी होना अनिवार्य।</li>
              <li>न्यूनतम 10+2 (इंटरमीडिएट), ITI या पॉलिटेक्निक उत्तीर्ण।</li>
              <li>आयु सीमा: 18 वर्ष से 50 वर्ष के मध्य।</li>
              <li>व्यक्तिगत या प्रोपराइटरशिप बैंक खाता चालू स्थिति में हो।</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <FileText size={15} className="text-[#0B3B66]" /> अनिवार्य कागजात
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
              <li>मैट्रिक व इंटरमीडिएट अंक पत्र / प्रमाण पत्र</li>
              <li>जाति प्रमाण पत्र एवं स्थायी निवास प्रमाण पत्र</li>
              <li>आय प्रमाण पत्र एवं पैन कार्ड</li>
              <li>रद्द किया गया चेक (Cancelled Cheque)</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

UdyamiLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    applyUrl: PropTypes.string,
  }).isRequired,
};