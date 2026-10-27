import { Cookie, ExternalLink, LockKeyhole, Mail, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getLegalPageContent } from "../data/legalPagesContent.js";

const content = getLegalPageContent("/privacy-policy");
const sectionIcons = [ShieldCheck, LockKeyhole, Cookie, null, ExternalLink, LockKeyhole, Trash2, null, null];
const sectionIds = [
  "collection-heading",
  "use-heading",
  "ads-heading",
  "analytics-heading",
  "links-heading",
  "security-heading",
  "rights-heading",
  "grievance-heading",
  "children-heading",
];

function InlineContent({ value }) {
  if (typeof value === "string") return value;
  return value.map((part, index) => {
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    if (part.type === "link") {
      const className = "text-blue-700 underline underline-offset-2 hover:text-blue-900";
      if (part.href.startsWith("/")) return <Link key={index} to={part.href} className={className}>{part.text}</Link>;
      return <a key={index} href={part.href} target={part.external ? "_blank" : undefined} rel={part.external ? "noreferrer" : undefined} className={className}>{part.text}</a>;
    }
    return <span key={index}>{part.text}</span>;
  });
}

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <header>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            {content.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{content.title}</h1>
          <p className="text-slate-500 text-xs mt-1">{content.updated}</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">{content.intro}</p>
        </header>

        <div className="space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {content.sections.map((section, index) => {
            const Icon = sectionIcons[index];
            const sectionClass = section.type === "callout"
              ? "bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2"
              : "space-y-2";
            return (
              <section key={section.heading} className={sectionClass} aria-labelledby={sectionIds[index]}>
                {Icon
                  ? <div className="flex items-center gap-2"><Icon size={18} className={["text-blue-700", "text-emerald-700", "text-amber-600", "", "text-slate-500", "text-blue-700", "text-rose-700"][index]} /><h2 id={sectionIds[index]} className="text-base font-bold text-slate-900">{section.heading}</h2></div>
                  : <h2 id={sectionIds[index]} className="text-base font-bold text-slate-900">{section.heading}</h2>}
                {section.paragraphs.map((paragraph, paragraphIndex) => {
                  if (index === 7 && paragraphIndex === 1) return null;
                  const className = index === 0 && paragraphIndex === 1
                    ? "font-bold text-slate-900"
                    : undefined;
                  return <p key={paragraphIndex} className={className}><InlineContent value={paragraph} /></p>;
                })}
                {section.lists?.map((list, listIndex) => (
                  <ul key={listIndex} className="list-disc list-inside space-y-2 pl-1">
                    {list.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent value={item} /></li>)}
                  </ul>
                ))}
                {section.emphasis && <p className="font-bold text-slate-900">{section.emphasis}</p>}
                {section.links?.map((link) => (
                  <a key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:underline">
                    <Mail size={16} /> {link.text}
                  </a>
                ))}
                {index === 7 && <p className="text-xs text-slate-500">{section.paragraphs[1]}</p>}
              </section>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">← Main page</Link>
          {content.footerLinks.map((link) => <Link key={link.href} to={link.href} className="text-xs font-bold text-blue-600 hover:underline">{link.text}</Link>)}
        </div>
      </div>
    </main>
  );
}
