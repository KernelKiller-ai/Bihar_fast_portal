import { STATIC_ROUTE_METADATA } from "../utils/seoConfig.js";

const page = (route, content) => ({
  ...content,
  metaTitle: STATIC_ROUTE_METADATA[route].title,
  metaDescription: STATIC_ROUTE_METADATA[route].description,
  canonical: STATIC_ROUTE_METADATA[route].canonical,
});

const contactCards = [
  { title: "आधिकारिक ईमेल", text: "support@biharfast.in", href: "mailto:support@biharfast.in" },
  { title: "कम्युनिटी चैनल", text: "टेलीग्राम & व्हाट्सएप ग्रुप्स" },
  { title: "राज्य / क्षेत्र", text: "पटना / शेखपुरा, बिहार (भारत)" },
];
const contactResponseHeading = "प्रतिक्रिया समय-सीमा (Response Timeline):";
const contactResponseText = [
  { type: "text", text: "हमारी तकनीकी एवं संपादकीय टीम कार्यदिवसों में सामान्यतः " },
  { type: "strong", text: "24 से 48 व्यावसायिक घंटों" },
  { type: "text", text: " के भीतर सभी प्राप्त ईमेल और संदेशों का संज्ञान लेकर उत्तर प्रेषित करती है।" },
];
const contactForm = {
  heading: "अपना संदेश प्रेषित करें",
  name: "आपका नाम (Full Name)",
  email: "ईमेल आईडी (Valid Email)",
  subject: "विषय (उदा. विज्ञापन में त्रुटि / विधिक सुझाव / कॉपीराइट)",
  message: "अपना संदेश स्पष्ट रूप से लिखें...",
  submit: "संदेश भेजें",
  submitting: "भेज रहे हैं... / Sending...",
  success: "धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।",
  error: "संदेश भेजा नहीं जा सका। कृपया कुछ देर बाद फिर प्रयास करें या support@biharfast.in पर ईमेल करें।",
};
const contactEditorialPolicies = [
  {
    heading: "Grievance Redressal Policy",
    paragraphs: [
      "We review reports about errors in examination circulars, admit-card details and corrections, result dates, eligibility information, broken official links, and typographical mistakes. When you contact us, include the BiharFast page URL, the relevant notice or application detail, and, where possible, the primary official source.",
      "Our editorial team aims to acknowledge and review complete grievances within 24 to 48 working hours on business days. If a correction is verified, we update the page or add a clarification. Complex issues may require additional time while we confirm details with the issuing authority.",
    ],
  },
  {
    heading: "Content Disclaimer & Verification Advisory",
    paragraphs: [
      "BiharFast is an independent information portal and is not a recruitment agency or government office. We summarize public information for convenience and do not collect application fees, guarantee selection, or submit forms on an applicant's behalf.",
      "Before submitting any recruitment application or paying a form fee, applicants must read and double-check the latest official notification, eligibility rules, dates, fees, and instructions on the issuing authority's website. The official notification and portal always take precedence over our summaries. Please report a suspected error with its official source so our editors can review it.",
    ],
  },
  {
    heading: "Working Hours & Location",
    paragraphs: [
      "Our editorial and support team is available Monday to Friday, 10:00 AM–6:00 PM IST, excluding public holidays. BiharFast operates from Patna / Sheikhpura, Bihar, India. Messages received outside working hours are reviewed on the next working day.",
    ],
  },
];

