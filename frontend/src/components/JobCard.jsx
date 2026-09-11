import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Calendar, Users, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";
import { generateSlug } from "../utils/slug";

export default function JobCard({ post }) {
  // Agar post.slug missing ho toh safe slug generate karein
  const postSlug = post.slug || (post.id && String(post.id).length > 20 ? null : post.id) || generateSlug(post);

  return (
    <div className="bg-white border border-slate-200 hover:border-[#0B4F8A] rounded-2xl p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-[#0B4F8A] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
            {post.department || "बिहार सरकार"}
          </span>

          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        </div>

        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#0B4F8A] transition-colors line-clamp-2">
          {post.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Users size={13} className="text-slate-400" /> कुल पद:
            </span>
            <strong className="text-slate-900 font-bold">{post.total_posts || post.totalPosts || "अधिसूचना देखें"}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <GraduationCap size={13} className="text-slate-400" /> योग्यता:
            </span>
            <strong className="text-slate-800 font-semibold truncate max-w-35">
              {post.eligibility || "10th / 12th / स्नातक"}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar size={13} className="text-slate-400" /> अंतिम तिथि:
            </span>
            <strong className="text-rose-600 font-bold">{post.last_date || post.lastDate || "सक्रिय सूचना"}</strong>
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-500" /> NIC Verified
        </span>

        <Link
          to={`/post/${postSlug}`}
          className="inline-flex items-center gap-1 text-xs font-black text-[#0B4F8A] group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>विवरण देखें</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

JobCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slug: PropTypes.string,
    department: PropTypes.string,
    title: PropTypes.string,
    total_posts: PropTypes.string,
    totalPosts: PropTypes.string,
    eligibility: PropTypes.string,
    last_date: PropTypes.string,
    lastDate: PropTypes.string,
  }).isRequired,
};