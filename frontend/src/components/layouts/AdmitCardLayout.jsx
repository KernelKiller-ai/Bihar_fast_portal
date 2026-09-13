import PropTypes from "prop-types";
import { 
  Calendar, 
  AlertTriangle, 
  Download, 
  FileCheck, 
  ArrowLeft, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  FileText,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function AdmitCardLayout({ post }) {
  const downloadUrl = post.applyUrl || post.pdfUrl || post.pdf_url || "#";
  const title = post.title || "प्रवेश पत्र डाउनलोड";
  const dept = post.department || "बिहार परीक्षा बोर्ड";
  const examDate = post.lastDate || post.last_date || "आधिकारिक सूचना देखें";

  // Dynamic AI content with fallbacks
  const shortDesc = post.short_desc || null;
  const downloadSteps = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 
    ? post.how_to_apply 
    : null;
  const examRules = Array.isArray(post.selection_process) && post.selection_process.length > 0 
    ? post.selection_process 
    : null;
  const faqs = Array.isArray(post.extra_links) && post.extra_links.length > 0 
    ? post.extra_links 
    : null;

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Top Header */}
      <header className="bg-linear-to-r from-[#073663] via-[#0B3B66] to-[#073663] text-white p-5 sm:p-6 border-b-4 border-amber-500">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded font-mono shadow-xs">
            प्रवेश पत्र (Admit Card)
          </span>
          <Link 
            to="/" 
            className="text-xs text-sky-200 hover:text-white flex items-center gap-1 font-bold transition bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">{title}</h1>
        <p className="text-xs text-sky-200 mt-1.5 font-medium">विभाग: {dept} • परीक्षा केंद्र एवं रोल नंबर विवरण</p>
      </header>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Dynamic Share Bar */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Direct Download Callout */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-2">
          <p className="text-xs font-bold text-emerald-950">आधिकारिक सर्वर से सीधा प्रवेश पत्र डाउनलोड करें</p>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow transition active:scale-95 cursor-pointer"
          >
            <Download size={16} /> डाउनलोड एडमिट कार्ड (Official Direct Server)
          </a>
          <p className="text-[10.5px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> आधिकारिक लिंक • नो थर्ड-पार्टी रीडायरेक्ट
          </p>
        </div>

        {/* Overview Section */}
        <section className="space-y-2 text-xs sm:text-sm text-slate-700">
          <h2 className="font-black text-[#0B3B66] text-sm sm:text-base flex items-center gap-2">
            <FileText size={16} className="text-[#0B4F8A]" /> परीक्षा विवरण एवं महत्वपूर्ण सूचना (Overview)
          </h2>
          {shortDesc ? (
            <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 text-slate-800 leading-relaxed font-medium">
              {shortDesc}
            </div>
          ) : (
            <p className="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {dept} द्वारा {title} का आधिकारिक ई-एडमिट कार्ड जारी कर दिया गया है। अभ्यर्थी परीक्षा तिथि, शिफ्ट समय एवं आवंटित परीक्षा केंद्र की पुष्टि हेतु नीचे दिए गए लिंक से तुरंत अपना प्रवेश पत्र डाउनलोड करें।
            </p>
          )}
        </section>

        {/* Schedule & Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66] text-sm">
              <Calendar size={15} /> परीक्षा कार्यक्रम (Exam Schedule)
            </h3>
            <ul className="space-y-2.5 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-500 font-medium">परीक्षा तिथि / स्थिति:</span>
                <strong className="text-slate-900">{examDate}</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">रिपोर्टिंग समय:</span>
                <strong className="text-slate-900">एडमिट कार्ड स्लिप पर अंकित</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">परीक्षा केंद्र:</span>
                <strong className="text-slate-900">आवंटित जिला व केंद्र</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66] text-sm">
              <FileCheck size={15} /> परीक्षा केंद्र पर ले जाने हेतु दस्तावेज
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium leading-relaxed">
              <li>साफ प्रिंटेड ई-एडमिट कार्ड (A4 साइज)</li>
              <li>मूल फोटो पहचान पत्र (Voter ID / PAN / Driving License)</li>
              <li>2 हालिया पासपोर्ट साइज रंगीन फोटोग्राफ</li>
              <li>पारदर्शी नीला या काला बॉल पेन</li>
            </ul>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-indigo-700" />
            एडमिट कार्ड डाउनलोड करने की चरणबद्ध प्रक्रिया
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-800 font-medium">
            {downloadSteps ? (
              downloadSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))
            ) : (
              <>
                <li>ऊपर दिए गए <strong>&quot;डाउनलोड एडमिट कार्ड&quot;</strong> आधिकारिक सर्वर लिंक पर क्लिक करें।</li>
                <li>लॉगिन पृष्ठ पर अपना रजिस्ट्रेशन नंबर / रोल नंबर तथा जन्म तिथि (DD/MM/YYYY) अथवा पासवर्ड दर्ज करें।</li>
                <li>स्क्रीन पर प्रदर्शित सुरक्षा कैप्चा कोड भरकर &apos;Submit&apos; बटन पर क्लिक करें।</li>
                <li>आपका एडमिट कार्ड स्क्रीन पर प्रदर्शित हो जाएगा। उसमें अपना नाम, केंद्र और तिथि का मिलान कर लें।</li>
                <li>भविष्य के संदर्भ हेतु एडमिट कार्ड का 2 रंगीन प्रिंटआउट अवश्य निकाल लें।</li>
              </>
            )}
          </ol>
        </section>

        {/* Instructions / Hall Guidelines (AI Enhanced) */}
        {examRules && (
          <section className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 text-xs sm:text-sm space-y-3">
            <h3 className="font-black flex items-center gap-1.5 text-[#0B3B66] text-sm sm:text-base">
              <FileCheck size={16} className="text-emerald-700" /> महत्वपूर्ण परीक्षा दिशा-निर्देश
            </h3>
            <ul className="space-y-2 text-slate-800">
              {examRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Advisory Box */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed font-medium">
            उम्मीदवारों को सलाह दी जाती है कि वे परीक्षा शुरू होने से कम से कम 1 घंटा पूर्व केंद्र पर पहुंचे। मुख्य द्वार बंद होने के बाद किसी भी परिस्थिति में परीक्षा हॉल में प्रवेश की अनुमति नहीं होगी।
          </p>
        </div>

        {/* Frequently Asked Questions (FAQ Section) */}
        {faqs && (
          <section className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 text-xs sm:text-sm space-y-3">
            <h3 className="font-black flex items-center gap-1.5 text-[#0B3B66] text-sm sm:text-base">
              <HelpCircle size={16} className="text-[#0B4F8A]" /> एडमिट कार्ड से जुड़े सामान्य प्रश्नोत्तर (FAQs)
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

AdmitCardLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    department: PropTypes.string,
    lastDate: PropTypes.string,
    last_date: PropTypes.string,
    applyUrl: PropTypes.string,
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