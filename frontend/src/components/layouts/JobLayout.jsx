import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import {
  Calendar,
  GraduationCap,
  ExternalLink,
  Download,
  ArrowLeft,
  Users,
  CheckCircle2,
  FileText,
  HelpCircle,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { addExternalLinkSafety } from "../../utils/sanitizeHtml";
import PostBanner from "./PostBanner";

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
  const sanitizedContent = fullContent
    ? addExternalLinkSafety(DOMPurify.sanitize(fullContent, { USE_PROFILES: { html: true }, ADD_ATTR: ["target", "rel"] }))
    : null;
  const shortDesc = post.short_desc || null;
  const howToApply = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 ? post.how_to_apply : null;
  const selectionProcess = Array.isArray(post.selection_process) && post.selection_process.length > 0 ? post.selection_process : null;

  // Dynamic FAQs
  const faqs = (Array.isArray(post.faqs) && post.faqs.length > 0)
    ? post.faqs
    : (Array.isArray(post.extra_links) && post.extra_links.length > 0 ? post.extra_links : null);

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.1)] overflow-hidden my-6">
      {/* Header: multi-layer gradient + 3D glow accent bar */}
      <header className="relative bg-linear-to-br from-[#0F2A4A] via-[#16406E] to-[#0B4F8A] text-white">
        {/* 3D glow accent bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-400 via-orange-300 to-amber-400 shadow-[0_2px_10px_rgba(251,191,36,0.6)]" />
        {/* Glow blob accent */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <PostBanner post={post} label="सरकारी भर्ती बैनर" />

          <div className="flex items-center justify-between gap-2 mt-5 mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-[0_3px_10px_rgba(251,191,36,0.4)]">
              सरकारी भर्ती (Live Recruitment)
            </span>
            <Link
              to="/"
              className="text-xs text-sky-200 hover:text-white flex items-center gap-1.5 font-bold transition bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg active:scale-[0.98]"
            >
              <ArrowLeft size={14} /> वापस होम पेज
            </Link>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug drop-shadow-xs wrap-anywhere">
            {title}
          </h1>

          <div className="flex min-w-0 flex-wrap items-center gap-y-2 gap-x-4 text-xs text-sky-100 mt-4 pt-3 border-t border-white/10 font-medium">
            {dept && (
              <span className="flex min-w-0 items-center gap-1.5 wrap-anywhere">
                <Briefcase size={15} className="text-amber-400" />
                विभाग: <strong className="text-white font-bold">{dept}</strong>
              </span>
            )}
            <span className="text-sky-100">
              स्वतंत्र सूचना पोर्टल • आधिकारिक स्रोतों के लिंक
            </span>
          </div>
        </div>
      </header>

      <div className="p-5 sm:p-8 space-y-7">
        {/* Info Matrix — 3D elevated floating tiles */}
        {(totalPosts || lastDate || eligibility) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {totalPosts && (
              <div className="min-w-0 relative rounded-2xl border border-slate-200/90 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.14)] p-4 flex items-start gap-3 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-8px_rgba(11,79,138,0.25)]">
                {/* Dual border glow */}
                <div className="absolute inset-1 rounded-xl border border-blue-100/70 pointer-events-none" />
                <Users size={18} className="text-[#0F3966] shrink-0 mt-0.5" />
                <div className="min-w-0 relative">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">कुल पद (Vacancies)</p>
                  <p className="text-sm font-black text-[#0B4F8A] mt-0.5 wrap-anywhere">{totalPosts}</p>
                </div>
              </div>
            )}

            {lastDate && (
              <div className="min-w-0 relative rounded-2xl border border-rose-200/90 shadow-[0_8px_24px_-8px_rgba(225,29,72,0.18)] p-4 flex items-start gap-3 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-8px_rgba(225,29,72,0.3)]">
                <div className="absolute inset-1 rounded-xl border border-rose-100/80 pointer-events-none" />
                {/* Rose glow accent */}
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-rose-400/20 blur-md pointer-events-none" />
                <Calendar size={18} className="text-rose-600 shrink-0 mt-0.5 relative" />
                <div className="min-w-0 relative">
                  <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">अंतिम तिथि (Last Date)</p>
                  <p className="text-sm font-black text-rose-900 mt-0.5 wrap-anywhere">{lastDate}</p>
                </div>
              </div>
            )}

            {eligibility && (
              <div className="min-w-0 relative rounded-2xl border border-emerald-200/90 shadow-[0_8px_24px_-8px_rgba(22,101,52,0.16)] p-4 flex items-start gap-3 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-8px_rgba(22,101,52,0.28)]">
                <div className="absolute inset-1 rounded-xl border border-emerald-100/80 pointer-events-none" />
                <GraduationCap size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div className="min-w-0 relative">
                  <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">अनिवार्य योग्यता</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 leading-snug wrap-anywhere">{eligibility}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Callout Hub */}
        {(applyLink !== "#" || pdfLink !== "#") && (
          <div className="bg-linear-to-br from-blue-50/90 to-indigo-50/70 border-2 border-blue-200/90 rounded-2xl p-4 sm:p-6 text-center space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_-10px_rgba(11,79,138,0.2)]">
            <p className="text-sm sm:text-base font-black text-slate-900">
              सीधे आधिकारिक पोर्टल से ऑनलाइन आवेदन करें अथवा अधिसूचना पीडीएफ डाउनलोड करें
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              {applyLink !== "#" && (
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#0B4F8A] hover:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl shadow-[0_6px_18px_rgba(11,79,138,0.35)] transition-all duration-200 hover:shadow-[0_10px_24px_rgba(11,79,138,0.45)] active:scale-[0.98] cursor-pointer"
                >
                  <ExternalLink size={16} /> ऑनलाइन आवेदन करें (Apply Online)
                </a>
              )}
              {pdfLink !== "#" && (
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.1)] transition-all duration-200 hover:shadow-[0_8px_18px_rgba(15,23,42,0.16)] active:scale-[0.98] cursor-pointer"
                >
                  <Download size={16} /> आधिकारिक विज्ञापन (Official PDF)
                </a>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Overview */}
        {shortDesc && (
          <section className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-black text-[#0F3966] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#0F3966]" />
              संक्षिप्त विवरण (Recruitment Overview)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {shortDesc}
            </p>
          </section>
        )}

        {/* Full Rich Article Body */}
        {sanitizedContent && (
          <section className="border-t border-slate-200 pt-7">
            <div
              className="
                min-w-0 max-w-full text-slate-800 text-xs sm:text-sm leading-relaxed space-y-5 wrap-anywhere
                [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:font-black [&_h2]:text-[#0F3966] [&_h2]:border-l-4 [&_h2]:border-amber-500 [&_h2]:pl-3 [&_h2]:mt-6 [&_h2]:mb-2
                [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:my-2.5
                [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:my-3 [&_ul]:pl-2 [&_ul]:bg-slate-50 [&_ul]:p-4 [&_ul]:rounded-xl [&_ul]:border [&_ul]:border-slate-200
                [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2.5 [&_ol]:my-3 [&_ol]:pl-2 [&_ol]:bg-slate-50 [&_ol]:p-4 [&_ol]:rounded-xl [&_ol]:border [&_ol]:border-slate-200
                [&_li]:text-slate-800 [&_li]:leading-relaxed
                [&_strong]:text-slate-950 [&_strong]:font-bold
                [&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:overscroll-x-contain [&_table]:border-collapse [&_table]:my-4
                [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:text-left [&_th]:font-bold
                [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_td]:align-top
                [&_a]:text-blue-700 [&_a]:underline [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:shadow-md
              "
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </section>
        )}

        {/* Dynamic Step-by-Step Guide */}
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

        {/* Dynamic Selection Process */}
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
                  <div key={idx} className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 transition hover:border-slate-300 hover:shadow-[0_6px_18px_-8px_rgba(15,23,42,0.15)]">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                      <span className="bg-[#0B4F8A] text-white text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5 shadow-[0_2px_6px_rgba(11,79,138,0.35)]">
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
    thumbnail_url: PropTypes.string,
    banner_url: PropTypes.string,
    image_url: PropTypes.string,
    photo_url: PropTypes.string,
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
