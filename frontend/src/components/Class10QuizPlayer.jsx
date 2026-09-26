import { useState, useEffect, useCallback, useId, useRef } from "react";
import PropTypes from "prop-types";
import { 
  Trophy, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Timer, 
  MapPin, 
  Sparkles,
  Award,
  Send
} from "lucide-react";
import Leaderboard from "./Leaderboard";
import { useAuth } from "../context/authContext";
import { savePendingStudentAttempt, saveStudentAttempt } from "../utils/studentHistory";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

// Bihar ke sabhi 38 Official Districts (Alphabetically Organized)
const BIHAR_DISTRICTS = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", 
  "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", 
  "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", 
  "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", 
  "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", 
  "Patna", "Purnea", "Rohtas (Sasaram)", "Saharsa", "Samastipur", 
  "Saran (Chhapra)", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", 
  "Supaul", "Vaishali (Hajipur)", "West Champaran (Bettiah)"
];

export default function Class10QuizPlayer({ examId = "class_10", quizId = null }) {
  const { user, openLoginModal } = useAuth();
  const studentNameId = useId();
  const districtId = useId();
  const phoneId = useId();

  // Steps: 'register' | 'playing' | 'result'
  const [step, setStep] = useState("register");
  const [student, setStudent] = useState({
    name: "",
    district: "Patna",
    phone: ""
  });

  const [quizMeta, setQuizMeta] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [attemptDate, setAttemptDate] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const submissionLockRef = useRef(false);
  const submitRef = useRef(null);
  const remainingTimeRef = useRef(0);
  const startedAtRef = useRef(null);
  const activeQuestions = demoMode ? questions.slice(0, 5) : questions;
  const profileName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  useEffect(() => {
    document.title = "Bihar Board Class 10 Free Mock Test & Quiz | BiharFast";

    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag("name", "description", "अभ्यास करें बिहार बोर्ड मैट्रिक परीक्षा के लिए फ्री ऑनलाइन मॉक टेस्ट और क्विज़। पाएं तुरंत रिजल्ट, विस्तृत समाधान और लीडरबोर्ड रैंकिंग।");
    setMetaTag("property", "og:title", "Bihar Board Class 10 Free Mock Test & Quiz | BiharFast");
    setMetaTag("property", "og:description", "अभ्यास करें बिहार बोर्ड मैट्रिक परीक्षा के लिए फ्री ऑनलाइन मॉक टेस्ट और क्विज़। पाएं तुरंत रिजल्ट, विस्तृत समाधान और लीडरबोर्ड रैंकिंग।");

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", `https://biharfast.in${window.location.pathname}`);
  }, []);

  // Dynamic Query Fetch: Supports both explicit quizId and examId
  useEffect(() => {
    let isMounted = true;
    async function fetchQuiz() {
      setLoadingQuiz(true);
      try {
        let endpoint = `${API_BASE_URL}/api/quiz/today`;
        if (quizId) {
          endpoint += `?quiz_id=${encodeURIComponent(quizId)}`;
        } else if (examId) {
          endpoint += `?subject=${encodeURIComponent(examId)}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (isMounted && data.is_live && data.quiz) {
          setQuizMeta(data.quiz);
          setQuestions(data.questions || []);
          const durationSeconds = (data.quiz.duration_minutes || 15) * 60;
          remainingTimeRef.current = durationSeconds;
          setTimeLeft(durationSeconds);
        } else if (isMounted) {
          setQuizMeta(null);
          setQuestions([]);
        }
      } catch (err) {
        console.error("Quiz dynamic load error:", err);
      } finally {
        if (isMounted) setLoadingQuiz(false);
      }
    }
    fetchQuiz();

    return () => {
      isMounted = false;
    };
  }, [examId, quizId]);

  const startTest = (isDemo) => {
    if (!isDemo && !user) {
      openLoginModal();
      return;
    }
    setDemoMode(isDemo);
    setAnswers({});
    setResult(null);
    setTimeExpired(false);
    setSubmitError("");
    const configuredDuration = (quizMeta.duration_minutes || 15) * 60;
    const duration = isDemo ? Math.min(configuredDuration, 5 * 60) : configuredDuration;
    remainingTimeRef.current = duration;
    setTimeLeft(duration);
    startedAtRef.current = Date.now();
    setStep("playing");
  };

  // Submit Handler
  const handleSubmit = useCallback(async (automatic = false) => {
    if (submissionLockRef.current || !quizMeta) return;
    const unansweredCount = activeQuestions.length - Object.keys(answers).length;
    if (!automatic && unansweredCount > 0 && !window.confirm(`आपने ${unansweredCount} प्रश्नों के उत्तर नहीं दिए हैं। क्या आप अभी टेस्ट सबमिट करना चाहते हैं?`)) {
      return;
    }

    submissionLockRef.current = true;
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = {
        quiz_id: quizMeta.id,
        answers: answers,
        student_name: student.name.trim() || profileName || "छात्र",
        district: student.district || "बिहार",
        phone: student.phone.trim() || null,
        demo_mode: demoMode
      };

      const res = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = new Error("Submission failed");
        error.status = res.status;
        throw error;
      }
      const resultJson = await res.json();
      setResult(resultJson);
      const completedAt = new Date();
      setAttemptDate(completedAt);
      if (!demoMode && user) {
        saveStudentAttempt(user.id, {
          id: `${quizMeta.id}-${completedAt.getTime()}`,
          quiz_id: quizMeta.id,
          title: quizMeta.title,
          subject: quizMeta.subject,
          attempted_at: completedAt.toISOString(),
          score: resultJson.score,
          total_questions: resultJson.total_questions,
          accuracy_percentage: resultJson.accuracy_percentage,
          practice_seconds: startedAtRef.current ? Math.max(0, Math.round((completedAt.getTime() - startedAtRef.current) / 1000)) : 0,
          results: resultJson.results,
        });
      }
      setStep("result");
    } catch (err) {
      setSubmitError(err.status === 429
        ? "कृपया 1 मिनट प्रतीक्षा करें और पुनः प्रयास करें।"
        : "टेस्ट सबमिट करने में समस्या हुई। कृपया पुनः प्रयास करें।");
      console.error(err);
    } finally {
      submissionLockRef.current = false;
      setSubmitting(false);
    }
  }, [quizMeta, activeQuestions.length, answers, student, profileName, demoMode, user]);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Keep one interval for the full playing step; changing answers must not restart it.
  useEffect(() => {
    if (step !== "playing") return;
    const timer = setInterval(() => {
      const nextTime = Math.max(remainingTimeRef.current - 1, 0);
      remainingTimeRef.current = nextTime;
      setTimeLeft(nextTime);
      if (nextTime === 0) {
        clearInterval(timer);
        setTimeExpired(true);
        submitRef.current?.(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  const handleOptionSelect = (qId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionKey }));
  };

  // WhatsApp Viral Share
  const shareToWhatsApp = () => {
    if (!result || !quizMeta) return;
    const shareUrl = quizId 
      ? `https://www.biharfast.in/mock-test?exam=${encodeURIComponent(examId)}&quiz_id=${encodeURIComponent(quizMeta.id)}`
      : `https://www.biharfast.in/mock-test?exam=${encodeURIComponent(examId)}`;

    const badge = getResultBadge(result.accuracy_percentage);
    const dateText = attemptDate?.toLocaleDateString("hi-IN") || "आज";
    const text = 
`⚡ *BIHARFAST OFFICIAL - ऑनलाइन मॉक टेस्ट* ⚡
📝 *${quizMeta.title}*

👤 *परीक्षार्थी:* ${student.name}
📍 *जिला:* ${student.district}
🏆 *स्कोर:* ${result.score}/${result.total_questions}
🎯 *सटीकता:* ${result.accuracy_percentage}%
🏅 *बैज:* ${badge.label}
📅 *दिनांक:* ${dateText}

🔥 *क्या आप मुझसे ज्यादा अंक ला सकते हैं?*
अभी टेस्ट दें और अपना नाम बिहार के स्टेट लीडरबोर्ड पर देखें:
👉 ${shareUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToTelegram = () => {
    if (!result || !quizMeta) return;
    const shareUrl = `https://www.biharfast.in/mock-test?exam=${encodeURIComponent(examId)}&quiz_id=${encodeURIComponent(quizMeta.id)}`;
    const badge = getResultBadge(result.accuracy_percentage);
    const text = `${student.name} ने ${result.score}/${result.total_questions} अंक और ${result.accuracy_percentage}% सटीकता हासिल की (${badge.label})। क्या आप उनका स्कोर पार कर सकते हैं?`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const getResultBadge = (accuracy) => {
    if (accuracy >= 90) return { label: "उत्कृष्ट प्रदर्शन / Brilliant", className: "bg-amber-100 text-amber-900 border-amber-300" };
    if (accuracy >= 75) return { label: "बहुत अच्छा / Good", className: "bg-emerald-100 text-emerald-900 border-emerald-300" };
    if (accuracy >= 50) return { label: "अच्छा प्रयास / Well Tried", className: "bg-sky-100 text-sky-900 border-sky-300" };
    return { label: "अभ्यास जारी रखें / Keep Practicing", className: "bg-orange-100 text-orange-900 border-orange-300" };
  };

  const saveDemoResult = () => {
    if (!result || !demoMode) return;
    const completedAt = attemptDate || new Date();
    const attempt = {
      id: `${quizMeta.id}-${completedAt.getTime()}`,
      quiz_id: quizMeta.id,
      title: quizMeta.title,
      subject: quizMeta.subject,
      attempted_at: completedAt.toISOString(),
      score: result.score,
      total_questions: result.total_questions,
      accuracy_percentage: result.accuracy_percentage,
      practice_seconds: startedAtRef.current ? Math.max(0, Math.round((completedAt.getTime() - startedAtRef.current) / 1000)) : 0,
      results: result.results,
    };
    if (user) saveStudentAttempt(user.id, attempt);
    else {
      savePendingStudentAttempt(attempt);
      openLoginModal();
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loadingQuiz) {
    return (
      <div className="py-20 text-center text-sm font-bold text-slate-600">
        प्रश्न पत्र लोड हो रहा है...
      </div>
    );
  }

  if (!quizMeta || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl text-center shadow-md border border-slate-200">
        <h3 className="text-lg font-black text-slate-800">सत्र वर्तमान में बंद है</h3>
        <p className="text-xs text-slate-500 mt-2">इस परीक्षा के लिए नया टेस्ट जल्द ही लाइव किया जाएगा।</p>
      </div>
    );
  }

  // ================= 1. PRE-TEST REGISTRATION =================
  if (step === "register") {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-3xl shadow-xl border border-blue-100">
        <div className="text-center mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider rounded-full">
            BiharFast Official Mock Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-3">{quizMeta.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            पूरा टेस्ट और स्कोर इतिहास आपके छात्र लॉगिन के साथ उपलब्ध है
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!user) {
              openLoginModal();
              return;
            }
            if (student.name.trim() || profileName) startTest(false);
          }}
          className="space-y-4 text-xs font-bold"
        >
          <div>
            <label htmlFor={studentNameId} className="block text-slate-700 uppercase mb-1">
              आपका पूरा नाम (Full Name) *
            </label>
            <input
              id={studentNameId}
              type="text"
              required={Boolean(user)}
              placeholder="उदा. राहुल कुमार"
              value={student.name || profileName}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-semibold"
            />
          </div>

          <div>
            <label htmlFor={districtId} className="block text-slate-700 uppercase mb-1">
              गृह जिला (District) *
            </label>
            <select
              id={districtId}
              value={student.district}
              onChange={(e) => setStudent({ ...student, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-semibold bg-white"
            >
              {BIHAR_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={phoneId} className="block text-slate-700 uppercase mb-1">
              मोबाइल नंबर (वैकल्पिक)
            </label>
            <input
              id={phoneId}
              type="tel"
              placeholder="WhatsApp Number (Optional)"
              value={student.phone}
              onChange={(e) => setStudent({ ...student, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-linear-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{user ? `पूरा टेस्ट शुरू करें (${questions.length} प्रश्न)` : "लॉगिन करके पूरा टेस्ट शुरू करें"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => startTest(true)}
            className="w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-900 transition hover:bg-emerald-100"
          >
            बिना लॉगिन 5 प्रश्नों का फ्री डेमो दें
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500">डेमो स्कोर निजी रहेगा और लीडरबोर्ड में नहीं जोड़ा जाएगा।</p>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-4">
          <Leaderboard quizId={quizMeta.id} />
        </div>
      </div>
    );
  }

  // ================= 2. ACTIVE QUIZ INTERFACE =================
  if (step === "playing") {
    return (
      <div className="max-w-2xl mx-auto my-6 px-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">{quizMeta.title}</h1>
        {/* Sticky Header with Timer */}
        <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-2xl shadow-md flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-slate-900">{student.name}</h3>
            <span className="text-[11px] text-slate-500 font-semibold">📍 {student.district}</span>
            <div className="mt-2 w-48 max-w-full">
              <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                <span>उत्तर दिए</span>
                <span>{Object.keys(answers).length} / {activeQuestions.length}</span>
              </div>
              <div
                className="h-2 rounded-full bg-slate-200 overflow-hidden"
                role="progressbar"
                aria-label="उत्तर दिए गए प्रश्न"
                aria-valuemin={0}
                aria-valuemax={activeQuestions.length}
                aria-valuenow={Object.keys(answers).length}
              >
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
                  style={{ width: `${activeQuestions.length ? (Object.keys(answers).length / activeQuestions.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 font-mono font-black px-3.5 py-1.5 rounded-xl border border-rose-200">
            <Timer size={16} />
            <span className="text-base">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {timeExpired && submitting && (
          <div role="status" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-900">
            समय समाप्त! उत्तर सबमिट हो रहे हैं...
          </div>
        )}
        {submitError && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm font-bold text-rose-800">
            {submitError}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {activeQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-start gap-3 mb-4">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {q.question_text}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {["A", "B", "C", "D"].map((opt) => {
                  const optText = q[`option_${opt.toLowerCase()}`];
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={submitting || timeExpired}
                      onClick={() => handleOptionSelect(q.id, opt)}
                      className={`w-full text-left p-3 rounded-xl border font-semibold text-xs transition flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 hover:bg-blue-50/60 border-slate-200 text-slate-800"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-[11px] ${
                          isSelected ? "bg-white text-blue-700" : "bg-white border border-slate-300 text-slate-700"
                        }`}
                      >
                        {opt}
                      </span>
                      <span className="flex-1">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? "परिणाम तैयार हो रहा है..." : submitError ? "पुनः प्रयास करें" : demoMode ? "डेमो सबमिट करें" : "टेस्ट सबमिट करें"}
          </button>
        </div>
      </div>
    );
  }

  // ================= 3. RESULT & VIRAL SHARE =================
  if (step === "result" && result) {
    const resultBadge = getResultBadge(result.accuracy_percentage);
    const resultDate = attemptDate?.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }) || "आज";
    return (
      <div className="max-w-xl mx-auto my-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 overflow-hidden text-center p-6 sm:p-8">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              BiharFast Official Scorecard
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {quizMeta.title}
            </h1>
          </div>

          <div className="my-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trophy size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{student.name}</h2>
            <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <MapPin size={12} className="text-rose-500" />
              <span>जिला: {student.district}</span>
            </p>
            <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full border text-xs font-black ${resultBadge.className}`}>
              <Award size={14} /> {resultBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-500 font-bold">अंक</span>
              <p className="text-xl font-black text-blue-700">{result.score}/{result.total_questions}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-bold">सटीकता</span>
              <p className="text-xl font-black text-emerald-600">{result.accuracy_percentage}%</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-bold">तिथि</span>
              <p className="text-xs sm:text-sm font-black text-slate-800 mt-1">{resultDate}</p>
            </div>
          </div>

          <div className="space-y-3">
            {demoMode && (
              <button
                type="button"
                onClick={saveDemoResult}
                className="w-full rounded-xl border border-sky-300 bg-sky-50 py-3 text-sm font-black text-sky-900 transition hover:bg-sky-100"
              >
                {user ? "डेमो परिणाम इतिहास में सहेजें" : "डेमो परिणाम सहेजने के लिए Student Login करें"}
              </button>
            )}
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 size={20} />
              <span>Share Result on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={shareToTelegram}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={18} />
              <span>टेलीग्राम पर परिणाम साझा करें</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setResult(null);
                setDemoMode(false);
                setAttemptDate(null);
                setTimeExpired(false);
                setSubmitError("");
                remainingTimeRef.current = (quizMeta.duration_minutes || 15) * 60;
                setTimeLeft(remainingTimeRef.current);
                setStep("register");
              }}
              className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-900 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>अन्य छात्र का टेस्ट दें</span>
            </button>
          </div>
        </div>

        {/* Detailed Solutions */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            विस्तृत समाधान व उत्तर कुंजी (Solutions)
          </h3>

          <div className="space-y-4">
            {result.results?.map((item, idx) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                <div className="flex items-start gap-2 mb-2">
                  <span className="font-black text-slate-700">{idx + 1}.</span>
                  <p className="font-bold text-slate-900">{item.question_text}</p>
                </div>
                <div className="flex items-center gap-4 font-semibold text-[11px]">
                  <span className={`flex items-center gap-1 ${item.is_correct ? "text-emerald-700" : "text-rose-600"}`}>
                    {item.is_correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    आपका उत्तर: {item.user_choice || "छोड़ दिया"}
                  </span>
                  <span className="text-blue-700 font-bold">
                    सही उत्तर: {item.correct_option}
                  </span>
                </div>
                {item.explanation && (
                  <p className="mt-2 text-slate-600 bg-white p-2 rounded border border-slate-200/60 text-[11px]">
                    💡 <strong>स्पष्टीकरण:</strong> {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Leaderboard quizId={quizMeta.id} />
      </div>
    );
  }

  return null;
}

Class10QuizPlayer.propTypes = {
  examId: PropTypes.string,
  quizId: PropTypes.string
};