import PropTypes from "prop-types";
import { 
  Search, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  CreditCard, 
  RefreshCw,
  AlertTriangle 
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareAlertBar from "./ShareAlertBar";

export default function BiharBhumiLayout({ post }) {
  const portalUrl = post?.applyUrl || "https://biharbhumi.bihar.gov.in";
  const title = post?.title || "बिहार भूमि दाखिल खारिज, एलपीसी एवं ऑनलाइन लगान पोर्टल";
  const dept = "राजस्व एवं भूमि सुधार विभाग, बिहार";

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden my-6">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-[#5B3924] via-[#78482A] to-[#5B3924] text-white p-5 sm:p-7 border-b-4 border-amber-500">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-mono shadow-xs">
            राजस्व एवं भूमि सुधार (Land Records)
          </span>
          <Link 
            to="/" 
            className="text-xs text-amber-200 hover:text-white flex items-center gap-1 font-bold transition bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft size={14} /> वापस होम पेज
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow-xs">
          {title}
        </h1>
        <p className="text-xs text-amber-200 mt-2 font-medium">
          विभाग: {dept} • डिजिटल भू-अभिलेख एवं ई-सेवाएं
        </p>
      </header>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Dynamic WhatsApp & Telegram Share Bar */}
        <ShareAlertBar title={title} dept={dept} />

        {/* Quick Portal Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <a
            href="https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi3.aspx"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition group flex items-start gap-3 shadow-xs"
          >
            <div className="p-2.5 bg-[#78482A] text-white rounded-lg group-hover:scale-105 transition shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">जमाबंदी पंजी देखें (Jamabandi Register)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">खाता, खेसरा, जमाबंदी संख्या एवं भाग-पृष्ठ से खोजें</p>
            </div>
          </a>

          <a
            href="https://www.biharbhumi.bihar.gov.in/Biharbhumi/DakhilKharij/PublicReport.aspx"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition group flex items-start gap-3 shadow-xs"
          >
            <div className="p-2.5 bg-emerald-700 text-white rounded-lg group-hover:scale-105 transition shrink-0">
              <Search size={18} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">दाखिल खारिज स्थिति (Mutation Status)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">केस नंबर या डीड (Deed) नंबर डालकर स्थिति ट्रैक करें</p>
            </div>
          </a>
        </div>

        {/* Direct Link to Main Portal */}
        <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm font-bold text-amber-950">
            भू-लगान भुगतान (Online Tax Payment), परिमार्जन प्लस एवं ऑनलाइन दाखिल-खारिज पोर्टल
          </p>
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#78482A] hover:bg-[#5B3924] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
          >
            <ExternalLink size={16} /> बिहार भूमि आधिकारिक मुख्य पोर्टल पर जाएं
          </a>
          <p className="text-[11px] text-amber-800 font-semibold flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={14} className="text-emerald-600" /> 
            सीधे राजस्व एवं भूमि सुधार विभाग (NIC बिहार) के सुरक्षित सर्वर से कनेक्टेड
          </p>
        </div>

        {/* Step-by-Step Practical Guides */}
        <div className="space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-6">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#78482A]" />
              बिहार भूमि डिजिटल पोर्टल: नागरिक सेवाएं एवं उद्देश्य
            </h2>
            <p>
              बिहार सरकार के राजस्व एवं भूमि सुधार विभाग द्वारा राज्य के रैयतों (जमीन मालिकों) को पारदर्शी और बिचौलिया-मुक्त सेवाएं प्रदान करने हेतु <strong>Bihar Bhumi</strong> वेब पोर्टल संचालित किया जा रहा है। इस पोर्टल के माध्यम से नागरिक अपने घर बैठे जमीन का खतियान, डिजिटल जमाबंदी पंजी, ऑनलाइन दाखिल खारिज (Mutation), भू-लगान (Land Revenue Tax) भुगतान तथा भूमि स्वामित्व प्रमाण पत्र (LPC) से संबंधित कार्य ऑनलाइन निष्पादित कर सकते हैं।
            </p>
          </section>

          {/* Section 2: How to View Jamabandi */}
          <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-amber-700" />
              डिजिटल जमाबंदी (खतियान / पर्चा) देखने की प्रक्रिया
            </h2>
            <ol className="space-y-2.5 list-decimal list-inside pl-1 text-slate-800">
              <li className="pl-1">
                सर्वप्रथम <strong>&quot;जमाबंदी पंजी देखें&quot;</strong> लिंक पर क्लिक करके संबंधित पृष्ठ पर जाएं।
              </li>
              <li className="pl-1">
                ड्रॉपडाउन मेन्यू से अपना <strong>जिला (District)</strong> एवं <strong>अंचल (Circle/Block)</strong> चुनें और &apos;Proceed&apos; पर क्लिक करें।
              </li>
              <li className="pl-1">
                इसके बाद अपने पंचायत अंतर्गत आने वाले <strong>हल्का</strong> एवं <strong>मौजा</strong> का चयन करें।
              </li>
              <li className="pl-1">
                खोजने के लिए किसी एक विकल्प का उपयोग करें: <strong>रैयत का नाम</strong>, <strong>खाता संख्या</strong>, <strong>खेसरा (प्लॉट) संख्या</strong>, अथवा <strong>जमाबंदी संख्या</strong>।
              </li>
              <li className="pl-1">
                सुरक्षा कोड (कैप्चा) दर्ज कर खोजें पर क्लिक करें। नीचे सूची में अपने नाम के सामने <strong>&apos;देखें&apos; (Eye Icon)</strong> पर क्लिक करके पूरी डिजिटल जमाबंदी पर्ची डाउनलोड या प्रिंट करें।
              </li>
            </ol>
          </section>

          {/* Section 3: Essential Land Records Checklist */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-700" />
              ऑनलाइन दाखिल खारिज (Mutation) हेतु आवश्यक दस्तावेज
            </h2>
            <p>
              यदि आपने हाल ही में कोई जमीन क्रय (Registry) की है अथवा पैतृक संपत्ति का बंटवारा हुआ है, तो नामान्तरण हेतु निम्नलिखित दस्तावेजों की आवश्यकता होती है:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>पंजीकृत केवाला (Registered Sale Deed) की स्पष्ट पीडीएफ</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>विक्रेता की पूर्व जमाबंदी अथवा अद्यतन लगान रसीद</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>विहित प्रपत्र में भरा हुआ स्व-घोषणा पत्र (Self-Declaration)</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>वंशावली प्रमाण पत्र (विरासत/पैतृक नामांतरण के मामलों में)</span>
              </div>
            </div>
          </section>

          {/* Section 4: Parimarjan & Online Lagan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#78482A] text-sm">
                <CreditCard size={16} /> भू-लगान (ऑनलाइन रसीद) भुगतान
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                अब अंचल कार्यालय जाए बिना अपनी जमीन का वार्षिक मालगुजारी लगान नेट बैंकिंग, यूपीआई अथवा डेबिट कार्ड से जमा कर सकते हैं। भुगतान होते ही तुरंत डिजिटल हस्ताक्षरित सरकारी रसीद जनरेट हो जाती है।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h3 className="font-black flex items-center gap-1.5 mb-2.5 text-[#78482A] text-sm">
                <RefreshCw size={16} /> परिमार्जन प्लस (त्रुटि सुधार)
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                यदि आपकी जमाबंदी में रैयत का नाम गलत है, खाता-खेसरा छूटा हुआ है या रकबा (क्षेत्रफल) कम दर्ज है, तो परिमार्जन प्लस पोर्टल पर साक्ष्य दस्तावेज अपलोड कर ऑनलाइन सुधार आवेदन दे सकते हैं।
              </p>
            </div>
          </div>

          {/* Section 5: FAQ Accordion Style */}
          <section className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#78482A]" />
              बिहार भूमि पोर्टल से जुड़े मुख्य प्रश्नोत्तर (FAQs)
            </h2>
            <div className="space-y-3.5 divide-y divide-slate-200 text-xs sm:text-sm">
              <div className="pt-2">
                <h3 className="font-bold text-slate-900">
                  प्र. दाखिल-खारिज (Mutation) कितने दिनों में स्वीकृत होता है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: बिहार लोक सेवा का अधिकार (RTPS) अधिनियम के अनुसार सामान्य मामलों में बिना आपत्ति के 35 कार्य दिवस तथा आपत्ति वाले मामलों में 75 कार्य दिवस की अधिकतम समय-सीमा निर्धारित है।
                </p>
              </div>

              <div className="pt-3">
                <h3 className="font-bold text-slate-900">
                  प्र. यदि ऑनलाइन रसीद कटने के बाद भी जमाबंदी अपडेट न हो तो क्या करें?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: सामान्यतः बैंक सर्वर से पुष्टि होने में 24 से 48 घंटे का समय लगता है। यदि राशि कटने के बाद रसीद लंबित दिखे तो &apos;Verify Payment&apos; विकल्प में जाकर ट्रांजेक्शन आईडी से स्थिति पुनः सत्यापित करें।
                </p>
              </div>

              <div className="pt-3">
                <h3 className="font-bold text-slate-900">
                  प्र. भू-स्वामित्व प्रमाण पत्र (LPC) किस कार्य हेतु आवश्यक होता है?
                </h3>
                <p className="text-slate-600 mt-1 pl-4">
                  उत्तर: कृषि ऋण (KCC), सरकारी योजनाओं के अनुदान, अथवा न्यायालयीन मामलों में वर्तमान स्वामित्व प्रमाणित करने के लिए अंचल अधिकारी द्वारा जारी अद्यतन LPC आवश्यक होता है।
                </p>
              </div>
            </div>
          </section>

          {/* Legal Advisory */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>सावधानी:</strong> ऑनलाइन प्राप्त डिजिटल जमाबंदी प्रति केवल सामान्य सूचना एवं संदर्भ हेतु मान्य है। किसी भी न्यायालयीन अथवा रजिस्ट्री प्रयोजन हेतु राजस्व विभाग से प्रमाणित प्रति (Certified Copy) प्राप्त करना आवश्यक है।
            </p>
          </div>

        </div>
      </div>
    </article>
  );
}

BiharBhumiLayout.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    applyUrl: PropTypes.string,
  }),
};