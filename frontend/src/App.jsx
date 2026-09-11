import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotificationCard from "./components/NotificationCard";
import ImageResizer from "./components/ImageResizer";
import AgeCalculator from "./components/AgeCalculator";
import Footer from "./components/Footer";
import PostDetail from "./pages/PostDetail";
import { PERMANENT_SERVICES } from "./data/portalData";
import { 
  Camera, Calculator, Flame, Sparkles, Briefcase, 
  Search, ArrowRight, Award, IdCard, Send, MessageSquare, 
  ExternalLink, Zap, TrendingUp, ShieldCheck, Loader2,
  GraduationCap, Wrench, Users
} from "lucide-react";
import { generateSlug } from "./utils/slug";

// Policy & Forecast Pages
// @ts-ignore
import About from "./pages/about";
// @ts-ignore
import Contact from "./pages/contact";
// @ts-ignore
import Disclaimer from "./pages/disclaimer";
// @ts-ignore
import PrivacyPolicy from "./pages/privacyPolicy";
// @ts-ignore
import Terms from "./pages/terms";
// @ts-ignore
import Upcoming2026 from "./pages/upcoming";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CATEGORY_TABS = [
  { id: "all", label: "All Updates", icon: Sparkles },
  { id: "results", label: "Results", icon: Award },
  { id: "admit_card", label: "Admit Card", icon: IdCard },
  { id: "jobs", label: "Govt Jobs", icon: Briefcase },
  { id: "services", label: "RTPS Services", icon: ShieldCheck },
  { id: "schemes", label: "Schemes / Yojana", icon: Sparkles },
];

