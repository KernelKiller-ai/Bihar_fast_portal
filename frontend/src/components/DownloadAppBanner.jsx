import { Download, X } from "lucide-react";
import { useState } from "react";

export default function DownloadAppBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 md:hidden" aria-label="Download BiharFast Android app">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/95 p-3 shadow-[0_12px_36px_rgba(15,23,42,0.2)] backdrop-blur-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl" aria-hidden="true">
          ⚡
        </div>
        <p className="min-w-0 flex-1 text-[11px] font-extrabold leading-tight text-slate-800">
          BiharFast Android App <span className="text-emerald-700">(Only 3 MB)</span>
          <span className="mt-0.5 block text-[10px] font-bold text-slate-500">Sabse Fast Updates</span>
        </p>
        <a
          href="/biharfast.apk"
          download="BiharFast.apk"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
        >
          <Download size={14} aria-hidden="true" />
          Download
        </a>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute -right-1.5 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-900"
          aria-label="Dismiss app download banner"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
