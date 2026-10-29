import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Calendar,
  GraduationCap,
  ArrowUpRight,
  FileText,
  AlertCircle,
  Building2,
  Clock3,
  IndianRupee,
  Timer,
} from "lucide-react";
import { generateSlug } from "../utils/slug";

export default function NotificationCard({ item }) {
  const postUrl = `/post/${generateSlug(item)}`;

  const category = (item.category || "").toLowerCase();
  const slug = (item.slug || "").toLowerCase();
  const itemTitle = item.title || "अधिसूचना विवरण";

  // Identify citizen public services
  const isCitizenService =
    category === "services" ||
    category === "rtps" ||
    category === "bihar_bhumi" ||
    category === "schemes" ||
    slug.includes("rtps") ||
    slug.includes("bhumi") ||
    slug.includes("yojana");
  const fee = item.fees ?? item.fee;
  const processingTime = item.processing_time ?? item.delivery_time;
  const lastDate = item.lastDate || item.last_date;
  const eligibility = item.eligibility || item.qualification_details;
  const totalPosts = item.total_posts ?? item.totalPosts;
  const pdfUrl = item.pdfUrl || item.pdf_url;
  const applyUrl = item.applyUrl || item.apply_url || item.link;

  const renderStatusBadge = () => {
    if (item.status) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-1 text-[11px] font-bold text-slate-700">
          {item.status}
        </span>
      );
    }

    if (item.hasRealDate && item.daysLeft !== null && item.daysLeft !== undefined) {
      if (item.daysLeft < 0) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-1 text-[11px] font-bold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Closed
          </span>
        );
      }

      if (item.daysLeft <= 3) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/80 px-2.5 py-1 text-[11px] font-black text-rose-700">
            <AlertCircle size={13} />
            Last {item.daysLeft} Days!
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          <Clock3 size={13} />
          {item.daysLeft} Days Left
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Active
      </span>
    );
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-8px_rgba(11,79,138,0.2)]">
      {/* Top Accent Strip */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#0B4F8A] via-blue-500 to-sky-400" />

      <div className="p-4 sm:p-5">
        {/* Header Row */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-1 text-[11px] font-bold text-slate-700">
            <Building2 size={12} className="shrink-0 text-slate-500" />
            <span className="truncate">{item.department || "बिहार सरकार"}</span>
          </span>
          {renderStatusBadge()}
        </div>

        {/* Title */}
        <h2 className="mb-3 min-h-11 text-sm font-extrabold leading-[1.6] tracking-tight text-slate-900 sm:text-base">
          <Link
            to={postUrl}
            className="transition-colors duration-200 group-hover:text-[#0B4F8A]"
            title={itemTitle}
            aria-label={itemTitle}
          >
            {itemTitle}
          </Link>
        </h2>

        {/* Info Grid — Elevated Metric Sub-cards */}
        <div className="grid grid-cols-1 gap-2.5 text-xs min-[420px]:grid-cols-2">
          {totalPosts !== undefined && totalPosts !== null && totalPosts !== "" && (
            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors group-hover:border-blue-100">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <Building2 size={11} />
                Total Posts
              </div>
              <div className="wrap-break-word font-extrabold text-[#0B4F8A]">{totalPosts}</div>
            </div>
          )}
          {lastDate && (
            <div className="min-w-0 rounded-xl border border-rose-100 bg-rose-50/60 p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-rose-500">
                <Calendar size={11} />
                Important Date
              </div>
              <div className="wrap-break-word font-extrabold text-rose-700">{lastDate}</div>
            </div>
          )}
          {eligibility && (
            <div className="col-span-1 min-w-0 rounded-xl border border-blue-100/80 bg-linear-to-r from-blue-50/80 to-sky-50/60 p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] min-[420px]:col-span-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#0B4F8A]/70">
                <GraduationCap size={12} />
                Eligibility
              </div>
              <div className="wrap-break-word font-bold text-slate-800">{eligibility}</div>
            </div>
          )}
          {isCitizenService && fee && (
            <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                <IndianRupee size={11} />
                सरकारी शुल्क
              </div>
              <div className="wrap-break-word font-extrabold text-emerald-800">{fee}</div>
            </div>
          )}
          {isCitizenService && processingTime && (
            <div className="min-w-0 rounded-xl border border-amber-100 bg-amber-50/60 p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                <Timer size={12} />
                समय सीमा
              </div>
              <div className="wrap-break-word font-extrabold text-amber-800">{processingTime}</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        {(pdfUrl || applyUrl) && (
          <a
            href={pdfUrl || applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${isCitizenService ? "Portal लिंक खोलें" : "Official PDF डाउनलोड करें"}: ${itemTitle}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-200/80 hover:text-slate-900 active:scale-[0.98]"
          >
            <FileText size={13} />
            {isCitizenService ? "Direct Portal" : "Official PDF"}
          </a>
        )}

        <Link
          to={postUrl}
          aria-label={`पूरी जानकारी देखें: ${itemTitle}`}
          className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#0B4F8A] px-3.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(11,79,138,0.25)] transition-all duration-200 hover:bg-blue-800 hover:shadow-[0_6px_16px_rgba(11,79,138,0.35)] active:scale-[0.98]"
        >
          View Details
          <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

NotificationCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    department: PropTypes.string,
    category: PropTypes.string,
    status: PropTypes.string,
    slug: PropTypes.string,
    hasRealDate: PropTypes.bool,
    daysLeft: PropTypes.number,
    total_posts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalPosts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastDate: PropTypes.string,
    last_date: PropTypes.string,
    eligibility: PropTypes.string,
    qualification_details: PropTypes.string,
    fees: PropTypes.string,
    fee: PropTypes.string,
    processing_time: PropTypes.string,
    delivery_time: PropTypes.string,
    pdfUrl: PropTypes.string,
    applyUrl: PropTypes.string,
    link: PropTypes.string
  }).isRequired
};
