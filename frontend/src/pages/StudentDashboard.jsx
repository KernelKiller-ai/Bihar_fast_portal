import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { getStudentAttempts, getStudentDistrict, saveStudentDistrict } from "../utils/studentHistory";

const DISTRICTS = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
  "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
  "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
  "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnea",
  "Rohtas (Sasaram)", "Saharsa", "Samastipur", "Saran (Chhapra)", "Sheikhpura", "Sheohar",
  "Sitamarhi", "Siwan", "Supaul", "Vaishali (Hajipur)", "West Champaran (Bettiah)",
];

const SUBJECTS = [
  { label: "गणित", match: /math|गणित|110|121/i, color: "bg-sky-600" },
  { label: "विज्ञान", match: /science|विज्ञान|112|physics|chemistry|biology/i, color: "bg-emerald-600" },
  { label: "सामाजिक विज्ञान", match: /social|सामाजिक|111|history|geography|polity/i, color: "bg-amber-500" },
  { label: "हिंदी", match: /hindi|हिंदी|101|106/i, color: "bg-rose-500" },
];

function getDisplayName(user) {
  return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "छात्र";
}

function formatPracticeTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours ? `${hours} घं. ${minutes} मि.` : `${minutes} मिनट`;
}

function getAttemptSubject(attempt) {
  const source = `${attempt.subject || ""} ${attempt.title || ""}`;
  if (/social|सामाजिक|111|history|geography|polity/i.test(source)) return "सामाजिक विज्ञान";
  return SUBJECTS.find((subject) => subject.match.test(source))?.label || "अन्य";
}

