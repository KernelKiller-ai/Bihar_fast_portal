import PropTypes from "prop-types";
import { MessageSquare, Send, Share2, Sparkles, Check, Copy } from "lucide-react";
import { useState } from "react";

export default function ShareAlertBar({ title, dept }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Dynamic share text for students
  const shareText = `*${title}* (${dept})\n\nआधिकारिक सूचना और डायरेक्ट लिंक यहाँ देखें:\n${currentUrl}\n\nरोजगार व सरकारी योजनाओं के सबसे तेज अपडेट के लिए BiharFast से जुड़ें!`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title + " - " + dept)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-black text-sm flex items-center gap-1.5 text-amber-400">
            <Share2 size={16} /> दोस्तों के साथ यह सूचना शेयर करें
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5">
            अभ्यर्थियों की मदद हेतु इस भर्ती/परिणाम का आधिकारिक लिंक WhatsApp या Telegram पर साझा करें।
          </p>
        </div>
        
        {/* Post-Specific Share Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs active:scale-95"
          >
            <MessageSquare size={14} className="fill-white" /> WhatsApp
          </a>

          <a
            href={telegramShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs active:scale-95"
          >
            <Send size={14} /> Telegram
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition border border-slate-700 active:scale-95"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? "कॉपी हो गया!" : "लिंक कॉपी"}
          </button>
        </div>
      </div>

      {/* Official Community Channels Join Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200">
            बिहार के किसी भी एडमिट कार्ड या रिजल्ट का नोटिफिकेशन तुरंत पाने के लिए:
          </span>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial text-center bg-white/10 hover:bg-white/20 text-emerald-300 font-bold text-[11px] py-1.5 px-3 rounded-lg border border-emerald-500/30 transition"
          >
            Join WhatsApp Channel
          </a>
          <a
            href="https://t.me/biharfast_official"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial text-center bg-white/10 hover:bg-white/20 text-sky-300 font-bold text-[11px] py-1.5 px-3 rounded-lg border border-sky-500/30 transition"
          >
            Join Telegram Group
          </a>
        </div>
      </div>
    </div>
  );
}

ShareAlertBar.propTypes = {
  title: PropTypes.string.isRequired,
  dept: PropTypes.string.isRequired,
};s