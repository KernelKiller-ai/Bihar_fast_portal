import { Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            संपर्क सूत्र
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            हमसे संपर्क करें (Contact Us)
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            किसी भी सूचना में त्रुटि, शिकायत, सुझाव या तकनीकी सहायता के लिए हमारी टीम से संपर्क करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
              <Mail size={18} />
            </div>
            <h4 className="font-bold text-xs text-slate-900">ईमेल सपोर्ट</h4>
            <p className="text-[11px] text-slate-500 mt-1">support@biharfast.in</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
              <MessageSquare size={18} />
            </div>
            <h4 className="font-bold text-xs text-slate-900">सोशल चैनल्स</h4>
            <p className="text-[11px] text-slate-500 mt-1">टेलीग्राम & व्हाट्सएप अलर्ट्स</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-2">
              <MapPin size={18} />
            </div>
            <h4 className="font-bold text-xs text-slate-900">क्षेत्र</h4>
            <p className="text-[11px] text-slate-500 mt-1">पटना, बिहार (भारत)</p>
          </div>
        </div>

        {/* Query Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900">अपना संदेश भेजें</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="आपका पूरा नाम"
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
            <input
              type="email"
              placeholder="ईमेल पता"
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>
          <input
            type="text"
            placeholder="विषय (उदा. फॉर्म भरने में समस्या, विज्ञापन त्रुटि)"
            required
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
          <textarea
            rows={4}
            placeholder="अपना संदेश विस्तार से लिखें..."
            required
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Send size={14} /> संदेश सबमिट करें
          </button>
        </form>

        <div className="pt-2">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    </div>
  );
}