import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  GraduationCap, 
  ArrowUpRight, 
  FileText, 
  AlertCircle, 
  Award, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Clock3,
  IndianRupee,
  ShieldCheck,
  Timer
} from "lucide-react";
import { generateSlug } from "../utils/slug";

const DEPT_CONFIG = {
  BPSC: {
    badge: "bg-emerald-600 text-white",
    bar: "bg-emerald-600",
    borderHover: "hover:border-emerald-500",
    btn: "bg-emerald-600 hover:bg-emerald-700 text-white"
  },
  CSBC: {
    badge: "bg-blue-700 text-white",
    bar: "bg-blue-700",
    borderHover: "hover:border-blue-500",
    btn: "bg-blue-700 hover:bg-blue-800 text-white"
  },
  "BPSSC (दारोगा)": {
    badge: "bg-rose-600 text-white",
    bar: "bg-rose-600",
    borderHover: "hover:border-rose-500",
    btn: "bg-rose-600 hover:bg-rose-700 text-white"
  },
  "BTSC तकनीकी आयोग": {
    badge: "bg-teal-700 text-white",
    bar: "bg-teal-700",
    borderHover: "hover:border-teal-500",
    btn: "bg-teal-700 hover:bg-teal-800 text-white"
  },
  "RTPS BIHAR": {
    badge: "bg-indigo-600 text-white",
    bar: "bg-indigo-600",
    borderHover: "hover:border-indigo-500",
    btn: "bg-indigo-600 hover:bg-indigo-700 text-white"
  },
  "BIHAR BHUMI": {
    badge: "bg-amber-600 text-white",
    bar: "bg-amber-600",
    borderHover: "hover:border-amber-500",
    btn: "bg-amber-600 hover:bg-amber-700 text-white"
  },
  DEFAULT: {
    badge: "bg-slate-800 text-white",
    bar: "bg-[#0B4F8A]",
    borderHover: "hover:border-blue-500",
    btn: "bg-[#0B4F8A] hover:bg-[#073863] text-white"
  }
};

export default function NotificationCard({ item }) {
  const deptKey = item.department?.toUpperCase().trim() || "DEFAULT";
  const dept = DEPT_CONFIG[deptKey] || DEPT_CONFIG[item.department] || DEPT_CONFIG.DEFAULT;
  const postUrl = `/post/${generateSlug(item)}`;

  const category = (item.category || "").toLowerCase();
  const slug = (item.slug || "").toLowerCase();

  // Identify citizen public services
  const isCitizenService = 
    category === "services" || 
    category === "rtps" || 
    category === "bihar_bhumi" || 
    category === "schemes" || 
    slug.includes("rtps") || 
    slug.includes("bhumi") || 
    slug.includes("yojana");

  const renderStatusBadge = () => {
    if (isCitizenService) {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-300">
          <ShieldCheck size={13} className="text-emerald-700" />
          Active Service
        </span>
      );
    }

    if (item.isResult || category === "results" || category === "result") {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-purple-200">
          <Award size={13} className="text-purple-700" />
          Result Declared
        </span>
      );
    }

    if (category === "admit_card") {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-300">
          <CheckCircle2 size={13} className="text-amber-800" />
          Admit Card Out
        </span>
      );
    }

    if (item.hasRealDate && item.daysLeft !== null && item.daysLeft !== undefined) {
      if (item.daysLeft < 0) {
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200">
            Closed
          </span>
        );
      }

      if (item.daysLeft <= 3) {
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[11px] font-black px-2.5 py-1 rounded-md border border-red-300 animate-pulse">
            <AlertCircle size={13} className="text-red-600" />
            Last {item.daysLeft} Days!
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-200">
          <Clock3 size={13} />
          {item.daysLeft} Days Left
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-sky-200">
        <Sparkles size={12} />
        Live Circular
      </span>
    );
  };

  return (
    <article className={`bg-white rounded-2xl border border-slate-200 ${dept.borderHover} transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group`}>
      <div className={`h-1.5 w-full ${dept.bar}`} />

      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`${dept.badge} text-[11px] font-black tracking-wider px-2.5 py-0.5 rounded-sm uppercase flex items-center gap-1 shadow-2xs`}>
            <Building2 size={12} />
            {item.department || "BIHAR"}
          </span>
          {renderStatusBadge()}
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight mb-4 line-clamp-2 min-h-11">
          <Link 
            to={postUrl}
            className="hover:text-blue-700 transition-colors"
            title={item.title}
          >
            {item.title}
          </Link>
        </h2>

        {/* Dynamic Metric Grid based on Category */}
        {isCitizenService ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                <IndianRupee size={11} className="text-emerald-600" />
                सरकारी शुल्क
              </div>
              <div className="font-bold truncate text-emerald-700">
                {item.fees || item.fee || "निःशुल्क (₹0)"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                <Timer size={12} className="text-slate-500" />
                समय सीमा
              </div>
              <div className="font-bold text-slate-700 truncate">
                {item.processing_time || item.delivery_time || "10-14 कार्य दिवस"}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                <Calendar size={11} className="text-slate-500" />
                {item.hasRealDate ? "Last Date" : "Status"}
              </div>
              <div className={`font-bold truncate ${item.hasRealDate ? "text-rose-600" : "text-slate-700"}`}>
                {item.hasRealDate ? (item.lastDate || item.last_date) : "Active Circular"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                <GraduationCap size={12} className="text-slate-500" />
                {item.isResult ? "Category" : "Eligibility"}
              </div>
              <div className="font-bold text-slate-700 truncate">
                {item.isResult ? "Merit / Score" : (item.eligibility || "Refer PDF")}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <a 
          href={item.pdfUrl || item.applyUrl || item.link || "#"} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition hover:bg-slate-100 shadow-2xs"
        >
          <FileText size={13} className="text-slate-400" />
          {isCitizenService ? "Direct Portal" : "Official PDF"}
        </a>

        <Link 
          to={postUrl}
          className={`${dept.btn} text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition active:scale-95 cursor-pointer`}
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
    slug: PropTypes.string,
    isResult: PropTypes.bool,
    hasRealDate: PropTypes.bool,
    daysLeft: PropTypes.number,
    lastDate: PropTypes.string,
    last_date: PropTypes.string,
    eligibility: PropTypes.string,
    pdfUrl: PropTypes.string,
    applyUrl: PropTypes.string,
    link: PropTypes.string,
    fees: PropTypes.string,
    fee: PropTypes.string,
    processing_time: PropTypes.string,
    delivery_time: PropTypes.string
  }).isRequired
};