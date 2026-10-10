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
        <span className="inline-flex items-center rounded-md border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#334155]">
          {item.status}
        </span>
      );
    }

    if (item.hasRealDate && item.daysLeft !== null && item.daysLeft !== undefined) {
      if (item.daysLeft < 0) {
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-300">
            Closed
          </span>
        );
      }

      if (item.daysLeft <= 3) {
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 text-[11px] font-black px-2.5 py-1 rounded-md border border-red-400 animate-pulse">
            <AlertCircle size={13} className="text-red-700" />
            Last {item.daysLeft} Days!
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-300">
          <Clock3 size={13} />
          {item.daysLeft} Days Left
        </span>
      );
    }

    return null;
  };

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#CBD5E1] hover:shadow-[0_4px_6px_-1px_rgba(11,37,69,0.07)]">
      <div className="h-1 w-full bg-[#0B2545]" />

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-1 text-[10px] font-bold tracking-wide text-[#0F172A]">
            <Building2 size={12} />
            {item.department || "Bihar"}
          </span>
          {renderStatusBadge()}
        </div>

        <h2 className="mb-3 min-h-11 text-sm font-bold leading-[1.6] tracking-tight text-[#0F172A] sm:text-base">
          <Link 
            to={postUrl}
            className="transition-colors hover:text-[#0B2545]"
            title={itemTitle}
            aria-label={itemTitle}
          >
            {itemTitle}
          </Link>
        </h2>

        <div className="grid grid-cols-1 gap-2 text-xs min-[420px]:grid-cols-2">
          {totalPosts !== undefined && totalPosts !== null && totalPosts !== "" && (
            <div className="min-w-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase text-[#64748B]">
                <Building2 size={11} />
                Total Posts
              </div>
              <div className="break-words font-semibold text-[#0F172A]">{totalPosts}</div>
            </div>
          )}
          {lastDate && (
            <div className="min-w-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase text-[#64748B]">
                <Calendar size={11} />
                Important Date
              </div>
              <div className="break-words font-semibold text-[#0F172A]">{lastDate}</div>
            </div>
          )}
          {eligibility && (
            <div className="min-w-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase text-[#64748B]">
                <GraduationCap size={12} />
                Eligibility
              </div>
              <div className="break-words font-semibold text-[#0F172A]">{eligibility}</div>
            </div>
          )}
          {isCitizenService && fee && (
            <div className="min-w-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase text-[#64748B]">
                <IndianRupee size={11} />
                सरकारी शुल्क
              </div>
              <div className="break-words font-semibold text-[#0F172A]">{fee}</div>
            </div>
          )}
          {isCitizenService && processingTime && (
            <div className="min-w-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase text-[#64748B]">
                <Timer size={12} />
                समय सीमा
              </div>
              <div className="break-words font-semibold text-[#0F172A]">{processingTime}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
        {(pdfUrl || applyUrl) && (
          <a
            href={pdfUrl || applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${isCitizenService ? "Portal लिंक खोलें" : "Official PDF डाउनलोड करें"}: ${itemTitle}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#475569] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
          >
            <FileText size={13} />
            {isCitizenService ? "Direct Portal" : "Official PDF"}
          </a>
        )}

        <Link 
          to={postUrl}
          aria-label={`पूरी जानकारी देखें: ${itemTitle}`}
          className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-md bg-[#0B2545] px-3.5 text-xs font-semibold text-white transition hover:bg-[#091E3A] active:scale-95"
        >
          View Details
          <ArrowUpRight size={13} />
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