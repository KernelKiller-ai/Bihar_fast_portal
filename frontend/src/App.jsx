import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import DownloadAppBanner from "./components/DownloadAppBanner";
import NotificationCard from "./components/NotificationCard";
import ScrollToTop from "./components/ScrollToTop";
import ImageResizer from "./components/ImageResizer";
import AgeCalculator from "./components/AgeCalculator";
import Footer from "./components/Footer";
import { generateSlug } from "./utils/slug";
import SiteMapPage from "./pages/SiteMapPage";

// Icons
import { 
  Camera, Calculator, Flame, Sparkles, Briefcase, 
  Search, ArrowRight, Award, IdCard, Send, MessageSquare, 
  ExternalLink, Zap, TrendingUp, ShieldCheck, Loader2,
  Wrench, CheckCircle2, Trophy, Clock, KeyRound, CalendarDays
} from "lucide-react";

// Lazy Loaded Pages (Bundle Size Optimization)
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const BsebMatric = lazy(() => import("./pages/BsebMatric"));
const BsebInter = lazy(() => import("./pages/BsebInter"));
const CuetUgAdmission = lazy(() => import("./pages/CuetUgAdmission"));
const UdyamiYojana = lazy(() => import("./pages/UdyamiYojana"));
const RtpsBihar = lazy(() => import("./pages/RtpsBihar"));
const KushalYuvaProgram = lazy(() => import("./pages/KushalYuvaProgram"));
const StudentCreditCard = lazy(() => import("./pages/StudentCreditCard"));
const MockTestPage = lazy(() => import("./pages/MockTestPage"));
const Upcoming2026 = lazy(() => import("./pages/upcoming"));
const DownloadApp = lazy(() => import("./pages/DownloadApp"));

// Policy Pages (Lazy Loaded)
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const Disclaimer = lazy(() => import("./pages/disclaimer"));
const PrivacyPolicy = lazy(() => import("./pages/privacyPolicy"));
const Terms = lazy(() => import("./pages/terms"));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

// Only dynamic circular tabs
const CATEGORY_TABS = [
  { id: "all", label: "All Updates", icon: Sparkles },
  { id: "results", label: "Results", icon: Award },
  { id: "admit_card", label: "Admit Card", icon: IdCard },
  { id: "jobs", label: "Govt Jobs", icon: Briefcase },
  { id: "answer-key", label: "Answer Key", icon: KeyRound },
  { id: "exam-calendar", label: "Exam Calendar", icon: CalendarDays },
];

const FILTER_CATEGORY_ALIASES = {
  jobs: ["jobs", "job"],
  results: ["results", "result"],
  admit_card: ["admit_card", "admit"],
  "answer-key": ["answer-key", "answer_key", "answerkey"],
  "exam-calendar": ["exam-calendar", "exam_calendar", "calendar"],
};

