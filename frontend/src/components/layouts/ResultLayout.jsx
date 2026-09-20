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
  FileText,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "../ShareAlertBar";

export default function ResultLayout({ post }) {
  if (!post) return null;

  const title = post.title;
  const dept = post.department || "कर्मचारी चयन आयोग (SSC)";
  const lastDate = post.last_date || post.lastDate || "सक्रिय सूचना";
  const resultUrl = post.apply_url || post.applyUrl || post.download_url || post.pdf_url || post.pdfUrl || "#";
  const pdfUrl = post.pdf_url || post.pdfUrl || "#";

  const fullContent = post.content || null;
  const shortDesc = post.short_desc || null;

  const faqs = (Array.isArray(post.faqs) && post.faqs.length > 0) 
    ? post.faqs 
    : (Array.isArray(post.extra_links) && post.extra_links.length > 0 ? post.extra_links : null);

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-[#0F2A4A] via-[#16406E] to-[#0F2A4A] text-white p-6 sm:p-8 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            परीक्षा परिणाम एवं स्कोरकार्ड
          </span>
          <Link 
            to="/" 
            className="text-xs text-sky-200 hover:text-white flex items-center gap-1.5 font-bold transition bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug drop-shadow-xs">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-sky-100 mt-4 pt-3 border-t border-white/10 font-medium">
          <span className="flex items-center gap-1.5">
            <Award size={15} className="text-amber-400" /> विभाग: <strong className="text-white font-bold">{dept}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-400" /> 100% सत्यापित आधिकारिक लिंक
          </span>
        </div>
      </header>

      <div className="p-5 sm:p-8 space-y-7">
        <ShareAlertBar title={title} dept={dept} />

        {/* Action Callout Box */}
        <div className="bg-linear-to-br from-blue-50/90 to-indigo-50/70 border-2 border-blue-200/90 rounded-2xl p-6 text-center space-y-4 shadow-xs">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              Direct Server Access
            </span>
            <p className="text-sm sm:text-base font-black text-slate-900 mt-2">
              आधिकारिक पोर्टल से सीधे फाइनल आंसर-की, रिस्पॉन्स शीट व मार्क्स डाउनलोड करें
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {resultUrl !== "#" && (
              <a
                href={resultUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#0F3966] hover:bg-[#0b2b4d] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <ExternalLink size={16} /> फाइनल आंसर-की / मार्क्स लॉगिन लिंक
              </a>
            )}
            {pdfUrl !== "#" && pdfUrl !== resultUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Download size={16} /> आधिकारिक सूचना (Official PDF)
              </a>
            )}
          </div>

          <p className="text-xs text-slate-600 font-medium pt-1 flex items-center justify-center gap-1.5">
            <Clock size={14} className="text-rose-600" /> 
            अंतिम तिथि / समय-सीमा: <strong className="text-rose-700">{lastDate}</strong>
          </p>
        </div>

        {/* Overview Box */}
        {shortDesc && (
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-black text-[#0F3966] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#0F3966]" />
              संक्षिप्त विवरण (Notification Overview)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {shortDesc}
            </p>
          </section>
        )}

        {/* Full Rich Article Body (With Clean Child Tag Styling) */}
        {fullContent && (
          <section className="border-t border-slate-200 pt-7">
            <div 
              className="
                text-slate-800 text-xs sm:text-sm leading-relaxed space-y-5
                [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:font-black [&_h2]:text-[#0F3966] [&_h2]:border-l-4 [&_h2]:border-amber-500 [&_h2]:pl-3 [&_h2]:mt-6 [&_h2]:mb-2
                [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:my-2.5
                [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:my-3 [&_ul]:pl-2 [&_ul]:bg-slate-50 [&_ul]:p-4 [&_ul]:rounded-xl [&_ul]:border [&_ul]:border-slate-200
                [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2.5 [&_ol]:my-3 [&_ol]:pl-2 [&_ol]:bg-slate-50 [&_ol]:p-4 [&_ol]:rounded-xl [&_ol]:border [&_ol]:border-slate-200
                [&_li]:text-slate-800 [&_li]:leading-relaxed
                [&_strong]:text-slate-950 [&_strong]:font-bold
              "
              dangerouslySetInnerHTML={{ __html: fullContent }} 
            />
          </section>
        )}

        {/* FAQs Modern Accordion-Style Cards */}
        {faqs && (
          <section className="border-t border-slate-200 pt-7 space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0F3966]" />
              अक्सर पूछे जाने वाले सवाल (Frequently Asked Questions)
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {faqs.map((faq, idx) => {
                // Remove redundant prefix if user typed "Question 1:" or "प्र. 1:"
                const rawQ = (faq.q || faq.question || "").replace(/^(question\s*\d+:?|प्र\.\s*\d+:?)/i, "").trim();
                const rawA = faq.a || faq.answer || "";

                return (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition hover:border-slate-300">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                      <span className="bg-[#0F3966] text-white text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <span>{rawQ}</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 pl-7 leading-relaxed font-medium">
                      {rawA}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
    pdf_url: PropTypes.string,
    pdfUrl: PropTypes.string,
    short_desc: PropTypes.string,
    content: PropTypes.string,
    faqs: PropTypes.array,
    extra_links: PropTypes.array,
  }).isRequired,
};