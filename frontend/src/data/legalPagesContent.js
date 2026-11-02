import { STATIC_ROUTE_METADATA } from "../utils/seoConfig.js";

const page = (route, content) => ({
  ...content,
  metaTitle: STATIC_ROUTE_METADATA[route].title,
  metaDescription: STATIC_ROUTE_METADATA[route].description,
  canonical: STATIC_ROUTE_METADATA[route].canonical,
});

const contactCards = [
  { title: "संपादकीय और तकनीकी सहायता", text: "support@biharfast.in", href: "mailto:support@biharfast.in" },
  { title: "Grievance redressal", text: "support@biharfast.in · Subject: Grievance", href: "mailto:support@biharfast.in?subject=Grievance%20Redressal" },
  { title: "गोपनीयता और डेटा अनुरोध", text: "support@biharfast.in · Subject: Privacy", href: "mailto:support@biharfast.in?subject=Privacy%20Request" },
];
const contactResponseHeading = "प्रतिक्रिया समय-सीमा (Response Timeline):";
const contactResponseText = [
  { type: "text", text: "हम सामान्यतः " },
  { type: "strong", text: "24–48 घंटे" },
  { type: "text", text: " में संदेश की समीक्षा या प्राप्ति की पुष्टि करने का प्रयास करते हैं। जटिल शिकायत, छुट्टी, या आधिकारिक स्रोत से पुष्टि की आवश्यकता होने पर पूरा समाधान अधिक समय ले सकता है।" },
];
const contactForm = {
  heading: "अपना संदेश प्रेषित करें",
  name: "आपका नाम (Full Name)",
  email: "ईमेल आईडी (Valid Email)",
  subject: "संदेश का प्रकार",
  subjectPlaceholder: "संदेश का प्रकार चुनें",
  feedbackOptions: [
    { value: "Factual correction", label: "तथ्यात्मक सुधार / आधिकारिक स्रोत" },
    { value: "Grievance redressal", label: "शिकायत / Grievance redressal" },
    { value: "Privacy or data request", label: "गोपनीयता / डेटा अनुरोध" },
    { value: "Copyright or legal concern", label: "कॉपीराइट / कानूनी चिंता" },
    { value: "Technical support", label: "तकनीकी सहायता" },
    { value: "Feedback or suggestion", label: "प्रतिक्रिया / सुझाव" },
    { value: "Other", label: "अन्य" },
  ],
  message: "अपना संदेश स्पष्ट रूप से लिखें...",
  submit: "संदेश भेजें",
  submitting: "भेज रहे हैं... / Sending...",
  success: "धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।",
  error: "संदेश भेजा नहीं जा सका। कृपया कुछ देर बाद फिर प्रयास करें या support@biharfast.in पर ईमेल करें।",
};
const contactEditorialPolicies = [
  {
    heading: "Grievance Redressal और संपादकीय सुधार",
    paragraphs: [
      "Use the grievance email shown above or select “शिकायत / Grievance redressal” in the contact form. Please state the BiharFast page URL, the specific statement or conduct you are reporting, the date you noticed it, and the outcome you are requesting. For a factual correction, include a link or reference to the current official notice where possible. Do not send passwords, OTPs, bank details, or unnecessary identity documents.",
      "We aim to acknowledge or respond within 24–48 hours. We review complete reports, check the relevant page and source, and correct or clarify information when the evidence supports a change. Acknowledgement is not a finding that a grievance is valid. Complex cases, high message volume, holidays, or a need to confirm an official record may extend the time needed for a substantive response; we will try to explain any delay.",
      "If you are dissatisfied with our response, reply to the same email with your reference and the reason for escalation. Privacy, copyright, and legal notices should be clearly identified in the subject line and include enough detail for review. BiharFast cannot decide a government application or alter a department's official record; those matters must be raised with the responsible authority.",
    ],
  },
  {
    heading: "Content Disclaimer & Verification Advisory",
    paragraphs: [
      "BiharFast is an independent information portal and is not a recruitment agency or government office. We summarize public information for convenience and do not collect application fees, guarantee selection, or submit forms on an applicant's behalf.",
      "Before submitting any recruitment application or paying a form fee, applicants must read and double-check the latest official notification, eligibility rules, dates, fees, and instructions on the issuing authority's website. The official notification and portal always take precedence over our summaries. Please report a suspected error with its official source so our editors can review it.",
      "Our feedback channels are for corrections, reader suggestions, website accessibility and technical problems, copyright or content concerns, and privacy questions. Please use factual, relevant language and share only information needed to explain the issue. We do not provide legal representation, application filing, recruitment coaching guarantees, or private access to government officials.",
    ],
  },
  {
    heading: "Support team and contact scope",
    paragraphs: [
      "Messages are reviewed by the relevant editorial, technical, or privacy-support function and routed internally where needed. BiharFast does not publish an unverified personal phone number or private address; email at support@biharfast.in is the public contact point. The team can explain our own pages and services but cannot issue certificates, change recruitment records, guarantee scheme benefits, or act as a government grievance authority.",
      "The 24–48 hour turnaround is an expected initial acknowledgement or review target, not a guarantee of final resolution. Please retain your sent email or form confirmation and do not submit the same case repeatedly unless you have new information; duplicate messages can delay review.",
    ],
  },
];

