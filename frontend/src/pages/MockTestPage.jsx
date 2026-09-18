import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Trophy, Clock, HelpCircle, AlertCircle, 
  ShieldCheck, CheckCircle2, ChevronRight, Sparkles, 
  BookOpen, Flame, Compass
} from "lucide-react";
import Class10QuizPlayer from "../components/Class10QuizPlayer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

// 10th ke baad ke sabhi exams ki list
const EXAM_CATEGORIES = [
  {
    id: "class_10",
    title: "BSEB 10th मैट्रिक बोर्ड 2026",
    tag: "10th Board",
    badge: "Live Active",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    desc: "Science, Math, SST, Hindi & Sanskrit ke daily sets.",
    icon: Trophy,
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "bseb_12_science",
    title: "BSEB 12th इंटर (Science)",
    tag: "12th Board",
    badge: "Questions Soon",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
    desc: "Physics, Chemistry, Biology aur Mathematics MCQs.",
    icon: BookOpen,
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "bseb_12_arts",
    title: "BSEB 12th इंटर (Arts & Commerce)",
    tag: "12th Board",
    badge: "Questions Soon",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
    desc: "History, Geography, Polity aur Economics sets.",
    icon: BookOpen,
    color: "from-purple-600 to-pink-600"
  },
  {
    id: "bihar_police_constable",
    title: "CSBC बिहार पुलिस कांस्टेबल",
    tag: "10th/12th Pass",
    badge: "High Demand",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "सामान्य ज्ञान, विज्ञान, हिंदी और करेंट अफेयर्स प्रैक्टिस।",
    icon: ShieldCheck,
    color: "from-red-600 to-rose-700"
  },
  {
    id: "bssc_inter_level",
    title: "BSSC इंटर स्तरीय संयुक्त परीक्षा",
    tag: "10+2 Clerk",
    badge: "Upcoming",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    desc: "रीजनिंग, गणित, सामान्य अध्ययन और सामान्य विज्ञान।",
    icon: Flame,
    color: "from-teal-600 to-emerald-700"
  },
  {
    id: "ssc_gd_constable",
    title: "SSC GD कांस्टेबल भर्ती",
    tag: "10th Central",
    badge: "All India",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    desc: "General Intelligence, Elementary Math aur General Knowledge.",
    icon: ShieldCheck,
    color: "from-sky-600 to-blue-800"
  },
  {
    id: "rrb_group_d_alp",
    title: "Railway RRB (Group D / ALP / NTPC)",
    tag: "10th/ITI/12th",
    badge: "All India",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "रेलवे भर्ती बोर्ड सामान्य विज्ञान और तार्किक क्षमता।",
    icon: Compass,
    color: "from-orange-600 to-amber-700"
  },
  {
    id: "bihar_daroga_si",
    title: "BPSSC बिहार दारोगा (Sub-Inspector)",
    tag: "Graduate",
    badge: "Officer Level",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    desc: "प्रारंभिक एवं मुख्य परीक्षा विशेष सामान्य अध्ययन पत्र।",
    icon: ShieldCheck,
    color: "from-slate-800 to-slate-950"
  }
];

export default function MockTestPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedExamId = searchParams.get("exam");

  const [examAvailability, setExamAvailability] = useState({});
  const [loadingCheck, setLoadingCheck] = useState(false);

  // Selected Exam Object
  const currentExam = EXAM_CATEGORIES.find(e => e.id === selectedExamId);

  useEffect(() => {
    // Agar koi specific exam selected hai, check karein backend me sawal hain ya nahi
    if (selectedExamId) {
      async function checkExamTest() {
        setLoadingCheck(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/quiz/today?subject=${selectedExamId}`);
          const data = await res.json();
          setExamAvailability(prev => ({
            ...prev,
            [selectedExamId]: data.is_live && data.questions && data.questions.length > 0
          }));
        } catch (e) {
          console.error("Test availability check failed", e);
          setExamAvailability(prev => ({ ...prev, [selectedExamId]: false }));
        } finally {
          setLoadingCheck(false);
        }
      }
      checkExamTest();
    }
  }, [selectedExamId]);

  // Case 1: Exam Hub View (Jab koi exam select na ho)
  if (!selectedExamId) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-amber-500" /> BiharFast Exam Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ऑनलाइन मॉक टेस्ट व लाइव प्रैक्टिस सेंटर
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-2xl">
                BSEB 10वीं/12वीं बोर्ड एवं बिहार व केंद्र सरकार की सभी प्रमुख प्रतियोगी परीक्षाओं के लिए विषयवार टेस्ट। अपनी परीक्षा चुनें और टेस्ट शुरू करें।
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 self-start md:self-auto shrink-0"
            >
              <ArrowLeft size={14} /> मुख्य पोर्टल पर जाएं
            </Link>
          </div>

          {/* Exam Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAM_CATEGORIES.map((exam) => {
              const Icon = exam.icon;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSearchParams({ exam: exam.id })}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-linear-to-tr ${exam.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${exam.badgeColor}`}>
                        {exam.badge}
                      </span>
                    </div>

                    <h2 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                      {exam.title}
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                      योग्यता: {exam.tag}
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium mt-2 line-clamp-2">
                      {exam.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-black text-blue-600 group-hover:text-blue-700">
                    <span>टेस्ट सेक्शन खोलें</span>
                    <ChevronRight size={15} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  // Case 2: Selected Exam Test Player View
  const isAvailable = examAvailability[selectedExamId];

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Top Switch Bar */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> सभी परीक्षाएं देखें (Change Exam)
          </button>
          <span className="text-xs font-black text-slate-900">
            चयनित: <span className="text-blue-700">{currentExam ? currentExam.title : selectedExamId}</span>
          </span>
        </div>

        {/* Loading State */}
        {loadingCheck && (
          <div className="bg-white rounded-2xl p-12 text-center space-y-2 border border-slate-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-600">प्रश्न पत्र लोड हो रहा है...</p>
          </div>
        )}

        {/* Agar Backend me is exam ke questions upload nahi huye hain */}
        {!loadingCheck && isAvailable === false && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Clock size={30} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                {currentExam ? currentExam.title : selectedExamId} का टेस्ट जल्द शुरू होगा!
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                इस परीक्षा के लिए नए NCERT/आधिकारिक प्रश्न एडमिन पैनल द्वारा तैयार किए जा रहे हैं। कृपया कुछ समय बाद देखें या 10वीं बोर्ड का लाइव टेस्ट दें।
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSearchParams({ exam: "class_10" })}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition shadow-sm"
              >
                10th Matric Live Test दें
              </button>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                अन्य परीक्षाएं
              </button>
            </div>
          </div>
        )}

        {/* Agar questions uplabdh hain, toh Player start hoga */}
        {!loadingCheck && isAvailable === true && (
          <Class10QuizPlayer />
        )}

      </div>
    </div>
  );
}