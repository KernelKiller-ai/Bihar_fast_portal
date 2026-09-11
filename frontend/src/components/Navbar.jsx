import { Link } from "react-router-dom";
import { Bell, ShieldCheck, Users } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 select-none shadow-lg">
      {/* 1. Indian Tricolor Micro Top Border */}
      <div className="w-full h-1 bg-linear-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Rich Deep Sapphire Glass Container */}
      <div className="w-full bg-linear-to-r from-[#0a2540] via-[#0e3b64] to-[#0a2540] border-b border-cyan-500/20 shadow-inner relative overflow-hidden">
        
        {/* Subtle Ambient Light Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-20 bg-sky-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1550px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10">
          
          {/* Logo Brand Plate */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="bg-white p-1 rounded-xl shadow-md border border-sky-200/50 flex items-center justify-center transition group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="BiharFast Logo" 
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans drop-shadow-xs">
                  BIHAR<span className="text-[#FF9933]">FAST</span>
                </span>
                <span className="text-[9.5px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-mono shadow-xs">
                  OFFICIAL
                </span>
              </div>
              <span className="text-[10.5px] text-sky-200 font-semibold tracking-wide -mt-0.5">
                Govt Jobs & Public Services • Bihar
              </span>
            </div>
          </Link>

          {/* Center: Vibrant Cyan & Emerald Status Pill */}
          <div className="hidden lg:flex items-center gap-2.5 bg-black/25 border border-sky-400/30 backdrop-blur-md rounded-full px-4 py-1.5 text-xs text-sky-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-extrabold text-white text-[11px] tracking-wide">Live Feed:</span>
            <span className="text-sky-200 font-medium text-[11px]">NIC Verified 2026</span>
            <span className="text-sky-400/50">•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-bold text-[11px]">
              <ShieldCheck size={13} className="text-emerald-400" /> 100% Direct Links
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Counter Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-xs">
              <Users size={14} className="text-emerald-300" />
              <span className="font-mono text-emerald-300 font-black text-xs">1,299</span>
              <span className="text-[10.5px] text-sky-200 font-normal">Active</span>
            </div>

            {/* Premium Gold-Orange Button */}
            <a
              href="https://t.me/biharfast_official"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-linear-to-r from-[#FF9933] to-[#F97316] hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-md hover:shadow-orange-500/30 cursor-pointer group active:scale-95"
            >
              <Bell size={15} className="fill-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Get Alerts</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}