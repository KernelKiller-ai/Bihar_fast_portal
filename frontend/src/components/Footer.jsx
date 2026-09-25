import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  Globe, 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Bell, 
  FileText, 
  Mail, 
  Folder, 
  FolderOpen,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Footer({ onOpenTool }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ message: data.message || "सफलतापूर्वक सब्सक्राइब किया गया!", type: "success" });
        setEmail("");
        setTimeout(() => setStatus({ message: "", type: "" }), 5000);
      } else {
        setStatus({ message: data.detail || "कृपया वैध ईमेल दर्ज करें।", type: "error" });
      }
    } catch {
      setStatus({ message: "सर्वर से संपर्क नहीं हो पाया। बाद में प्रयास करें।", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-[#f8fafc] text-slate-700 pt-8 border-t border-slate-200 select-none relative">
      
      {/* 1. Top Feature Highlights Pill Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B5C9E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">Verified Information</p>
                <p className="text-[10px] text-slate-500 font-medium">From Official Sources</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap size={20} className="fill-white" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">Fast & Lightweight</p>
                <p className="text-[10px] text-slate-500 font-medium">Works on 2G/3G too</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">For Every Aspirant</p>
                <p className="text-[10px] text-slate-500 font-medium">Jobs • Welfare • Growth</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">Bilingual Support</p>
                <p className="text-[10px] text-slate-500 font-medium">English | हिंदी</p>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Heart size={20} className="fill-white" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">A Brighter Bihar</p>
                <p className="text-[10px] text-slate-500 font-medium">Together We Grow</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main 5-Column Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(14,minmax(0,1fr))] gap-8 items-start">
          
          {/* Column 1: Brand Info & Clean Slogan (Span 3) */}
          <div className="lg:col-span-3 flex flex-col items-start">
            
            <div className="flex flex-col items-start w-full">
              <img 
                src="/logo.png" 
                alt="BiharFast Logo" 
                className="h-14 sm:h-16 w-auto object-contain block"
              />
              <p className="text-[11px] font-bold text-slate-700 mt-2">
                Jobs &nbsp;|&nbsp; Welfare &nbsp;|&nbsp; Information
              </p>
              <p className="text-[10px] text-slate-500 tracking-wide font-medium mt-0.5">
                — सही जानकारी, बेहतर बिहार —
              </p>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-normal mt-3 w-full">
              BiharFast is a citizen-first platform to bring all Bihar government job, welfare scheme and useful information in one place. Simple. Fast. Reliable.
            </p>

            <div className="mt-4 mb-3 inline-block">
              <span className="font-extrabold text-base sm:text-lg text-[#0B4F8A] font-serif italic tracking-wide block">
                बढ़ता बिहार, <span className="text-[#F97316]">बनता भविष्य</span>
              </span>
              <svg className="w-full h-2.5 text-[#F97316] mt-0.5" viewBox="0 0 200 9" fill="none" preserveAspectRatio="none">
                <path d="M2.5 6.5C45 2.5 120 1.5 197.5 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-2">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[10px] font-bold hover:scale-110 transition shadow-xs"
              >
                ▶
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="X (Twitter)"
                className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black hover:scale-110 transition shadow-xs"
              >
                𝕏
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-linear-to-tr from-amber-500 via-rose-600 to-purple-600 text-white flex items-center justify-center text-[11px] font-bold hover:scale-110 transition shadow-xs"
              >
                📷
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-black hover:scale-110 transition shadow-xs"
              >
                f
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-xs font-black hover:scale-110 transition shadow-xs"
              >
                in
              </a>
            </div>
          </div>

          {/* Column 2: Explore (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 font-extrabold text-[13px] tracking-tight mb-3 border-b-2 border-slate-900 pb-1 inline-block">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link to="/" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Home size={13} className="text-slate-400" /> Home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Briefcase size={13} className="text-slate-400" /> Government Jobs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Users size={13} className="text-slate-400" /> Welfare Schemes
                </Link>
              </li>
              <li>
                <Link to="/upcoming-2026" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <GraduationCap size={13} className="text-slate-400" /> Scholarships
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <FileText size={13} className="text-slate-400" /> Results
                </Link>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onOpenTool?.("resizer")}
                  className="hover:text-blue-700 flex items-center gap-2 transition text-left cursor-pointer"
                >
                  <Wrench size={13} className="text-slate-400" /> Useful Tools
                </button>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Bell size={13} className="text-slate-400" /> Alerts & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Archives (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 font-extrabold text-[13px] tracking-tight mb-3 border-b-2 border-slate-900 pb-1 inline-block">
              Quick Links &amp; Archives
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link to="/sitemap" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <FolderOpen size={13} className="text-blue-600" /> All Updates &amp; Archive
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Briefcase size={13} className="text-slate-400" /> Government Jobs
                </Link>
              </li>
              <li>
                <Link to="/admit-card" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <FileText size={13} className="text-slate-400" /> Admit Cards
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <FileText size={13} className="text-slate-400" /> Results
                </Link>
              </li>
              <li>
                <Link to="/bseb-matric-10th" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> BSEB Matric Hub
                </Link>
              </li>
              <li>
                <Link to="/bseb-inter-12th" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> BSEB Inter Hub
                </Link>
              </li>
              <li>
                <Link to="/rtps-bihar" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> RTPS Bihar Hub
                </Link>
              </li>
              <li>
                <Link to="/udyami-yojana" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> Udyami Yojana Hub
                </Link>
              </li>
              <li>
                <Link to="/kyp-bihar" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> KYP Bihar Hub
                </Link>
              </li>
              <li>
                <Link to="/student-credit-card" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> Student Credit Card Hub
                </Link>
              </li>
              <li>
                <Link to="/cuet-ug-admission" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400" /> CUET UG Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Categories (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 font-extrabold text-[13px] tracking-tight mb-3 border-b-2 border-slate-900 pb-1 inline-block">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <a href="https://bpsc.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> BPSC Jobs
                </a>
              </li>
              <li>
                <a href="https://csbc.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> Bihar Police
                </a>
              </li>
              <li>
                <a href="https://bssc.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> Teacher Recruitment
                </a>
              </li>
              <li>
                <a href="https://btsc.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> Health Department
                </a>
              </li>
              <li>
                <a href="https://serviceonline.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> Panchayati Raj
                </a>
              </li>
              <li>
                <a href="https://serviceonline.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> Student Schemes
                </a>
              </li>
              <li>
                <a href="https://serviceonline.bihar.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-2 transition">
                  <Folder size={13} className="text-slate-400 shrink-0" /> Social Welfare
                </a>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-700 flex items-center gap-2 font-bold text-slate-800 transition">
                  <FolderOpen size={13} className="text-blue-600 shrink-0" /> All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Support (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 font-extrabold text-[13px] tracking-tight mb-3 border-b-2 border-slate-900 pb-1 inline-block">
              Legal &amp; Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><Link to="/about" className="hover:text-blue-700 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-700 transition">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-700 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-700 transition">Terms &amp; Conditions</Link></li>
              <li><Link to="/disclaimer" className="hover:text-blue-700 transition">Disclaimer</Link></li>
              <li><Link to="/download" className="hover:text-blue-700 transition">Download App</Link></li>
            </ul>
          </div>

          {/* Column 6: Stay Connected (Span 3) */}
          <div className="lg:col-span-3 space-y-3 relative">
            
            <div className="absolute -top-4 -right-2 w-28 h-28 opacity-10 pointer-events-none text-[#0B4F8A] hidden sm:block">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <path d="M15,35 Q25,20 45,25 Q65,15 85,25 Q95,45 85,65 Q75,85 55,80 Q35,85 20,70 Q10,55 15,35 Z" />
              </svg>
            </div>

            <h4 className="text-slate-900 font-extrabold text-[13px] tracking-tight mb-2 border-b-2 border-slate-900 pb-1 inline-block">
              Stay Connected
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Get the latest updates directly to your inbox.
            </p>

            {/* Email Form Connected to Backend */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-blue-700 shadow-2xs disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B4F8A] hover:bg-[#073663] text-white font-extrabold text-xs py-2 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-white" /> Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>

              {/* Instant Feedback Alert */}
              {status.message && (
                <div className={`p-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
                  status.type === "success" 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}>
                  {status.type === "success" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  <span>{status.message}</span>
                </div>
              )}
            </form>

            {/* WhatsApp Community Box */}
            <a
              href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#E8F8F0] border border-[#25D366]/50 hover:border-[#25D366] transition group shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-sm font-black shadow-xs shrink-0">
                  💬
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-950 leading-tight">Join Our WhatsApp Channel</p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Get instant updates</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>

      {/* 3. Bottom Royal Navy Strip: Sovereign Ashok Stambh & Tiranga Tagline */}
      <div className="bg-[#052649] text-white py-4 px-4 sm:px-6 border-t-2 border-amber-400 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 120" className="w-8 h-10 shrink-0 fill-slate-100 drop-shadow-xs">
              <path d="M50,10 C42,10 38,18 38,25 C34,26 31,30 32,35 C32,40 36,43 40,45 C41,53 45,62 50,66 C55,62 59,53 60,45 C64,43 68,40 68,35 C69,30 66,26 62,25 C62,18 58,10 50,10 Z" />
              <path d="M35,28 C26,28 20,35 22,44 C24,50 28,55 35,56 C33,48 34,38 35,28 Z" opacity="0.85" />
              <path d="M65,28 C74,28 80,35 78,44 C76,50 72,55 65,56 C67,48 66,38 65,28 Z" opacity="0.85" />
              <rect x="20" y="66" width="60" height="8" rx="2" />
              <circle cx="50" cy="79" r="4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="15" y="85" width="70" height="5" rx="1.5" />
              <text x="50" y="100" fontSize="7" fill="#CBD5E1" textAnchor="middle" fontWeight="bold">सत्यमेव जयते</text>
            </svg>

            <div className="leading-tight text-center md:text-left">
              <p className="font-extrabold text-sm text-white tracking-wide">
                BiharFast <span className="text-[11px] font-normal text-blue-200 block sm:inline sm:ml-1.5">• A People&apos;s Information Platform</span>
              </p>
              <p className="text-[10.5px] text-amber-300 font-semibold mt-0.5">
                जनता के लिए, बिहार के लिए
              </p>
            </div>
          </div>

          <div className="text-center text-slate-300 text-[11px] leading-relaxed max-w-md">
            <p>© 2026 BiharFast. All rights reserved.</p>
            <p className="text-[10px] text-slate-400">
              Not affiliated with any government department. Information sourced from official portals.
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              BiharFast is an independent educational and job information portal registered under Ministry of MSME, Govt. of India.
            </p>
            <nav className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 font-bold text-blue-200" aria-label="Legal and app links">
              <Link to="/about" className="hover:text-white hover:underline">About</Link>
              <Link to="/contact" className="hover:text-white hover:underline">Contact</Link>
              <Link to="/privacy" className="hover:text-white hover:underline">Privacy</Link>
              <Link to="/terms" className="hover:text-white hover:underline">Terms</Link>
              <Link to="/disclaimer" className="hover:text-white hover:underline">Disclaimer</Link>
              <Link to="/download" className="hover:text-white hover:underline">Download App</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white italic">Informed Citizens</p>
              <p className="text-[10.5px] text-amber-300 font-semibold">Build a Stronger Bihar</p>
            </div>
            <div className="flex flex-col gap-0.5 w-6 h-5 rounded-xs overflow-hidden shadow-xs border border-white/20">
              <div className="h-1/3 bg-[#FF9933] w-full" />
              <div className="h-1/3 bg-white w-full flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-blue-900" />
              </div>
              <div className="h-1/3 bg-[#138808] w-full" />
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}

Footer.propTypes = {
  onOpenTool: PropTypes.func
};