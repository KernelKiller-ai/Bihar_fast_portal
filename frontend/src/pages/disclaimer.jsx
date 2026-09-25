import { AlertOctagon, CheckCircle2, FileWarning, Mail, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <header>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            Legal Disclaimer &amp; Public Notice
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">BiharFast Disclaimer</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: September 2026</p>
        </header>

        <section className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 sm:p-6 flex items-start gap-3" aria-labelledby="non-government-heading">
          <AlertOctagon className="text-rose-700 shrink-0 mt-0.5" size={24} />
          <div className="text-sm text-rose-950 space-y-3 leading-relaxed">
            <h2 id="non-government-heading" className="text-base sm:text-lg font-black text-rose-900">Strict Non-Government Declaration</h2>
            <p className="font-black">BiharFast is an independent private informational portal. It is NOT affiliated with, authorized by, or associated with any central or state government body (such as BPSC, BSSC, CSBC, SSC, UPSC, RRB).</p>
            <p>We do not claim to be a government entity and do not represent any government official, department, commission, board, ministry, or recruitment authority. Government names, logos, notices, and links are referenced only to help users locate public information.</p>
          </div>
        </section>

        <div className="space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2" aria-labelledby="source-heading">
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-600" /><h2 id="source-heading" className="text-base font-bold text-slate-900">Source Attribution and Information Purpose</h2></div>
            <p>All notifications, results, admit cards, and recruitment notices published on BiharFast are sourced strictly from publicly accessible official government websites, official portals, and public press releases. We reproduce or summarize this information for convenience, awareness, and educational purposes only.</p>
            <p className="font-bold text-slate-900">Users MUST always verify every date, eligibility condition, fee, vacancy, result, and instruction directly from the relevant official gazette or government portal before applying, paying a fee, travelling, or taking any other action.</p>
          </section>

          <section className="space-y-2" aria-labelledby="fraud-heading">
            <div className="flex items-center gap-2"><ShieldAlert size={18} className="text-amber-600" /><h2 id="fraud-heading" className="text-base font-bold text-slate-900">No Employment Fee and Anti-Fraud Warning</h2></div>
            <p>BiharFast never charges money, fees, commissions, donations, or processing charges for providing job information, application forms, admit cards, hall tickets, results, or links to public services. BiharFast does not guarantee selection, appointment, examination results, or employment.</p>
            <p className="font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">Beware of fraudsters who use the BiharFast name, logo, or links to request money, OTPs, passwords, bank details, or personal documents. Do not pay anyone claiming to represent BiharFast. Report suspicious activity to the relevant authorities and contact us at support@biharfast.in.</p>
          </section>

          <section className="space-y-2" aria-labelledby="liability-heading">
            <div className="flex items-center gap-2"><FileWarning size={18} className="text-slate-500" /><h2 id="liability-heading" className="text-base font-bold text-slate-900">Limitation of Liability and Updates</h2></div>
            <p>BiharFast is not legally or financially liable for unintentional typographical errors, omissions, incomplete information, delayed updates, broken external links, server interruptions, application errors, payment issues, or sudden changes to examination dates, eligibility, vacancies, or procedures made by recruitment boards or government authorities.</p>
            <p>Official departments and recruitment boards may revise, postpone, cancel, or replace notices without prior warning. The latest official notification and gazette always take precedence over any information displayed on BiharFast.</p>
          </section>

          <section className="space-y-2" aria-labelledby="external-heading">
            <h2 id="external-heading" className="text-base font-bold text-slate-900">External Links and User Responsibility</h2>
            <p>BiharFast links to external government and third-party websites for user convenience. We do not control or endorse the availability, security, privacy practices, content, or terms of those websites. Users are responsible for checking the address bar and submitting information only on the official portal they intend to use.</p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2" aria-labelledby="grievance-heading">
            <div className="flex items-center gap-2"><Mail size={18} className="text-[#0B4F8A]" /><h2 id="grievance-heading" className="text-base font-bold text-slate-900">Content Takedown and Grievance Redressal</h2></div>
            <p>If any government authority, organization, copyright owner, or user identifies a factual discrepancy, outdated notice, unauthorized use of copyrighted material, or other concern, please contact us for immediate review and grievance redressal.</p>
            <a href="mailto:support@biharfast.in" className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:underline"><Mail size={15} /> support@biharfast.in</a>
          </section>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">← Main page</Link>
          <div className="flex items-center gap-3 text-xs font-bold"><Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link><Link to="/contact" className="text-blue-600 hover:underline">Contact Us</Link></div>
        </div>
      </div>
    </main>
  );
}