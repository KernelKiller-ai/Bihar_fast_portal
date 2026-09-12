import PropTypes from "prop-types";
import { 
  FileCheck, 
  Clock, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  Search, 
  FileText, 
  CheckCircle2, 
  Download, 
  HelpCircle, 
  AlertCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function RtpsLayout({ post }) {
  const portalUrl = post?.applyUrl || "https://serviceonline.bihar.gov.in";
  const title = post?.title || "RTPS बिहार: ऑनलाइन जाति, आवासीय एवं आय प्रमाण पत्र पोर्टल";
  const dept = "सामान्य प्रशासन विभाग, बिहार सरकार (RTPS & Other Services)";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-[#073663] via-[#0B4F8A] to-[#047857] text-white p-5 sm:p-7 border-b-4 border-emerald-500">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            RTPS लोक सेवाएं (E-Certificates)
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
        <p className="text-xs text-sky-200 mt-2 font-medium">
          विभाग: {dept} • लोक सेवाओं का अधिकार अधिनियम
        </p>
      </header>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Dynamic WhatsApp & Telegram Share Bar */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Quick Action Hub */}
        <div className="bg-emerald-50/80 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-3.5">
          <p className="text-sm font-bold text-emerald-950">
            आधिकारिक RTPS (ServiceOnline) पोर्टल से आवेदन करें, स्थिति ट्रैक करें या डिजिटल प्रमाण पत्र डाउनलोड करें
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <ExternalLink size={16} /> नया प्रमाण पत्र ऑनलाइन बनाएं (Apply Online)
            </a>
            <a
              href={`${portalUrl}#track`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <Search size={16} /> आवेदन की स्थिति (Track Status)
            </a>
            <a
              href={`${portalUrl}#download`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <Download size={16} /> प्रमाण पत्र डाउनलोड करें (Download)
            </a>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={14} className="text-emerald-600" /> सीधे बिहार प्रशासनिक सुधार मिशन सोसाइटी (BPSM) के अधिकृत सर्वर से सुरक्षित
          </p>
        </div>

        {/* Requirements & Timelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-3 text-[#0B3B66] text-sm">
              <Clock size={16} /> सेवा प्रदाय समय सीमा (Guaranteed Time Limit)
            </h3>
            <ul className="space-y-2.5 divide-y divide-slate-200">
              <li className="flex justify-between pt-1">
                <span className="text-slate-600 font-medium">आवासीय (निवास) प्रमाण पत्र:</span>
                <strong className="text-slate-900">10 कार्य दिवस</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">आय प्रमाण पत्र:</span>
                <strong className="text-slate-900">10 कार्य दिवस</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">जाति प्रमाण पत्र (SC/ST/EBC/BC):</span>
                <strong className="text-slate-900">10 कार्य दिवस</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">नॉन-क्रीमी लेयर (NCL - बिहार / केंद्र):</span>
                <strong className="text-slate-900">21 कार्य दिवस</strong>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">आर्थिक रूप से कमजोर वर्ग (EWS):</span>
                <strong className="text-slate-900">21 कार्य दिवस</strong>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-black flex items-center gap-1.5 mb-3 text-[#0B3B66] text-sm">
              <FileCheck size={16} /> अनिवार्य दस्तावेज (Mandatory Checklist)
            </h3>
            <div className="space-y-2 text-slate-700 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>स्व-हस्ताक्षरित पासपोर्ट साइज नवीनतम रंगीन फोटो (20kb–50kb)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>पहचान प्रमाण: आधार कार्ड, मतदाता पहचान पत्र, या पैन कार्ड</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>OTP प्रमाणीकरण हेतु आधार से लिंक सक्रिय मोबाइल नंबर</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>NCL हेतु: शपथ पत्र, पूर्व का जाति प्रमाण पत्र, निवास एवं आय प्रमाण</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>सरकारी कर्मचारी परिवार हेतु वेतन प्रमाण पत्र (यदि लागू हो)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#0B3B66]" />
              RTPS पोर्टल परिचय एवं नागरिक लाभ
            </h2>
            <p>
              बिहार लोक सेवाओं का अधिकार (Right to Public Services - RTPS) अधिनियम के अंतर्गत राज्य के नागरिकों को विभिन्न प्रशासनिक प्रमाणपत्र निर्धारित समय-सीमा के भीतर पारदर्शी तरीके से उपलब्ध कराए जाते हैं। अब किसी भी ब्लॉक (अंचल) कार्यालय के चक्कर लगाए बिना <strong>ServiceOnline Bihar</strong> पोर्टल के जरिए जाति, आय, निवास, क्रीमीलेयर रहित प्रमाण पत्र (NCL) तथा ईडब्ल्यूएस (EWS) प्रमाण पत्र सीधे ऑनलाइन बनाए और डिजिटल हस्ताक्षरित कॉपी डाउनलोड किए जा सकते हैं।
            </p>
          </section>

          {/* Online Application Steps */}
          <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              ऑनलाइन आवेदन पत्र भरने की चरणबद्ध प्रक्रिया
            </h2>
            <ol className="space-y-2.5 list-decimal list-inside pl-1 text-slate-800">
              <li className="pl-1">
                सर्वप्रथम <strong>ServiceOnline Bihar (serviceonline.bihar.gov.in)</strong> पोर्टल पर जाएं।
              </li>
              <li className="pl-1">
                बाईं ओर स्थित मेन्यू में <strong>&quot;लोक सेवाओं का अधिकार की सेवाएं&quot;</strong> के अंतर्गत <strong>&quot;सामान्य प्रशासन विभाग&quot;</strong> पर क्लिक करें।
              </li>
              <li className="pl-1">
                अपनी आवश्यकतानुसार <strong>आवासीय, जाति, आय या नॉन-क्रीमी लेयर प्रमाण पत्र</strong> चुनें और निर्गमन स्तर (अंचल स्तर - CO/RO level) का चयन करें।
              </li>
              <li className="pl-1">
                फॉर्म में आवेदक का नाम, पिता का नाम, माता का नाम, स्थायी पता (जिला, अनुमंडल, प्रखंड, ग्राम पंचायत/नगर निकाय) एवं मोबाइल नंबर दर्ज करें।
              </li>
              <li className="pl-1">
                स्व-अभिप्रमाणित फोटो अपलोड करें तथा आधार प्रमाणीकरण (OTP सत्यापन) करें अथवा पहचान पत्र की पीडीएफ प्रति संलग्न (Attach Enclosure) करें।
              </li>
              <li className="pl-1">
                फॉर्म जांचने के पश्चात &apos;Final Submit&apos; करें और 16 अंकों की संदर्भ संख्या (Application Reference Number) वाली <strong>पावती रसीद (Acknowledgement)</strong> सुरक्षित रख लें।
              </li>
            </ol>
          </section>

          {/* Certificate Download Guide */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Download size={18} className="text-[#0B3B66]" />
              तैयार प्रमाण पत्र सीधे डाउनलोड कैसे करें?
            </h2>
            <p>
              निर्धारित कार्य दिवस पूरा होने पर आपके पंजीकृत मोबाइल नंबर पर एसएमएस द्वारा डिजिटल प्रमाण पत्र का लिंक प्राप्त हो जाता है। यदि एसएमएस प्राप्त न हो तो पोर्टल के मुख्य पृष्ठ पर <strong>&quot;Certificate Download&quot;</strong> विकल्प में जाकर अपना <strong>Application Reference Number</strong> एवं आवेदक का अंग्रेजी में नाम दर्ज करके डिजिटल सिग्नेचर युक्त प्रमाण पत्र सीधे पीडीएफ के रूप में डाउनलोड कर सकते हैं।
            </p>
          </section>

          {/* FAQ Section */}
          <section className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0B3B66]" />
              RTPS लोक सेवाओं से संबंधित अक्सर पूछे जाने वाले प्रश्न (FAQs)
            </h2>
            <div className="space-y-3.5 divide-y divide-slate-200 text-xs sm:text-sm">
              <div className="pt-2">
                <h3 className="font-bold text-slate-900">
                  प्र. क्या ऑनलाइन जारी प्रमाण पत्र पर ब्लॉक के भौतिक हस्ताक्षर की आवश्यकता होती है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: नहीं। RTPS पोर्टल द्वारा निर्गत सभी प्रमाण पत्र सक्षम पदाधिकारी (राजस्व अधिकारी / अंचल अधिकारी) द्वारा <strong>डिजिटली हस्ताक्षरित (Digitally Signed)</strong> होते हैं। इन पर किसी मुहर या भौतिक हस्ताक्षर की आवश्यकता नहीं होती, यह सभी सरकारी परीक्षाओं और नौकरियों में पूर्णतः मान्य हैं।
                </p>
              </div>

              <div className="pt-3">
                <h3 className="font-bold text-slate-900">
                  प्र. सरकारी नौकरी (BPSC, CSBC, BSSC) के लिए किस स्तर का प्रमाण पत्र आवश्यक होता है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: बिहार राज्य स्तरीय भर्ती परीक्षाओं हेतु <strong>राजस्व अधिकारी (RO) / अंचल अधिकारी (CO) स्तर</strong> का प्रमाण पत्र प्राथमिक रूप से मान्य होता है। विशेष आवश्यकताओं के लिए इसके आधार पर अनुमंडल (SDO) या जिला स्तर (DM) का प्रमाण पत्र भी ऑनलाइन निर्गत कराया जा सकता है।
                </p>
              </div>

              <div className="pt-3">
                <h3 className="font-bold text-slate-900">
                  प्र. आय प्रमाण पत्र की वैधता अवधि कितनी होती है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: आय प्रमाण पत्र सामान्यतः निर्गत होने की तिथि से 1 वित्तीय वर्ष (1 Year) के लिए वैध माना जाता है। वहीं आवासीय प्रमाण पत्र जब तक निवास स्थान न बदले, स्थायी रूप से मान्य रहता है।
                </p>
              </div>
            </div>
          </section>

          {/* Legal Note */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>महत्वपूर्ण सूचना:</strong> प्रमाण पत्र में किसी भी प्रकार का गलत विवरण या फर्जी दस्तावेज प्रस्तुत करना भारतीय न्याय संहिता के अंतर्गत दंडनीय अपराध है। प्रमाण पत्र के क्यूआर कोड (QR Code) को स्कैन करके कोई भी नियोक्ता उसकी सत्यता जांच सकता है।
            </p>
          </div>

        </div>
      </div>
    </article>
  );
}

RtpsLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    applyUrl: PropTypes.string,
  }),
};