import { BookOpenCheck, Compass, HeartHandshake, Mail, ShieldCheck, Target, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { getLegalPageContent } from "../data/legalPagesContent.js";

const content = getLegalPageContent("/about");

function InlineContent({ value }) {
  if (typeof value === "string") return value;
  return value.map((part, index) => {
    if (part.type === "strong") return <strong key={index} className="text-slate-900">{part.text}</strong>;
    if (part.type === "link") {
      return part.href.startsWith("/")
        ? <Link key={index} to={part.href} className="font-bold text-blue-700 underline">{part.text}</Link>
        : <a key={index} href={part.href} className="font-bold text-blue-700 underline">{part.text}</a>;
    }
    return <span key={index}>{part.text}</span>;
  });
}

export default function About() {
  const [intro, values, mission, verification, identity, promises, platform, support] = content.sections;
  const valueIcons = [ShieldCheck, Zap, Users];
  const promiseStyles = [
    "bg-emerald-50 border-emerald-200",
    "bg-amber-50 border-amber-200",
    "bg-slate-50 border-slate-200",
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <header className="border-b border-slate-100 pb-6">
          <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-[#0B4F8A] px-3 py-1 rounded-full border border-blue-200">
            {content.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{content.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{content.subtitle}</p>
        </header>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {intro.paragraphs.map((paragraph, index) => (
            <p key={index}><InlineContent value={paragraph} /></p>
          ))}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {values.cards.map((card, index) => {
            const Icon = valueIcons[index];
            const iconColor = ["bg-[#0B4F8A] text-white", "bg-emerald-700 text-white", "bg-amber-500 text-slate-950"][index];
            return (
              <div key={card.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className={`w-9 h-9 rounded-lg ${iconColor} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <h2 className="font-extrabold text-slate-900 text-sm">{card.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{card.text}</p>
              </div>
            );
          })}
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2"><Target size={18} className="text-[#0B4F8A]" /> {mission.heading}</h2>
          {mission.paragraphs.map((paragraph, index) => <p key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed"><InlineContent value={paragraph} /></p>)}
        </section>

        <section className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
          <BookOpenCheck size={20} className="shrink-0 text-blue-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-black text-blue-900 mb-1">{verification.title}</strong>
            {verification.paragraphs.map((paragraph, index) => <p key={index}><InlineContent value={paragraph} /></p>)}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2"><Compass size={18} className="text-emerald-700" /> {identity.heading}</h2>
          {identity.paragraphs.map((paragraph, index) => <p key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed"><InlineContent value={paragraph} /></p>)}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {promises.cards.map((card, index) => (
            <div key={card.title} className={`p-4 rounded-xl border ${promiseStyles[index]}`}>
              <h3 className="font-extrabold text-slate-900 text-sm">{card.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{card.text}</p>
            </div>
          ))}
        </section>

        <section className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <HeartHandshake size={20} className="shrink-0 text-amber-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-black text-amber-900 mb-1">{platform.title}</strong>
            {platform.paragraphs.map((paragraph, index) => <p key={index}><InlineContent value={paragraph} /></p>)}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2"><Mail size={18} className="text-[#0B4F8A]" /> {support.heading}</h2>
          {support.paragraphs.map((paragraph, index) => <p key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed"><InlineContent value={paragraph} /></p>)}
          <div className="flex flex-wrap gap-3 text-xs font-bold">
            {content.footerLinks.map((link) => <Link key={link.href} to={link.href} className="text-blue-700 hover:underline">{link.text}</Link>)}
          </div>
        </section>

        <div className="pt-2">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">← मुख्य पृष्ठ पर लौटें</Link>
        </div>
      </div>
    </main>
  );
}
