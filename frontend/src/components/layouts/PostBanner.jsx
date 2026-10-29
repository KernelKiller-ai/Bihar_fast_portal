import { Building2 } from "lucide-react";
import PropTypes from "prop-types";

/** Dynamic department initials (max 3 chars), Hindi-safe fallback. */
function getInitials(department) {
  if (!department) return "BF";
  const words = String(department)
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "BF";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * PostBanner — featured photo with org-badge overlay, or a branded
 * 3D geometric SVG fallback banner so layouts never look empty.
 */
export default function PostBanner({ post, label }) {
  const photoUrl = post ? (post.thumbnail_url || post.banner_url || post.image_url || post.photo_url || null) : null;
  const dept = post?.department || "BiharFast";
  const initials = getInitials(dept);

  if (photoUrl) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.25)]">
        <img
          src={photoUrl}
          alt={post?.title || dept}
          loading="lazy"
          decoding="async"
          className="aspect-21/9 w-full object-cover"
        />
        {/* Depth overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
        {/* Organization badge */}
        <span className="absolute bottom-3 left-3 inline-flex max-w-[85%] items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.25)] backdrop-blur">
          <Building2 size={13} className="shrink-0 text-[#0B4F8A]" />
          <span className="truncate">{dept}</span>
        </span>
      </div>
    );
  }

  // 3D SVG geometric fallback banner
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-linear-to-br from-slate-50 via-blue-50/60 to-sky-50 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.15)]">
      <svg
        viewBox="0 0 840 260"
        preserveAspectRatio="xMidYMid slice"
        className="aspect-21/9 w-full"
        role="img"
        aria-label={`${dept} banner`}
      >
        <defs>
          <linearGradient id="bfGeoA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0B4F8A" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="bfGeoB" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#166534" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0B4F8A" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {/* Geometric layers */}
        <polygon points="0,260 260,0 480,260" fill="url(#bfGeoA)" />
        <polygon points="520,260 700,60 840,260" fill="url(#bfGeoB)" />
        <polygon points="330,260 470,120 620,260" fill="#0B4F8A" opacity="0.08" />
        <circle cx="740" cy="52" r="90" fill="#0EA5E9" opacity="0.07" />
        <circle cx="90" cy="40" r="56" fill="#166534" opacity="0.08" />
        {/* Branding mark */}
        <rect x="56" y="88" width="96" height="96" rx="24" fill="#0B4F8A" opacity="0.92" />
        <rect x="64" y="96" width="80" height="80" rx="19" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
        <text
          x="104"
          y="146"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="900"
          fontSize="34"
          fill="#ffffff"
        >
          {initials}
        </text>
        <text
          x="176"
          y="118"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="800"
          fontSize="22"
          fill="#0F172A"
          opacity="0.85"
        >
          BiharFast
        </text>
        <text
          x="176"
          y="150"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          fontSize="14"
          fill="#334155"
          opacity="0.75"
        >
          {label || "आधिकारिक अपडेट • Official Update"}
        </text>
        {/* Thin accent bar */}
        <rect x="0" y="0" width="840" height="5" fill="#0B4F8A" />
        <rect x="0" y="5" width="420" height="2.5" fill="#38BDF8" opacity="0.8" />
      </svg>
    </div>
  );
}

PostBanner.propTypes = {
  post: PropTypes.object,
  label: PropTypes.string,
};
