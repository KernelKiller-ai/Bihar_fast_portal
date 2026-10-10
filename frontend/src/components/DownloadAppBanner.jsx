import { Download, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function DownloadAppBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="mx-auto w-full max-w-7xl px-4 py-2 md:hidden" aria-label="Download BiharFast Android app">
      <div className="relative flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3 pr-8 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#ECFDF5] text-xl text-[#15803D]" aria-hidden="true">
          ⚡
        </div>
        <p className="min-w-0 flex-1 text-[11px] font-bold leading-relaxed text-[#0F172A]">
          BiharFast Android App <span className="text-[#15803D]">(Only 3 MB)</span>
          <span className="mt-0.5 block text-[10px] font-medium text-[#64748B]">Get the app</span>
        </p>
        <a
          href="/biharfast.apk"
          download="BiharFast.apk"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md bg-[#15803D] px-3 text-xs font-semibold text-white transition hover:bg-[#166534] active:scale-95"
        >
          <Download size={14} aria-hidden="true" />
          Download
        </a>
        <Link
          to="/download"
          className="hidden text-[10px] font-medium text-[#475569] underline underline-offset-2 sm:inline"
        >
          Kaise install karein? / Install Guide
        </Link>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition hover:text-[#0F172A]"
          aria-label="Dismiss app download banner"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
