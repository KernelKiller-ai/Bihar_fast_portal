import PropTypes from "prop-types";
import { FileCheck, Clock, ExternalLink, ArrowLeft, ShieldCheck, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function RtpsLayout({ post }) {
  const portalUrl = post.applyUrl || "https://serviceonline.bihar.gov.in";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      <header className="bg-[#0B3B66] text-white p-5 border-b-4 border-emerald-500">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-900 px-2 py-0.5 rounded font-mono">
            RTPS लोक सेवाएं (E-Certificates)
          </span>
          <Link to="/" className="text-xs text-sky-200 hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight">{post.title}</h1>
        <p className="text-xs text-sky-200 mt-1">विभाग: सामान्य प्रशासन विभाग • लोक सेवाओं का अधिकार</p>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Quick Action Buttons */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-3">
          <p className="text-xs font-bold text-emerald-950">आधिकारिक RTPS (ServiceOnline) पोर्टल से आवेदन एवं प्रमाण पत्र डाउनलोड करें</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <ExternalLink size={15} /> नया प्रमाण पत्र ऑनलाइन बनाएं
            </a>
            <a
              href={`${portalUrl}#track`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Search size={15} /> आवेदन की स्थिति (Track Status)
            </a>
          </div>
          <p className="text-[10.5px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> डायरेक्ट डिजिटल हस्ताक्षरित (Digitally Signed) प्रमाण पत्र
          </p>
        </div>

        {/* Requirements & Timelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <Clock size={15} /> सेवा प्रदाय समय सीमा (Time Limit)
            </h3>
            <ul className="space-y-2 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-500 font-medium">निवास प्रमाण पत्र:</span>
                <strong className="text-slate-900">10 कार्य दिवस</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">आय प्रमाण पत्र:</span>
                <strong className="text-slate-900">10 कार्य दिवस</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">जाति / NCL प्रमाण पत्र:</span>
                <strong className="text-slate-900">21 कार्य दिवस</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <FileCheck size={15} /> अनिवार्य दस्तावेज (Required Documents)
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
              <li>स्व-हस्ताक्षरित पासपोर्ट साइज फोटो</li>
              <li>वैध पहचान पत्र (Aadhaar / Voter Card / PAN)</li>
              <li>स्व-घोषणा पत्र (Self-Declaration Form)</li>
              <li>OTP सत्यापन हेतु आधार लिंक्ड मोबाइल नंबर</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

RtpsLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    applyUrl: PropTypes.string,
  }).isRequired,
};