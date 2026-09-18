import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Trophy, Clock, HelpCircle, AlertCircle, 
  ShieldCheck, CheckCircle2, ChevronRight, Sparkles, 
  BookOpen, Flame, Compass, Target, ArrowRight, Layers
} from "lucide-react";
import Class10QuizPlayer from "../components/Class10QuizPlayer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

const EXAM_CATEGORIES = [
  {
    id: "class_10",
    title: "BSEB 10th मैट्रिक बोर्ड 2026",
    tag: "10th Board",
    badge: "Live Active",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    desc: "गणित (110), विज्ञान (112), सामाजिक विज्ञान (111), हिंदी (101) व संस्कृत (105) मॉडल सेट्स।",
    icon: Trophy,
    color: "from-amber-500 to-orange-600",
    subjectPrefix: "bseb_10"
  },
  {
    id: "bseb_12_science",
    title: "BSEB 12th इंटर (Science)",
    tag: "12th Board",
    badge: "Available",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    desc: "Physics (117), Chemistry (118), Biology (119) और Mathematics (121) MCQs।",
    icon: BookOpen,
    color: "from-blue-600 to-indigo-600",
    subjectPrefix: "bseb_12_1"
  },
  {
    id: "bseb_12_arts",
    title: "BSEB 12th इंटर (Arts & Commerce)",
    tag: "12th Board",
    badge: "Available",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    desc: "History (321), Geography (323), Polity (322), Accountancy (220) व भाषा सेट्स।",
    icon: BookOpen,
    color: "from-purple-600 to-pink-600",
    subjectPrefix: "bseb_12_3"
  },
  {
    id: "bihar_police_constable",
    title: "CSBC बिहार पुलिस कांस्टेबल",
    tag: "10th/12th Pass",
    badge: "High Demand",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "सामान्य ज्ञान, विज्ञान, हिंदी और करेंट अफेयर्स प्रैक्टिस।",
    icon: ShieldCheck,
    color: "from-red-600 to-rose-700",
    subjectPrefix: "bihar_police"
  },
  {
    id: "bssc_inter_level",
    title: "BSSC इंटर स्तरीय संयुक्त परीक्षा",
    tag: "10+2 Clerk",
    badge: "Upcoming",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    desc: "रीजनिंग, गणित, सामान्य अध्ययन और सामान्य विज्ञान।",
    icon: Flame,
    color: "from-teal-600 to-emerald-700",
    subjectPrefix: "bssc"
  },
  {
    id: "ssc_gd_constable",
    title: "SSC GD कांस्टेबल भर्ती",
    tag: "10th Central",
    badge: "All India",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    desc: "General Intelligence, Elementary Math aur General Knowledge.",
    icon: ShieldCheck,
    color: "from-sky-600 to-blue-800",
    subjectPrefix: "ssc_gd"
  },
  {
    id: "rrb_group_d_alp",
    title: "Railway RRB (Group D / ALP / NTPC)",
    tag: "10th/ITI/12th",
    badge: "All India",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "रेलवे भर्ती बोर्ड सामान्य विज्ञान और तार्किक क्षमता।",
    icon: Compass,
    color: "from-orange-600 to-amber-700",
    subjectPrefix: "rrb"
  },
  {
    id: "bihar_daroga_si",
    title: "BPSSC बिहार दारोगा (Sub-Inspector)",
    tag: "Graduate",
    badge: "Officer Level",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    desc: "प्रारंभिक एवं मुख्य परीक्षा विशेष सामान्य अध्ययन पत्र।",
    icon: ShieldCheck,
    color: "from-slate-800 to-slate-950",
    subjectPrefix: "bihar_daroga"
  }
];

