import { useState } from "react";
import { Mail, MapPin, Send, MessageSquare, Clock, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getLegalPageContent } from "../data/legalPagesContent.js";

const content = getLegalPageContent("/contact");

function InlineContent({ value }) {
  if (typeof value === "string") return value;
  return value.map((part, index) => part.type === "strong"
    ? <strong key={index}>{part.text}</strong>
    : <span key={index}>{part.text}</span>);
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "25951b24-77e0-42e0-bf8d-90f97f584332",
          subject: formData.subject || "BiharFast website contact message",
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send the message");
      }

      setFormData({ name: "", email: "", subject: "", message: "" });
      setStatus({
        type: "success",
        message: content.form.success,
      });
    } catch {
      setStatus({
        type: "error",
        message: content.form.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {content.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {content.title}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            {content.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.contactCards.map((card, index) => {
            const Icon = [Mail, MessageSquare, MapPin][index];
            const color = ["bg-blue-600", "bg-emerald-600", "bg-purple-600"][index];
            return (
              <div key={card.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={18} />
                </div>
                <h2 className="font-bold text-xs text-slate-900">{card.title}</h2>
                {card.href
                  ? <a href={card.href} className="text-[11px] text-blue-700 hover:underline mt-1 font-mono select-all">{card.text}</a>
                  : <p className="text-[11px] text-slate-500 mt-1">{card.text}</p>}
              </div>
            );
          })}
        </div>

        {/* Grievance & Response Timeline Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Clock size={14} className="text-[#0B4F8A]" /> 
            {content.responseHeading}
          </div>
          <p>
            <InlineContent value={content.responseText} />
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {content.editorialPolicies.map((policy) => (
            <section key={policy.heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h2 className="font-bold text-slate-900">{policy.heading}</h2>
              {policy.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </section>
          ))}
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Send size={15} className="text-[#0B4F8A]" /> {content.form.heading}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              placeholder={content.form.name}
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
            <input
              type="email"
              name="email"
              placeholder={content.form.email}
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder={content.form.subject}
            value={formData.subject}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
          <textarea
            name="message"
            rows={4}
            placeholder={content.form.message}
            required
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
          {status.message && (
            <div
              role="alert"
              className={`flex items-start gap-2 rounded-xl border p-3 text-xs font-bold leading-relaxed ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-[#0B4F8A] hover:bg-[#083c68] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-xs active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> {content.form.submitting}</> : <><Send size={14} /> {content.form.submit}</>}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link to="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" /> {content.footer}
          </span>
        </div>
      </div>
    </div>
  );
}