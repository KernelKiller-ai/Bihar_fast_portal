import { Link } from "react-router-dom";
import { getLegalPageContent } from "../data/legalPagesContent.js";

const content = getLegalPageContent("/terms");

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

export default function Terms() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <header>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{content.eyebrow}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{content.title}</h1>
          <p className="text-slate-500 text-xs mt-1">{content.updated}</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">{content.intro}</p>
        </header>

        <div className="space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {content.sections.map((section, index) => (
            <section key={section.heading} className={`space-y-2${index === 6 ? " bg-slate-50 border border-slate-200 rounded-2xl p-5" : ""}`}>
              <h2 className="text-base font-bold text-slate-900">{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><InlineContent value={paragraph} /></p>)}
              {section.lists?.map((list, listIndex) => (
                <ul key={listIndex} className="list-disc list-inside space-y-1.5 pl-1">
                  {list.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent value={item} /></li>)}
                </ul>
              ))}
            </section>
          ))}
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
