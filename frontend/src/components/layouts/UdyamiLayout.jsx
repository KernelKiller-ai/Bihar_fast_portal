import PropTypes from "prop-types";
import { 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  Building2, 
  Sparkles, 
  HelpCircle, 
  FileCheck2, 
  Percent, 
  AlertTriangle 
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "../ShareAlertBar";

export default function UdyamiLayout({ post }) {
  const portalUrl = post?.applyUrl || "https://udyami.bihar.gov.in";
  const title = post?.title || "बिहार मुख्यमंत्री उद्यमी योजना 2026 ऑनलाइन आवेदन एवं प्रोजेक्ट लिस्ट";
  const dept = "उद्योग विभाग, बिहार सरकार (Department of Industries)";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-7 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            स्वरोजगार अनुदान (Welfare Scheme)
          </span>
          <Link 
            to="/" 
            className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 font-bold transition bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow-xs">
          {title}
        </h1>
        <p className="text-xs text-emerald-200 mt-2 font-medium">
          विभाग: {dept} • ₹10 लाख तक की वित्तीय सहायता (50% सब्सिडी)
        </p>
      </header>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Dynamic WhatsApp & Telegram Share Bar */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Financial Incentive Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Coins size={15} /> कुल परियोजना लागत
            </span>
            <strong className="text-emerald-950 text-base font-black mt-1 block">₹10,00,000 तक</strong>
            <span className="text-[11px] text-emerald-700 mt-0.5 block">नया उद्योग/स्टार्टअप स्थापित करने हेतु</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <Sparkles size={15} /> सरकारी अनुदान (50% माफ)
            </span>
            <strong className="text-amber-950 text-base font-black mt-1 block">₹5,00,000 (मुफ्त)</strong>
            <span className="text-[11px] text-amber-700 mt-0.5 block">सीधे बैंक खाते में सब्सिडी अनुदान</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-xs">
            <span className="text-blue-700 font-bold flex items-center gap-1">
              <Percent size={15} /> आसान ऋण वापसी शर्त
            </span>
            <strong className="text-blue-950 text-xs font-bold mt-1 block leading-tight">
              0% ब्याज (महिला/SC/ST) / 1% (अन्य)
            </strong>
            <span className="text-[11px] text-blue-700 mt-0.5 block">84 समान मासिक किश्तों में वापसी</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="bg-teal-50/70 border-2 border-teal-300 rounded-2xl p-6 text-center space-y-3.5">
          <p className="text-sm font-bold text-teal-950">
            उद्योग विभाग आधिकारिक पोर्टल: नया पंजीकरण, प्रोजेक्ट सूची व परिणाम
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <ExternalLink size={16} /> पोर्टल पर पंजीकरण / लॉगिन करें
            </a>
            <a
              href="https://udyami.bihar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <FileText size={16} /> 102 प्रोजेक्ट्स की विस्तृत सूची (DPR)
            </a>
          </div>
          <p className="text-[11px] text-teal-800 font-semibold flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={14} className="text-emerald-600" /> चयन पूर्णतः कंप्यूटरीकृत लॉटरी प्रणाली द्वारा
          </p>
        </div>

        {/* Target Categories Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs text-center">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block font-black">महिला उद्यमी</strong>
            <span className="text-slate-500 text-[11px] mt-0.5 block">सभी वर्गों की महिलाओं हेतु 0% ब्याज</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block font-black">युवा उद्यमी</strong>
            <span className="text-slate-500 text-[11px] mt-0.5 block">सामान्य व पिछड़ा वर्ग हेतु मात्र 1% ब्याज</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block font-black">SC / ST उद्यमी</strong>
            <span className="text-slate-500 text-[11px] mt-0.5 block">अनुसूचित जाति/जनजाति हेतु ब्याजमुक्त ऋण</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block font-black">अल्पसंख्यक उद्यमी</strong>
            <span className="text-slate-500 text-[11px] mt-0.5 block">मुस्लिम, सिख, ईसाई आदि समुदाय हेतु</span>
          </div>
        </div>

        {/* Eligibility & Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66] text-sm">
              <CheckCircle2 size={16} className="text-emerald-600" /> पात्रता मानदंड (Eligibility Criteria)
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">•</span>
                <span>बिहार का स्थायी (मूल) निवासी होना अनिवार्य है।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">•</span>
                <span>न्यूनतम शैक्षणिक योग्यता 10+2 (इंटरमीडिएट), ITI, पॉलिटेक्निक या समकक्ष डिप्लोमा उत्तीर्ण।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">•</span>
                <span>आयु सीमा: आवेदन की तिथि को न्यूनतम 18 वर्ष एवं अधिकतम 50 वर्ष।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">•</span>
                <span>आवेदक के नाम से व्यक्तिगत बचत खाता अथवा प्रोपराइटरशिप चालू (Current) खाता।</span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#0B3B66] text-sm">
              <FileCheck2 size={16} className="text-[#0B3B66]" /> अनिवार्य कागजात (Documents Required)
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-black">•</span>
                <span>मैट्रिक (10वीं) एवं इंटरमीडिएट (12वीं) अंक पत्र व मूल प्रमाण पत्र</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-black">•</span>
                <span>जाति प्रमाण पत्र एवं स्थायी निवास प्रमाण पत्र (RTPS निर्गत)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-black">•</span>
                <span>पैन कार्ड एवं आधार कार्ड (सक्रिय मोबाइल नंबर से लिंक)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-black">•</span>
                <span>बैंक पासबुक अथवा रद्द किया गया चेक (Cancelled Cheque)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-teal-700" />
              योजना का उद्देश्य एवं कार्यप्रणाली
            </h2>
            <p>
              बिहार सरकार द्वारा राज्य में सूक्ष्म एवं लघु उद्योगों को बढ़ावा देने, युवाओं को रोजगार के नए अवसर प्रदान करने के उद्देश्य से <strong>मुख्यमंत्री उद्यमी योजना</strong> संचालित की जा रही है। चयनित लाभार्थियों को ₹10 लाख की वित्तीय सहायता दी जाती है, जिसमें से ₹5 लाख सरकारी अनुदान (सब्सिडी) के रूप में पूर्णतः माफ रहते हैं और शेष ₹5 लाख का ऋण आसान किश्तों में लौटाना होता है।
            </p>
          </section>

          {/* Registration Steps */}
          <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-700" />
              ऑनलाइन आवेदन एवं चयन की चरणबद्ध प्रक्रिया
            </h2>
            <ol className="space-y-2.5 list-decimal list-inside pl-1 text-slate-800">
              <li className="pl-1">
                <strong>पंजीकरण (Registration):</strong> आधिकारिक वेबसाइट <code>udyami.bihar.gov.in</code> पर जाकर आधार संख्या एवं मोबाइल नंबर दर्ज कर ओटीपी सत्यापन करें।
              </li>
              <li className="pl-1">
                <strong>प्रोजेक्ट व श्रेणी का चयन:</strong> उद्योग विभाग द्वारा अनुमोदित प्रोजेक्ट सूची में से अपने कौशल अनुसार उद्योग (जैसे मखाना प्रोसेसिंग, रेडीमेड गारमेंट्स, पेवर ब्लॉक्स आदि) चुनें।
              </li>
              <li className="pl-1">
                <strong>दस्तावेज अपलोड:</strong> अपनी शैक्षणिक योग्यता, आवासीय, जाति, पैन कार्ड तथा बैंक चेक की स्कैन कॉपी 200 KB से कम साइज में अपलोड करें।
              </li>
              <li className="pl-1">
                <strong>कंप्यूटरीकृत रैंडम लॉटरी:</strong> आवेदन प्रक्रिया समाप्त होने पर उद्योग विभाग द्वारा पारदर्शी कंप्यूटरीकृत लॉटरी के माध्यम से अंतिम चयन सूची जारी की जाती है।
              </li>
              <li className="pl-1">
                <strong>प्रशिक्षण एवं राशि अंतरण:</strong> चयनित अभ्यर्थियों को 15 दिनों का उद्यमिता विकास प्रशिक्षण दिया जाता है तथा राशि 3 चरणों में सीधे बैंक खाते में भेजी जाती है।
              </li>
            </ol>
          </section>

          {/* Project Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <strong className="text-slate-900 font-bold block mb-1">Category A (सर्वसामान्य उद्योग)</strong>
              <p className="text-slate-600">खाद्य प्रसंस्करण, आटा चक्की, तेल मिल, मखाना प्रोसेसिंग व जनरल इंजीनियरिंग।</p>
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <strong className="text-slate-900 font-bold block mb-1">Category B (विशेष विनिर्माण)</strong>
              <p className="text-slate-600">चमड़ा उद्योग, रेडीमेड वस्त्र निर्माण (टेक्सटाइल), लकड़ी के फर्नीचर एवं आईटी सेवाएं।</p>
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <strong className="text-slate-900 font-bold block mb-1">Category C (बियाडा क्लस्टर)</strong>
              <p className="text-slate-600">BIADA औद्योगिक क्षेत्रों में प्लग एंड प्ले शेड्स में स्थापित होने वाली इकाइयां।</p>
            </div>
          </div>

          {/* FAQs */}
          <section className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0B3B66]" />
              मुख्यमंत्री उद्यमी योजना: अक्सर पूछे जाने वाले प्रश्न (FAQs)
            </h2>
            <div className="space-y-3.5 divide-y divide-slate-200 text-xs sm:text-sm">
              <div className="pt-2">
                <h3 className="font-bold text-slate-900">
                  प्र. क्या आवेदन करते समय चालू (Current) बैंक खाता होना अनिवार्य है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: प्रारंभिक ऑनलाइन आवेदन के समय आवेदक अपने व्यक्तिगत बचत खाते (Savings Account) की चेकबुक से आवेदन कर सकता है। लॉटरी में चयन होने के उपरांत फर्म के नाम से करंट अकाउंट खुलवाना आवश्यक होता है।
                </p>
              </div>

              <div className="pt-3">
                <h3 className="font-bold text-slate-900">
                  प्र. 5 लाख रुपये के ऋण की वापसी कब से शुरू करनी होती है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: परियोजना की स्थापना और राशि प्राप्त होने के 1 वर्ष (12 महीने) की ग्रेस अवधि (Moratorium Period) के बाद 84 समान मासिक किश्तों में ऋण की अदायगी शुरू होती है।
                </p>
              </div>

              <div className="pt-3">
                <h3 className="font-bold text-slate-900">
                  प्र. क्या किसी बिचौलिए या दलाल के माध्यम से चयन संभव है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: बिल्कुल नहीं। उद्योग विभाग द्वारा चयन पूरी तरह पारदर्शी सॉफ्टवेयर आधारित रैंडम लॉटरी द्वारा जनता और मीडिया के समक्ष किया जाता है। किसी भी फर्जी कॉल या पैसों की मांग करने वालों से सावधान रहें।
                </p>
              </div>
            </div>
          </section>

          {/* Advisory */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>चेतावनी:</strong> आवेदन पत्र में केवल वही प्रोजेक्ट चुनें जिसमें आपको व्यावहारिक अनुभव या रुचि हो। चयन के बाद परियोजना का स्थल निरीक्षण और तकनीकी सत्यापन उद्योग विस्तार पदाधिकारी द्वारा किया जाता है।
            </p>
          </div>

        </div>
      </div>
    </article>
  );
}

UdyamiLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    applyUrl: PropTypes.string,
  }),
};