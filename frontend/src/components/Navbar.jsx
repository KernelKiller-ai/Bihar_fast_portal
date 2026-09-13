import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 select-none shadow-md">
      {/* 1. Indian Tricolor Micro Top Border */}
      <div className="w-full h-1 bg-linear-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Rich Deep Sapphire Glass Container */}
      <div className="w-full bg-linear-to-r from-[#0a2540] via-[#0e3b64] to-[#0a2540] border-b border-cyan-500/20 shadow-inner relative overflow-hidden">
        
        {/* Subtle Ambient Light Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-20 bg-sky-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1550px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10">
          
          {/* Logo Brand Plate */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
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

          {/* Center: Live Feed Pill */}
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
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Hubs Badge */}
            <Link
              to="/upcoming-2026"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-sky-100 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>सभी पोर्टल्स (2026)</span>
            </Link>

            {/* Official WhatsApp Channel Join Button */}
            <a
              href="https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl transition shadow-md hover:shadow-emerald-500/30 cursor-pointer group active:scale-95"
            >
              <svg 
                className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform shrink-0" 
                viewBox="0 0 24 24"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.067-1.11-.067-.291-.093-.667-.234-1.144-.442-1.999-.871-3.308-2.909-3.41-3.045-.098-.135-.809-1.077-.809-2.054 0-.977.511-1.456.693-1.656.182-.2.398-.25.531-.25.132 0 .265.002.38.008.123.006.287-.047.45.344.167.398.571 1.393.622 1.497.051.103.085.224.017.359-.068.135-.102.22-.204.34-.102.119-.215.266-.307.358-.103.103-.21.215-.091.42.119.205.53.874 1.137 1.414.781.696 1.44.912 1.645 1.015.205.103.324.086.444-.051.12-.137.513-.598.65-.804.137-.206.273-.172.461-.103.188.069 1.196.564 1.401.667.205.103.342.155.393.24.051.086.051.499-.093.904z" />
              </svg>
              <span>व्हाट्सएप चैनल</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}