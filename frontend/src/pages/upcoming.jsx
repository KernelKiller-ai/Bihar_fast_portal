import { Link } from "react-router-dom";
import { 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  Flame, 
  AlertCircle, 
  ArrowLeft 
} from "lucide-react";

const UPCOMING_2026_DATA = [
  {
    id: "up-1",
    department: "BPSC",
    title: "71st Combined Competitive Examination (CCE 2026)",
    posts: "SDM, DSP, Revenue Officer & Block Officers",
    expectedVacancies: "1,000+ Posts",
    eligibility: "Bachelor's Degree in any discipline",
    status: "Notification Expected Soon",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    expectedMonth: "Oct – Nov 2026"
  },
  {
    id: "up-2",
    department: "BPSSC",
    title: "Bihar Police Sub-Inspector (Daroga) Bharti 2026",
    posts: "Police Sub-Inspector / SI",
    expectedVacancies: "2,000+ Posts",
    eligibility: "Graduation + Physical Standard Requirements",
    status: "Roster Clearance Pending",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    expectedMonth: "Late 2026"
  },
  {
    id: "up-3",
    department: "CSBC",
    title: "Bihar Police Constable New Phase Recruitment",
    posts: "Constable (General Duty & Armed Police)",
    expectedVacancies: "19,000+ Posts",
    eligibility: "12th (Intermediate) Passed",
    status: "Dept Sanction Phase",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    expectedMonth: "2026 Session"
  },
  {
    id: "up-4",
    department: "BSSC",
    title: "4th Graduate Level Combined Exam (BSSC CGL-4)",
    posts: "Secretariat Assistant, Planning Assistant & Inspectors",
    expectedVacancies: "2,500+ Posts",
    eligibility: "Graduation Degree",
    status: "Requisition Expected",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    expectedMonth: "Late 2026"
  },
  {
    id: "up-5",
    department: "BTSC",
    title: "Bihar Junior Engineer (JE Civil/Mech/Elec) Recruitment",
    posts: "Junior Engineer (JE)",
    expectedVacancies: "8,000+ Posts",
    eligibility: "Diploma in Respective Engineering Branch",
    status: "Roster Review",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    expectedMonth: "2026 Calendar"
  },
  {
    id: "up-6",
    department: "BSEB / TRE",
    title: "Bihar Teacher Recruitment (TRE Phase 4.0)",
    posts: "Primary, Middle & Higher Secondary Teachers",
    expectedVacancies: "80,000+ Posts (Projected)",
    eligibility: "B.Ed / D.El.Ed + CTET / STET",
    status: "Dept Verification",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    expectedMonth: "2026-27"
  }
];

export default function Upcoming2026() {
  return (
    <div className="min-h-screen bg-[#041226] text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition mb-4 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Live Portal
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-500/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
                <Sparkles size={13} /> Exclusive 2026 Forecast
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Bihar Upcoming Govt Jobs & Exam Calendar 2026
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Projected notifications, expected vacancies, and eligibility criteria for Bihar boards.
              </p>
            </div>

            <div className="bg-blue-950/70 border border-blue-400/20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0">
              <Flame size={22} className="text-rose-400 fill-rose-400 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Projected Vacancies</span>
                <span className="text-base font-black text-amber-300">1,12,000+ Posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Forecast Notice:</strong> These projections are compiled from department roster clearances, court directives, and annual exam calendars. Official application links will be updated automatically on the live dashboard upon release.
          </p>
        </div>

        {/* Grid of Vacancies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UPCOMING_2026_DATA.map((job) => (
            <div 
              key={job.id} 
              className="bg-[#071b38]/70 hover:bg-[#071b38] border border-blue-500/20 hover:border-blue-400/40 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-blue-600/30 text-blue-300 border border-blue-400/30 font-black text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase">
                    <Building2 size={12} />
                    {job.department}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${job.badgeColor}`}>
                    {job.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {job.posts}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-blue-500/15">
                <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Briefcase size={11} className="text-amber-400" /> Expected Posts
                  </span>
                  <span className="font-extrabold text-amber-300 mt-0.5 block truncate">
                    {job.expectedVacancies}
                  </span>
                </div>

                <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Clock size={11} className="text-blue-400" /> Expected Time
                  </span>
                  <span className="font-extrabold text-blue-300 mt-0.5 block truncate">
                    {job.expectedMonth}
                  </span>
                </div>

                <div className="col-span-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-0.5">
                    <GraduationCap size={12} className="text-emerald-400" /> Expected Eligibility
                  </span>
                  <span className="font-semibold text-slate-200 text-xs block">
                    {job.eligibility}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}