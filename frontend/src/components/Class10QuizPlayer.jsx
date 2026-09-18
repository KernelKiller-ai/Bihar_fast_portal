import React, { useState, useEffect, useCallback, useId } from "react";
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
  Award,
  Sparkles
} from "lucide-react";
import Leaderboard from "./Leaderboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

const BIHAR_DISTRICTS = [
  "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", 
  "Sheikhpura", "Nalanda", "Purnea", "Saran", "Begusarai", 
  "Samastipur", "Rohtas", "Vaishali", "Saharsa", "Katihar"
];

// Ab yeh examId prop accept karega (default: "class_10")
export default function Class10QuizPlayer({ examId = "class_10" }) {
  const studentNameId = useId();
  const districtId = useId();
  const phoneId = useId();

  // Navigation Steps: 'register' | 'playing' | 'result'
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

  // Initial Load: Target Exam specific query
  useEffect(() => {
    let isMounted = true;
    async function fetchQuiz() {
      setLoadingQuiz(true);
      try {
        // Targeted Exam ID query parameter pass ho raha hai
        const queryParam = examId ? `?subject=${encodeURIComponent(examId)}` : "";
        const res = await fetch(`${API_BASE_URL}/api/quiz/today${queryParam}`);
        const data = await res.json();
        if (isMounted && data.is_live && data.quiz) {
          setQuizMeta(data.quiz);
          setQuestions(data.questions || []);
          setTimeLeft((data.quiz.duration_minutes || 10) * 60);
        } else if (isMounted) {
          setQuizMeta(null);
          setQuestions([]);
        }
      } catch (err) {
        console.error("Quiz load error:", err);
      } finally {
        if (isMounted) setLoadingQuiz(false);
      }
    }
    fetchQuiz();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  // Submit Handler
  const handleSubmit = useCallback(async () => {
    if (submitting || !quizMeta) return;
    setSubmitting(true);

    try {
      const payload = {
        quiz_id: quizMeta.id,
        answers: answers,
        student_name: student.name.trim() || "छात्र",
        district: student.district || "बिहार",
        phone: student.phone.trim() || null
      };

      const res = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Submission failed");
      const resultJson = await res.json();
      setResult(resultJson);
      setStep("result");
    } catch (err) {
      alert("टेस्ट सबमिट करने में समस्या हुई। कृपया पुनः प्रयास करें।");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, quizMeta, answers, student]);

  // Timer Tick
  useEffect(() => {
    if (step !== "playing" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft, handleSubmit]);

  const handleOptionSelect = (qId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionKey }));
  };

  const shareToWhatsApp = () => {
    if (!result || !quizMeta) return;
    const text = 
`⚡ *BIHARFAST OFFICIAL - ऑनलाइन मॉक टेस्ट* ⚡
📝 *${quizMeta.title}*

👤 *परीक्षार्थी:* ${student.name}
📍 *जिला:* ${student.district}
🏆 *स्कोर:* ${result.score}/${result.total_questions}
🎯 *सटीकता:* ${result.accuracy_percentage}%

🔥 *क्या आप मुझसे ज्यादा अंक ला सकते हैं?*
अभी टेस्ट दें और अपना नाम बिहार के स्टेट लीडरबोर्ड पर देखें:
👉 https://www.biharfast.in/mock-test?exam=${encodeURIComponent(examId)}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loadingQuiz) {
    return (
      <div className="py-20 text-center text-sm font-bold text-slate-600">
        प्रश्नावली लोड हो रही है...
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
          <h2 className="text-2xl font-black text-slate-900 mt-3">{quizMeta.title}</h2>
          <p className="text-xs text-slate-500 mt-1">
            लीडरबोर्ड पर रैंक पाने के लिए अपना नाम और जिला दर्ज करें
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (student.name.trim()) setStep("playing");
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
              required
              placeholder="उदा. राहुल कुमार"
              value={student.name}
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
            <span>टेस्ट शुरू करें ({questions.length} प्रश्न)</span>
            <ArrowRight size={16} />
          </button>
        </form>

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
        {/* Sticky Header with Timer */}
        <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-2xl shadow-md flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-slate-900">{student.name}</h3>
            <span className="text-[11px] text-slate-500 font-semibold">📍 {student.district}</span>
          </div>
          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 font-mono font-black px-3.5 py-1.5 rounded-xl border border-rose-200">
            <Timer size={16} className="animate-spin" />
            <span className="text-base">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
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
        <div className="mt-8">
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? "परिणाम तैयार हो रहा है..." : "टेस्ट सबमिट करें"}
          </button>
        </div>
      </div>
    );
  }

  // ================= 3. RESULT & VIRAL SHARE =================
  if (step === "result" && result) {
    return (
      <div className="max-w-xl mx-auto my-8 px-4">
        {/* Shareable Card Frame */}
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
              <span className="text-[11px] text-slate-500 font-bold">गलत</span>
              <p className="text-xl font-black text-rose-500">{result.wrong_count}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 size={20} />
              <span>व्हाट्सएप पर शेयर करें (दोस्तों को चुनौती दें)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setResult(null);
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
  examId: PropTypes.string
};