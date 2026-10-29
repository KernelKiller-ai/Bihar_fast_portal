import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  ExternalLink, 
  Clock, 
  X, 
  Building2, 
  Sparkles 
} from "lucide-react";
import { BIHAR_DISTRICTS, INITIAL_DISTRICT_JOBS } from "../data/districtJobsData.js";

export default function DistrictRecruitment() {
  const [jobs] = useState(INITIAL_DISTRICT_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeModalJob, setActiveModalJob] = useState(null);

  useEffect(() => {
    document.title = "Bihar District Wise Recruitment 2026 | बिहार सभी 38 जिला भर्ती - BiharFast";
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeModalJob) {
        setActiveModalJob(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalJob]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchQuery = 
        job.district.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        job.postName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        job.eligibility.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchDistrict = 
        selectedDistrict === "ALL" || 
        job.district.toLowerCase() === selectedDistrict.toLowerCase();

      const matchStatus = 
        statusFilter === "ALL" || 
        job.status.toLowerCase() === statusFilter.toLowerCase();

      return matchQuery && matchDistrict && matchStatus;
    });
  }, [jobs, searchQuery, selectedDistrict, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("ALL");
    setStatusFilter("ALL");
  };

  return (
    <main className="min-h-[75vh] max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Top Banner / Hero Header */}
      <header className="bg-linear-to-r from-[#0B2545] via-[#0F3563] to-[#0B2545] text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden mb-8 border border-slate-700/50">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles size={13} className="text-amber-400" /> बिहार सभी 38 जिला भर्ती 2026
            </span>
            <span className="text-xs text-blue-200">
              NIC District Portals Official Updates
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Bihar District Wise Recruitment Master Hub
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-3xl mt-2 leading-relaxed font-normal">
            बिहार के सभी 38 जिलों (समाहरणालय, विकास मित्र, पंचायती राज, स्वास्थ्य समिति, कस्तूरबा विद्यालय व प्रखंड स्तरीय) की नवीनतम संविदा एवं नियमित रिक्तियां।
          </p>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-8" aria-label="District jobs search and filters">
        <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by District (e.g. Araria, Begusarai, Patna) or Post Name..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-civic-navy transition"
              aria-label="Search by district or job title"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* District Select Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="Filter by District"
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-civic-navy cursor-pointer"
            >
              <option value="ALL">All 38 Districts (सभी जिले)</option>
              {BIHAR_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto shrink-0">
            {["ALL", "Active", "Upcoming"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === st 
                    ? "bg-civic-navy text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st === "ALL" ? "All Status" : st}
              </button>
            ))}
          </div>

        </div>

        {/* Results Info & Quick Reset */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <p>
            Showing <strong className="text-slate-900">{filteredJobs.length}</strong> recruitment update{filteredJobs.length === 1 ? "" : "s"}
            {selectedDistrict !== "ALL" && <span> in <strong className="text-blue-800">{selectedDistrict}</strong></span>}
          </p>
          {(searchQuery || selectedDistrict !== "ALL" || statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              <X size={13} /> Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Main Content Area: Responsive Table (Desktop) & Cards (Mobile) */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" aria-label="District Recruitment List">
        
        {/* Empty State */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Search size={24} />
            </div>
            <h2 className="text-base font-bold text-slate-800">No recruitment updates found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are currently no matching vacancies for your search criteria. Please reset your filters or check back soon.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-civic-navy text-white text-xs font-bold rounded-xl hover:bg-civic-navy-dark transition cursor-pointer"
            >
              View All Districts
            </button>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    <th scope="col" className="py-3.5 px-4 w-36">Zila (District)</th>
                    <th scope="col" className="py-3.5 px-4">Post / Bharti Name</th>
                    <th scope="col" className="py-3.5 px-4 w-44">Eligibility</th>
                    <th scope="col" className="py-3.5 px-4 w-36">Last Date</th>
                    <th scope="col" className="py-3.5 px-4 w-36 text-right">Action / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredJobs.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition">
                      
                      {/* District Column */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-rose-600 shrink-0" />
                          <span>{item.district}</span>
                        </div>
                      </td>

                      {/* Post Name Column */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.postName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center gap-1">
                            <Building2 size={11} className="text-slate-400" /> {item.department}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{item.totalPosts}</span>
                        </div>
                      </td>

                      {/* Eligibility Column */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap size={14} className="text-blue-700 shrink-0" />
                          <span>{item.eligibility}</span>
                        </div>
                      </td>

                      {/* Last Date & Status Column */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{item.lastDate}</span>
                        </div>
                        <div className="mt-1">
                          {item.status === "Active" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock size={10} />
                              Upcoming
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Links Column */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveModalJob(item)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            View Info
                          </button>
                          <a
                            href={item.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-civic-navy hover:bg-civic-navy-dark text-white font-bold rounded-lg text-xs transition shadow-2xs"
                            aria-label={`Official notice for ${item.postName} in ${item.district}`}
                          >
                            <span>Notice</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredJobs.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 font-extrabold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      <MapPin size={12} className="text-rose-600" /> {item.district}
                    </span>
                    {item.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={10} />
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-snug">{item.postName}</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Building2 size={11} className="text-slate-400" /> {item.department} ({item.totalPosts})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Eligibility</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{item.eligibility}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Last Date</span>
                      <span className="font-bold text-slate-900">{item.lastDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveModalJob(item)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-civic-navy hover:bg-civic-navy-dark text-white font-bold rounded-xl text-xs transition shadow-2xs text-center"
                    >
                      <span>Official Notice</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* District Information Callout */}
      <aside className="mt-8 bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 sm:p-7 text-xs leading-relaxed text-slate-700" aria-label="District Recruitment Guidelines">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
            ℹ️
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-civic-navy mb-1">
              बिहार जिला स्तरीय भर्ती आवेदन दिशा-निर्देश (Important Advisory)
            </h2>
            <p className="mb-2">
              बिहार के सभी जिलों (समाहरणालय, प्रखंड, अनुमंडल एवं पंचायत स्तर) की संविदा, आउटसोर्सिंग एवं नियमित भर्तियां संबंधित जिले के आधिकारिक NIC पोर्टल (उदा. <code>araria.nic.in</code>, <code>begusarai.nic.in</code>) पर प्रकाशित की जाती हैं।
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>विकास मित्र पदों हेतु आवेदन संबंधित प्रखंड सह अंचल कार्यालय में भौतिक रूप से जमा किए जाते हैं।</li>
              <li>तकनीकी सहायक एवं लेखापाल पदों का चयन जिला पंचायती राज शाखा के माध्यम से होता है।</li>
              <li>किसी भी भर्ती के लिए किसी अनाधिकृत व्यक्ति को कोई शुल्क न दें। आधिकारिक सूचना पत्र जिला पोर्टल से ही सत्यापित करें।</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Details Modal */}
      {activeModalJob && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="district-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            
            <button
              type="button"
              onClick={() => setActiveModalJob(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-bold text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200">
                <MapPin size={12} /> {activeModalJob.district} District
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                activeModalJob.status === "Active"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}>
                {activeModalJob.status}
              </span>
            </div>

            <h2 id="district-modal-title" className="text-lg font-black text-slate-900 leading-snug">
              {activeModalJob.postName}
            </h2>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p><strong className="text-slate-900">Vibhag (Department):</strong> {activeModalJob.department}</p>
              <p><strong className="text-slate-900">Total Vacancies:</strong> {activeModalJob.totalPosts}</p>
              <p><strong className="text-slate-900">Eligibility Required:</strong> {activeModalJob.eligibility}</p>
              <p><strong className="text-slate-900">Last Date to Apply:</strong> <span className="font-bold text-rose-700">{activeModalJob.lastDate}</span></p>
            </div>

            {activeModalJob.detailsNote && (
              <div className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
                <strong className="text-amber-900 block mb-1">विशेष विवरण (Notice Note):</strong>
                {activeModalJob.detailsNote}
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={activeModalJob.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-civic-navy hover:bg-civic-navy-dark text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                <span>Open {activeModalJob.district} NIC Portal</span>
                <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => setActiveModalJob(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
