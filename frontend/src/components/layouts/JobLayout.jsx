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
  AlertTriangle,
  HelpCircle,
  Clock,
  Briefcase,
  BookOpen,
  Scale
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function JobLayout({ post }) {
  if (!post) return null;

  const title = post.title;
  const dept = post.department || "बिहार सरकार";
  const totalPosts = post.total_posts || post.totalPosts || "विभागीय सूचना देखें";
  const lastDate = post.last_date || post.lastDate || "सक्रिय";
  const eligibility = post.eligibility || "विस्तृत विज्ञापन देखें";
  const applyLink = post.apply_url || post.applyUrl || "#";
  const pdfLink = post.pdf_url || post.pdfUrl || "#";

  // Dynamic Content Fields from Supabase
  const fullContent = post.content || null;
  const shortDesc = post.short_desc || null;
  const howToApply = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 ? post.how_to_apply : null;
  const selectionProcess = Array.isArray(post.selection_process) && post.selection_process.length > 0 ? post.selection_process : null;
  
  // FAQs priority: post.faqs first, fallback to extra_links
  const faqs = (Array.isArray(post.faqs) && post.faqs.length > 0) 
    ? post.faqs 
    : (Array.isArray(post.extra_links) && post.extra_links.length > 0 ? post.extra_links : null);

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-[#073663] via-[#0B4F8A] to-[#073663] text-white p-5 sm:p-7 border-b-4 border-amber-500">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            सरकारी भर्ती (Govt Job Portal)
          </span>
          <Link 
            to="/" 
            className="text-xs text-sky-200 hover:text-white flex items-center gap-1 font-bold transition bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow-xs">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-sky-100 mt-3 font-medium">
          <span className="flex items-center gap-1">
            <Briefcase size={14} className="text-amber-400" /> विभाग: <strong className="text-white font-bold">{dept}</strong>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400" /> 100% आधिकारिक NIC व विभागीय लिंक
          </span>
        </div>
      </header>

      <div className="p-5 sm:p-8 space-y-6">
        <ShareAlertBar title={title} dept={dept} />

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Users size={16} className="text-[#0B4F8A]" /> कुल पद (Total Vacancies)
            </div>
            <strong className="text-slate-900 text-base font-black mt-1.5 block">{totalPosts}</strong>
            <span className="text-[11px] text-slate-500 mt-0.5 block">कोटिवार आरक्षण रोस्टर लागू</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar size={16} className="text-rose-600" /> अंतिम तिथि (Last Date)
            </div>
            <strong className="text-rose-600 text-base font-black mt-1.5 block">{lastDate}</strong>
            <span className="text-[11px] text-slate-500 mt-0.5 block">ऑनलाइन सर्वर बंद होने का समय</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <GraduationCap size={16} className="text-emerald-600" /> अनिवार्य योग्यता (Eligibility)
            </div>
            <strong className="text-slate-900 text-xs font-bold mt-1.5 block leading-snug">{eligibility}</strong>
            <span className="text-[11px] text-slate-500 mt-0.5 block">कट-ऑफ तिथि तक प्रमाण पत्र आवश्यक</span>
          </div>
        </div>

        {/* Action Direct Hub */}
        <div className="bg-linear-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm font-bold text-blue-950">
            आधिकारिक सर्वर से सीधे आवेदन करें अथवा विभागीय विज्ञापन पीडीएफ डाउनलोड करें
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {applyLink !== "#" && (
              <a
                href={applyLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#0B4F8A] hover:bg-[#073663] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <ExternalLink size={16} /> ऑनलाइन आवेदन करें (Apply Online)
              </a>
            )}
            {pdfLink !== "#" && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <Download size={16} /> आधिकारिक विज्ञापन (Official PDF)
              </a>
            )}
          </div>
        </div>

        {/* Content Flow */}
        <div className="space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-8">
          
          {/* 1. Short Description / Overview */}
          {shortDesc && (
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-[#0B4F8A]" />
                भर्ती विवरण एवं पृष्ठभूमि (Recruitment Overview)
              </h2>
              <div className="text-slate-800 leading-relaxed text-sm bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                {shortDesc}
              </div>
            </section>
          )}

          {/* 2. Full Article Content Body (800+ Words Long Guide) */}
          {fullContent && (
            <section className="space-y-4 prose max-w-none text-slate-800 leading-relaxed">
              <div 
                className="whitespace-pre-line text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: fullContent }} 
              />
            </section>
          )}

          {/* 3. Step by Step Online Application Instructions (Only rendered if present in DB) */}
          {howToApply && (
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-indigo-700" />
                ऑनलाइन आवेदन पत्र भरने की चरणबद्ध प्रक्रिया (Step-by-Step Guide)
              </h2>
              <ol className="space-y-2.5 list-decimal list-inside pl-1 bg-slate-50 border border-slate-200 p-5 rounded-xl">
                {howToApply.map((step, idx) => (
                  <li key={idx} className="text-slate-800 font-medium leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 4. Selection Process (Only rendered if present in DB) */}
          {selectionProcess && (
            <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-800" />
                चयन प्रक्रिया एवं परीक्षा प्रारूप (Selection Criteria)
              </h2>
              <ul className="space-y-2 list-disc list-inside text-slate-800">
                {selectionProcess.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 5. FAQs Section (Only rendered if present in DB) */}
          {faqs && (
            <section className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#0B4F8A]" />
                अक्सर पूछे जाने वाले सवाल (Frequently Asked Questions)
              </h2>
              <div className="space-y-3.5 divide-y divide-slate-200">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={idx === 0 ? "pt-1" : "pt-3"}>
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock size={14} className="text-sky-700 shrink-0" />
                      प्र. {faq.q || faq.question}
                    </h3>
                    <p className="text-slate-600 mt-1 pl-5">
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

JobLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    department: PropTypes.string,
    total_posts: PropTypes.string,
    totalPosts: PropTypes.string,
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