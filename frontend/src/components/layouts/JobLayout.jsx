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
  const title = post.title || "बिहार राज्य सरकारी रोजगार अधिसूचना";
  const dept = post.department || "बिहार सरकार कार्मिक एवं सामान्य प्रशासन";
  const totalPosts = post.totalPosts || post.total_posts || "अधिसूचना अनुसार";
  const lastDate = post.lastDate || post.last_date || "आधिकारिक सूचना देखें";
  const eligibility = post.eligibility || post.qualification_details || "संबंधित संकाय में मान्यता प्राप्त डिग्री / डिप्लोमा / समकक्ष";
  const applyLink = post.applyUrl || post.link || "#";
  const pdfLink = post.pdfUrl || post.pdf_url || "#";

  // Dynamic Gemini Content with Fallbacks
  const shortDesc = post.short_desc || null;
  const howToApply = Array.isArray(post.how_to_apply) && post.how_to_apply.length > 0 ? post.how_to_apply : null;
  const selectionProcess = Array.isArray(post.selection_process) && post.selection_process.length > 0 ? post.selection_process : null;
  const faqs = Array.isArray(post.extra_links) && post.extra_links.length > 0 ? post.extra_links : null;

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
            <ShieldCheck size={14} className="text-emerald-400" /> 100% आधिकारिक NIC व विभागीय सर्वर लिंक
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

        {/* Quick Important Highlights Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-3 text-[#0B3B66] text-sm">
              <Calendar size={16} /> महत्वपूर्ण तिथियां (Important Schedule)
            </h3>
            <ul className="space-y-2.5 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-600 font-medium">ऑनलाइन आवेदन की तिथि:</span>
                <strong className="text-slate-900">विभागीय पोर्टल पर सक्रिय</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">ऑनलाइन शुल्क भुगतान की अंतिम तिथि:</span>
                <strong className="text-slate-900">{lastDate}</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">फॉर्म सुधार (Application Edit Window):</span>
                <strong className="text-slate-900">अंतिम तिथि के 3 दिन बाद तक</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">प्रवेश पत्र (Admit Card) व परीक्षा तिथि:</span>
                <strong className="text-amber-700">यथासमय आयोग द्वारा सूचित</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-3 text-[#0B3B66] text-sm">
              <Scale size={16} /> आयु सीमा एवं छूट नियम (Age Criteria)
            </h3>
            <div className="space-y-2.5">
              <p className="text-slate-700 font-medium leading-relaxed">
                उम्मीदवार की आयु की गणना निर्धारित कट-ऑफ तिथि के आधार पर की जाएगी। न्यूनतम आयु 18/21 वर्ष तथा अधिकतम आयु सामान्य वर्ग हेतु 37 वर्ष निर्धारित है।
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>पिछड़ा वर्ग (BC) एवं अत्यंत पिछड़ा वर्ग (EBC): 3 वर्ष की छूट (40 वर्ष)</li>
                <li>अनुसूचित जाति (SC) एवं अनुसूचित जनजाति (ST): 5 वर्ष की छूट (42 वर्ष)</li>
                <li>सभी वर्गों की महिला उम्मीदवारों को राज्य सरकार नियमानुसार अतिरिक्त छूट</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Direct Hub */}
        <div className="bg-linear-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm font-bold text-blue-950">
            आधिकारिक सर्वर से सीधे आवेदन करें अथवा विभागीय विज्ञापन पीडीएफ डाउनलोड करें
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={applyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#0B4F8A] hover:bg-[#073663] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <ExternalLink size={16} /> ऑनलाइन आवेदन करें (Apply Online)
            </a>
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
          <p className="text-[11px] text-blue-800 font-medium flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={14} className="text-emerald-600" /> 
            BiharFast केवल आधिकारिक बिहार सरकार एवं NIC अधिकृत पोर्टल्स के डायरेक्ट लिंक प्रदान करता है।
          </p>
        </div>

        {/* In-Depth Comprehensive Guide Sections */}
        <div className="space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-8">
          
          {/* Detailed Overview (AI Enhanced) */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#0B4F8A]" />
              भर्ती विवरण एवं आधिकारिक पृष्ठभूमि (Recruitment Overview & Objective)
            </h2>
            {shortDesc ? (
              <p className="text-slate-800 leading-relaxed text-sm bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                {shortDesc}
              </p>
            ) : (
              <>
                <p>
                  बिहार राज्य सरकार के अंतर्गत <strong>{dept}</strong> ने सुशासन एवं राज्य की प्रशासनिक व तकनीकी व्यवस्था को सुदृढ़ बनाने के उद्देश्य से <strong>{title}</strong> के लिए सार्वजनिक भर्ती विज्ञापन प्रकाशित किया है। इस भर्ती अभियान के अंतर्गत कुल <strong>{totalPosts}</strong> रिक्त पदों पर सीधी भर्ती अथवा प्रतियोगी परीक्षा के माध्यम से योग्य उम्मीदवारों की नियुक्ति की जाएगी।
                </p>
                <p>
                  राज्य के ऐसे अभ्यर्थी जो काफी समय से सरकारी रोजगार की तलाश कर रहे हैं, उनके लिए यह एक उत्कृष्ट अवसर है। आयोग द्वारा जारी निर्देशानुसार केवल वही उम्मीदवार अंतिम चयन प्रक्रिया में सम्मिलित हो सकेंगे जो ऑनलाइन आवेदन की अंतिम तिथि <strong>{lastDate}</strong> तक समस्त शैक्षणिक, तकनीकी एवं आवासीय योग्यताओं को पूर्ण करते हों।
                </p>
              </>
            )}
          </section>

          {/* Educational Qualification Detailed */}
          <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <GraduationCap size={18} className="text-emerald-600" />
              विस्तृत शैक्षणिक योग्यता एवं तकनीकी अनुभव (Detailed Qualification Standards)
            </h2>
            <p>
              इस पद पर चयन हेतु मूल विज्ञापन के अनुसार निम्नलिखित शैक्षणिक मापदंड अनिवार्य किए गए हैं:
            </p>
            <ul className="space-y-2 list-disc list-inside pl-1 text-slate-800">
              <li>
                उम्मीदवार के पास केंद्र अथवा राज्य सरकार द्वारा मान्यता प्राप्त किसी बोर्ड, विश्वविद्यालय अथवा तकनीकी परिषद से <strong>{eligibility}</strong> की मूल अथवा औपबंधिक डिग्री/डिप्लोमा होना अनिवार्य है।
              </li>
              <li>
                जो अभ्यर्थी अंतिम वर्ष की परीक्षा में शामिल हुए हैं, उनका परिणाम आवेदन पत्र भरने की निर्धारित अंतिम तिथि से पूर्व घोषित हो चुका होना चाहिए।
              </li>
              <li>
                आरक्षित श्रेणी के अभ्यर्थियों को अपनी शैक्षणिक योग्यता के साथ-साथ बिहार सरकार द्वारा विहित प्रपत्र में सक्षम प्राधिकारी (अंचलाधिकारी/राजस्व अधिकारी/अनुमंडल पदाधिकारी) द्वारा निर्गत जाति प्रमाण पत्र, क्रीमीलेयर रहित प्रमाण पत्र (NCL) अथवा आर्थिक रूप से कमजोर वर्ग (EWS) प्रमाण पत्र प्रस्तुत करना आवश्यक होगा।
              </li>
            </ul>
          </section>

          {/* Step by Step Online Application Instructions (AI Enhanced) */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-indigo-700" />
              ऑनलाइन आवेदन पत्र भरने की चरणबद्ध प्रक्रिया (Step-by-Step Online Application Guide)
            </h2>
            <p>
              उम्मीदवारों की सुविधा हेतु संपूर्ण ऑनलाइन आवेदन प्रक्रिया को नीचे क्रमवार समझाया गया है ताकि फॉर्म भरते समय किसी प्रकार की त्रुटि न हो:
            </p>
            <ol className="space-y-3 list-decimal list-inside pl-1">
              {howToApply ? (
                howToApply.map((step, idx) => (
                  <li key={idx} className="pl-1 text-slate-800 font-medium">
                    {step}
                  </li>
                ))
              ) : (
                <>
                  <li className="pl-1">
                    <strong>आधिकारिक पोर्टल पर प्रवेश:</strong> सर्वप्रथम <strong>{dept}</strong> के अधिकृत वेब पोर्टल पर जाएं अथवा दिए गए &quot;ऑनलाइन आवेदन करें&quot; लिंक पर क्लिक करें।
                  </li>
                  <li className="pl-1">
                    <strong>नवीन पंजीकरण:</strong> अपना वैध मोबाइल नंबर, ईमेल आईडी, नाम तथा जन्मतिथि प्रविष्ट करके ओटीपी सत्यापन करें।
                  </li>
                  <li className="pl-1">
                    <strong>विवरण दर्ज करना:</strong> व्यक्तिगत, पता और शैक्षणिक योग्यता सावधानीपूर्वक भरें।
                  </li>
                  <li className="pl-1">
                    <strong>दस्तावेज अपलोड:</strong> पासपोर्ट साइज फोटोग्राफ और हस्ताक्षर अपलोड करें।
                  </li>
                  <li className="pl-1">
                    <strong>शुल्क भुगतान:</strong> श्रेणीवार निर्धारित आवेदन शुल्क का ऑनलाइन भुगतान करें।
                  </li>
                  <li className="pl-1">
                    <strong>फाइनल प्रिंट:</strong> सबमिट करके पावती रसीद (Acknowledgement Slip) का प्रिंट सुरक्षित रखें।
                  </li>
                </>
              )}
            </ol>
          </section>

          {/* Instructions / Selection Guidelines (AI Enhanced) */}
          <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-800" />
              महत्वपूर्ण निर्देश एवं चयन प्रक्रिया (Important Selection Guidelines)
            </h2>
            {selectionProcess ? (
              <ul className="space-y-2.5 list-disc list-inside text-slate-800 text-xs sm:text-sm">
                {selectionProcess.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-1">चरण 1: लिखित / सीबीटी परीक्षा</strong>
                  <p className="text-slate-600">कंप्यूटर आधारित परीक्षा (CBT) अथवा ओएमआर वस्तुनिष्ठ परीक्षा।</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-1">चरण 2: दस्तावेज सत्यापन (DV)</strong>
                  <p className="text-slate-600">मूल शैक्षणिक प्रमाण पत्र, जाति प्रमाण पत्र का भौतिक सत्यापन।</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-1">चरण 3: अंतिम मेधा सूची</strong>
                  <p className="text-slate-600">आरक्षण रोस्टर एवं सीबीटी परीक्षा प्राप्तांकों के आधार पर नियुक्ति सूची।</p>
                </div>
              </div>
            )}
          </section>

          {/* Essential Documents Checklist */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              आवेदन हेतु आवश्यक महत्वपूर्ण दस्तावेजों की चेकलिस्ट (Mandatory Documents)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>मैट्रिक (10वीं) अंक पत्र व मूल प्रमाण पत्र (जन्मतिथि साक्ष्य)</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>इंटरमीडिएट / स्नातक / डिप्लोमा अंक पत्र एवं डिग्री</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>सक्षम स्तर से निर्गत निवास प्रमाण पत्र (आवासीय प्रमाण)</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>जाति / नॉन-क्रीमी लेयर (NCL) / ईडब्ल्यूएस प्रमाण पत्र</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>वैध सरकारी पहचान पत्र (आधार कार्ड, वोटर कार्ड अथवा पैन कार्ड)</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>दिव्यांगता अथवा स्वतंत्रता सेनानी आश्रित प्रमाण पत्र (यदि लागू हो)</span>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions (AI Enhanced) */}
          <section className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0B4F8A]" />
              भर्ती से जुड़े सामान्य प्रश्नोत्तर (Frequently Asked Questions)
            </h2>
            <div className="space-y-3.5 divide-y divide-slate-200">
              {faqs ? (
                faqs.map((faq, idx) => (
                  <div key={idx} className={idx === 0 ? "pt-1" : "pt-3"}>
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock size={14} className="text-sky-700" />
                      प्र. {faq.q}
                    </h3>
                    <p className="text-slate-600 mt-1 pl-5">
                      उत्तर: {faq.a}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="pt-2">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock size={14} className="text-sky-700" />
                      प्र. {title} के लिए आवेदन की अंतिम तारीख क्या है?
                    </h3>
                    <p className="text-slate-600 mt-1 pl-5">
                      उत्तर: विभागीय अधिसूचना के अनुसार अंतिम तिथि <strong>{lastDate}</strong> तक नियत की गई है।
                    </p>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-sky-700" />
                      प्र. इस भर्ती अभियान में कुल कितनी रिक्तियों की घोषणा की गई है?
                    </h3>
                    <p className="text-slate-600 mt-1 pl-5">
                      उत्तर: आधिकारिक रोस्टर के अनुसार कुल <strong>{totalPosts}</strong> पदों पर नियुक्ति की प्रक्रिया प्रारंभ की गई है।
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}

JobLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    department: PropTypes.string,
    totalPosts: PropTypes.string,
    total_posts: PropTypes.string,
    lastDate: PropTypes.string,
    last_date: PropTypes.string,
    eligibility: PropTypes.string,
    qualification_details: PropTypes.string,
    applyUrl: PropTypes.string,
    link: PropTypes.string,
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