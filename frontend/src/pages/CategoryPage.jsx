import { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Bell, Loader2 } from "lucide-react";
import { generateSlug } from "../utils/slug";

const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B";

const CATEGORY_DETAILS = {
  "welfare-schemes": {
    title: "Bihar Welfare Schemes",
    description: "Browse Bihar government welfare schemes, public benefits, and citizen services.",
    keywords: ["welfare", "scheme", "yojana", "pension", "social benefit"],
  },
  scholarships: {
    title: "Scholarships in Bihar",
    description: "Find scholarship announcements and education support updates for students.",
    keywords: ["scholarship", "medhavriti", "post matric", "pre matric", "stipend"],
  },
  "bpsc-jobs": {
    title: "BPSC Jobs and Updates",
    description: "Latest Bihar Public Service Commission recruitment and examination updates.",
    keywords: ["bpsc", "bihar public service commission"],
  },
  "bihar-police": {
    title: "Bihar Police Recruitment",
    description: "Browse Bihar Police recruitment, admit card, and examination updates.",
    keywords: ["bihar police", "csbc", "bpolice", "bihar police service"],
  },
  "teacher-recruitment": {
    title: "Teacher Recruitment in Bihar",
    description: "Latest Bihar teacher recruitment, eligibility, and examination updates.",
    keywords: ["teacher", "teaching", "bsebc", "education department"],
  },
  "health-department": {
    title: "Bihar Health Department Jobs",
    description: "Health department recruitment and public health updates in Bihar.",
    keywords: ["health", "medical", "nurse", "doctor", "btsc"],
  },
  "panchayati-raj": {
    title: "Bihar Panchayati Raj Updates",
    description: "Panchayati Raj department recruitment and public service updates.",
    keywords: ["panchayati raj", "panchayat", "gram panchayat"],
  },
  "student-schemes": {
    title: "Student Schemes in Bihar",
    description: "Government schemes, education support, and benefits for Bihar students.",
    keywords: ["student", "scholarship", "education", "credit card", "kyp"],
  },
  "social-welfare": {
    title: "Bihar Social Welfare Updates",
    description: "Social welfare schemes, benefits, and related government notifications.",
    keywords: ["social welfare", "welfare", "anganwadi", "pension", "women"],
  },
};

function getNoticeText(notice) {
  const fields = [
    notice.title,
    notice.department,
    notice.category,
    notice.type,
    notice.short_desc,
    notice.shortDescription,
    notice.eligibility,
    notice.tags,
    notice.keywords,
  ];

  return fields
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getCategoryTitle(slug) {
  if (CATEGORY_DETAILS[slug]) return CATEGORY_DETAILS[slug].title;
  if (slug === "all") return "All Categories";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CategoryPage({ notices = [], loading = false }) {
  const { slug = "" } = useParams();
  const category = CATEGORY_DETAILS[slug];
  const title = getCategoryTitle(slug);

  useEffect(() => {
    document.title = `${title} Updates - BiharFast`;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content =
      category?.description ||
      `Browse the latest ${title.toLowerCase()} notices and updates from Bihar on BiharFast.`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://biharfast.in/category/${encodeURIComponent(slug)}`;
  }, [category, slug, title]);

  const terms = category?.keywords || [slug.replace(/-/g, " ")];
  const visibleNotices =
    slug === "all"
      ? notices
      : notices.filter((notice) => {
          const text = getNoticeText(notice);
          return terms.some((term) => text.includes(term));
        });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[55vh]">
      <header className="border-b border-slate-200 pb-6 mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-blue-700">BiharFast Categories</p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{title}</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          {category?.description || `Browse the latest ${title.toLowerCase()} notices and updates from Bihar.`}
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm font-semibold text-slate-600" role="status">
          <Loader2 className="animate-spin text-blue-700" size={19} />
          Updates are loading...
        </div>
      ) : visibleNotices.length > 0 ? (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {visibleNotices.map((notice) => {
            const postSlug = notice.slug || generateSlug(notice);
            return (
              <li key={postSlug}>
                <Link
                  to={`/post/${postSlug}`}
                  className="group flex items-start justify-between gap-4 p-4 sm:p-5 hover:bg-blue-50/60"
                >
                  <span>
                    <span className="block text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-800">
                      {notice.title || "Official Bihar Government Notice"}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-slate-500">
                      {notice.department || "Bihar Government"}
                    </span>
                  </span>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-slate-400 group-hover:text-blue-700" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8 text-center">
          <Bell className="mx-auto text-blue-700" size={28} />
          <h2 className="mt-3 text-lg font-black text-slate-900">{title}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
            Is category mein naye updates jald jode ja rahe hain. Taaza notifications ke liye hamare WhatsApp channel se judein.
          </p>
          <a
            href={WHATSAPP_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-green-700"
          >
            Join WhatsApp Channel <ArrowRight size={16} />
          </a>
        </section>
      )}

      <nav aria-label="Browse more updates" className="mt-7 flex flex-wrap gap-4 text-sm font-bold">
        <Link to="/all-updates" className="text-blue-700 hover:underline">All Updates</Link>
        <Link to="/jobs" className="text-blue-700 hover:underline">Government Jobs</Link>
        <Link to="/results" className="text-blue-700 hover:underline">Results</Link>
      </nav>
    </main>
  );
}

CategoryPage.propTypes = {
  notices: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};
