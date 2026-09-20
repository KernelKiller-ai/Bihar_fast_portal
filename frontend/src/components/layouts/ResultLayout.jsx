import PropTypes from "prop-types";
import { 
  Award, 
  Download, 
  ExternalLink,
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  HelpCircle, 
  Clock, 
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function ResultLayout({ post }) {
  if (!post) return null;

  const title = post.title;
  const dept = post.department || "बिहार / केंद्रीय भर्ती आयोग";
  const lastDate = post.last_date || post.lastDate || "सक्रिय सूचना";
  const resultUrl = post.apply_url || post.applyUrl || post.download_url || post.pdf_url || post.pdfUrl || "#";
  const pdfUrl = post.pdf_url || post.pdfUrl || "#";

  // Dynamic Content Fields
  const fullContent = post.content || null;
  const shortDesc = post.short_desc || null;
  const stepsToCheck = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 
    ? post.how_to_apply 
    : null;
  const nextStages = Array.isArray(post.selection_process) && post.selection_process.length > 0 
    ? post.selection_process 
    : null;

  // FAQs Priority: post.faqs first, then extra_links
  const faqs = (Array.isArray(post.faqs) && post.faqs.length > 0) 
    ? post.faqs 
    : (Array.isArray(post.extra_links) && post.extra_links.length > 0 ? post.extra_links : null);

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-purple-950 via-indigo-900 to-purple-950 text-white p-5 sm:p-7 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            परीक्षा परिणाम एवं स्कोरकार्ड (Official Result Portal)
          </span>
          <Link 
            to="/" 
            className="text-xs text-indigo-200 hover:text-white flex items-center gap-1 font-bold transition bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow-xs">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-indigo-200 mt-3 font-medium">
          <span className="flex items-center gap-1">
            <Award size={14} className="text-amber-400" /> विभाग: <strong className="text-white font-bold">{dept}</strong>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400" /> 100% सत्यापित आधिकारिक लिंक
          </span>
        </div>
      </header>

      <div className="p-5 sm:p-8 space-y-6">
        <ShareAlertBar title={title} dept={dept} />

        {/* Scorecard / Result Download Callout */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm font-bold text-purple-950">
            आधिकारिक सर्वर से सीधे अपना प्राप्तांक (Marks), फाइनल आंसर-की अथवा मेरिट लिस्ट डाउनलोड करें
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {resultUrl !== "#" && (
              <a
                href={resultUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <ExternalLink size={16} /> रिजल्ट / मार्क्स लॉगिन लिंक
              </a>
            )}
            {pdfUrl !== "#" && pdfUrl !== resultUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <Download size={16} /> आधिकारिक सूचना (Official PDF)
              </a>
            )}
          </div>
          <p className="text-[11px] text-purple-800 font-semibold flex items-center justify-center gap-1">
            <Clock size={13} className="text-purple-600" /> अंतिम तिथि / समय-सीमा: <strong>{lastDate}</strong>
          </p>
        </div>

        {/* Dynamic Content Stream */}
        <div className="space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-8">
          
          {/* 1. Short Description / Overview */}
          {shortDesc && (
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-purple-700" />
                परिणाम एवं अधिसूचना विवरण (Overview)
              </h2>
              <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 text-slate-800 leading-relaxed text-sm">
                {shortDesc}
              </div>
            </section>
          )}

          {/* 2. Full Long-Form Article Body (800+ Words Guide) */}
          {fullContent && (
            <section className="space-y-4 prose max-w-none text-slate-800 leading-relaxed">
              <div 
                className="space-y-4 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fullContent }} 
              />
            </section>
          )}

          {/* 3. Steps to Check Result (Only rendered if present) */}
          {stepsToCheck && (
            <section className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
              <h2 className="font-black text-[#0B3B66] text-base flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-indigo-700" /> 
                रिजल्ट और मेरिट लिस्ट चेक करने की प्रक्रिया
              </h2>
              <ol className="space-y-2 list-decimal list-inside text-slate-800">
                {stepsToCheck.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </section>
          )}

          {/* 4. Next Selection Stages (Only rendered if present) */}
          {nextStages && (
            <section className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
              <h3 className="font-black flex items-center gap-2 text-[#0B3B66] text-base">
                <Award size={18} className="text-amber-600" /> 
                चयन प्रक्रिया के आगामी चरण एवं निर्देश
              </h3>
              <ul className="space-y-2 text-slate-800">
                {nextStages.map((stage, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{stage}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 5. Frequently Asked Questions (Dynamic FAQs) */}
          {faqs && (
            <section className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50 space-y-4">
              <h3 className="font-black flex items-center gap-2 text-[#0B3B66] text-base sm:text-lg">
                <HelpCircle size={18} className="text-indigo-700" /> 
                परिणाम से जुड़े सामान्य प्रश्नोत्तर (Frequently Asked Questions)
              </h3>
              <div className="space-y-3.5 divide-y divide-slate-200">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={idx === 0 ? "pt-1" : "pt-3"}>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock size={14} className="text-sky-700 shrink-0" />
                      प्र. {faq.q || faq.question}
                    </h4>
                    <p className="text-slate-600 mt-1 pl-5 leading-relaxed">
                      उत्तर: {faq.a || faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </article>
  );
}

ResultLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    department: PropTypes.string,
    last_date: PropTypes.string,
    lastDate: PropTypes.string,
    apply_url: PropTypes.string,
    applyUrl: PropTypes.string,
    download_url: PropTypes.string,
    pdf_url: PropTypes.string,
    pdfUrl: PropTypes.string,
    short_desc: PropTypes.string,
    content: PropTypes.string,
    how_to_apply: PropTypes.arrayOf(PropTypes.string),
    selection_process: PropTypes.arrayOf(PropTypes.string),
    faqs: PropTypes.arrayOf(
      PropTypes.shape({
        q: PropTypes.string,
        question: PropTypes.string,
        a: PropTypes.string,
        answer: PropTypes.string,
      })
    ),
    extra_links: PropTypes.array,
  }).isRequired,
};