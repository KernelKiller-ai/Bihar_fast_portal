import { useEffect, useState } from "react";
import { Megaphone, X, ExternalLink } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../api/supabase";

const BANNER_ID = "top_banner";
const DISMISS_KEY = "biharfast_banner_dismissed_id";

export default function TopBanner() {
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === BANNER_ID;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    supabase
      .from("site_settings")
      .select("banner_active, banner_text, banner_link, banner_bg, updated_at")
      .eq("id", BANNER_ID)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) setBanner(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!banner?.banner_active || dismissed || !banner?.banner_text) return null;

  const handleClose = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, BANNER_ID);
    } catch {
      /* storage unavailable — dismiss is memory-only */
    }
  };

  return (
    <div
      role="status"
      className="relative bg-[#0B4F8A] text-white shadow-md z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <span className="shrink-0 bg-white/15 p-1.5 rounded-lg">
          <Megaphone size={16} className="text-amber-300" />
        </span>

        <p className="text-xs sm:text-sm font-semibold flex-1 min-w-0 leading-snug">
          {banner.banner_text}
        </p>

        {banner.banner_link && (
          <a
            href={banner.banner_link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 bg-white text-[#0B4F8A] hover:bg-amber-100 text-xs font-black px-3 py-1.5 rounded-lg transition-colors"
          >
            यहाँ देखें <ExternalLink size={12} />
          </a>
        )}

        <button
          onClick={handleClose}
          aria-label="Close banner"
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