export const LEGAL_PAGES_CONTENT = {
  "/about": page("/about", {
    title: "About BiharFast | Bihar Student Education & Public Information",
    eyebrow: "About BiharFast Platform",
    subtitle: "Educational utility and state administrative guide for Bihar students • Independent public information portal",
    sections: [
      {
        type: "intro",
        paragraphs: [
          [
            { type: "strong", text: "BiharFast.in" },
            { type: "text", text: " is an independent private educational utility and state administrative guide for Bihar students. We organize public information about examinations, admissions, recruitment, student schemes, results, admit cards, and citizen services so readers can understand where to verify requirements and what official source to consult next." },
          ],
          "Government gazettes, recruitment notices, and administrative instructions can be difficult to navigate, especially on a phone or a low-bandwidth connection. BiharFast aims to make public information easier to scan, explain common terms and steps in plain language, and link to primary sources where available. Our summaries are a starting point for research, not a replacement for a government order, legal advice, or a department's decision.",
        ],
      },
      {
        type: "cards",
        cards: [
          {
            title: "Primary Sources",
            text: "We seek out the issuing department's notice, portal, or gazette and identify the source for readers.",
          },
          {
            title: "Fast and Accessible",
            text: "Lightweight pages designed for practical use on rural and urban connections.",
          },
          {
            title: "Student-Centric",
            text: "Practical guides explain dates, eligibility terms, documents, and routes to official services.",
          },
        ],
      },
      {
        heading: "Our Mission in Practice",
        paragraphs: [
          "Our mission is educational utility: to serve as a state administrative guide that helps Bihar students find and understand public information about BPSC, CSBC, BTSC, school and board examinations, admissions, scholarships, education assistance, and other student-facing services. We organize the steps and source links; the responsible authority alone sets eligibility, accepts applications, issues certificates, and makes decisions.",
          "We aim to make the information useful to first-time applicants as well as experienced aspirants. Guides can explain how to locate a notice, compare a summary with its source, prepare a document checklist, and track a published deadline. They do not promise a job, admission, financial assistance, examination result, or preferential access to a public office.",
        ],
      },
      {
        type: "callout",
        title: "Verification and Editorial Process",
        paragraphs: [
          "Our editorial process prioritizes the issuing authority's notice, official portal, gazette, or public announcement. Editors seek to check the source, relevant dates, post or scheme name, and material eligibility details before publishing or updating a summary. We identify the publication or update context where practical and distinguish confirmed instructions from estimates, expected timelines, or background explanation. A source link is provided when available and usable.",
          "Accuracy is an ongoing standard, not a claim that errors are impossible. Notices may change, source pages can be unavailable, and a summary can become outdated. When we learn of a likely error, we review it against the primary source and correct or clarify the page when warranted. Readers can report an issue with the page URL and official evidence through the contact page. For an application or payment decision, verify the live department portal immediately before acting.",
        ],
      },
      {
        heading: "Entity and Legal Identity",
        paragraphs: [
          "BiharFast (biharfast.in) is an independently operated private information website. It is not a government department, statutory authority, recruitment agency, school board, or official representative. We do not imply that a department endorses our editorial decisions. Government names and public information are referenced only to identify the relevant authority and help readers find original material. This page does not claim registration, authorization, or endorsement that has not been independently documented here.",
        ],
      },
      {
        type: "cards",
        cards: [
          {
            title: "Accessible public information",
            text: "Core summaries and source links are presented as a free public-information resource.",
          },
          {
            title: "Anti-Fraud Commitment",
            text: "We never ask for money, sell forms, or promise a job or selection.",
          },
          {
            title: "Student-Centric Support",
            text: "Readers can raise corrections, privacy concerns, and grievances through a published email contact.",
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
      {
        heading: "Who prepares BiharFast content",
        paragraphs: [
          "BiharFast content is maintained through editorial research, source checking, technical publishing, and reader-support work. Editors organize publicly available information and review corrections; technical contributors maintain the website and its tools; support routes feedback to the appropriate function. We publish contact through support@biharfast.in rather than presenting unnamed contributors as government officials or subject-matter authorities. No contributor can promise a recruitment result or influence a public decision.",
          "Readers are encouraged to send specific feedback, including the page address and a clear description of the problem. We review suggestions for clarity, accessibility, translation, and broken links. Where a matter belongs to a government office, we point readers back to that office rather than implying that BiharFast can resolve it on the administration's behalf.",
        ],
      },
      {
        heading: "Public welfare and responsible use",
        paragraphs: [
          "We believe clear access to reliable public information can help students and families make better-informed decisions. Our public-welfare focus is to reduce confusion about where to find notices and how to verify them, not to decide who qualifies for a benefit. Scheme criteria, application windows, document lists, and funding can change; applicants should use the current notice and official helpline before sharing personal data or paying a fee.",
          "BiharFast may display advertising to support the operation of a free information resource. Advertising does not buy editorial placement or change how an official notice is described. Readers should distinguish a clearly identified advertisement from editorial information and report content that appears misleading or unsafe.",
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
    updated: "Last updated: 2 November 2026",
    intro: "This Privacy Policy explains how BiharFast (biharfast.in) handles information when you visit or use our website, tools, contact form, newsletter, and optional browser notifications. We describe the data practices and third-party services currently used, including Google Analytics, Google AdSense, OneSignal, and Web3Forms. For processing we determine, BiharFast is the public contact point; where GDPR terminology applies, the site operator is the controller, and under the DPDP Act it is the data fiduciary, to the extent those roles apply. The policy is intended to explain our approach under applicable Indian privacy and information-technology laws, including the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 and rules, and under the GDPR where it applies. It is not a representation that a policy by itself guarantees legal compliance; obligations and commencement of provisions depend on applicable law and actual service configuration.",
    sections: [
      {
        heading: "1. Information We Collect",
        paragraphs: [
          "We do not ask readers to create a BiharFast account to browse public information. Depending on the feature used, we or our service providers may process the following categories:",
          "Contact messages: name, email address, selected message category, subject, and message content that you choose to submit through the Contact form. The form sends this information to Web3Forms for delivery. Avoid including passwords, OTPs, financial account details, identity-document numbers, or other sensitive information.",
          "Newsletter and notifications: an email address submitted to subscribe to updates is sent to our subscription service. The OneSignal notification SDK is loaded on the production domain; if you enable browser notifications, the browser and OneSignal may process a subscription identifier and device/browser information to deliver and manage notifications. You can deny or later revoke notification permission in your browser or device settings.",
          "Technical and usage data: hosting, security, Google Analytics 4 (GA4), Google Tag Manager, and advertising services may process IP address, device and browser attributes, pages viewed, referring source, timestamps, cookie or advertising identifiers, and interaction events. The precise data collected depends on browser settings and the relevant provider's configuration.",
        ],
        lists: [{
          items: [
            [{ type: "strong", text: "Information you provide:" }, { type: "text", text: " contact and subscription details you voluntarily submit, together with the text of your request." }],
            [{ type: "strong", text: "Information generated by use:" }, { type: "text", text: " security logs, basic diagnostics, analytics events, and browser or advertising identifiers handled by our providers." }],
            [{ type: "strong", text: "Information we do not request for tools:" }, { type: "text", text: " our exam photo resizer and age or Student Credit Card calculators do not ask for your photo, name, bank account, Aadhaar number, or application credentials." }],
          ],
        }],
        emphasis: "Never send passwords, OTPs, payment-card or bank credentials, or government-portal login details through BiharFast.",
      },
      {
        heading: "2. How We Use Information",
        paragraphs: [
          "We use submitted contact details to respond to your question, review a correction or grievance, handle privacy or copyright requests, and maintain necessary support records. Subscription information is used to provide updates requested by the subscriber and to prevent duplicate or abusive sign-ups. Technical logs help operate the service, diagnose failures, protect systems, and investigate misuse. Analytics help us understand site use and improve page performance; advertising services support the website and may measure or personalize ads.",
          "Where GDPR applies, the legal basis depends on the activity and may include your consent, our legitimate interests in operating and securing the website and answering messages, or compliance with a legal obligation. You may withdraw consent for future processing where consent is the basis; withdrawal does not make earlier processing unlawful. Under Indian law, we handle digital personal data subject to the applicable requirements and rights in force. We do not sell contact-form information or intentionally use it for unrelated direct marketing.",
        ],
      },
      {
        heading: "3. Cookies, Google AdSense, and Third-Party Advertising",
        paragraphs: [
          "BiharFast loads Google AdSense on the website. Google and other advertising or measurement partners may use cookies, local storage, pixels, scripts, or similar technologies to deliver ads, limit repeated ads, measure ad performance, prevent fraud, and, depending on the user's location, settings, and available consent choices, personalize advertising. These technologies may process an IP address, browser/device information, cookie or advertising identifiers, and interactions with an ad. Partner data practices are governed by each partner's own notices and controls.",
          [
            { type: "strong", text: "Google advertising: " },
            { type: "text", text: "Google may read or set cookies and use information collected from this and other sites to provide, measure, and improve advertising as described in Google's current advertising and privacy notices. Whether an ad is personalized can depend on Google's settings, applicable law, and the user's choices. BiharFast does not receive a user's Google advertising profile and cannot inspect or control Google's cookies." },
          ],
          [
            { type: "strong", text: "Third-party advertising cookies: " },
            { type: "text", text: "An ad or its vendor can make a direct connection from your browser to that provider. The provider may receive technical information, including your IP address, when its content is requested. BiharFast does not control third-party cookies, retention periods, or downstream use. Review the vendor's privacy policy and available controls for details." },
          ],
          [
            { type: "strong", text: "Your choices: " },
            { type: "text", text: "You can manage Google personalization through Google Ads Settings, use industry opt-out tools where available, and block or delete cookies using your browser settings. Blocking cookies may affect ad delivery and other third-party features. Browser controls do not necessarily remove data already held by a provider. BiharFast does not currently provide a separate site-wide cookie-preference dashboard. This policy is not itself consent, and browser or Google opt-out controls are not a substitute for prior consent where applicable law requires it. The site uses Google tags and AdSense; regional consent configuration should be verified against current legal and Google requirements." },
          ],
        ],
        lists: [{
          items: [
            [
              { type: "text", text: "Review or change Google ad personalization at " },
              { type: "link", text: "Google Ads Settings", href: "https://adssettings.google.com/", external: true },
              { type: "text", text: " and read " },
              { type: "link", text: "Google's Advertising Privacy Principles", href: "https://policies.google.com/technologies/ads", external: true },
              { type: "text", text: "." },
            ],
            [
              { type: "text", text: "Available industry opt-out resources include " },
              { type: "link", text: "AboutAds Choices", href: "https://www.aboutads.info/choices/", external: true },
              { type: "text", text: " or the " },
              { type: "link", text: "Network Advertising Initiative (NAI)", href: "https://optout.networkadvertising.org/", external: true },
              { type: "text", text: "." },
            ],
            [
              { type: "text", text: "Use your browser's privacy settings to review, block, or delete cookies and site data. Settings are browser- and device-specific." },
            ],
          ],
        }],
      },
      {
        heading: "4. Google Analytics, Google Tag Manager, and Push Notifications",
        paragraphs: [
          [{ type: "strong", text: "Google Analytics 4 (GA4): " }, { type: "text", text: "GA4 is loaded to measure website usage and performance. It can collect page views, events, approximate location derived from network information, device/browser details, and online identifiers, subject to Google's settings and your browser controls. Google processes data under its own terms. See Google's privacy policy and analytics information for current retention and opt-out options." }],
          [{ type: "strong", text: "Google Tag Manager: " }, { type: "text", text: "The site includes Google Tag Manager to manage website tags. The container may load configured tags; tags and their behavior can change as the site is maintained. Google Tag Manager itself may process technical request data. This policy identifies the current integrations we know about, not every possible later tag." }],
          [{ type: "strong", text: "OneSignal: " }, { type: "text", text: "The notification service can process a browser subscription identifier and technical details to deliver push alerts. Notification permission is controlled by the browser or device. You can block or revoke permission there; disabling notifications prevents further delivery to that browser. OneSignal's own privacy notice applies to its processing." }],
        ],
      },
      {
        heading: "5. Service providers and external links",
        paragraphs: [
          "We use third parties to operate features: Web3Forms receives contact-form submissions for delivery; Google provides analytics, tag management, and advertising technologies; OneSignal supports push notifications; and hosting, security, and infrastructure providers deliver the website and associated services. The newsletter form sends an email address to BiharFast's subscription API. These providers process information under their own privacy terms and, where applicable, service arrangements with us. We do not authorize them to use contact details for unrelated BiharFast marketing.",
          "Links to government and other external websites are provided for convenience. When you follow an external link, that destination's privacy notice and practices apply. Check the web address before submitting personal information. BiharFast does not control an external site's cookies, security, content, or data retention.",
        ],
      },
      {
        heading: "6. Client-side tools: photos and calculator inputs",
        type: "callout",
        paragraphs: [
          "The exam photo and signature resizer uses your browser's image and Canvas APIs. The image you select is processed in the browser to create a preview and downloadable JPEG; BiharFast does not upload, receive, or store your selected photo or signature on a BiharFast server. The tool does not retain the image after you leave the page, apart from the browser's temporary in-memory processing and any file you choose to download.",
          "The Student Credit Card EMI calculator and age calculator perform their calculations in the browser. The values you enter are not sent to a BiharFast server and are not saved by these tools. Do not enter identity, bank, application-login, or other sensitive details into these utilities. Your normal browser, operating system, network provider, or third-party analytics/ad scripts may separately process technical browsing data as described in this policy; the tools themselves do not transmit the photo or calculator inputs.",
        ],
      },
      {
        heading: "7. Server logs, security, and retention",
        paragraphs: [
          "Our hosting and security providers may automatically create server or access logs containing IP address, request path, date and time, response status, browser/user-agent information, and diagnostic or security events. Logs help diagnose faults, maintain service availability, rate-limit abuse, detect unauthorized access, and investigate incidents. They are not intended to identify readers for editorial profiling. Hosting and security providers may also maintain their own operational logs.",
          "We retain contact and grievance records for the time reasonably needed to respond, document a correction, comply with a legal duty, or resolve a dispute. Subscription records are kept while the subscription is active and as needed to honor an unsubscribe or suppression request. Analytics, advertising, notification, and infrastructure records are subject to provider settings and their own retention schedules; we do not state a fixed duration where it is controlled by a provider. We use reasonable safeguards, but no internet transmission or storage system can be guaranteed completely secure.",
        ],
      },
      {
        heading: "8. Privacy rights and choices",
        paragraphs: [
          [
            { type: "text", text: "Depending on the law that applies, you may have rights to request access to information, correction or completion, erasure, restriction or objection, data portability, withdrawal of consent, grievance redressal, or nomination of another person to exercise rights. Indian data-principal rights and GDPR rights differ and are subject to statutory conditions, exceptions, and the law in force. You may unsubscribe from email updates and revoke browser notifications using the relevant controls. To make a privacy request, email " },
            { type: "link", text: "support@biharfast.in", href: "mailto:support@biharfast.in" },
            { type: "text", text: " with the subject “Privacy Request.” We may ask for proportionate information to verify that the request relates to you; do not send passwords, OTPs, or full identity-document numbers. We aim to acknowledge a request within 24–48 hours, but statutory response periods and verification requirements govern the formal response. We may retain information where permitted or required by law, to honor suppression requests, or to establish or defend legal claims." },
          ],
          "If GDPR applies to your processing, you may also have the right to complain to the competent data-protection supervisory authority in your country or place of residence. For processing under Indian law, you may use the grievance route described below and any statutory remedy available under the applicable law and rules.",
        ],
      },
      {
        heading: "9. Grievance contact and data protection requests",
        type: "callout",
        paragraphs: [
          "For a privacy question, data-access or deletion request, advertising concern, or grievance about our handling of personal data, email support@biharfast.in with “Privacy Grievance” in the subject. Include the relevant feature and a description of the request. We will route it to the person responsible for reviewing privacy matters. We do not publish an unverified personal name, postal address, or separate officer contact; this email is the current public grievance point.",
          "We aim to acknowledge or respond within 24–48 hours. That is a service target, not a substitute for any statutory period or a promise that a request will be granted. We may need to verify identity, clarify scope, or explain a lawful reason for retaining some information.",
        ],
        links: [{ text: "support@biharfast.in", href: "mailto:support@biharfast.in" }],
      },
      {
        heading: "10. Children, international processing, and policy updates",
        paragraphs: [
          "BiharFast provides general public information and exam-preparation content, which may be read by students of different ages. We do not intentionally ask children to provide personal information through the tools. A parent or lawful guardian who believes a child has submitted information should contact us so we can review the circumstances and take appropriate action as required by law. We do not invite children to submit identity or financial information.",
          "Some service providers may process information on systems located outside your state or country. Where applicable, transfers are subject to the legal safeguards and provider arrangements available to us. The privacy terms of those providers also apply to their independent processing.",
          "We may revise this policy when our services, vendors, or legal obligations change. The “Last updated” date identifies the current version. Material changes will be reflected on this page; please review it periodically. Continued browsing after an update does not replace consent where consent is legally required.",
        ],
      },
    ],
    footerLinks: [{ text: "Privacy questions? Contact us", href: "/contact" }],
  }),

  "/terms": page("/terms", {
    title: "Terms & Conditions of Use",
    eyebrow: "Legal Agreement",
    updated: "Last updated: 2 November 2026",
    intro: "These Terms explain the rules for using BiharFast (biharfast.in), its public-information pages, browser tools, and related features. By accessing or using the website, you agree to follow these Terms and applicable law. If you do not agree, discontinue use. Nothing in these Terms removes a right that cannot lawfully be excluded or limited.",
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
          "Original BiharFast text, layout, graphics, software, and branding are owned by BiharFast or used with permission, subject to third-party rights and applicable law. Do not copy, republish, sell, mirror, modify, or commercially exploit protected original material without permission, except where applicable law permits. Copyright or other rights in official notices, photographs, government emblems, and third-party material remain with their respective owners; their presence here does not transfer ownership or grant a license.",
          "Department names, public notices, results, and other public information are referenced to identify sources and help readers. Their reuse is subject to the relevant owner's rights and applicable copyright law; BiharFast makes no blanket claim that every third-party item may be freely reproduced. If you believe material on this site infringes your rights, contact support@biharfast.in with the URL, identification of the protected work, and your basis for the request.",
          "The BiharFast name, logo, original site design, and editorial materials must not be used to impersonate this website, imply government endorsement, or mislead readers. Third-party trademarks and marks belong to their owners.",
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
            "submit spam, abusive, threatening, defamatory, discriminatory, or knowingly false messages through a site form or contact channel;",
            "upload or transmit personal data, images, or documents belonging to another person without authority or a lawful basis;",
          ],
        }],
      },
      {
        heading: "4. Disclaimer of Warranties and No Employment Guarantee",
        paragraphs: [
          "All notices, dates, eligibility information, vacancy figures, admit-card details, results, and syllabus information are provided “as-is” and may contain errors, omissions, delays, or outdated information. BiharFast does not guarantee accuracy, completeness, availability, uninterrupted access, examination selection, job placement, appointment, or employment.",
          "BiharFast is NOT a recruitment agency. Users are responsible for checking every original notification, gazette, deadline, fee, and eligibility requirement directly with the relevant official department before applying, travelling, or paying any fee. The current official notice and portal prevail. Tools provide estimates and do not provide legal, financial, or official eligibility determinations.",
          "We make reasonable editorial efforts to identify the source and correct material errors reported to us, but cannot promise that every page is current at every moment. Information may change after publication or may be delayed by an issuing authority. You are responsible for reviewing the official source at the time you act.",
        ],
      },
      {
        heading: "5. External Links and Third-Party Actions",
        paragraphs: [
          "Links to third-party government application portals and services are provided for user convenience. Once you leave BiharFast, the external website controls its own content, privacy policy, security, application processing, payments, availability, and terms.",
          "BiharFast does not control third-party services and is not responsible for their content, terms, privacy practices, security, availability, application decisions, or transactions. External sites may change or become unavailable without notice. Check the URL and provider before submitting data or payment.",
        ],
      },
      {
        heading: "6. Availability, Changes, and Termination",
        paragraphs: [
          "We may suspend, modify, remove, or update a feature, page, notice, link, or service to maintain security, accuracy, or operation. We may restrict access where we reasonably suspect abuse, security violations, unlawful conduct, or a breach of these Terms. We will update the date above when these Terms materially change. Your continued use after an update indicates acceptance only to the extent permitted by applicable law; where affirmative agreement is legally required, continued browsing alone is not a substitute.",
          "We may retain records reasonably necessary to administer the service, enforce these Terms, address complaints, or comply with legal obligations. If a provision is held unenforceable, the remaining provisions continue to the extent the law permits.",
        ],
      },
      {
        heading: "7. Governing Law and Dispute Resolution",
        type: "callout",
        paragraphs: [
          "These Terms are governed by the laws of India, subject to any mandatory consumer-protection or other legal rights. A dispute should first be raised with support@biharfast.in so we can review the issue. If it is not resolved, it may be referred to a court or forum with jurisdiction under applicable law. Nothing here restricts a right to approach a statutory authority or competent forum.",
        ],
      },
      {
        heading: "8. Contact and notices",
        paragraphs: [
          "Questions about these Terms, intellectual-property concerns, or reports of misuse may be sent to support@biharfast.in. Include the relevant page URL, a clear explanation, and supporting details that are necessary to review the request. Do not include passwords, OTPs, banking credentials, or unrelated sensitive information. The contact page describes the expected response time and grievance route.",
        ],
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
    updated: "Last updated: 2 November 2026",
    sections: [
      {
        heading: "Strict Non-Government Declaration",
        type: "callout",
        paragraphs: [
          "BiharFast (biharfast.in) is an independent private informational portal and is NOT affiliated with, authorized by, or associated with the Government of Bihar or any government department.",
          "BiharFast is not owned, operated, sponsored, approved, or endorsed by the Government of Bihar, a ministry, a recruitment commission, an examination board, or any public authority. We do not represent a government official or accept applications on a department's behalf. Government and examination names are used only to identify the subject and direct readers toward public sources. Any marks, names, emblems, and official content belong to their respective owners.",
        ],
      },
      {
        heading: "Source Attribution and Information Purpose",
        paragraphs: [
          "BiharFast publishes summaries and guides based on public information and seeks to identify the issuing authority and link to a primary source where available. Information can be incomplete, changed, delayed, or inadvertently incorrect. A link does not mean that a department endorses BiharFast, and a summary is not the full notice, an official interpretation, legal advice, or a decision on an individual application.",
          [{ type: "strong", text: "Students and applicants must cross-check the original notice, dates, eligibility, fees, documents, and submission instructions on the responsible official portal before applying, paying, travelling, or relying on any information." }],
          [
            { type: "text", text: "For verification, visit the relevant official site directly, including " },
            { type: "link", text: "bpsc.bih.nic.in", href: "https://bpsc.bih.nic.in", external: true },
            { type: "text", text: ", " },
            { type: "link", text: "csbc.bih.nic.in", href: "https://csbc.bih.nic.in", external: true },
            { type: "text", text: ", and " },
            { type: "link", text: "onlinebseb.in", href: "https://onlinebseb.in", external: true },
            { type: "text", text: ". These are examples; use the portal named in the current notification for your particular examination or service." },
          ],
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
          "BiharFast does not warrant that content will always be accurate, complete, current, uninterrupted, or suitable for a particular decision. To the extent permitted by law, BiharFast is not responsible for loss resulting from reliance on an unverified summary, an expired or broken link, a third-party service, or a change made by an issuing authority. This notice does not exclude liability that cannot lawfully be excluded.",
          "Government departments and examination authorities may revise, postpone, cancel, or replace notices. The latest official notification and any official correction or extension always take precedence over information displayed on BiharFast. Report a suspected error to support@biharfast.in with the page URL and a primary-source reference.",
        ],
      },
      {
        heading: "External Links and User Responsibility",
        paragraphs: [
          "BiharFast links to external government and third-party websites for convenience. We do not control their availability, security, privacy practices, application processing, content, or terms. A linked address may change, and an external page may contain its own notices or fees. Check the address bar and confirm the destination from the current official recruitment notice before submitting a form, document, or payment.",
          "BiharFast does not collect an application fee or submit a government application for you. We do not guarantee eligibility, admission, financial assistance, examination results, recruitment, selection, appointment, or employment. Use official channels for individual application status and decisions.",
        ],
      },
      {
        heading: "Content Takedown and Grievance Redressal",
        type: "callout",
        paragraphs: [
          "If a government authority, organization, rights holder, or reader identifies a factual discrepancy, outdated notice, possible copyright issue, misleading statement, or other concern, contact support@biharfast.in with the page URL, issue, and relevant evidence. We aim to acknowledge or review reports within 24–48 hours. A substantive review may take longer where we need to verify a primary source or assess a rights claim. A report does not automatically establish that content is unlawful or inaccurate, but we will assess it and take appropriate action where warranted.",
          "Do not send passwords, OTPs, financial credentials, or unnecessary personal documents in a complaint. For a privacy request, mark the subject “Privacy Grievance.” The contact page describes our feedback categories and response target.",
        ],
        links: [{ text: "support@biharfast.in", href: "mailto:support@biharfast.in" }],
      },
      {
        heading: "Client-side tools and estimates",
        paragraphs: [
          "The photo and signature resizer processes the selected image locally in your browser and does not upload or store it on a BiharFast server. The Student Credit Card, age, and other calculators display estimates from values entered in the browser; they do not determine official eligibility or a lender's payable amount. Read the specific tool's assumptions and verify any decision with the responsible authority.",
          "BiharFast may display clearly identified advertisements to support the service. An advertisement is not an official recommendation or endorsement. Review our Privacy Policy for information about Google AdSense, analytics, cookies, and other service providers.",
        ],
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
