import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, loading, openLoginModal, signOut } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "छात्र";
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  // Bahar click karne par menu band karne ke liye
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full select-none border-b border-[#E2E8F0] bg-white">
      <div className="bg-[#091E3A] px-4 py-1.5 text-center text-[10px] leading-relaxed text-slate-100 sm:text-xs">
        BiharFast is an independent public-interest information portal — not affiliated with any government agency.
      </div>
      {/* 1. Indian Tricolor Micro Top Border */}
      <div className="h-0.5 w-full bg-linear-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="relative w-full overflow-visible border-b border-[#E2E8F0] bg-white">
        
        <div className="pointer-events-none absolute left-1/4 top-0 hidden h-20 w-96 bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-6">
          
          <Link to="/" className="group flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-1 transition group-hover:border-[#CBD5E1] sm:h-11 sm:w-11">
              <picture>
                <source srcSet="/logo-192.webp" type="image/webp" />
                <img
                  src="/logo-192.png"
                  alt="BiharFast"
                  width="192"
                  height="192"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-square h-8 w-8 object-contain sm:h-9 sm:w-9"
                />
              </picture>
            </div>
            
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-lg font-black tracking-tight text-[#0B2545] sm:text-xl">
                  BIHAR<span className="text-[#E65100]">FAST</span>
                </span>
                <span className="hidden rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#475569] sm:inline">
                  INDEPENDENT
                </span>
              </div>
              <span className="hidden text-[10px] font-medium tracking-wide text-[#64748B] sm:block">
                Bihar information portal • links to official sources
              </span>
            </div>
          </Link>

          {/* Center: Live Feed Pill */}
          <div className="hidden items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1.5 text-xs text-[#475569] lg:flex">
            <span className="font-semibold text-[#0B2545]">Bihar jobs &amp; public services</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium">Independent information portal</span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {!loading && !user && (
              <button
                type="button"
                onClick={openLoginModal}
                aria-label="Student login"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-[#0B2545] bg-[#0B2545] p-2 text-xs font-semibold text-white transition hover:bg-[#091E3A] sm:px-3.5 sm:py-2"
              >
                <UserRound size={15} />
                <span className="hidden sm:inline">Student Login</span>
              </button>
            )}

            {!loading && user && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  className="inline-flex min-h-10 max-w-48 items-center gap-2 rounded-md border border-[#E2E8F0] bg-white p-1.5 pr-2.5 text-left text-[#0F172A] transition hover:bg-[#F8FAFC] sm:px-2.5"
                >
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata.avatar_url || user.user_metadata.picture}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full border border-white/40 object-cover shrink-0"
                    />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-xs font-black text-[#0B2545]">
                      {initials || <UserRound size={15} />}
                    </span>
                  )}
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-28 truncate text-xs font-extrabold">{displayName}</span>
                    <span className="block text-[10px] text-[#64748B]">Student</span>
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`hidden sm:block transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} 
                  />
                </button>

                {profileMenuOpen && (
                  <div 
                    role="menu" 
                    className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800"
                    >
                      ⚡ मेरी तैयारी (My Prep & Rank)
                    </Link>
                    <Link
                      to="/mock-test"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800"
                    >
                      🏆 स्टेट लाइव मॉक टेस्ट
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        await signOut();
                      }}
                      className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-xs font-bold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut size={14} /> लॉगआउट (Logout)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Hubs Badge */}
            <Link
              to="/upcoming-2026"
              className="hidden min-h-10 items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#475569] transition hover:bg-[#F8FAFC] active:scale-95 sm:inline-flex"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>सभी पोर्टल्स (2026)</span>
            </Link>

            {/* Direct Android APK download */}
            <a
              href="/biharfast.apk"
              download="BiharFast.apk"
              className="hidden min-h-10 items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0B2545] transition hover:bg-[#EFF4FF] active:scale-95 md:inline-flex"
            >
              <span aria-hidden="true">📲</span>
              <span>Download App (3 MB)</span>
            </a>

            {/* Official WhatsApp Channel Join Button */}
            <a
              href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join official WhatsApp channel"
              className="flex min-h-10 items-center gap-1.5 rounded-md bg-[#15803D] px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-[#166534] active:scale-95 sm:px-3"
            >
              <svg 
                className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform shrink-0" 
                viewBox="0 0 24 24"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.067-1.11-.067-.291-.093-.667-.234-1.144-.442-1.999-.871-3.308-2.909-3.41-3.045-.098-.135-.809-1.077-.809-2.054 0-.977.511-1.456.693-1.656.182-.2.398-.25.531-.25.132 0 .265.002.38.008.123.006.287-.047.45.344.167.398.571 1.393.622 1.497.051.103.085.224.017.359-.068.135-.102.22-.204.34-.102.119-.215.266-.307.358-.103.103-.21.215-.091.42.119.205.53.874 1.137 1.414.781.696 1.44.912 1.645 1.015.205.103.324.086.444-.051.12-.137.513-.598.65-.804.137-.206.273-.172.461-.103.188.069 1.196.564 1.401.667.205.103.342.155.393.24.051.086.051.499-.093.904z" />
              </svg>
              <span className="hidden sm:inline">व्हाट्सएप चैनल</span>
            </a>
          </div>

        </div>
      </div>
      <div className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-3 sm:px-6">
          <div className="flex min-w-max items-center gap-1 py-1.5 text-xs font-semibold">
            <Link to="/jobs" className="min-h-9 rounded-md bg-[#0B2545] px-3 py-2 text-white">Latest Jobs</Link>
            <Link to="/admit-card" className="min-h-9 rounded-md px-3 py-2 text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0B2545]">Admit Cards</Link>
            <Link to="/results" className="min-h-9 rounded-md px-3 py-2 text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0B2545]">Results</Link>
            <Link to="/all-updates" className="min-h-9 rounded-md px-3 py-2 text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0B2545]">All Updates</Link>
            <Link to="/rtps-bihar" className="min-h-9 rounded-md px-3 py-2 text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0B2545]">RTPS Services</Link>
            <Link to="/useful-tools" className="min-h-9 rounded-md px-3 py-2 text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0B2545]">Useful Tools</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}