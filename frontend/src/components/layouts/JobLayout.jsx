import PropTypes from "prop-types";
import { 
  Calendar, 
  GraduationCap, 
  ExternalLink, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  Users,
  CheckCircle2,
  FileText,
  HelpCircle,
  Clock,
  Briefcase,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function JobLayout({ post }) {
  if (!post) return null;

  const title = post.title;
  const dept = post.department || null;
  const totalPosts = post.total_posts || post.totalPosts || null;
  const lastDate = post.last_date || post.lastDate || null;
  const eligibility = post.eligibility || null;
  const applyLink = post.apply_url || post.applyUrl || "#";
  const pdfLink = post.pdf_url || post.pdfUrl || "#";

  // Dynamic Content Fields from Supabase
  const fullContent = post.content || null;
  const shortDesc = post.short_desc || null;
  const howToApply = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 ? post.how_to_apply : null;
  const selectionProcess = Array.isArray(post.selection_process) && post.selection_process.length > 0 ? post.selection_process : null;
  
  // Dynamic FAQs
  const faqs = (Array.isArray(post.faqs) && post.faqs.length > 0) 
    ? post.faqs 
    : (Array.isArray(post.extra_links) && post.extra_links.length > 0 ? post.extra_links : null);

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-[#0F2A4A] via-[#16406E] to-[#0F2A4A] text-white p-6 sm:p-8 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            सरकारी भर्ती (Live Recruitment)
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
          {dept && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={15} className="text-amber-400" /> 
              विभाग: <strong className="text-white font-bold">{dept}</strong>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-400" /> प्रमाणित आधिकारिक अधिसूचना
          </span>
        </div>
      </header>

      <div className="p-5 sm:p-8 space-y-7">
        <ShareAlertBar title={title} dept={dept || ""} />

        {/* Dynamic Highlights Grid (Only rendered when data exists) */}
        {(totalPosts || lastDate || eligibility) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {totalPosts && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <Users size={18} className="text-[#0F3966] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">कुल पद (Vacancies)</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{totalPosts}</p>
                </div>
              </div>
            )}

            {lastDate && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <Calendar size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">अंतिम तिथि (Last Date)</p>
                  <p className="text-sm font-black text-rose-900 mt-0.5">{lastDate}</p>
                </div>
              </div>
            )}

            {eligibility && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <GraduationCap size={18} className="text-[#0F3966] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">अनिवार्य योग्यता</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">{eligibility}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Callout Hub */}
        {(applyLink !== "#" || pdfLink !== "#") && (
          <div className="bg-linear-to-br from-blue-50/90 to-indigo-50/70 border-2 border-blue-200/90 rounded-2xl p-6 text-center space-y-4 shadow-xs">
            <p className="text-sm sm:text-base font-black text-slate-900">
              सीधे आधिकारिक पोर्टल से ऑनलाइन आवेदन करें अथवा अधिसूचना पीडीएफ डाउनलोड करें
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {applyLink !== "#" && (
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0F3966] hover:bg-[#0b2b4d] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  <ExternalLink size={16} /> ऑनलाइन आवेदन करें (Apply Online)
                </a>
              )}
              {pdfLink !== "#" && (
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Download size={16} /> आधिकारिक विज्ञापन (Official PDF)
                </a>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Overview */}
        {shortDesc && (
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-black text-[#0F3966] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#0F3966]" />
              संक्षिप्त विवरण (Recruitment Overview)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {shortDesc}
            </p>
          </section>
        )}

        {/* Full Rich Article Body (With Child Tag Styling) */}
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

        {/* Dynamic Step-by-Step Guide (From Database Array) */}
        {howToApply && (
          <section className="border-t border-slate-200 pt-7 space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              ऑनलाइन आवेदन की चरणबद्ध प्रक्रिया (Application Steps)
            </h2>
            <ol className="space-y-2.5 list-decimal list-inside bg-slate-50 border border-slate-200 p-5 rounded-xl">
              {howToApply.map((step, idx) => (
                <li key={idx} className="text-slate-800 font-medium leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Dynamic Selection Process (From Database Array) */}
        {selectionProcess && (
          <section className="border-t border-slate-200 pt-7 space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-[#0F3966]" />
              चयन प्रक्रिया एवं परीक्षा प्रारूप (Selection Criteria)
            </h2>
            <ul className="space-y-2 list-disc list-inside bg-slate-50 border border-slate-200 p-5 rounded-xl text-slate-800">
              {selectionProcess.map((item, idx) => (
                <li key={idx} className="leading-relaxed font-medium">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQs Dynamic Modern Cards */}
        {faqs && (
          <section className="border-t border-slate-200 pt-7 space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0F3966]" />
              अक्सर पूछे जाने वाले सवाल (Frequently Asked Questions)
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {faqs.map((faq, idx) => {
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

JobLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    department: PropTypes.string,
    total_posts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalPosts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    last_date: PropTypes.string,
    lastDate: PropTypes.string,
    eligibility: PropTypes.string,
    apply_url: PropTypes.string,
    applyUrl: PropTypes.string,
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