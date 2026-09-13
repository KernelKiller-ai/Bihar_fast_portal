import PropTypes from "prop-types";
import { 
  Award, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  HelpCircle, 
  Clock, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function ResultLayout({ post }) {
  const resultUrl = post.applyUrl || post.download_url || post.pdfUrl || post.pdf_url || "#";
  const title = post.title || "परीक्षा परिणाम एवं कट-ऑफ सूची";
  const dept = post.department || "बिहार सरकार आयोग";

  // Dynamic Content with safe fallbacks
  const shortDesc = post.short_desc || null;
  const stepsToCheck = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 
    ? post.how_to_apply 
    : null;
  const nextStages = Array.isArray(post.selection_process) && post.selection_process.length > 0 
    ? post.selection_process 
    : null;
  const faqs = Array.isArray(post.extra_links) && post.extra_links.length > 0 
    ? post.extra_links 
    : null;

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-purple-950 via-indigo-900 to-purple-950 text-white p-5 border-b-4 border-amber-400">
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
        {/* Dynamic Post Share & Alerts */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Scorecard / Result Download Callout */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 text-center space-y-2">
          <p className="text-xs font-bold text-purple-950">मेरिट लिस्ट एवं चयनित अभ्यर्थियों का रिजल्ट देखें</p>
          <a
            href={resultUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Download size={16} /> रिजल्ट / मेरिट लिस्ट PDF डाउनलोड करें
          </a>
          <p className="text-[10.5px] text-purple-800 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> आधिकारिक आयोग सर्वर से सत्यापित मेरिट लिस्ट
          </p>
        </div>

        {/* Overview Section */}
        <section className="space-y-2 text-xs sm:text-sm text-slate-700">
          <h2 className="font-black text-[#0B3B66] text-sm sm:text-base flex items-center gap-2">
            <FileText size={16} className="text-purple-700" /> परिणाम एवं अधिसूचना विवरण (Overview)
          </h2>
          {shortDesc ? (
            <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 text-slate-800 leading-relaxed font-medium">
              {shortDesc}
            </div>
          ) : (
            <p className="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {dept} द्वारा {title} का आधिकारिक परीक्षा परिणाम एवं चयन सूची जारी कर दी गई है। उम्मीदवार नीचे दिए गए निर्देशों का पालन कर मेरिट सूची में अपना अनुक्रमांक (Roll Number) जांच सकते हैं।
            </p>
          )}
        </section>

        {/* Steps to Check Result */}
        <section className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 text-xs sm:text-sm text-slate-700 space-y-3">
          <h2 className="font-black text-[#0B3B66] text-sm sm:text-base flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-indigo-700" /> रिजल्ट और मेरिट लिस्ट चेक करने की प्रक्रिया
          </h2>
          <ol className="space-y-2.5 list-decimal list-inside pl-1 text-slate-800">
            {stepsToCheck ? (
              stepsToCheck.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))
            ) : (
              <>
                <li className="leading-relaxed">
                  ऊपर दिए गए <strong>&apos;रिजल्ट / मेरिट लिस्ट PDF डाउनलोड करें&apos;</strong> बटन पर क्लिक करके आधिकारिक पीडीएफ डाउनलोड करें।
                </li>
                <li className="leading-relaxed">
                  यदि आप स्मार्टफोन पर देख रहे हैं तो PDF व्यूअर के <strong>Search Icon</strong> पर टैप करें, या डेस्कटॉप पर <strong>Ctrl + F</strong> दबाकर अपना रोल नंबर सर्च करें।
                </li>
                <li className="leading-relaxed">
                  यदि आपका रोल नंबर मेरिट लिस्ट में उपलब्ध है, तो आप आगामी चयन चरण (DV / PET / मुख्य परीक्षा) हेतु सफल घोषित हो चुके हैं।
                </li>
              </>
            )}
          </ol>
        </section>

        {/* Next Stages / Guidelines */}
        <section className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 text-xs sm:text-sm space-y-3">
          <h3 className="font-black flex items-center gap-1.5 text-[#0B3B66] text-sm sm:text-base">
            <Award size={16} className="text-amber-600" /> चयन प्रक्रिया के आगामी चरण एवं आवश्यक निर्देश
          </h3>
          {nextStages ? (
            <ul className="space-y-2 text-slate-800">
              {nextStages.map((stage, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{stage}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>दस्तावेज सत्यापन (Document Verification - DV)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>चिकित्सा परीक्षण (Medical Examination यदि नियमावली अनुसार लागू हो)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>अंतिम अनुशंसा एवं पदस्थापन सूची (Final Appointment)</span>
              </li>
            </ul>
          )}
        </section>

        {/* Frequently Asked Questions (FAQ Section) */}
        {faqs && (
          <section className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 text-xs sm:text-sm space-y-3">
            <h3 className="font-black flex items-center gap-1.5 text-[#0B3B66] text-sm sm:text-base">
              <HelpCircle size={16} className="text-indigo-700" /> परिणाम से जुड़े सामान्य प्रश्नोत्तर (FAQs)
            </h3>
            <div className="space-y-3 divide-y divide-slate-200">
              {faqs.map((faq, idx) => (
                <div key={idx} className={idx === 0 ? "pt-1" : "pt-3"}>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock size={14} className="text-sky-700" />
                    प्र. {faq.q}
                  </h4>
                  <p className="text-slate-600 mt-1 pl-5 leading-relaxed">
                    उत्तर: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
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
    pdf_url: PropTypes.string,
    short_desc: PropTypes.string,
    how_to_apply: PropTypes.arrayOf(PropTypes.string),
    selection_process: PropTypes.arrayOf(PropTypes.string),
    extra_links: PropTypes.arrayOf(
      PropTypes.shape({
        q: PropTypes.string,
        a: PropTypes.string,
      })
    ),
  }).isRequired,
};