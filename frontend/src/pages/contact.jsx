import { Mail, MapPin, Send, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            सहायता एवं संपर्क केंद्र
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            हमसे संपर्क करें (Contact & Grievance Redressal)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            यदि आपको पोर्टल पर प्रकाशित किसी अधिसूचना में कोई तथ्यात्मक त्रुटि दिखाई दे, कॉपीराइट संबंधित कोई आपत्ति हो, अथवा तकनीकी सहायता की आवश्यकता हो, तो नीचे दिए गए माध्यमों से संपर्क करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
              <Mail size={18} />
            </div>
            <h4 className="font-bold text-xs text-slate-900">आधिकारिक ईमेल</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-mono select-all">support@biharfast.in</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
              <MessageSquare size={18} />
            </div>
            <h4 className="font-bold text-xs text-slate-900">कम्युनिटी चैनल</h4>
            <p className="text-[11px] text-slate-500 mt-1">टेलीग्राम & व्हाट्सएप ग्रुप्स</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-2">
              <MapPin size={18} />
            </div>
            <h4 className="font-bold text-xs text-slate-900">राज्य / क्षेत्र</h4>
            <p className="text-[11px] text-slate-500 mt-1">पटना / शेखपुरा, बिहार (भारत)</p>
          </div>
        </div>

        {/* Grievance & Response Timeline Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Clock size={14} className="text-[#0B4F8A]" /> 
            प्रतिक्रिया समय-सीमा (Response Timeline):
          </div>
          <p>
            हमारी तकनीकी एवं संपादकीय टीम कार्यदिवसों में सामान्यतः <strong>24 से 48 व्यावसायिक घंटों</strong> के भीतर सभी प्राप्त ईमेल और संदेशों का संज्ञान लेकर उत्तर प्रेषित करती है।
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Send size={15} className="text-[#0B4F8A]" /> अपना संदेश प्रेषित करें
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="आपका नाम (Full Name)"
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
            <input
              type="email"
              placeholder="ईमेल आईडी (Valid Email)"
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>
          <input
            type="text"
            placeholder="विषय (उदा. विज्ञापन में त्रुटि / विधिक सुझाव / कॉपीराइट)"
            required
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
          <textarea
            rows={4}
            placeholder="अपना संदेश स्पष्ट रूप से लिखें..."
            required
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#0B4F8A] hover:bg-[#083c68] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-xs active:scale-95"
          >
            <Send size={14} /> संदेश भेजें
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" /> स्पैम-मुक्त सुरक्षित संचार
          </span>
        </div>
      </div>
    </div>
  );
}