import { ShieldCheck, Zap, Users, Target, HeartHandshake, Compass, Mail, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <header className="border-b border-slate-100 pb-6">
          <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-[#0B4F8A] px-3 py-1 rounded-full border border-blue-200">
            About BiharFast Platform
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            हमारे बारे में (About BiharFast.in)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">सटीक सूचना, पारदर्शी मार्गदर्शन • Independent Educational Information Portal</p>
        </header>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          <p><strong className="text-slate-900">BiharFast.in</strong> is an independent educational and public information portal built for students, job seekers, and citizens across Bihar and India. Our mission is to deliver fast, accurate, and simplified career, job, examination, result, admit-card, and education notifications for rural and urban aspirants.</p>
          <p>Government gazettes and recruitment notifications can be difficult to read, especially on a phone or a slow connection. We make complex public notices easier to understand and connect readers directly to the primary official source so they can make informed decisions.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-[#0B4F8A] text-white flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Primary Sources</h3>
            <p className="text-xs text-slate-500 mt-1">We cite and link the official department portal or gazette whenever available.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Zap size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Fast and Accessible</h3>
            <p className="text-xs text-slate-500 mt-1">Lightweight pages designed for practical use on rural and urban connections.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-3">
              <Users size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Student-Centric</h3>
            <p className="text-xs text-slate-500 mt-1">Clear summaries help students understand important dates, eligibility, and next steps.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2"><Target size={18} className="text-[#0B4F8A]" /> Our Mission in Practice</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">We aim to close the information gap between official public notices and the people who need them. BiharFast is not a government service and does not replace an official notification. It provides a clearer starting point for aspirants preparing for BPSC, CSBC, SSC, railway, board examinations, and public welfare or education schemes.</p>
        </section>

        <section className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
          <BookOpenCheck size={20} className="shrink-0 text-blue-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-black text-blue-900 mb-1">Verification and Editorial Process</strong>
            Every notification, syllabus update, and result update is manually checked against the relevant official department portal before publication. We always cite and link the primary official source where one is available. Readers must still verify the latest gazette before applying or taking action because departments can change dates and instructions.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2"><Compass size={18} className="text-emerald-700" /> Entity and Legal Identity</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">BiharFast is an independent educational and public information portal registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India. It is privately operated, self-funded, and independent, with no government ownership, government control, or political affiliation. References to government departments, examinations, and public notices do not imply endorsement or authorization.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200"><h3 className="font-extrabold text-slate-900 text-sm">100% Free Information</h3><p className="text-xs text-slate-600 mt-1">No charge for reading public news, alerts, summaries, or source links.</p></div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200"><h3 className="font-extrabold text-slate-900 text-sm">Anti-Fraud Commitment</h3><p className="text-xs text-slate-600 mt-1">We never ask for money, sell forms, or promise a job or selection.</p></div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200"><h3 className="font-extrabold text-slate-900 text-sm">Student-Centric Support</h3><p className="text-xs text-slate-600 mt-1">We welcome corrections and handle grievances transparently.</p></div>
        </section>

        <section className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <HeartHandshake size={20} className="shrink-0 text-amber-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-black text-amber-900 mb-1">Independent Public Information Platform</strong>
            BiharFast does not claim to be a government entity or represent a government official. Information is published for educational and public awareness purposes. Please read our <Link to="/disclaimer" className="font-bold text-blue-700 underline">Disclaimer</Link> before relying on any update.
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2"><Mail size={18} className="text-[#0B4F8A]" /> Editorial Corrections and Support</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">For corrections, source verification questions, copyright concerns, editorial inquiries, or student support, email <a href="mailto:support@biharfast.in" className="font-bold text-blue-700 underline">support@biharfast.in</a> or use our <Link to="/contact" className="font-bold text-blue-700 underline">Contact page</Link>. Please include the relevant page URL and official source where possible.</p>
          <div className="flex flex-wrap gap-3 text-xs font-bold"><Link to="/disclaimer" className="text-blue-700 hover:underline">Disclaimer</Link><Link to="/privacy" className="text-blue-700 hover:underline">Privacy Policy</Link><Link to="/contact" className="text-blue-700 hover:underline">Contact Us</Link></div>
        </section>

        <div className="pt-2">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>

      </div>
    </main>
  );
}