export default function MockTestPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedExamId = searchParams.get("exam");
  const selectedQuizId = searchParams.get("quiz_id");

  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const currentExam = EXAM_CATEGORIES.find((e) => e.id === selectedExamId);

  // Fetch all active test slots from backend
  useEffect(() => {
    let isMounted = true;
    if (selectedExamId && !selectedQuizId) {
      setLoadingList(true);
      fetch(`${API_BASE_URL}/api/quiz/available`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.success) {
            setAvailableQuizzes(data.data || []);
          }
        })
        .catch((e) => console.error("Failed to load available quizzes", e))
        .finally(() => {
          if (isMounted) setLoadingList(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedExamId, selectedQuizId]);

  // Filter quizzes according to selected exam category
  const filteredPapers = availableQuizzes.filter((quiz) => {
    if (!currentExam) return false;
    const subj = (quiz.subject || "").toLowerCase();
    
    if (selectedExamId === "class_10") {
      return subj.startsWith("bseb_10") || subj.includes("10");
    }
    if (selectedExamId === "bseb_12_science") {
      return subj.includes("12_117") || subj.includes("12_118") || subj.includes("12_119") || subj.includes("12_121") || subj.includes("12_science");
    }
    if (selectedExamId === "bseb_12_arts") {
      return subj.includes("12_3") || subj.includes("12_2") || subj.includes("12_arts") || subj.includes("lang");
    }
    return subj.includes(selectedExamId);
  });

  // ==========================================
  // CASE 1: All Exam Categories Selection
  // ==========================================
  if (!selectedExamId) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-amber-500" /> BiharFast Multi-Exam Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ऑनलाइन मॉक टेस्ट व लाइव प्रैक्टिस सेंटर
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-2xl">
                BSEB मैट्रिक/इंटर बोर्ड एवं बिहार व केंद्र सरकार की प्रतियोगी परीक्षाओं के मॉडल पेपर्स। अपनी परीक्षा चुनें और विषयवार टेस्ट दें।
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 self-start md:self-auto shrink-0 cursor-pointer"
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
                    <span>विषय सूची देखें</span>
                    <ChevronRight size={15} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Informational SEO Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" /> बिहार बोर्ड व सरकारी प्रतियोगी परीक्षा तैयारी मार्गदर्शिका
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              BiharFast ऑनलाइन टेस्ट पोर्टल पर सभी मॉक टेस्ट एनसीईआरटी (NCERT) और आधिकारिक बोर्ड/आयोग के नवीनतम सिलेबस को ध्यान में रखकर तैयार किए जाते हैं। वस्तुनिष्ठ (MCQ) प्रश्नों के नियमित अभ्यास से परीक्षा भवन में समय प्रबंधन और सटीकता में सुधार होता है।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-500 font-semibold">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                ✔️ <strong>वास्तविक परीक्षा पैटर्न:</strong> आधिकारिक मॉडल पेपर्स और पूर्ववर्ती प्रश्नों का संकलन।
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                ✔️ <strong>दैनिक प्रयास सीमा:</strong> स्पैम से बचाव हेतु 1 IP पते से प्रति दिन 6 प्रयास अनुमत।
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                ✔️ <strong>राज्य स्तरीय लीडरबोर्ड:</strong> टेस्ट सबमिट करते ही जिलावार रैंक और स्कोरकार्ड।
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 2: Specific Paper Selected -> Play Quiz
  // ==========================================
  if (selectedQuizId) {
    return (
      <div className="min-h-screen bg-slate-100/70 py-6 px-3 sm:px-6 font-sans">
        <div className="max-w-4xl mx-auto space-y-4">
          
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setSearchParams({ exam: selectedExamId })}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition cursor-pointer"
            >
              <ArrowLeft size={14} /> विषय सूची पर वापस जाएं (Back to Papers)
            </button>
            <span className="text-xs font-black text-blue-700">
              {currentExam?.title}
            </span>
          </div>

          <Class10QuizPlayer examId={selectedExamId} quizId={selectedQuizId} />

        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 3: Subject & Model Paper Card Selection (Student Chooses Paper)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> सभी परीक्षाएं देखें (Change Category)
          </button>
          <span className="text-xs font-black text-slate-900">
            चयनित परीक्षा: <span className="text-blue-700">{currentExam?.title}</span>
          </span>
        </div>

        {/* Header Heading */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900">
            अपना विषय व प्रश्न पत्र चुनें
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            नीचे दिए गए सक्रिय मॉडल सेट्स में से किसी एक पर क्लिक करके लाइव टेस्ट शुरू करें।
          </p>
        </div>

        {/* Loading Spinner */}
        {loadingList && (
          <div className="bg-white rounded-3xl p-16 text-center space-y-2 border border-slate-200 shadow-xs">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-600">उपलब्ध प्रश्न पत्र लोड हो रहे हैं...</p>
          </div>
        )}

        {/* Empty State Fallback */}
        {!loadingList && filteredPapers.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Clock size={30} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                {currentExam?.title} के प्रश्न पत्र जल्द उपलब्ध होंगे!
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                इस परीक्षा के लिए विषयवार टेस्ट एडमिन पैनल द्वारा जोड़े जा रहे हैं। कृपया अन्य उपलब्ध टेस्ट दें।
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSearchParams({ exam: "class_10" })}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                10th Matric Live Test देखें
              </button>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                अन्य परीक्षाएं
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Paper Selection Cards */}
        {!loadingList && filteredPapers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white border border-slate-200 hover:border-blue-600 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-black uppercase">
                      Code: {paper.subject}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> लाइव एक्टिव
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                    {paper.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} className="text-slate-400" />
                      {paper.total_questions || 0} कुल प्रश्न
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {paper.duration_minutes || 15} मिनट
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchParams({ exam: selectedExamId, quiz_id: paper.id })}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  टेस्ट शुरू करें <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}