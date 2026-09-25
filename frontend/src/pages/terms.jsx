import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <header>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            Legal Agreement
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">Terms &amp; Conditions of Use</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: September 2026</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">These Terms govern your use of BiharFast, an independent informational and career guidance platform. By visiting or using this portal, you confirm that you have read, understood, and completely agreed to these Terms. If you do not agree, stop using the portal.</p>
        </header>

        <div className="space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Nature of Service and Educational Purpose</h2>
            <p>BiharFast provides public-information summaries, career guidance, job and examination updates, links to public services, and educational tools. It is an independent private platform, not a government entity, recruitment agency, placement service, examination board, or authorized representative of any department.</p>
            <p>Information is provided for general education and convenience. Using this portal, its content, tools, links, or Android app constitutes complete agreement to these Terms and the applicable <Link to="/privacy" className="text-blue-700 underline">Privacy Policy</Link> and <Link to="/disclaimer" className="text-blue-700 underline">Disclaimer</Link>.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Intellectual Property and Fair Use of Government Information</h2>
            <p>BiharFast owns or has permission to use its platform UI, visual design, codebase, logo, original articles, editorial structure, and original tools. These materials may not be copied, republished, sold, mirrored, or commercially reused without prior written permission.</p>
            <p>Government logos, department names including BSSC, BPSC, CSBC, SSC, UPSC, and RRB, public examination circulars, notices, results, and other official information remain the property or responsibility of their respective departments and authorities. BiharFast references them strictly for fair-use citizen education, identification, commentary, and informational accessibility. Such references do not imply endorsement, authorization, affiliation, or ownership by BiharFast.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Prohibited User Activities</h2>
            <p>Unless BiharFast gives prior written permission, you must not:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>perform web scraping, automated crawling, data mining, bulk extraction, or commercial republication;</li>
              <li>launch, assist, or distribute a DDoS attack, malicious traffic, malware, or any activity that disrupts the service;</li>
              <li>reverse engineer, decompile, modify, or attempt to derive the source code of the website or app;</li>
              <li>bypass authentication, rate limits, access controls, security mechanisms, or technical restrictions; or</li>
              <li>misrepresent BiharFast, impersonate its team, misuse its branding, or use the portal for fraud or unlawful activity.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Disclaimer of Warranties and No Employment Guarantee</h2>
            <p>All notices, dates, eligibility information, vacancy figures, admit-card details, results, and syllabus information are provided “as-is” and may contain errors, omissions, delays, or outdated information. BiharFast does not guarantee accuracy, completeness, availability, uninterrupted access, examination selection, job placement, appointment, or employment.</p>
            <p>BiharFast is NOT a recruitment agency. Users are legally responsible for verifying every original notification, gazette, deadline, fee, and eligibility requirement directly from the relevant official department portal before applying or paying any fee. The official notification always prevails.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. External Links and Third-Party Actions</h2>
            <p>Links to third-party government application portals and services are provided for user convenience. Once you leave BiharFast, the external website controls its own content, privacy policy, security, application processing, payments, availability, and terms.</p>
            <p>BiharFast bears no liability for technical failures, rejected applications, missed deadlines, payment losses, fraudulent transactions, data submitted to external portals, or any other action or loss arising from a third-party website.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Availability, Changes, and Termination</h2>
            <p>We may suspend, modify, remove, or update any feature, page, notice, link, or service without notice. We may restrict access where we reasonably suspect abuse, security violations, unlawful conduct, or a breach of these Terms. We may also update these Terms; continued use after an update means you accept the revised Terms.</p>
          </section>

          <section className="space-y-2 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h2 className="text-base font-bold text-slate-900">7. Governing Law and Dispute Resolution</h2>
            <p>These Terms are governed strictly by the laws of India. Any dispute, claim, or proceeding connected with BiharFast or these Terms will be subject to the exclusive jurisdiction of the competent courts in Bihar, India.</p>
          </section>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">← Main page</Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            <Link to="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}