export const LEGAL_PAGES_CONTENT = {
  "/about": page("/about", {
    title: "हमारे बारे में (About BiharFast.in)",
    eyebrow: "About BiharFast Platform",
    subtitle: "सटीक सूचना, पारदर्शी मार्गदर्शन • Independent Educational Information Portal",
    sections: [
      {
        type: "intro",
        paragraphs: [
          [
            { type: "strong", text: "BiharFast.in" },
            { type: "text", text: " is an independent educational and public information portal built for students, job seekers, and citizens across Bihar and India. Our mission is to deliver fast, accurate, and simplified career, job, examination, result, admit-card, and education notifications for rural and urban aspirants." },
          ],
          "Government gazettes and recruitment notifications can be difficult to read, especially on a phone or a slow connection. We make complex public notices easier to understand and connect readers directly to the primary official source so they can make informed decisions.",
        ],
      },
      {
        type: "cards",
        cards: [
          {
            title: "Primary Sources",
            text: "We cite and link the official department portal or gazette whenever available.",
          },
          {
            title: "Fast and Accessible",
            text: "Lightweight pages designed for practical use on rural and urban connections.",
          },
          {
            title: "Student-Centric",
            text: "Clear summaries help students understand important dates, eligibility, and next steps.",
          },
        ],
      },
      {
        heading: "Our Mission in Practice",
        paragraphs: [
          "We aim to close the information gap between official public notices and the people who need them. BiharFast is not a government service and does not replace an official notification. It provides a clearer starting point for aspirants preparing for BPSC, CSBC, SSC, railway, board examinations, and public welfare or education schemes.",
        ],
      },
      {
        type: "callout",
        title: "Verification and Editorial Process",
        paragraphs: [
          "Every notification, syllabus update, and result update is manually checked against the relevant official department portal before publication. We always cite and link the primary official source where one is available. Readers must still verify the latest gazette before applying or taking action because departments can change dates and instructions.",
        ],
      },
      {
        heading: "Entity and Legal Identity",
        paragraphs: [
          "BiharFast is an independent educational and public information portal registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India. It is privately operated, self-funded, and independent, with no government ownership, government control, or political affiliation. References to government departments, examinations, and public notices do not imply endorsement or authorization.",
        ],
      },
      {
        type: "cards",
        cards: [
          {
            title: "100% Free Information",
            text: "No charge for reading public news, alerts, summaries, or source links.",
          },
          {
            title: "Anti-Fraud Commitment",
            text: "We never ask for money, sell forms, or promise a job or selection.",
          },
          {
            title: "Student-Centric Support",
            text: "We welcome corrections and handle grievances transparently.",
          },
        ],
      },
      {
        type: "callout",
        title: "Independent Public Information Platform",
        paragraphs: [
          [
            { type: "text", text: "BiharFast does not claim to be a government entity or represent a government official. Information is published for educational and public awareness purposes. Please read our " },
            { type: "link", text: "Disclaimer", href: "/disclaimer" },
            { type: "text", text: " before relying on any update." },
          ],
        ],
      },
      {
        heading: "Editorial Corrections and Support",
        paragraphs: [
          [
            { type: "text", text: "For corrections, source verification questions, copyright concerns, editorial inquiries, or student support, email " },
            { type: "link", text: "support@biharfast.in", href: "mailto:support@biharfast.in" },
            { type: "text", text: " or use our " },
            { type: "link", text: "Contact page", href: "/contact" },
            { type: "text", text: ". Please include the relevant page URL and official source where possible." },
          ],
        ],
      },
    ],
    footerLinks: [
      { text: "Disclaimer", href: "/disclaimer" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Contact Us", href: "/contact" },
    ],
  }),

  "/contact": page("/contact", {
    title: "हमसे संपर्क करें (Contact & Grievance Redressal)",
    eyebrow: "सहायता एवं संपर्क केंद्र",
    intro: "यदि आपको पोर्टल पर प्रकाशित किसी अधिसूचना में कोई तथ्यात्मक त्रुटि दिखाई दे, कॉपीराइट संबंधित कोई आपत्ति हो, अथवा तकनीकी सहायता की आवश्यकता हो, तो नीचे दिए गए माध्यमों से संपर्क करें।",
    contactCards,
    responseHeading: contactResponseHeading,
    responseText: contactResponseText,
    sections: [
      { type: "cards", heading: "Contact channels", cards: contactCards },
      { heading: contactResponseHeading, paragraphs: [contactResponseText] },
      ...contactEditorialPolicies,
      { type: "form", heading: contactForm.heading, fields: [contactForm.name, contactForm.email, contactForm.subject, contactForm.message] },
    ],
    editorialPolicies: contactEditorialPolicies,
    form: contactForm,
    footer: "स्पैम-मुक्त सुरक्षित संचार",
  }),

  "/privacy-policy": page("/privacy-policy", {
    title: "Privacy Policy",
    eyebrow: "Privacy, Cookies & Data Protection",
    updated: "Last updated: September 2026",
    intro: "This policy explains how BiharFast collects, uses, protects, and shares information when you visit biharfast.in. It is intended to support applicable Indian data-protection requirements, the Information Technology Act, 2000 and related rules, and applicable GDPR obligations where they apply to a visitor.",
    sections: [
      {
        heading: "1. Information We Collect",
        paragraphs: ["We collect only information reasonably needed to operate, secure, improve, and support the website:"],
        lists: [{
          items: [
            [{ type: "strong", text: "Public visitor and technical data:" }, { type: "text", text: " IP address, browser type, device information, operating system, referring page, approximate usage data, and timestamps may be processed through standard server logs and Google Analytics 4 (GA4)." }],
            [{ type: "strong", text: "Contact and support data:" }, { type: "text", text: " name, email address, optional subject, and message submitted through our Contact form. Contact submissions are transmitted to Web3Forms for delivery to our support team." }],
            [{ type: "strong", text: "Newsletter and push alerts:" }, { type: "text", text: " email addresses submitted for newsletter updates and OneSignal browser push notification tokens created only after a user voluntarily grants browser permission." }],
          ],
        }],
        emphasis: "We NEVER collect or store sensitive personal information such as government passwords, bank details, payment card data, OTPs, or online-banking credentials.",
      },
      {
        heading: "2. How We Use Information",
        paragraphs: ["Information may be used to respond to support and correction requests, deliver voluntarily requested newsletter or push alerts, prevent abuse, secure the website, understand aggregated traffic, improve performance and usability, and comply with legal obligations. We do not sell personal information or use contact submissions for unrelated marketing."],
      },
      {
        heading: "3. Cookies, Google AdSense, and Third-Party Advertising Compliance",
        paragraphs: [
          "BiharFast (biharfast.in) uses cookies and third-party advertising partners, prominently including Google AdSense, to deliver relevant advertisements and sustain our free educational and job notification platform.",
          [
            { type: "strong", text: "Google AdSense & DoubleClick DART Cookie: " },
            { type: "text", text: "Google is a third-party advertising vendor on our website. Google uses cookies, including the DoubleClick DART cookie, to serve advertisements to visitors based on their visit to biharfast.in and other sites across the Internet. The DART cookie enables Google and its certified partner ad networks to serve targeted, interest-based advertisements based on prior visits." },
          ],
          [
            { type: "strong", text: "Third-Party Ad Networks and Vendors: " },
            { type: "text", text: "Other third-party advertising partners and ad networks may also use cookies, JavaScript, or Web Beacons within the advertisements and links displayed on BiharFast. These technologies automatically receive your IP address when ad impressions occur. They are utilized by advertising partners to gauge campaign performance and personalize ad content according to their own privacy standards." },
          ],
          [
            { type: "strong", text: "No Access to Personal Information: " },
            { type: "text", text: "BiharFast does not sell, rent, or provide any personally identifiable information (such as your name, email address, phone number, or government exam credentials) to third-party advertisers. BiharFast has no direct access to or control over cookies or tracking technologies deployed by third-party advertisers." },
          ],
          [
            { type: "strong", text: "User Opt-Out and Cookie Control Options: " },
            { type: "text", text: "Users have the complete right and technical ability to opt out of personalized advertising or disable cookies through the following verified resources:" },
          ],
        ],
        lists: [{
          items: [
            [
              { type: "text", text: "You can opt out of personalized Google advertising by visiting " },
              { type: "link", text: "Google Ads Settings", href: "https://adssettings.google.com/", external: true },
              { type: "text", text: " or reviewing " },
              { type: "link", text: "Google's Advertising Privacy Principles", href: "https://policies.google.com/technologies/ads", external: true },
              { type: "text", text: "." },
            ],
            [
              { type: "text", text: "You can opt out of third-party vendor cookies for interest-based advertising through " },
              { type: "link", text: "AboutAds Choices", href: "https://www.aboutads.info/choices/", external: true },
              { type: "text", text: " or the " },
              { type: "link", text: "Network Advertising Initiative (NAI)", href: "https://optout.networkadvertising.org/", external: true },
              { type: "text", text: "." },
            ],
            [
              { type: "text", text: "You can modify your browser settings (Chrome, Edge, Safari, Firefox) to block or delete cookies. Disabling cookies may affect certain session-based preferences on web portals." },
            ],
          ],
        }],
      },
      {
        heading: "4. Analytics and Push Notifications",
        paragraphs: [
          [{ type: "strong", text: "Google Analytics 4:" }, { type: "text", text: " GA4 helps us understand aggregated traffic patterns, page performance, and user experience improvements. Google may process identifiers and usage information according to its own privacy terms." }],
          [{ type: "strong", text: "OneSignal:" }, { type: "text", text: " OneSignal is used for real-time exam, job, and public-service alerts. It operates only after browser permission is granted. Users can revoke notification permission at any time through their browser or device settings; they may also contact us to request removal of related alert data." }],
        ],
      },
      {
        heading: "5. External Government and Third-Party Portals",
        paragraphs: ["BiharFast links to external official government portals such as bpsc.bihar.gov.in and bssc.bihar.gov.in for convenience. Once a user leaves BiharFast, the destination website's privacy policy, cookies, security practices, and terms govern that session. We do not control or accept responsibility for external websites."],
      },
      {
        heading: "6. Security and Retention",
        paragraphs: [
          "We use reasonable technical and organizational safeguards, including HTTPS transport where available, access controls, limited administrative access, and service-provider security controls, to protect contact messages and newsletter email data. No internet transmission or storage system can be guaranteed completely secure.",
          "Contact data is retained only as long as reasonably necessary to respond, resolve a grievance, maintain required records, or defend legal claims. Newsletter data is retained until unsubscribe or deletion. Analytics and server-log retention may follow the configured retention periods of the relevant hosting and analytics providers.",
        ],
      },
      {
        heading: "7. User Rights and Choices",
        paragraphs: [
          [
            { type: "text", text: "Subject to applicable law, users may request access, correction, deletion, restriction, or withdrawal of consent for information we control. Users may unsubscribe from newsletter emails and revoke push alerts in browser settings. To request data deletion or unsubscribe from alerts, email " },
            { type: "link", text: "support@biharfast.in", href: "mailto:support@biharfast.in" },
            { type: "text", text: " with enough information for us to identify the request. We may retain information required by law or necessary to prevent fraud and resolve disputes." },
          ],
        ],
      },
      {
        heading: "8. Grievance Officer and Privacy Contact",
        type: "callout",
        paragraphs: [
          "For privacy questions, data deletion requests, advertising concerns, or grievances under applicable Indian law, contact:",
          "We aim to acknowledge valid requests and respond within a reasonable period, subject to verification and applicable legal requirements.",
        ],
        links: [{ text: "support@biharfast.in", href: "mailto:support@biharfast.in" }],
      },
      {
        heading: "9. Children's Privacy and Policy Updates",
        paragraphs: ["The website is intended for general public information and exam preparation. We do not knowingly request sensitive information from children. If you believe a child has submitted personal information, contact us for review and deletion. We may update this policy when services, law, or data practices change; the updated date at the top will indicate the latest version."],
      },
    ],
    footerLinks: [{ text: "Privacy questions? Contact us", href: "/contact" }],
  }),

  "/terms": page("/terms", {
    title: "Terms & Conditions of Use",
    eyebrow: "Legal Agreement",
    updated: "Last updated: September 2026",
    intro: "These Terms govern your use of BiharFast, an independent informational and career guidance platform. By visiting or using this portal, you confirm that you have read, understood, and completely agreed to these Terms. If you do not agree, stop using the portal.",
    sections: [
      {
        heading: "1. Nature of Service and Educational Purpose",
        paragraphs: [
          "BiharFast provides public-information summaries, career guidance, job and examination updates, links to public services, and educational tools. It is an independent private platform, not a government entity, recruitment agency, placement service, examination board, or authorized representative of any department.",
          [
            { type: "text", text: "Information is provided for general education and convenience. Using this portal, its content, tools, links, or Android app constitutes complete agreement to these Terms and the applicable " },
            { type: "link", text: "Privacy Policy", href: "/privacy" },
            { type: "text", text: " and " },
            { type: "link", text: "Disclaimer", href: "/disclaimer" },
            { type: "text", text: "." },
          ],
        ],
      },
      {
        heading: "2. Intellectual Property and Fair Use of Government Information",
        paragraphs: [
          "BiharFast owns or has permission to use its platform UI, visual design, codebase, logo, original articles, editorial structure, and original tools. These materials may not be copied, republished, sold, mirrored, or commercially reused without prior written permission.",
          "Government logos, department names including BSSC, BPSC, CSBC, SSC, UPSC, and RRB, public examination circulars, notices, results, and other official information remain the property or responsibility of their respective departments and authorities. BiharFast references them strictly for fair-use citizen education, identification, commentary, and informational accessibility. Such references do not imply endorsement, authorization, affiliation, or ownership by BiharFast.",
        ],
      },
      {
        heading: "3. Prohibited User Activities",
        paragraphs: ["Unless BiharFast gives prior written permission, you must not:"],
        lists: [{
          items: [
            "perform web scraping, automated crawling, data mining, bulk extraction, or commercial republication;",
            "launch, assist, or distribute a DDoS attack, malicious traffic, malware, or any activity that disrupts the service;",
            "reverse engineer, decompile, modify, or attempt to derive the source code of the website or app;",
            "bypass authentication, rate limits, access controls, security mechanisms, or technical restrictions; or",
            "misrepresent BiharFast, impersonate its team, misuse its branding, or use the portal for fraud or unlawful activity.",
          ],
        }],
      },
      {
        heading: "4. Disclaimer of Warranties and No Employment Guarantee",
        paragraphs: [
          "All notices, dates, eligibility information, vacancy figures, admit-card details, results, and syllabus information are provided “as-is” and may contain errors, omissions, delays, or outdated information. BiharFast does not guarantee accuracy, completeness, availability, uninterrupted access, examination selection, job placement, appointment, or employment.",
          "BiharFast is NOT a recruitment agency. Users are legally responsible for verifying every original notification, gazette, deadline, fee, and eligibility requirement directly from the relevant official department portal before applying or paying any fee. The official notification always prevails.",
        ],
      },
      {
        heading: "5. External Links and Third-Party Actions",
        paragraphs: [
          "Links to third-party government application portals and services are provided for user convenience. Once you leave BiharFast, the external website controls its own content, privacy policy, security, application processing, payments, availability, and terms.",
          "BiharFast bears no liability for technical failures, rejected applications, missed deadlines, payment losses, fraudulent transactions, data submitted to external portals, or any other action or loss arising from a third-party website.",
        ],
      },
      {
        heading: "6. Availability, Changes, and Termination",
        paragraphs: ["We may suspend, modify, remove, or update any feature, page, notice, link, or service without notice. We may restrict access where we reasonably suspect abuse, security violations, unlawful conduct, or a breach of these Terms. We may also update these Terms; continued use after an update means you accept the revised Terms."],
      },
      {
        heading: "7. Governing Law and Dispute Resolution",
        type: "callout",
        paragraphs: ["These Terms are governed strictly by the laws of India. Any dispute, claim, or proceeding connected with BiharFast or these Terms will be subject to the exclusive jurisdiction of the competent courts in Bihar, India."],
      },
    ],
    footerLinks: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Contact Us", href: "/contact" },
    ],
  }),

  "/disclaimer": page("/disclaimer", {
    title: "BiharFast Disclaimer",
    eyebrow: "Legal Disclaimer & Public Notice",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Strict Non-Government Declaration",
        type: "callout",
        paragraphs: [
          "BiharFast is an independent private informational portal. It is NOT affiliated with, authorized by, or associated with any central or state government body (such as BPSC, BSSC, CSBC, SSC, UPSC, RRB).",
          "We do not claim to be a government entity and do not represent any government official, department, commission, board, ministry, or recruitment authority. Government names, logos, notices, and links are referenced only to help users locate public information.",
        ],
      },
      {
        heading: "Source Attribution and Information Purpose",
        paragraphs: [
          "All notifications, results, admit cards, and recruitment notices published on BiharFast are sourced strictly from publicly accessible official government websites, official portals, and public press releases. We reproduce or summarize this information for convenience, awareness, and educational purposes only.",
          [{ type: "strong", text: "Users MUST always verify every date, eligibility condition, fee, vacancy, result, and instruction directly from the relevant official gazette or government portal before applying, paying a fee, travelling, or taking any other action." }],
        ],
      },
      {
        heading: "No Employment Fee and Anti-Fraud Warning",
        paragraphs: [
          "BiharFast never charges money, fees, commissions, donations, or processing charges for providing job information, application forms, admit cards, hall tickets, results, or links to public services. BiharFast does not guarantee selection, appointment, examination results, or employment.",
          [{ type: "strong", text: "Beware of fraudsters who use the BiharFast name, logo, or links to request money, OTPs, passwords, bank details, or personal documents. Do not pay anyone claiming to represent BiharFast. Report suspicious activity to the relevant authorities and contact us at support@biharfast.in." }],
        ],
      },
      {
        heading: "Limitation of Liability and Updates",
        paragraphs: [
          "BiharFast is not legally or financially liable for unintentional typographical errors, omissions, incomplete information, delayed updates, broken external links, server interruptions, application errors, payment issues, or sudden changes to examination dates, eligibility, vacancies, or procedures made by recruitment boards or government authorities.",
          "Official departments and recruitment boards may revise, postpone, cancel, or replace notices without prior warning. The latest official notification and gazette always take precedence over any information displayed on BiharFast.",
        ],
      },
      {
        heading: "External Links and User Responsibility",
        paragraphs: ["BiharFast links to external government and third-party websites for user convenience. We do not control or endorse the availability, security, privacy practices, content, or terms of those websites. Users are responsible for checking the address bar and submitting information only on the official portal they intend to use."],
      },
      {
        heading: "Content Takedown and Grievance Redressal",
        type: "callout",
        paragraphs: ["If any government authority, organization, copyright owner, or user identifies a factual discrepancy, outdated notice, unauthorized use of copyrighted material, or other concern, please contact us for immediate review and grievance redressal."],
        links: [{ text: "support@biharfast.in", href: "mailto:support@biharfast.in" }],
      },
    ],
    footerLinks: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Contact Us", href: "/contact" },
    ],
  }),
};

export function getLegalPageContent(route) {
  return LEGAL_PAGES_CONTENT[route] || null;
}
