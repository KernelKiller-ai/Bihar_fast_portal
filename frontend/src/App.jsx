import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import DownloadAppBanner from "./components/DownloadAppBanner";
import TopBanner from "./components/TopBanner";
import AdminBannerControl from "./components/AdminBannerControl";
import NotificationCard from "./components/NotificationCard";
import LoginModal from "./components/LoginModal";
import ScrollToTop from "./components/ScrollToTop";
import ImageResizer from "./components/ImageResizer";
import AgeCalculator from "./components/AgeCalculator";
import Footer from "./components/Footer";
import { generateSlug } from "./utils/slug";
import SiteMapPage from "./pages/SiteMapPage";
import RouteSEO from "./components/RouteSEO";

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
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const UsefulToolsPage = lazy(() => import("./pages/UsefulToolsPage"));
const DistrictRecruitment = lazy(() => import("./pages/DistrictRecruitment"));

// Policy Pages (Lazy Loaded)
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const Disclaimer = lazy(() => import("./pages/disclaimer"));
const PrivacyPolicy = lazy(() => import("./pages/privacyPolicy"));
const Terms = lazy(() => import("./pages/terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
                department: item.department,
                category: cat,
                total_posts: item.total_posts ?? item.totalPosts,
                totalPosts: item.total_posts ?? item.totalPosts,
                last_date: item.last_date ?? item.lastDate,
                lastDate: item.last_date ?? item.lastDate,
                eligibility: item.eligibility ?? item.qualification_details,
                qualification_details: item.qualification_details,
                fees: item.fees ?? item.fee,
                pdf_url: item.pdf_url || item.pdfUrl,
                pdfUrl: item.pdf_url || item.pdfUrl,
                apply_url: item.apply_url || item.applyUrl || item.download_url || item.pdf_url,
                applyUrl: item.apply_url || item.applyUrl || item.download_url || item.pdf_url,
                link: item.apply_url || item.applyUrl || item.download_url || item.pdf_url,
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

  const liveScrapedItems = portalItems.filter(
    (i) => i.department === "BPSC" || i.department === "CSBC" || i.department?.includes("BPSSC") || i.department === "BCECEB" || i.department === "BSSC"
  );
  const topAlertItem = liveScrapedItems.length > 0 ? liveScrapedItems[0] : portalItems[0] || null;

  return (
    <div className="flex min-h-screen w-full min-w-0 max-w-full flex-col justify-between overflow-x-hidden bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <ScrollToTop />
      <LoginModal />
      <RouteSEO />
      <div>
        <TopBanner />
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
                  <section className="relative w-full select-none overflow-hidden border-b border-[#E2E8F0] bg-white">
                    <div className="mx-auto w-full max-w-7xl pt-5 sm:pt-7">
                      <div className="grid grid-cols-1 items-end gap-5 px-4 sm:px-6 lg:grid-cols-12">
                        <div className="lg:col-span-7 space-y-4 text-center lg:text-left z-10 pb-4">
                          <div className="flex flex-col items-center lg:items-start">
                            <img
                              src="/logo-192.webp"
                              alt="BiharFast"
                              width="48"
                              height="48"
                              loading="eager"
                              fetchPriority="high"
                              decoding="async"
                              className="h-12 w-12 sm:h-16 sm:w-16 object-contain aspect-square"
                            />
                          </div>

                          <div className="space-y-1">
                            <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#0B2545] sm:text-4xl lg:text-[38px]">
                              Bihar’s Fastest Gateway to Jobs &amp; Public Services.
                            </h1>
                            <p className="pt-1 text-xs font-medium leading-relaxed text-[#475569] sm:text-sm">
                              – सटीक जानकारी, बेहतर बिहार – | State &amp; Central Vacancies, Board Results &amp; Useful Tools
                            </p>
                          </div>

                          <div className="w-full max-w-xl mx-auto lg:mx-0 pt-1">
                            <div className="relative flex min-h-12 w-full items-center overflow-hidden rounded-lg border border-[#CBD5E1] bg-white p-1 shadow-sm transition focus-within:border-[#0B2545] focus-within:ring-2 focus-within:ring-[#0B2545]/15">
                              <Search className="ml-2 shrink-0 text-[#64748B] sm:ml-3" size={19} />
                              <input
                                type="text"
                                placeholder="Search jobs, results, admit cards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search notices"
                                className="min-w-0 w-full flex-1 px-2 py-2 text-xs font-medium text-[#0F172A] placeholder:text-[#64748B] focus:outline-none sm:px-3 sm:text-sm"
                              />
                              {searchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setSearchQuery("")}
                                  aria-label="Clear search"
                                  className="min-h-10 px-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
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
                                className="min-h-10 shrink-0 rounded-md bg-[#0B2545] px-4 text-xs font-semibold text-white transition hover:bg-[#091E3A] sm:px-6 sm:text-sm"
                              >
                                Search
                              </button>
                            </div>
                          </div>

                          {/* Quick Navigation Icons */}
                          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 pt-2 sm:grid-cols-3 lg:mx-0 lg:grid-cols-6">
                            <Link
                              to="/jobs"
                              onClick={() => { setActiveTab("jobs"); setSearchQuery(""); }}
                              className="group flex min-h-24 flex-col items-start justify-center rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EFF4FF] text-[#0B2545] transition group-hover:bg-[#DCE9FF]">
                                <Briefcase size={17} />
                              </div>
                              <span className="mt-2 text-xs font-semibold leading-relaxed text-[#0F172A]">Government Jobs</span>
                            </Link>

                            <Link
                              to="/admit-card"
                              className="group flex min-h-24 flex-col items-start justify-center rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FEF3C7] text-[#92400E] transition group-hover:bg-[#FDE68A]">
                                <IdCard size={17} />
                              </div>
                              <span className="mt-2 text-xs font-semibold leading-relaxed text-[#0F172A]">Admit Cards</span>
                            </Link>

                            <Link
                              to="/mock-test"
                              className="group flex min-h-24 flex-col items-start justify-center rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FFF7ED] text-[#C2410C] transition group-hover:bg-[#FFEDD5]">
                                <Trophy size={17} />
                              </div>
                              <span className="mt-2 text-xs font-semibold leading-relaxed text-[#0F172A]">Mock Tests</span>
                            </Link>

                            <Link
                              to="/rtps-bihar"
                              className="group flex min-h-24 flex-col items-start justify-center rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#ECFDF5] text-[#15803D] transition group-hover:bg-[#D1FAE5]">
                                <ShieldCheck size={17} />
                              </div>
                              <span className="mt-2 text-xs font-semibold leading-relaxed text-[#0F172A]">RTPS Services</span>
                            </Link>

                            <Link
                              to="/results"
                              onClick={() => { setActiveTab("results"); setSearchQuery(""); }}
                              className="group flex min-h-24 flex-col items-start justify-center rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EDE9FE] text-[#6D28D9] transition group-hover:bg-[#DDD6FE]">
                                <Award size={17} />
                              </div>
                              <span className="mt-2 text-xs font-semibold leading-relaxed text-[#0F172A]">Exam Results</span>
                            </Link>

                            <Link
                              to="/useful-tools"
                              className="group flex min-h-24 flex-col items-start justify-center rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F1F5F9] text-[#475569] transition group-hover:bg-[#E2E8F0]">
                                <Wrench size={17} />
                              </div>
                              <span className="mt-2 text-xs font-semibold leading-relaxed text-[#0F172A]">Useful Tools</span>
                            </Link>
                          </div>
                        </div>

                        {/* Hero Right Banner Card */}
                        <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-end relative h-full pb-4">
                          <div className="mb-2 w-full pr-2 text-center lg:text-right">
                            <span className="block text-xl font-bold leading-relaxed text-[#0B2545] sm:text-2xl">
                              बढ़ता बिहार, <span className="text-[#E65100]">बनता भविष्य</span>
                            </span>
                          </div>

                          <div className="relative flex min-h-55 w-full max-w-md flex-col justify-between overflow-hidden rounded-lg border border-[#0B2545] bg-[#0B2545] p-5 text-white shadow-sm">
                            <div>
                              <span className="inline-block rounded border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                                Independent information portal
                              </span>
                              <h2 className="text-lg font-black text-white mt-3">
                                सभी सरकारी भर्तियों और सेवाओं की सीधी जानकारी
                              </h2>
                              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-200">
                                BPSC, BSSC, CSBC और सार्वजनिक सेवाओं से जुड़ी जानकारी व आधिकारिक स्रोतों के लिंक एक जगह देखें।
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4 text-xs font-semibold text-slate-200">
                              <span>Official source links</span>
                              <Link to="/sitemap" className="text-white hover:underline flex items-center gap-1">
                                सभी लिंक्स देखें <ArrowRight size={13} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Direct Fast Hubs Navigation Strip */}
                      <div className="w-full border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 sm:px-6">
                        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto text-xs font-semibold text-[#475569]">
                          <span className="mr-1 flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0B2545]">
                            <Sparkles size={13} /> Fast Hubs:
                          </span>
                          <Link 
                            to="/mock-test" 
                            className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#0B2545] px-3 py-1 font-semibold text-white transition hover:bg-[#091E3A]"
                          >
                            <Trophy size={13} className="text-yellow-200" />
                            🎯 All Exam Live Mock Test & Rank
                          </Link>
                          <Link 
                            to="/bseb-matric-10th" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            BSEB 10th Result
                          </Link>
                          <Link 
                            to="/bseb-inter-12th" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            BSEB 12th Inter
                          </Link>
                          <Link 
                            to="/cuet-ug-admission" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            CUET UG 2026
                          </Link>
                          <Link 
                            to="/rtps-bihar" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            RTPS जाति/आय/निवास
                          </Link>
                          <Link 
                            to="/udyami-yojana" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            उद्यमी योजना ₹10L
                          </Link>
                          <Link 
                            to="/kyp-bihar" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            कुशल युवा (KYP)
                          </Link>
                          <Link 
                            to="/student-credit-card" 
                            className="min-h-9 shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
                          >
                            स्टूडेंट क्रेडिट कार्ड ₹4L
                          </Link>
                        </div>
                      </div>

                      {/* Benefits & Trust Strip */}
                      <div className="w-full border-y border-[#E2E8F0] bg-white px-4 py-3 text-[#475569] sm:px-6">
                        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-[#475569] sm:gap-8">
                            <span className="flex items-center gap-2">
                              <ShieldCheck size={16} className="text-[#15803D]" />
                              <span>Official source links <span className="block text-[9.5px] font-medium text-[#64748B]">Check the issuing department</span></span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Zap size={16} className="text-[#E65100]" />
                              <span>Quick access <span className="block text-[9.5px] font-medium text-[#64748B]">Jobs, services and tools</span></span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Sparkles size={16} className="text-[#0B2545]" />
                              <span>Independent portal <span className="block text-[9.5px] font-medium text-[#64748B]">Public information, clearly labeled</span></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-[#E2E8F0] bg-white px-4 py-2 text-xs font-medium text-[#475569]">
                      <span className="font-bold text-slate-700 text-[11px]">Trending:</span>
                      {["Live Mock Test", "BPSC", "BPSSC", "CSBC पुलिस", "BCECEB", "BTSC", "BSSC Inter"].map((tag) => (
                        tag === "Live Mock Test" ? (
                          <Link
                            key={tag}
                            to="/mock-test"
                            className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-800 text-[11px] font-bold border border-slate-300 transition cursor-pointer shadow-xs"
                          >
                            #{tag}
                          </Link>
                        ) : (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSearchQuery(tag)}
                            className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-800 text-[11px] font-bold border border-slate-300 transition cursor-pointer shadow-xs"
                          >
                            #{tag}
                          </button>
                        )
                      ))}
                    </div>
                  </section>

                  <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20">
                    {/* Quiz Callout Banner */}
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
                            बिहार ऑल एग्जाम लाइव मॉक टेस्ट & राज्य लीडरबोर्ड
                          </h2>
                          <p className="text-xs text-blue-100 font-medium">
                            अपनी तैयारी परखें, जिलावार रैंक देखें और दोस्तों के साथ व्हाट्सएप पर स्कोरकार्ड शेयर करें।
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/mock-test"
                        className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 group active:scale-95"
                      >
                        <span>अभी फ्री टेस्ट दें</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                      </Link>
                    </div>

                    {topAlertItem && (
                      <div className="mb-6 flex flex-col items-stretch justify-between gap-3 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-3.5 text-[#7C2D12] sm:flex-row sm:items-center sm:p-4">
                        <div className="flex min-w-0 items-center gap-3 text-xs font-medium leading-relaxed sm:text-sm">
                          <span className="flex shrink-0 items-center justify-center rounded-md bg-[#FFEDD5] p-2">
                            <Flame size={18} className="text-[#C2410C]" />
                          </span>
                          <span className="min-w-0 break-words">
                            Notice: {topAlertItem.department && <strong className="font-black">{topAlertItem.department} - </strong>}
                            {topAlertItem.title}
                          </span>
                        </div>
                        <Link 
                          to={`/post/${generateSlug(topAlertItem)}`}
                          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#FDBA74] bg-white px-4 text-xs font-semibold text-[#9A3412] transition hover:bg-[#FFEDD5]"
                        >
                          View Notice <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                      <div className="lg:col-span-8 space-y-6">
                        <div id="cyber-tools-section" className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
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
                            const tabPath = tab.id === "all" ? "/" : tab.id === "jobs" ? "/jobs" : tab.id === "results" ? "/results" : tab.id === "admit_card" ? "/admit-card" : "/sitemap";
                            return (
                              <Link
                                key={tab.id}
                                to={tabPath}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-xs font-black px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
                                  isActive
                                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-sm"
                                    : "bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                                }`}
                              >
                                <Icon size={15} className={isActive ? "text-[#FDBA74]" : "text-[#64748B]"} />
                                {tab.label}
                              </Link>
                            );
                          })}
                        </div>

                        <div id="active-circulars-section" className="space-y-4 scroll-mt-36">
                          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-black text-[#334155]">
                            <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#0B2545]">
                              <TrendingUp size={18} className="text-[#E65100]" />
                              Notices &amp; Updates
                            </h2>
                            <span className="flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 font-semibold text-[#475569]">
                              {loading && <Loader2 size={13} className="animate-spin text-[#0B2545]" />}
                              {filteredData.length} Notices
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
                            <div className="rounded-lg border border-[#E2E8F0] bg-white p-10 text-center text-sm font-medium text-[#475569] shadow-sm">
                              No notifications matched your search query. Try another keyword.
                            </div>
                          )}
                        </div>
                      </div>

                      <aside className="lg:col-span-4 space-y-6">
                        <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="text-blue-700" size={18} />
                              <h2 className="font-extrabold text-sm text-slate-900">Bihar Direct Hubs</h2>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Fast Access</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <Link to="/mock-test" className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 flex items-center justify-between transition group">
                              <div>
                                <p className="font-black text-amber-950 group-hover:text-amber-800 flex items-center gap-1">
                                  <Trophy size={13} className="text-amber-600" /> ऑल एग्जाम लाइव मॉक टेस्ट
                                </p>
                                <span className="text-[10px] text-amber-700 font-semibold">अंक, सटीकता और राज्य रैंक</span>
                              </div>
                              <ArrowRight size={13} className="text-amber-700 transition group-hover:translate-x-0.5" />
                            </Link>
                            <Link to="/bseb-matric-10th" className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/40 flex items-center justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-700">बिहार बोर्ड 10वीं रिजल्ट 2026</p>
                                <span className="text-[10px] text-slate-500">Board result information</span>
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
            <Route path="/category/:slug" element={<CategoryPage notices={portalItems} loading={loading} />} />
            <Route path="/useful-tools" element={<UsefulToolsPage />} />
            
            {/* Policy & Compliance Dual Routing */}
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            
            {/* Admin Gate Dual Routing */}
            <Route path="/admin" element={<><Admin /><AdminBannerControl /></>} />
            <Route path="/admin-portal" element={<><Admin /><AdminBannerControl /></>} />
            
            {/* Dedicated High-Speed Hubs */}
            <Route path="/bihar-district-wise-recruitment" element={<DistrictRecruitment />} />
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
            <Route path="/mock-test" element={<MockTestPage />} />
            
            <Route path="/upcoming-2026" element={<Upcoming2026 />} />
            <Route path="/download" element={<DownloadApp />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}