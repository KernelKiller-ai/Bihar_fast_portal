import PropTypes from "prop-types";
import { Calendar, AlertTriangle, Download, FileCheck, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdmitCardLayout({ post }) {
  const downloadUrl = post.applyUrl || post.pdfUrl || "#";

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
        <h1 className="text-xl sm:text-2xl font-black leading-tight">{post.title}</h1>
        <p className="text-xs text-sky-200 mt-1">विभाग: {post.department} • परीक्षा केंद्र प्रवेश सूचना</p>
      </header>

      <div className="p-5 space-y-5">
        {/* Direct Download Callout */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 text-center">
          <p className="text-xs font-bold text-emerald-900 mb-2">आधिकारिक सर्वर से प्रवेश पत्र डाउनलोड करें</p>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow transition active:scale-95"
          >
            <Download size={16} /> डाउनलोड एडमिट कार्ड (Server Link)
          </a>
          <p className="text-[10px] text-emerald-700 font-semibold mt-2 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> डायरेक्ट ऑफिशियल लिंक • नो फेक रीडायरेक्ट
          </p>
        </div>

        {/* Schedule & Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <Calendar size={15} /> परीक्षा कार्यक्रम (Schedule)
            </h3>
            <ul className="space-y-2 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-500 font-medium">परीक्षा तिथि / स्थिति:</span>
                <strong className="text-slate-900">{post.lastDate || "अधिसूचना देखें"}</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">रिपोर्टिंग समय:</span>
                <strong className="text-slate-900">एडमिट कार्ड पर देखें</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">परीक्षा केंद्र:</span>
                <strong className="text-slate-900">एडमिट कार्ड स्लिप पर अंकित</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66]">
              <FileCheck size={15} /> केंद्र पर अनिवार्य दस्तावेज
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
              <li>प्रिंटेड ई-एडमिट कार्ड (Color / Black & White)</li>
              <li>मूल फोटो पहचान पत्र (Voter ID / PAN / Govt ID)</li>
              <li>2 पासपोर्ट साइज हालिया रंगीन फोटो</li>
              <li>पारदर्शी नीला/काला बॉल पेन (यदि लागू हो)</li>
            </ul>
          </div>
        </div>

        {/* Advisory Box */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">
            उम्मीदवारों को सलाह दी जाती है कि वे परीक्षा शुरू होने से कम से कम 1 घंटा पूर्व केंद्र पर पहुंचे। मुख्य द्वार बंद होने के बाद किसी भी परिस्थिति में प्रवेश की अनुमति नहीं होगी।
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
    applyUrl: PropTypes.string,
    pdfUrl: PropTypes.string,
  }).isRequired,
};