function DashboardStat({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className="min-w-0 border-l-4 border-slate-200 bg-white p-4 shadow-sm" style={{ borderLeftColor: tone }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-black text-slate-950">{value}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">{detail}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon size={18} />
        </span>
      </div>
    </article>
  );
}

export default function StudentDashboard() {
  const { user, loading, openLoginModal } = useAuth();
  const [districtOverride, setDistrictOverride] = useState(null);
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);

  if (loading) {
    return <div className="grid min-h-[55vh] place-items-center text-sm font-bold text-slate-600">प्रोफ़ाइल लोड हो रही है...</div>;
  }

  if (!user) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:py-20">
        <section className="mx-auto max-w-3xl border-y-4 border-sky-800 bg-white px-6 py-10 text-center shadow-sm sm:px-12">
          <GraduationCap size={38} className="mx-auto text-sky-800" />
          <p className="mt-4 text-xs font-black uppercase tracking-wider text-sky-700">Student Portal</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">आपकी तैयारी, आपकी प्रगति</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            टेस्ट इतिहास और विषयवार प्रदर्शन देखने के लिए Google से लॉगिन करें। बिना लॉगिन पाँच प्रश्नों का डेमो टेस्ट आज़माएँ।
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={openLoginModal} className="rounded-xl bg-sky-800 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-900">
              Student Login
            </button>
            <Link to="/class-10-quiz" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50">
              5 प्रश्नों का फ्री डेमो <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const displayName = getDisplayName(user);
  const email = user.email || "ईमेल उपलब्ध नहीं";
  const attempts = getStudentAttempts(user.id);
  const district = districtOverride ?? getStudentDistrict(user.id);
  const averageAccuracy = attempts.length
    ? attempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_percentage || 0), 0) / attempts.length
    : 0;
  const bestAttempt = attempts.reduce((best, attempt) => {
    const scoreRate = Number(attempt.total_questions) ? Number(attempt.score) / Number(attempt.total_questions) : 0;
    const bestRate = best && Number(best.total_questions) ? Number(best.score) / Number(best.total_questions) : -1;
    return scoreRate > bestRate ? attempt : best;
  }, null);
  const practiceSeconds = attempts.reduce((sum, attempt) => sum + Number(attempt.practice_seconds || 0), 0);
  const categoryStats = SUBJECTS.map((subject) => {
    const selectedAttempts = attempts.filter((attempt) => getAttemptSubject(attempt) === subject.label);
    const accuracy = selectedAttempts.length
      ? selectedAttempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_percentage || 0), 0) / selectedAttempts.length
      : 0;
    return { ...subject, count: selectedAttempts.length, accuracy };
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-9">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-sky-800">Student Portal / BiharFast</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">नमस्ते, {displayName}</h1>
            <p className="mt-1 text-sm text-slate-600">आपकी मॉक टेस्ट तैयारी का व्यक्तिगत डैशबोर्ड</p>
          </div>
          <Link to="/mock-test?exam=class_10" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-amber-300">
            <BookOpenCheck size={17} /> नया फुल-लेंथ मॉक टेस्ट <ArrowRight size={16} />
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-4 border-b border-slate-200 pb-6 md:grid-cols-[1.2fr_2fr]">
          <article className="flex items-center gap-4 bg-[#0e3b64] p-5 text-white shadow-sm">
            {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
              <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="" className="h-16 w-16 rounded-full border-2 border-white/70 object-cover" />
            ) : (
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-amber-400 text-xl font-black text-slate-950">
                {displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black">{displayName}</h2>
              <p className="truncate text-xs text-sky-100">{email}</p>
              <label className="mt-3 flex items-center gap-2 text-xs font-bold text-sky-100">
                <MapPin size={14} />
                <select
                  value={district}
                  onChange={(event) => {
                    setDistrictOverride(event.target.value);
                    saveStudentDistrict(user.id, event.target.value);
                  }}
                  className="max-w-52 rounded-md border border-white/30 bg-white px-2 py-1 text-xs font-bold text-slate-900"
                >
                  {DISTRICTS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </article>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <DashboardStat label="कुल टेस्ट" value={attempts.length} detail="सहेजे गए प्रयास" icon={Activity} tone="#0284c7" />
            <DashboardStat label="औसत सटीकता" value={`${averageAccuracy.toFixed(1)}%`} detail="सभी टेस्ट का औसत" icon={Target} tone="#059669" />
            <DashboardStat label="सर्वश्रेष्ठ स्कोर" value={bestAttempt ? `${bestAttempt.score}/${bestAttempt.total_questions}` : "--"} detail={bestAttempt?.title || "अभी कोई प्रयास नहीं"} icon={Trophy} tone="#d97706" />
            <DashboardStat label="अभ्यास समय" value={formatPracticeTime(practiceSeconds)} detail="टेस्ट में बिताया समय" icon={Clock3} tone="#e11d48" />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="border-b border-slate-200 pb-6 lg:border-b-0 lg:border-r lg:pr-6">
            <div className="mb-4 flex items-center gap-2">
              <ChartNoAxesColumnIncreasing size={19} className="text-sky-800" />
              <h2 className="text-lg font-black text-slate-950">विषयवार प्रदर्शन</h2>
            </div>
            <div className="space-y-4">
              {categoryStats.map((subject) => (
                <div key={subject.label}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-slate-800">{subject.label}</span>
                    <span className="font-semibold text-slate-500">{subject.count} टेस्ट · {subject.accuracy.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full ${subject.color} transition-[width]`} style={{ width: `${Math.min(subject.accuracy, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">विषयवार आँकड़े आपके पूरे किए गए टेस्ट के आधार पर हैं।</p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-sky-800" />
                <h2 className="text-lg font-black text-slate-950">हाल के टेस्ट</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">{attempts.length} प्रयास</span>
            </div>

            {attempts.length === 0 ? (
              <div className="border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                <Trophy size={28} className="mx-auto text-amber-500" />
                <p className="mt-3 text-sm font-extrabold text-slate-800">आपका पहला टेस्ट यहाँ दिखाई देगा</p>
                <p className="mt-1 text-xs text-slate-500">फुल-लेंथ टेस्ट देकर अपनी तैयारी का आकलन करें।</p>
                <Link to="/mock-test?exam=class_10" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-sky-800 hover:text-sky-950">
                  टेस्ट चुनें <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
                {attempts.map((attempt) => {
                  const attemptId = attempt.id || `${attempt.quiz_id}-${attempt.attempted_at}`;
                  const expanded = expandedAttemptId === attemptId;
                  return (
                    <article key={attemptId} className="p-4 sm:p-5">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <h3 className="font-extrabold leading-snug text-slate-900">{attempt.title}</h3>
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                            <CalendarDays size={13} />
                            {new Date(attempt.attempted_at).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 sm:shrink-0">
                          <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-black text-emerald-900">
                            {attempt.score}/{attempt.total_questions}
                          </span>
                          <span className="text-sm font-extrabold text-slate-700">{Number(attempt.accuracy_percentage || 0).toFixed(1)}%</span>
                          <button
                            type="button"
                            onClick={() => setExpandedAttemptId(expanded ? null : attemptId)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-extrabold text-sky-800 transition hover:bg-sky-50"
                          >
                            {expanded ? "बंद करें" : "Review Solutions"}
                          </button>
                        </div>
                      </div>
                      {expanded && (
                        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                          {(attempt.results || []).map((result, index) => (
                            <div key={result.id || index} className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs font-bold text-slate-900">{index + 1}. {result.question_text}</p>
                              <p className={`mt-2 flex items-center gap-1.5 text-[11px] font-bold ${result.is_correct ? "text-emerald-700" : "text-rose-700"}`}>
                                {result.is_correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                आपका उत्तर: {result.user_choice || "छोड़ा"} · सही उत्तर: {result.correct_option}
                              </p>
                              {result.explanation && <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{result.explanation}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-4 border-y border-sky-900/20 bg-[#0e3b64] p-5 text-white sm:flex-row sm:items-center sm:px-7">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-300">अगला अभ्यास</p>
            <h2 className="mt-1 text-xl font-black">Start New Full-Length Mock Test</h2>
            <p className="mt-1 text-xs text-sky-100">पूरा पेपर हल करें और अपना स्कोर इतिहास में सहेजें।</p>
          </div>
          <Link to="/mock-test?exam=class_10" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300">
            मॉक टेस्ट शुरू करें <ArrowRight size={16} />
          </Link>
        </section>

        <p className="text-center text-[11px] text-slate-500">
          टेस्ट इतिहास इस डिवाइस और ब्राउज़र में आपके छात्र खाते के लिए स्थानीय रूप से सहेजा जाता है।
        </p>
      </div>
    </main>
  );
}