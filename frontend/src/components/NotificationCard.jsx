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
    badge: "bg-emerald-700 text-white",
    bar: "bg-emerald-700",
    borderHover: "hover:border-emerald-600",
    btn: "bg-emerald-700 hover:bg-emerald-800 text-white"
  },
  CSBC: {
    badge: "bg-blue-700 text-white",
    bar: "bg-blue-700",
    borderHover: "hover:border-blue-600",
    btn: "bg-blue-700 hover:bg-blue-800 text-white"
  },
  "BPSSC (दारोगा)": {
    badge: "bg-rose-700 text-white",
    bar: "bg-rose-700",
    borderHover: "hover:border-rose-600",
    btn: "bg-rose-700 hover:bg-rose-800 text-white"
  },
  "BTSC तकनीकी आयोग": {
    badge: "bg-teal-700 text-white",
    bar: "bg-teal-700",
    borderHover: "hover:border-teal-600",
    btn: "bg-teal-700 hover:bg-teal-800 text-white"
  },
  "RTPS BIHAR": {
    badge: "bg-indigo-700 text-white",
    bar: "bg-indigo-700",
    borderHover: "hover:border-indigo-600",
    btn: "bg-indigo-700 hover:bg-indigo-800 text-white"
  },
  "BIHAR BHUMI": {
    badge: "bg-amber-700 text-white",
    bar: "bg-amber-700",
    borderHover: "hover:border-amber-600",
    btn: "bg-amber-700 hover:bg-amber-800 text-white"
  },
  DEFAULT: {
    badge: "bg-slate-800 text-white",
    bar: "bg-[#0B4F8A]",
    borderHover: "hover:border-blue-600",
    btn: "bg-[#0B4F8A] hover:bg-[#073863] text-white"
  }
};

export default function NotificationCard({ item }) {
  const deptKey = item.department?.toUpperCase().trim() || "DEFAULT";
  const dept = DEPT_CONFIG[deptKey] || DEPT_CONFIG[item.department] || DEPT_CONFIG.DEFAULT;
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

  const renderStatusBadge = () => {
    if (isCitizenService) {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-400">
          <ShieldCheck size={13} className="text-emerald-800" />
          Active Service
        </span>
      );
    }

    if (item.isResult || category === "results" || category === "result") {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-950 text-[11px] font-bold px-2.5 py-1 rounded-md border border-purple-400">
          <Award size={13} className="text-purple-800" />
          Result Declared
        </span>
      );
    }

    if (category === "admit_card") {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-md border border-amber-400">
          <CheckCircle2 size={13} className="text-amber-900" />
          Admit Card Out
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

    return (
      <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-950 text-[11px] font-bold px-2.5 py-1 rounded-md border border-sky-300">
        <Sparkles size={12} className="text-sky-800" />
        Live Circular
      </span>
    );
  };

  return (
    <article className={`bg-white rounded-2xl border border-slate-200 ${dept.borderHover} transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group`}>
      <div className={`h-1.5 w-full ${dept.bar}`} />

      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`${dept.badge} text-[11px] font-black tracking-wider px-2.5 py-0.5 rounded-sm uppercase flex items-center gap-1 shadow-xs`}>
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
            title={itemTitle}
            aria-label={itemTitle}
          >
            {itemTitle}
          </Link>
        </h2>

        {/* Dynamic Metric Grid based on Category */}
        {isCitizenService ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-black text-slate-700 flex items-center gap-1 mb-0.5">
                <IndianRupee size={11} className="text-emerald-700" />
                सरकारी शुल्क
              </div>
              <div className="font-extrabold truncate text-emerald-800">
                {item.fees || item.fee || "निःशुल्क (₹0)"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-black text-slate-700 flex items-center gap-1 mb-0.5">
                <Timer size={12} className="text-slate-600" />
                समय सीमा
              </div>
              <div className="font-bold text-slate-800 truncate">
                {item.processing_time || item.delivery_time || "10-14 कार्य दिवस"}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-black text-slate-700 flex items-center gap-1 mb-0.5">
                <Calendar size={11} className="text-slate-600" />
                {item.hasRealDate ? "Last Date" : "Status"}
              </div>
              <div className={`font-bold truncate ${item.hasRealDate ? "text-rose-800" : "text-slate-800"}`}>
                {item.hasRealDate ? (item.lastDate || item.last_date) : "Active Circular"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="text-[10px] uppercase font-black text-slate-700 flex items-center gap-1 mb-0.5">
                <GraduationCap size={12} className="text-slate-600" />
                {item.isResult ? "Category" : "Eligibility"}
              </div>
              <div className="font-bold text-slate-800 truncate">
                {item.isResult ? "Merit / Score" : (item.eligibility || "Refer PDF")}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between gap-2">
        <a 
          href={item.pdfUrl || item.applyUrl || item.link || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`${isCitizenService ? "Portal लिंक खोलें" : "Official PDF डाउनलोड करें"}: ${itemTitle}`}
          className="text-xs font-bold text-slate-800 hover:text-slate-950 bg-white border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition hover:bg-slate-100 shadow-xs"
        >
          <FileText size={13} className="text-slate-700" />
          {isCitizenService ? "Direct Portal" : "Official PDF"}
        </a>

        <Link 
          to={postUrl}
          aria-label={`पूरी जानकारी देखें: ${itemTitle}`}
          className={`${dept.btn} text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer`}
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