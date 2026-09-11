import { ShieldCheck, Zap, Users, Target, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        
        <header className="border-b border-slate-100 pb-6">
          <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-[#0B4F8A] px-3 py-1 rounded-full border border-blue-200">
            About BiharFast
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            About Us — BiharFast
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            सही जानकारी, बेहतर बिहार • A Citizen-First Public Information Platform
          </p>
        </header>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed font-normal">
          <p>
            <strong className="text-slate-900">BiharFast</strong> is an independent, non-governmental informational portal built to deliver fast, verified, and clutter-free alerts regarding government recruitments, competitive examinations, admit cards, results, and welfare schemes across Bihar and Central Government bodies.
          </p>
          <p>
            Navigating official government notifications in India can be frustrating due to heavy server loads, broken interfaces, and third-party aggregator portals laden with intrusive ads, malicious redirects, and clickbait headlines. BiharFast was founded to solve this problem: delivering lightweight, mobile-first, and zero-spam updates that load seamlessly even on 2G and 3G networks.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-[#0B4F8A] text-white flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">100% Verified Links</h3>
            <p className="text-xs text-slate-500 mt-1">Every link points directly to government NIC or departmental servers.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Zap size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Lightweight & Fast</h3>
            <p className="text-xs text-slate-500 mt-1">Optimized for low-bandwidth devices without bloatware scripts.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-3">
              <Users size={18} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Aspirant-Centric</h3>
            <p className="text-xs text-slate-500 mt-1">Built to help rural and urban students stay informed on time.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Target size={18} className="text-[#0B4F8A]" /> Our Mission
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our mission is to eliminate informational asymmetry for job seekers and rural citizens. Whether an applicant is preparing for BPSC, CSBC, BPSSC, Railway, SSC, or seeking benefits from Bihar Mukhyamantri Udyami Yojana, BiharFast acts as a transparent, easy-to-use directory.
          </p>
        </section>

        <section className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <HeartHandshake size={20} className="shrink-0 text-amber-700 mt-0.5" />
          <div>
            <strong className="block font-black">Official Clarification:</strong>
            BiharFast is an independent informational initiative and is <strong>not affiliated with, endorsed by, or operated by the Government of Bihar or the Government of India</strong>. All official recruitment notifications are linked back to their respective origin portals.
          </div>
        </section>

      </div>
    </main>
  );
}