// Cleaned Direct Links (Official Government Recruitment Boards Only)
const DIRECT_LINKS = [
  { name: "BPSC Public Service", url: "https://bpsc.bihar.gov.in", tag: "Civil Services" },
  { name: "CSBC Police Constable", url: "https://csbc.bihar.gov.in", tag: "Police Dept" },
  { name: "BPSSC Sub-Inspector (SI)", url: "https://bpssc.bih.nic.in", tag: "Daroga Bharti" },
  { name: "BCECEB Examination Board", url: "https://bceceboard.bihar.gov.in", tag: "Entrance & Special Jobs" },
  { name: "BTSC Technical Service", url: "https://btsc.bihar.gov.in", tag: "JE & Medical" },
  { name: "BSSC Staff Selection", url: "https://bssc.bihar.gov.in", tag: "Inter & CGL" },
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
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const json = await response.json();

        let rawData = json?.data;
        if (typeof rawData === "string") {
          try {
            rawData = JSON.parse(rawData);
          } catch (e) {
            console.error("JSON parse error:", e);
            rawData = [];
          }
        }

        if (Array.isArray(rawData) && rawData.length > 0) {
          const normalized = rawData
            .filter((item) => {
              const s = (item.slug || item.id || "").toLowerCase();
              return !s.includes("rtps") && !s.includes("bhumi") && !s.includes("udyami");
            })
            .map((item) => {
              const rawCat = (item.category || item.type || "").toLowerCase().trim();
              const titleLower = (item.title || "").toLowerCase();
              const normalizedTitle = titleLower.replace(/[^a-z]/g, "");
              const cat =
                rawCat.includes("admit") || titleLower.includes("admit card") || titleLower.includes("call letter") || titleLower.includes("hall ticket")
                  ? "admit_card"
                  : rawCat.includes("result") || titleLower.includes("result") || titleLower.includes("merit list") || titleLower.includes("score card") || titleLower.includes("cut-off") || titleLower.includes("cutoff")
                    ? "results"
                    : rawCat.replace(/[^a-z]/g, "").includes("answerkey") || normalizedTitle.includes("answerkey")
                      ? "answer-key"
                      : rawCat.includes("calendar") || normalizedTitle.includes("calendar") || normalizedTitle.includes("examschedule") || normalizedTitle.includes("datesheet")
                        ? "exam-calendar"
                        : "jobs";

              return {
                ...item,
                id: item.id || item.slug,
                slug: item.slug || generateSlug(item),
                title: item.title,
                department: item.department || "BIHAR GOVT",
                category: cat,
                total_posts: item.total_posts || item.totalPosts || "अधिसूचना देखें",
                totalPosts: item.total_posts || item.totalPosts || "अधिसूचना देखें",
                last_date: item.last_date || item.lastDate || "सक्रिय सूचना",
                lastDate: item.last_date || item.lastDate || "सक्रिय सूचना",
                eligibility: item.eligibility || "विज्ञापन देखें",
                qualification_details: item.qualification_details,
                pdf_url: item.pdf_url || item.pdfUrl,
                pdfUrl: item.pdf_url || item.pdfUrl,
                apply_url: item.apply_url || item.applyUrl || item.download_url || item.pdf_url,
                applyUrl: item.apply_url || item.applyUrl || item.download_url || item.pdf_url,
                link: item.apply_url || item.applyUrl || item.download_url || item.pdf_url,
                fees: item.fees || item.fee || "निःशुल्क (₹0)"
              };
            });

          setPortalItems(normalized);
        } else {
          setPortalItems([]);
        }
      } catch (err) {
        console.warn("Backend fallback active:", err.message);
        setPortalItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveNotices();
  }, []);

  const filteredData = portalItems.filter((item) => {
    const cat = (item.category || "").toLowerCase();
    const acceptedCategories = FILTER_CATEGORY_ALIASES[activeTab] || [activeTab];
    const matchesTab = activeTab === "all" || acceptedCategories.includes(cat);
      
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
    (i) => i.department === "BPSC" || i.department === "CSBC" || i.department?.includes("BPSSC") || i.department === "BCECEB" || i.department === "BSSC"
  );
  const topAlertItem = liveScrapedItems.length > 0 ? liveScrapedItems[0] : portalItems[0] || null;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <ScrollToTop />
      <div>
        <Navbar />
        <DownloadAppBanner />

        <Suspense 
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
              <p className="text-xs font-bold text-slate-600">पेज लोड हो रहा है...</p>
            </div>
          }
        >
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
                              width="64"
                              height="64"
                              loading="eager"
                              decoding="async"
                              className="h-14 sm:h-16 w-14 sm:w-16 object-contain aspect-square"
                            />
                            <p className="text-xs sm:text-sm font-black text-slate-800 mt-1.5 tracking-wide">
                              Jobs | Welfare | Information
                            </p>
                            <p className="text-[10.5px] sm:text-xs text-slate-600 font-bold tracking-wider">
                              — सही जानकारी, बेहतर बिहार —
                            </p>
                          </div>

                          <div className="space-y-1">
                            <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-black text-[#0B3B66] tracking-tight leading-tight">
                              Bihar Government <br className="hidden sm:block" />
                              Opportunities, <span className="text-[#C2410C]">Now Faster.</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-700 font-bold pt-1">
                              Latest Jobs | Direct Fast Portals | Useful Tools | All in One Place
                            </p>
                            <p className="text-[11px] text-slate-600 font-semibold">
                              Trusted • Simple • Fast • For a Brighter Bihar
                            </p>
                          </div>

                          <div className="pt-1 max-w-xl mx-auto lg:mx-0">
                            <div className="relative flex items-center bg-white border-2 border-[#0B4F8A] rounded-2xl shadow-md overflow-hidden p-1 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                              <Search className="text-slate-600 ml-3 shrink-0" size={19} />
                              <input
                                type="text"
                                placeholder="Search jobs, results, admit cards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 font-semibold focus:outline-none"
                              />
                              {searchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setSearchQuery("")}
                                  className="text-xs text-slate-600 hover:text-slate-900 font-bold px-2 cursor-pointer"
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

                          {/* Quick Navigation Icons */}
                          <div className="grid grid-cols-5 gap-2 pt-2 max-w-lg mx-auto lg:mx-0">
                            <button
                              type="button"
                              onClick={() => { setActiveTab("jobs"); setSearchQuery(""); }}
                              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-blue-50/80 transition group cursor-pointer text-center"
                            >
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0B5C9E] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                <Briefcase size={18} />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 mt-1 leading-tight">Government<br />Jobs</span>
                            </button>

                            {/* 10th Mock Test Quick Icon */}
                            <Link
                              to="/class-10-quiz"
                              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-amber-50/80 transition group cursor-pointer text-center relative"
                            >
                              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-xs">
                                LIVE
                              </span>
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-linear-to-tr from-amber-600 to-yellow-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                <Trophy size={18} />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-black text-amber-900 mt-1 leading-tight">10th Daily<br />Mock Test</span>
                            </Link>

                            <Link
                              to="/rtps-bihar"
                              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-emerald-50/80 transition group cursor-pointer text-center"
                            >
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                <ShieldCheck size={18} />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 mt-1 leading-tight">RTPS<br />Services</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => { setActiveTab("results"); setSearchQuery(""); }}
                              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-purple-50/80 transition group cursor-pointer text-center"
                            >
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                <Award size={18} />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 mt-1 leading-tight">Exam<br />Results</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenTool("resizer")}
                              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-rose-50/80 transition group cursor-pointer text-center"
                            >
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                <Wrench size={18} />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 mt-1 leading-tight">Useful<br />Tools</span>
                            </button>
                          </div>
                        </div>

                        {/* Hero Right Banner Image (Safe Direct PNG & Aspect Ratio) */}
                        <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-end relative h-full">
                          <div className="text-center lg:text-right mb-2 w-full pr-2">
                            <span className="text-xl sm:text-2xl font-serif italic font-extrabold text-[#0B4F8A] block">
                              बढ़ता बिहार, <span className="text-[#C2410C]">बनता भविष्य</span>
                            </span>
                          </div>

                          <div className="w-full max-w-125 relative rounded-t-3xl overflow-hidden bg-linear-to-b from-sky-200/40 via-blue-50/30 to-transparent flex items-end justify-center">
                            <img 
                              src="/hero-students.png" 
                              alt="Bihar Aspirants" 
                              width="665"
                              height="443"
                              fetchPriority="high"
                              loading="eager"
                              decoding="async"
                              className="w-full h-auto max-h-87.5 sm:max-h-97.5 object-contain relative z-10 block drop-shadow-md select-none pointer-events-none aspect-665/443"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Direct Fast Hubs Navigation Strip */}
                      <div className="w-full bg-slate-900 border-t border-slate-800 py-2.5 px-4 sm:px-8">
                        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold text-white">
                          <span className="text-amber-400 flex items-center gap-1 shrink-0 font-extrabold text-[11px] uppercase tracking-wider mr-1">
                            <Sparkles size={13} /> Fast Hubs:
                          </span>
                          <Link 
                            to="/class-10-quiz" 
                            className="px-3 py-1 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold transition shrink-0 shadow-xs flex items-center gap-1.5"
                          >
                            <Trophy size={13} className="text-yellow-200" />
                            🎯 10th Mock Test & Rank
                          </Link>
                          <Link 
                            to="/bseb-matric-10th" 
                            className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 transition shrink-0"
                          >
                            BSEB 10th Result
                          </Link>
                          <Link 
                            to="/bseb-inter-12th" 
                            className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 transition shrink-0"
                          >
                            BSEB 12th Inter
                          </Link>
                          <Link 
                            to="/cuet-ug-admission" 
                            className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 transition shrink-0"
                          >
                            CUET UG 2026
                          </Link>
                          <Link 
                            to="/rtps-bihar" 
                            className="px-3 py-1 rounded-lg bg-teal-600/30 hover:bg-teal-600 border border-teal-500/40 transition shrink-0"
                          >
                            RTPS जाति/आय/निवास
                          </Link>
                          <Link 
                            to="/udyami-yojana" 
                            className="px-3 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600 border border-amber-500/40 transition shrink-0"
                          >
                            उद्यमी योजना ₹10L
                          </Link>
                          <Link 
                            to="/kyp-bihar" 
                            className="px-3 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600 border border-sky-500/40 transition shrink-0"
                          >
                            कुशल युवा (KYP)
                          </Link>
                          <Link 
                            to="/student-credit-card" 
                            className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 transition shrink-0"
                          >
                            स्टूडेंट क्रेडिट कार्ड ₹4L
                          </Link>
                        </div>
                      </div>

                      {/* Benefits & Trust Strip */}
                      <div className="w-full bg-linear-to-r from-[#073663] via-[#0A4B8A] to-[#138808] text-white py-3 px-4 sm:px-8 shadow-inner">
                        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-6 sm:gap-8 flex-wrap font-bold text-[11px] text-white">
                            <span className="flex items-center gap-2">
                              <ShieldCheck size={16} className="text-cyan-300" />
                              <span>Verified Sources <span className="font-medium opacity-90 block text-[9.5px]">Direct Official Portals</span></span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Zap size={16} className="text-amber-300 fill-amber-300" />
                              <span>Fast & Lightweight <span className="font-medium opacity-90 block text-[9.5px]">Works on 2G/3G too</span></span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Sparkles size={16} className="text-rose-200" />
                              <span>Empowering Bihar <span className="font-medium opacity-90 block text-[9.5px]">Real-Time Vacancy Alerts</span></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border-t border-slate-200/80 py-2 px-4 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-700 font-medium">
                      <span className="font-bold text-slate-700 text-[11px]">Trending:</span>
                      {["10th Mock Test", "BPSC", "BPSSC", "CSBC पुलिस", "BCECEB", "BTSC", "BSSC Inter"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (tag === "10th Mock Test") {
                              window.location.href = "/class-10-quiz";
                            } else {
                              setSearchQuery(tag);
                            }
                          }}
                          className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-800 text-[11px] font-bold border border-slate-300 transition cursor-pointer shadow-xs"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </section>

                  <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20">
                    {/* High-Converting Quiz Callout Banner */}
                    <div className="mb-6 bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                          <Trophy size={26} className="text-amber-300 animate-bounce" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Daily Live Exam
                            </span>
                            <span className="text-[11px] text-blue-200 font-bold flex items-center gap-1">
                              <Clock size={12} /> 15 Min Instant Test
                            </span>
                          </div>
                          <h2 className="text-base sm:text-lg font-black text-white mt-1">
                            BSEB 10th मैट्रिक लाइव मॉक टेस्ट & बिहार स्टेट लीडरबोर्ड
                          </h2>
                          <p className="text-xs text-blue-100 font-medium">
                            अपनी तैयारी परखें, जिलावार रैंक देखें और दोस्तों के साथ व्हाट्सएप पर स्कोरकार्ड शेयर करें।
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/class-10-quiz"
                        className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 group active:scale-95"
                      >
                        <span>अभी फ्री टेस्ट दें</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                      </Link>
                    </div>

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
                          className="bg-white text-red-700 font-black text-xs px-4 py-2 rounded-xl shadow-md hover:bg-amber-50 transition shrink-0 flex items-center gap-1.5 cursor-pointer"
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
                              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                                100% Free Online Utilities
                              </span>
                              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                                Smart Cyber Tools (Instant Self-Apply)
                              </h2>
                            </div>
                            <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-300">
                              Private & Fast
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <button
                              type="button"
                              onClick={() => setActiveTool(activeTool === "resizer" ? null : "resizer")}
                              className={`p-4 rounded-xl border-2 flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                                activeTool === "resizer"
                                  ? "bg-amber-50 border-amber-500 shadow-sm"
                                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                              }`}
                            >
                              <div className="p-3 rounded-xl bg-blue-700 text-white shadow-xs shrink-0">
                                <Camera size={22} />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Photo & Sign Resizer</p>
                                <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                                  Compress to 20–50 KB for official forms
                                </p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveTool(activeTool === "calculator" ? null : "calculator")}
                              className={`p-4 rounded-xl border-2 flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                                activeTool === "calculator"
                                  ? "bg-amber-50 border-amber-500 shadow-sm"
                                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                              }`}
                            >
                              <div className="p-3 rounded-xl bg-emerald-700 text-white shadow-xs shrink-0">
                                <Calculator size={22} />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Age Eligibility Calculator</p>
                                <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                                  Calculate cutoff age & category relaxation
                                </p>
                              </div>
                            </button>
                          </div>
                        </div>

                        {activeTool === "resizer" && <ImageResizer onClose={() => setActiveTool(null)} />}
                        {activeTool === "calculator" && <AgeCalculator onClose={() => setActiveTool(null)} />}

                        {/* Category Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto scroll-smooth touch-pan-x overscroll-x-contain pb-2 scrollbar-none">
                          {CATEGORY_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-xs font-black px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
                                  isActive
                                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <Icon size={15} className={isActive ? "text-amber-400" : "text-slate-600"} />
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>

                        <div id="active-circulars-section" className="space-y-4">
                          <div className="flex items-center justify-between text-xs font-black text-slate-800 px-1">
                            <h2 className="flex items-center gap-1.5 text-slate-900 text-sm font-extrabold">
                              <TrendingUp size={18} className="text-blue-700" />
                              Active Official Circulars
                            </h2>
                            <span className="bg-white border border-slate-300 text-slate-900 px-3 py-1 rounded-full font-black flex items-center gap-1.5 shadow-xs">
                              {loading && <Loader2 size={13} className="animate-spin text-blue-700" />}
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
                            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-600 text-sm font-bold shadow-xs">
                              No notifications matched your search query. Try another keyword.
                            </div>
                          )}
                        </div>
                      </div>

                      <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="text-blue-700" size={18} />
                              <h2 className="font-extrabold text-sm text-slate-900">Bihar Direct Hubs</h2>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Fast Access</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <Link to="/class-10-quiz" className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 flex items-center justify-between transition group">
                              <div>
                                <p className="font-black text-amber-950 group-hover:text-amber-800 flex items-center gap-1">
                                  <Trophy size={13} className="text-amber-600" /> 10th बोर्ड लाइव टेस्ट 2026
                                </p>
                                <span className="text-[10px] text-amber-700 font-semibold">अंक, सटीकता और राज्य रैंक</span>
                              </div>
                              <ArrowRight size={13} className="text-amber-700 transition group-hover:translate-x-0.5" />
                            </Link>
                            <Link to="/bseb-matric-10th" className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-700">बिहार बोर्ड 10वीं रिजल्ट 2026</p>
                                <span className="text-[10px] text-slate-500">Multi-Server Direct NIC Link</span>
                              </div>
                              <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-700 transition" />
                            </Link>
                            <Link to="/bseb-inter-12th" className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-emerald-700">बिहार बोर्ड 12वीं इंटर रिजल्ट</p>
                                <span className="text-[10px] text-slate-500">Science | Arts | Commerce Direct</span>
                              </div>
                              <ArrowRight size={13} className="text-slate-400 group-hover:text-emerald-700 transition" />
                            </Link>
                            <Link to="/rtps-bihar" className="p-2.5 rounded-xl border border-slate-100 hover:border-teal-500 hover:bg-teal-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-teal-700">RTPS जाति, आय, निवास प्रमाण पत्र</p>
                                <span className="text-[10px] text-slate-500">बिना लॉगिन सीधा डाउनलोड</span>
                              </div>
                              <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-700 transition" />
                            </Link>
                            <Link to="/udyami-yojana" className="p-2.5 rounded-xl border border-slate-100 hover:border-amber-500 hover:bg-amber-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-amber-700">मुख्यमंत्री उद्यमी योजना (₹10L)</p>
                                <span className="text-[10px] text-slate-500">चयन सूची & DPR फॉर्मेट</span>
                              </div>
                              <ArrowRight size={13} className="text-slate-400 group-hover:text-amber-700 transition" />
                            </Link>
                            <Link to="/kyp-bihar" className="p-2.5 rounded-xl border border-slate-100 hover:border-sky-500 hover:bg-sky-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-sky-700">कुशल युवा कार्यक्रम (KYP)</p>
                                <span className="text-[10px] text-slate-500">सर्टिफिकेट डाउनलोड & रजिस्ट्रेशन</span>
                              </div>
                              <ArrowRight size={13} className="text-slate-400 group-hover:text-sky-700 transition" />
                            </Link>
                            <Link to="/student-credit-card" className="p-2.5 rounded-xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-700">स्टूडेंट क्रेडिट कार्ड (BSCC)</p>
                                <span className="text-[10px] text-slate-500">₹4 लाख शिक्षा ऋण आवेदन</span>
                              </div>
                              <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-700 transition" />
                            </Link>
                          </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="text-amber-400 fill-amber-400" size={20} />
                            <h2 className="font-extrabold text-base">Get Real-Time Alerts</h2>
                          </div>
                          <p className="text-xs text-slate-200 mb-4 leading-relaxed font-medium">
                            Never miss an admit card, result or application deadline. Join our official community channels.
                          </p>
                          
                          <div className="space-y-2.5">
                            <a
                              href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B"
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-[#1da851] hover:bg-[#189246] text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xs active:scale-95"
                            >
                              <MessageSquare size={15} className="fill-white" /> Join Official WhatsApp Channel
                            </a>

                            <a
                              href="https://t.me/biharfast_official"
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xs active:scale-95"
                            >
                              <Send size={15} /> Join Telegram Channel (Free)
                            </a>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="text-emerald-700" size={18} />
                              <h2 className="font-extrabold text-sm text-slate-900">Official Commissions</h2>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Govt Sites</span>
                          </div>

                          <div className="divide-y divide-slate-100 text-xs">
                            {DIRECT_LINKS.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2.5 flex items-center justify-between group hover:text-blue-800 transition"
                              >
                                <div>
                                  <p className="font-bold text-slate-900 group-hover:text-blue-800 transition">
                                    {link.name}
                                  </p>
                                  <span className="text-[10px] text-slate-600 font-semibold">
                                    {link.tag}
                                  </span>
                                </div>
                                <ExternalLink size={13} className="text-slate-600 group-hover:text-blue-800 transition" />
                              </a>
                            ))}
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs">
                          <p className="font-black text-amber-950 mb-1 flex items-center gap-1">
                            <Sparkles size={14} className="text-amber-700" /> Bihar&apos;s Cleanest Job Portal
                          </p>
                          <p className="text-amber-900 leading-relaxed text-[11px] font-semibold">
                            Authentic updates and direct links pointing straight to official government departments and commission servers.
                          </p>
                        </div>
                      </aside>
                    </div>
                  </main>
                </>
              }
            />

            <Route path="/post/:slug" element={<PostDetail notices={portalItems} />} />
            <Route path="/sitemap" element={<SiteMapPage notices={portalItems} />} />
            <Route path="/all-updates" element={<SiteMapPage notices={portalItems} />} />
            <Route path="/jobs" element={<SiteMapPage notices={portalItems} category="jobs" />} />
            <Route path="/admit-card" element={<SiteMapPage notices={portalItems} category="admit_card" />} />
            <Route path="/results" element={<SiteMapPage notices={portalItems} category="results" />} />
            
            {/* Policy & Compliance Dual Routing */}
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            
            {/* Admin Gate Dual Routing */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-portal" element={<Admin />} />
            
            {/* Dedicated High-Speed Hubs */}
            <Route path="/bseb-matric-10th" element={<BsebMatric />} />
            <Route path="/bseb-inter-12th" element={<BsebInter />} />
            <Route path="/cuet-ug-admission" element={<CuetUgAdmission />} />
            <Route path="/rtps-bihar" element={<RtpsBihar />} />
            <Route path="/udyami-yojana" element={<UdyamiYojana />} />
            <Route path="/kyp-bihar" element={<KushalYuvaProgram />} />
            <Route path="/student-credit-card" element={<StudentCreditCard />} />
            
            {/* Dual Routes for Class 10th Mock Test */}
            <Route path="/class-10-quiz" element={<MockTestPage />} />
            <Route path="/mock-test/class-10" element={<MockTestPage />} />
            
            <Route path="/upcoming-2026" element={<Upcoming2026 />} />
            <Route path="/download" element={<DownloadApp />} />
          </Routes>
        </Suspense>
      </div>

      <Footer onOpenTool={handleOpenTool} />
    </div>
  );
}