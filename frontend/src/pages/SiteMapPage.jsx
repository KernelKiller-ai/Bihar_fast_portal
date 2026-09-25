import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, FileText, IdCard, Landmark } from "lucide-react";

const SECTIONS = [
  { key: "jobs", title: "Jobs", icon: Briefcase },
  { key: "admit_card", title: "Admit Cards", icon: IdCard },
  { key: "results", title: "Results", icon: FileText },
  { key: "services", title: "Services", icon: Landmark },
];

function getSlug(notice) {
  return notice.slug || notice.id;
}

function normalizeCategory(notice) {
  const category = String(notice.category || notice.type || "jobs").toLowerCase();
  if (category.includes("admit")) return "admit_card";
  if (category.includes("result")) return "results";
  if (category.includes("service") || category.includes("scheme")) return "services";
  return "jobs";
}

export default function SiteMapPage({ notices = [], category }) {
  const visibleSections = category
    ? SECTIONS.filter((section) => section.key === category)
    : SECTIONS;

  const groupedNotices = visibleSections.map((section) => ({
    ...section,
    notices: notices.filter((notice) => normalizeCategory(notice) === section.key),
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <header className="border-b border-slate-200 pb-6 mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-blue-700">BiharFast Archive</p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">All Updates & Official Notices</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          Browse every active Bihar government update by category. Each notice below links directly to its complete detail page.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupedNotices.map(({ key, title, icon: Icon, notices: sectionNotices }) => (
          <section key={key} aria-labelledby={`${key}-heading`} className="border border-slate-200 bg-white rounded-xl p-5 shadow-xs">
            <h2 id={`${key}-heading`} className="flex items-center gap-2 text-lg font-black text-slate-900 border-b border-slate-200 pb-3">
              <Icon size={19} className="text-blue-700" />
              {title}
              <span className="ml-auto text-xs font-bold text-slate-500">{sectionNotices.length}</span>
            </h2>
            {sectionNotices.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {sectionNotices.map((notice) => {
                  const slug = getSlug(notice);
                  return (
                    <li key={slug}>
                      <Link to={"/post/" + slug} className="group flex items-start justify-between gap-3 py-3 text-sm font-semibold text-slate-800 hover:text-blue-800">
                        <span>
                          {notice.title || "Official Bihar Government Notice"}
                          <span className="block text-[11px] text-slate-500 font-medium mt-1">{notice.department || "Bihar Government"}</span>
                        </span>
                        <ArrowRight size={15} className="shrink-0 mt-0.5 text-slate-400 group-hover:text-blue-700" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 py-4">No active updates in this category.</p>
            )}
          </section>
        ))}
      </div>

      <nav aria-label="Archive categories" className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
        <Link to="/sitemap" className="text-blue-700 hover:underline">All Updates</Link>
        <Link to="/jobs" className="text-blue-700 hover:underline">Jobs</Link>
        <Link to="/admit-card" className="text-blue-700 hover:underline">Admit Cards</Link>
        <Link to="/results" className="text-blue-700 hover:underline">Results</Link>
      </nav>
    </main>
  );
}

SiteMapPage.propTypes = {
  notices: PropTypes.arrayOf(PropTypes.object),
  category: PropTypes.string,
};