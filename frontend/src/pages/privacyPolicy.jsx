import { Cookie, ExternalLink, LockKeyhole, Mail, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const externalLinkClass = "text-blue-700 underline underline-offset-2 hover:text-blue-900";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <header>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            Privacy, Cookies &amp; Data Protection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">Privacy Policy</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: September 2026</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            This policy explains how BiharFast collects, uses, protects, and shares information when you visit <strong>biharfast.in</strong>. It is intended to support applicable Indian data-protection requirements, the Information Technology Act, 2000 and related rules, and applicable GDPR obligations where they apply to a visitor.
          </p>
        </header>

        <div className="space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2" aria-labelledby="collection-heading">
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-blue-700" /><h2 id="collection-heading" className="text-base font-bold text-slate-900">1. Information We Collect</h2></div>
            <p>We collect only information reasonably needed to operate, secure, improve, and support the website:</p>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li><strong>Public visitor and technical data:</strong> IP address, browser type, device information, operating system, referring page, approximate usage data, and timestamps may be processed through standard server logs and Google Analytics 4 (GA4).</li>
              <li><strong>Contact and support data:</strong> name, email address, optional subject, and message submitted through our Contact form. Contact submissions are transmitted to Web3Forms for delivery to our support team.</li>
              <li><strong>Newsletter and push alerts:</strong> email addresses submitted for newsletter updates and OneSignal browser push notification tokens created only after a user voluntarily grants browser permission.</li>
            </ul>
            <p className="font-bold text-slate-900">We NEVER collect or store sensitive personal information such as government passwords, bank details, payment card data, OTPs, or online-banking credentials.</p>
          </section>

          <section className="space-y-2" aria-labelledby="use-heading">
            <div className="flex items-center gap-2"><LockKeyhole size={18} className="text-emerald-700" /><h2 id="use-heading" className="text-base font-bold text-slate-900">2. How We Use Information</h2></div>
            <p>Information may be used to respond to support and correction requests, deliver voluntarily requested newsletter or push alerts, prevent abuse, secure the website, understand aggregated traffic, improve performance and usability, and comply with legal obligations. We do not sell personal information or use contact submissions for unrelated marketing.</p>
          </section>

          <section className="space-y-2" aria-labelledby="ads-heading">
            <div className="flex items-center gap-2"><Cookie size={18} className="text-amber-600" /><h2 id="ads-heading" className="text-base font-bold text-slate-900">3. Cookies, Google AdSense and DoubleClick DART</h2></div>
            <p>This website may use Google AdSense and other third-party advertising vendors. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</p>
            <p>Google may use advertising cookies, including the DoubleClick DART cookie, to enable Google and its partners to serve ads based on visits to this website and other websites. Advertising partners may process cookie identifiers, device information, and contextual or interest-based signals under their own policies.</p>
            <p>Users can opt out of personalized advertising through <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className={externalLinkClass}>Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info/" target="_blank" rel="noreferrer" className={externalLinkClass}>www.aboutads.info</a>. Where legally required, non-essential cookies and personalized advertising should be controlled through the site&apos;s consent choices.</p>
          </section>

          <section className="space-y-2" aria-labelledby="analytics-heading">
            <h2 id="analytics-heading" className="text-base font-bold text-slate-900">4. Analytics and Push Notifications</h2>
            <p><strong>Google Analytics 4:</strong> GA4 helps us understand aggregated traffic patterns, page performance, and user experience improvements. Google may process identifiers and usage information according to its own privacy terms.</p>
            <p><strong>OneSignal:</strong> OneSignal is used for real-time exam, job, and public-service alerts. It operates only after browser permission is granted. Users can revoke notification permission at any time through their browser or device settings; they may also contact us to request removal of related alert data.</p>
          </section>

          <section className="space-y-2" aria-labelledby="links-heading">
            <div className="flex items-center gap-2"><ExternalLink size={18} className="text-slate-500" /><h2 id="links-heading" className="text-base font-bold text-slate-900">5. External Government and Third-Party Portals</h2></div>
            <p>BiharFast links to external official government portals such as <strong>bpsc.bihar.gov.in</strong> and <strong>bssc.bihar.gov.in</strong> for convenience. Once a user leaves BiharFast, the destination website&apos;s privacy policy, cookies, security practices, and terms govern that session. We do not control or accept responsibility for external websites.</p>
          </section>

          <section className="space-y-2" aria-labelledby="security-heading">
            <div className="flex items-center gap-2"><LockKeyhole size={18} className="text-blue-700" /><h2 id="security-heading" className="text-base font-bold text-slate-900">6. Security and Retention</h2></div>
            <p>We use reasonable technical and organizational safeguards, including HTTPS transport where available, access controls, limited administrative access, and service-provider security controls, to protect contact messages and newsletter email data. No internet transmission or storage system can be guaranteed completely secure.</p>
            <p>Contact data is retained only as long as reasonably necessary to respond, resolve a grievance, maintain required records, or defend legal claims. Newsletter data is retained until unsubscribe or deletion. Analytics and server-log retention may follow the configured retention periods of the relevant hosting and analytics providers.</p>
          </section>

          <section className="space-y-2" aria-labelledby="rights-heading">
            <div className="flex items-center gap-2"><Trash2 size={18} className="text-rose-700" /><h2 id="rights-heading" className="text-base font-bold text-slate-900">7. User Rights and Choices</h2></div>
            <p>Subject to applicable law, users may request access, correction, deletion, restriction, or withdrawal of consent for information we control. Users may unsubscribe from newsletter emails and revoke push alerts in browser settings. To request data deletion or unsubscribe from alerts, email <a href="mailto:support@biharfast.in" className={externalLinkClass}>support@biharfast.in</a> with enough information for us to identify the request. We may retain information required by law or necessary to prevent fraud and resolve disputes.</p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2" aria-labelledby="grievance-heading">
            <h2 id="grievance-heading" className="text-base font-bold text-slate-900">8. Grievance Officer and Privacy Contact</h2>
            <p>For privacy questions, data deletion requests, advertising concerns, or grievances under applicable Indian law, contact:</p>
            <a href="mailto:support@biharfast.in" className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:underline"><Mail size={16} /> support@biharfast.in</a>
            <p className="text-xs text-slate-500">We aim to acknowledge valid requests and respond within a reasonable period, subject to verification and applicable legal requirements.</p>
          </section>

          <section className="space-y-2" aria-labelledby="children-heading">
            <h2 id="children-heading" className="text-base font-bold text-slate-900">9. Children&apos;s Privacy and Policy Updates</h2>
            <p>The website is intended for general public information and exam preparation. We do not knowingly request sensitive information from children. If you believe a child has submitted personal information, contact us for review and deletion. We may update this policy when services, law, or data practices change; the updated date at the top will indicate the latest version.</p>
          </section>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">← Main page</Link>
          <Link to="/contact" className="text-xs font-bold text-blue-600 hover:underline">Privacy questions? Contact us</Link>
        </div>
      </div>
    </main>
  );
}