const DIRECT_LINKS = [
  { name: "BPSC Public Service", url: "https://bpsc.bihar.gov.in", tag: "Civil Services" },
  { name: "CSBC Police Constable", url: "https://csbc.bihar.gov.in", tag: "Police Dept" },
  { name: "BPSSC Sub-Inspector (SI)", url: "https://bpssc.bih.nic.in", tag: "Daroga Bharti" },
  { name: "BCECEB Examination Board", url: "https://bceceboard.bihar.gov.in", tag: "Entrance & Special Jobs" },
  { name: "BTSC Technical Service", url: "https://btsc.bihar.gov.in", tag: "JE & Medical" },
  { name: "BSSC Staff Selection", url: "https://bssc.bihar.gov.in", tag: "Inter & CGL" },
  { name: "RTPS Bihar (E-Certificates)", url: "https://serviceonline.bihar.gov.in", tag: "Caste / Income" },
  { name: "Bihar Bhumi Records", url: "https://biharbhumi.bihar.gov.in", tag: "Mutation / Lagan" },
  { name: "Udyami Yojana Portal", url: "https://udyami.bihar.gov.in", tag: "Govt Grant" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeTool, setActiveTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [portalItems, setPortalItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveNotices() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notices`);
        const json = await response.json();

        let rawData = json.data;
        if (typeof rawData === "string") {
          try {
            rawData = JSON.parse(rawData);
          } catch (e) {
            console.error("JSON parse error:", e);
            rawData = [];
          }
        }

        if (Array.isArray(rawData) && rawData.length > 0) {
          const normalized = rawData.map((item) => {
            let cat = (item.category || "jobs").toLowerCase().trim();
            if (cat === "job" || cat === "notice" || cat === "latest-jobs") cat = "jobs";
            if (cat === "scheme" || cat === "yojana" || cat === "udyami") cat = "schemes";
            if (cat === "result") cat = "results";
            if (cat === "rtps" || cat === "bihar_bhumi" || cat === "land") cat = "services";

            return {
              ...item, // Preserve all specialized schema fields
              id: item.id || item.slug,
              slug: item.slug || generateSlug(item),
              title: item.title,
              department: item.department,
              category: cat,
              total_posts: item.total_posts || item.totalPosts || "विभागीय सूचना देखें",
              totalPosts: item.total_posts || item.totalPosts || "विभागीय सूचना देखें",
              last_date: item.last_date || item.lastDate || "सक्रिय सूचना",
              lastDate: item.last_date || item.lastDate || "सक्रिय सूचना",
              eligibility: item.eligibility || "विज्ञापन देखें",
              qualification_details: item.qualification_details,
              pdf_url: item.pdf_url || item.pdfUrl,
              pdfUrl: item.pdf_url || item.pdfUrl,
              apply_url: item.apply_url || item.applyUrl || item.pdf_url,
              applyUrl: item.apply_url || item.applyUrl || item.pdf_url,
              link: item.apply_url || item.pdf_url,
              fees: item.fees || item.fee || "निःशुल्क (₹0)",
              processing_time: item.processing_time || item.delivery_time || "10-14 कार्य दिवस"
            };
          });

          setPortalItems([...normalized, ...PERMANENT_SERVICES]);
        } else {
          setPortalItems(PERMANENT_SERVICES);
        }
      } catch (err) {
        console.warn("Backend fallback active:", err.message);
        setPortalItems(PERMANENT_SERVICES);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveNotices();
  }, []);

  const filteredData = portalItems.filter((item) => {
    const cat = (item.category || "").toLowerCase();
    const slug = (item.slug || "").toLowerCase();

    let matchesTab = false;
    if (activeTab === "all") {
      matchesTab = true;
    } else if (activeTab === "services") {
      matchesTab = cat === "services" || cat === "rtps" || cat === "bihar_bhumi" || slug.includes("rtps") || slug.includes("bhumi");
    } else if (activeTab === "schemes") {
      matchesTab = cat === "schemes" || cat === "yojana" || slug.includes("udyami") || slug.includes("scheme");
    } else if (activeTab === "results") {
      matchesTab = cat === "results" || cat === "result" || item.isResult;
    } else {
      matchesTab = cat === activeTab;
    }
      
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.department?.toLowerCase().includes(q) ||
      (item.eligibility && item.eligibility.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  const handleOpenTool = (toolName) => {
    setActiveTool(toolName);
    const element = document.getElementById("cyber-tools-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const liveScrapedItems = portalItems.filter(
    (i) => i.department === "BPSC" || i.department === "CSBC" || i.department?.includes("BPSSC") || i.department === "BCECEB"
  );
  const topAlertItem = liveScrapedItems.length > 0 ? liveScrapedItems[0] : portalItems[0] || null;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <section className="relative w-full bg-white border-b border-slate-200 overflow-hidden select-none">
                  <div className="max-w-[1550px] mx-auto pt-4 sm:pt-6">
                    <div className="px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                      <div className="lg:col-span-7 space-y-4 text-center lg:text-left z-10 pb-4">
                        <div className="flex flex-col items-center lg:items-start">
                          <img 
                            src="/logo.png" 
                            alt="BiharFast Logo" 
                            className="h-14 sm:h-16 w-auto object-contain"
                          />
                          <p className="text-xs sm:text-sm font-black text-slate-800 mt-1.5 tracking-wide">
                            Jobs &nbsp;|&nbsp; Welfare &nbsp;|&nbsp; Information
                          </p>
                          <p className="text-[10.5px] sm:text-xs text-slate-500 font-semibold tracking-wider">
                            — सही जानकारी, बेहतर बिहार —
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-black text-[#0B3B66] tracking-tight leading-tight">
                            Bihar Government <br className="hidden sm:block" />
                            Opportunities, <span className="text-[#F97316]">Now Faster.</span>
                          </h1>
                          <p className="text-xs sm:text-sm text-slate-600 font-bold pt-1">
                            Latest Jobs &nbsp;|&nbsp; Welfare Schemes &nbsp;|&nbsp; Useful Tools &nbsp;|&nbsp; All in One Place
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Trusted • Simple • Fast • For a Brighter Bihar
                          </p>
                        </div>

                        <div className="pt-1 max-w-xl mx-auto lg:mx-0">
                          <div className="relative flex items-center bg-white border-2 border-[#0B4F8A] rounded-2xl shadow-md overflow-hidden p-1 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                            <Search className="text-slate-400 ml-3 shrink-0" size={19} />
                            <input
                              type="text"
                              placeholder="Search jobs, schemes, results, notifications..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full py-2 px-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-semibold focus:outline-none"
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-xs text-slate-400 hover:text-slate-700 font-bold px-2 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById("active-circulars-section");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="bg-[#0B4F8A] hover:bg-[#073863] text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shrink-0 cursor-pointer shadow-xs"
                            >
                              Search
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2 pt-2 max-w-lg mx-auto lg:mx-0">
                          <button
                            type="button"
                            onClick={() => { setActiveTab("jobs"); setSearchQuery(""); }}
                            className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-blue-50/80 transition group cursor-pointer text-center"
                          >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0B5C9E] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                              <Briefcase size={18} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">Government<br />Jobs</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => { setActiveTab("schemes"); setSearchQuery(""); }}
                            className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-emerald-50/80 transition group cursor-pointer text-center"
                          >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                              <Users size={18} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">Welfare<br />Schemes</span>
                          </button>

                          <Link
                            to="/upcoming-2026"
                            className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-amber-50/80 transition group cursor-pointer text-center"
                          >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                              <GraduationCap size={18} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">Scholarships<br />& Upcoming</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => { setActiveTab("results"); setSearchQuery(""); }}
                            className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-purple-50/80 transition group cursor-pointer text-center"
                          >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                              <Award size={18} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">Exam<br />Results</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenTool("resizer")}
                            className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-rose-50/80 transition group cursor-pointer text-center"
                          >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                              <Wrench size={18} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">Useful<br />Tools</span>
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-end relative h-full">
                        <div className="text-center lg:text-right mb-2 w-full pr-2">
                          <span className="text-xl sm:text-2xl font-serif italic font-extrabold text-[#0B4F8A] block">
                            बढ़ता बिहार, <span className="text-[#F97316]">बनता भविष्य</span>
                          </span>
                        </div>

                        <div className="w-full max-w-125 relative rounded-t-3xl overflow-hidden bg-linear-to-b from-sky-200/40 via-blue-50/30 to-transparent flex items-end justify-center">
                          <img 
                            src="/hero-students.png" 
                            alt="Bihar Aspirants" 
                            className="w-full h-auto max-h-87.5 sm:max-h-97.5 object-contain relative z-10 block drop-shadow-md select-none pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-linear-to-r from-[#073663] via-[#0A4B8A] to-[#138808] text-white py-3 px-4 sm:px-8 shadow-inner">
                      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-6 sm:gap-8 flex-wrap font-bold text-[11px] text-white">
                          <span className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-cyan-300" />
                            <span>Verified Sources <span className="font-normal opacity-80 block text-[9.5px]">Direct Official Portals</span></span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Zap size={16} className="text-amber-300 fill-amber-300" />
                            <span>Fast & Lightweight <span className="font-normal opacity-80 block text-[9.5px]">Works on 2G/3G too</span></span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Users size={16} className="text-emerald-200" />
                            <span>Bilingual <span className="font-normal opacity-80 block text-[9.5px]">English | हिंदी</span></span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Sparkles size={16} className="text-rose-200" />
                            <span>Empowering Bihar <span className="font-normal opacity-80 block text-[9.5px]">Real-Time Vacancy Alerts</span></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200/80 py-2 px-4 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-500 text-[11px]">Trending:</span>
                    {["BPSC", "BPSSC", "CSBC पुलिस", "BCECEB", "BTSC", "BSSC Inter", "Udyami"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchQuery(tag)}
                        className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer shadow-xs"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </section>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20">
                  {topAlertItem && (
                    <div className="mb-6 bg-linear-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg flex items-center justify-between gap-3 border border-red-300/40">
                      <div className="flex items-center gap-3 text-xs sm:text-sm font-bold truncate">
                        <span className="bg-white/20 p-2 rounded-xl flex items-center justify-center shrink-0">
                          <Flame size={18} className="text-amber-200 fill-amber-200 animate-bounce" />
                        </span>
                        <span className="truncate">
                          Latest Alert: <strong className="text-amber-200 font-black">{topAlertItem.department}</strong> - {topAlertItem.title}
                        </span>
                      </div>
                      <Link 
                        to={`/post/${generateSlug(topAlertItem)}`}
                        className="bg-white text-red-600 font-black text-xs px-4 py-2 rounded-xl shadow-md hover:bg-amber-50 transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                      >
                        View Notice <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                      <div id="cyber-tools-section" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                              100% Free Online Utilities
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                              Smart Cyber Tools (Instant Self-Apply)
                            </h3>
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                            Private & Fast
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <button
                            type="button"
                            onClick={() => setActiveTool(activeTool === "resizer" ? null : "resizer")}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                              activeTool === "resizer"
                                ? "bg-amber-50 border-amber-400 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                            }`}
                          >
                            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
                              <Camera size={22} />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Photo & Sign Resizer</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Compress to 20–50 KB for official forms
                              </p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTool(activeTool === "calculator" ? null : "calculator")}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                              activeTool === "calculator"
                                ? "bg-amber-50 border-amber-400 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                            }`}
                          >
                            <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
                              <Calculator size={22} />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Age Eligibility Calculator</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Calculate cutoff age & category relaxation
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {activeTool === "resizer" && <ImageResizer onClose={() => setActiveTool(null)} />}
                      {activeTool === "calculator" && <AgeCalculator onClose={() => setActiveTool(null)} />}

                      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {CATEGORY_TABS.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={`text-xs font-black px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                                isActive
                                  ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <Icon size={15} className={isActive ? "text-amber-400" : "text-slate-400"} />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      <div id="active-circulars-section" className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-black text-slate-700 px-1">
                          <span className="flex items-center gap-1.5 text-slate-900 text-sm font-extrabold">
                            <TrendingUp size={18} className="text-blue-600" />
                            Active Official Circulars
                          </span>
                          <span className="bg-white border border-slate-200 text-slate-800 px-3 py-1 rounded-full font-black flex items-center gap-1.5 shadow-xs">
                            {loading && <Loader2 size={13} className="animate-spin text-blue-600" />}
                            {filteredData.length} Live Notices
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredData.map((item) => (
                            <NotificationCard
                              key={item.id || item.slug}
                              item={item}
                            />
                          ))}
                        </div>

                        {!loading && filteredData.length === 0 && (
                          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-sm font-bold shadow-xs">
                            No notifications matched your search query. Try another keyword.
                          </div>
                        )}
                      </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                      {/* Community Action Card */}
                      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="text-amber-400 fill-amber-400" size={20} />
                          <h3 className="font-extrabold text-base">Get Real-Time Alerts</h3>
                        </div>
                        <p className="text-xs text-slate-300 mb-4 leading-relaxed font-medium">
                          Never miss an admit card, result or application deadline. Join our official community channels.
                        </p>
                        
                        <div className="space-y-2.5">
                          <a
                            href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xs active:scale-95"
                          >
                            <MessageSquare size={15} className="fill-slate-950" /> Join Official WhatsApp Channel
                          </a>

                          <a
                            href="https://t.me/biharfast_official"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xs active:scale-95"
                          >
                            <Send size={15} /> Join Telegram Channel (Free)
                          </a>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="text-emerald-600" size={18} />
                            <h3 className="font-extrabold text-sm text-slate-900">Official Govt Portals</h3>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Link</span>
                        </div>

                        <div className="divide-y divide-slate-100 text-xs">
                          {DIRECT_LINKS.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2.5 flex items-center justify-between group hover:text-blue-700 transition"
                            >
                              <div>
                                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition">
                                  {link.name}
                                </p>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {link.tag}
                                </span>
                              </div>
                              <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-700 transition" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs">
                        <p className="font-black text-amber-900 mb-1 flex items-center gap-1">
                          <Sparkles size={14} className="text-amber-600" /> Bihar&apos;s Cleanest Job Portal
                        </p>
                        <p className="text-amber-800 leading-relaxed text-[11px] font-medium">
                          We do not host clickbait redirects or third-party ads. Every single link points directly to government NIC servers.
                        </p>
                      </div>
                    </aside>
                  </div>
                </main>
              </>
            }
          />

          <Route path="/post/:slug" element={<PostDetail notices={portalItems} />} />
          
          {/* Policy & Compliance Dual Routing */}
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          
          <Route path="/upcoming-2026" element={<Upcoming2026 />} />
        </Routes>
      </div>

      <Footer onOpenTool={handleOpenTool} />
    </div>
  );
}