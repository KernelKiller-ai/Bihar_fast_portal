import { AlertOctagon, CheckCircle2, FileWarning, Mail, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { getLegalPageContent } from "../data/legalPagesContent.js";

const content = getLegalPageContent("/disclaimer");
const sectionIcons = [AlertOctagon, CheckCircle2, ShieldAlert, FileWarning, null, Mail];

function InlineContent({ value }) {
  if (typeof value === "string") return value;
  return value.map((part, index) => {
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    if (part.type === "link") return part.href.startsWith("/")
      ? <Link key={index} to={part.href} className="text-blue-700 underline">{part.text}</Link>
      : <a key={index} href={part.href} className="text-blue-700 underline">{part.text}</a>;
    return <span key={index}>{part.text}</span>;
  });
}

export default function Disclaimer() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <header>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">{content.eyebrow}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{content.title}</h1>
          <p className="text-slate-500 text-xs mt-1">{content.updated}</p>
        </header>

        <div className="space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {content.sections.map((section, index) => {
            const Icon = sectionIcons[index];
            const classes = index === 0
              ? "bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 sm:p-6"
              : index === 5
                ? "bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2"
                : "space-y-2";
            if (index === 0) {
              return (
                <section key={section.heading} className={`${classes} flex items-start gap-3`} aria-labelledby="non-government-heading">
                  <Icon className="text-rose-700 shrink-0 mt-0.5" size={24} />
                  <div className="text-sm text-rose-950 space-y-3 leading-relaxed">
                    <h2 id="non-government-heading" className="text-base sm:text-lg font-black text-rose-900">{section.heading}</h2>
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex} className={paragraphIndex === 0 ? "font-black" : undefined}><InlineContent value={paragraph} /></p>
                    ))}
                  </div>
                </section>
              );
            }
            return (
              <section key={section.heading} className={classes} aria-labelledby={`disclaimer-section-${index}`}>
                {Icon
                  ? <div className="flex items-center gap-2">
                    <Icon size={18} className={["", "text-emerald-600", "text-amber-600", "text-slate-500", "", "text-[#0B4F8A]"][index]} />
                    <h2 id={`disclaimer-section-${index}`} className="text-base font-bold text-slate-900">{section.heading}</h2>
                  </div>
                  : <h2 id={`disclaimer-section-${index}`} className="text-base font-bold text-slate-900">{section.heading}</h2>}
                {section.paragraphs.map((paragraph, paragraphIndex) => {
                  const className = index === 0 && paragraphIndex === 0
                    ? "font-black text-rose-950"
                    : index === 2 && paragraphIndex === 1
                      ? "font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3"
                      : index === 1 && paragraphIndex === 1
                        ? "font-bold text-slate-900"
                        : undefined;
                  return <p key={paragraphIndex} className={className}><InlineContent value={paragraph} /></p>;
                })}
                {section.links?.map((link) => (
                  <a key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:underline">
                    <Mail size={15} /> {link.text}
                  </a>
                ))}
              </section>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">← Main page</Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            {content.footerLinks.map((link) => <Link key={link.href} to={link.href} className="text-blue-600 hover:underline">{link.text}</Link>)}
          </div>
        </div>
      </div>
    </main>
  );
}
