import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  Plus, Power, Trash2, ListOrdered, RefreshCw, 
  Layers, GraduationCap
} from "lucide-react";

// Official BSEB 2026 & Competitive Exam Subject Mapping
const EXAM_SUBJECT_MAP = {
  // ==================== BSEB CLASS 10TH (MATRIC) ====================
  bseb_10_110: { code: "110", name: "10th Mathematics (गणित)", group: "BSEB 10th (Matric)" },
  bseb_10_112: { code: "112", name: "10th Science (विज्ञान)", group: "BSEB 10th (Matric)" },
  bseb_10_111: { code: "111", name: "10th Social Science (सामाजिक विज्ञान)", group: "BSEB 10th (Matric)" },
  bseb_10_101: { code: "101", name: "10th MIL-Hindi (हिंदी)", group: "BSEB 10th (Matric)" },
  bseb_10_105: { code: "105", name: "10th SIL-Sanskrit (संस्कृत)", group: "BSEB 10th (Matric)" },
  bseb_10_103: { code: "103", name: "10th MIL-Urdu (उर्दू)", group: "BSEB 10th (Matric)" },
  bseb_10_104: { code: "104", name: "10th MIL-Maithili (मैथिली)", group: "BSEB 10th (Matric)" },
  bseb_10_102: { code: "102", name: "10th MIL-Bangla (बांग्ला)", group: "BSEB 10th (Matric)" },
  bseb_10_106: { code: "106", name: "10th SIL-Hindi (Non-Hindi)", group: "BSEB 10th (Matric)" },
  bseb_10_113: { code: "113", name: "10th English (अंग्रेजी)", group: "BSEB 10th (Matric)" },
  bseb_10_114: { code: "114", name: "10th Advanced Math (ऐच्छिक गणित)", group: "BSEB 10th (Matric)" },
  bseb_10_115: { code: "115", name: "10th Commerce (वाणिज्य)", group: "BSEB 10th (Matric)" },
  bseb_10_116: { code: "116", name: "10th Economics (अर्थशास्त्र)", group: "BSEB 10th (Matric)" },

  // ==================== BSEB CLASS 12TH (INTER SCIENCE) ====================
  bseb_12_117: { code: "117", name: "12th Physics (भौतिक विज्ञान)", group: "BSEB 12th Science" },
  bseb_12_118: { code: "118", name: "12th Chemistry (रसायन विज्ञान)", group: "BSEB 12th Science" },
  bseb_12_119: { code: "119", name: "12th Biology (जीव विज्ञान)", group: "BSEB 12th Science" },
  bseb_12_121: { code: "121", name: "12th Mathematics (गणित - Science)", group: "BSEB 12th Science" },
  bseb_12_120: { code: "120", name: "12th Agriculture (कृषि)", group: "BSEB 12th Science" },
  bseb_12_122: { code: "122", name: "12th Computer Science", group: "BSEB 12th Science" },

  // ==================== BSEB CLASS 12TH (INTER ARTS) ====================
  bseb_12_321: { code: "321", name: "12th History (इतिहास)", group: "BSEB 12th Arts" },
  bseb_12_322: { code: "322", name: "12th Political Science (राजनीति शास्त्र)", group: "BSEB 12th Arts" },
  bseb_12_323: { code: "323", name: "12th Geography (भूगोल)", group: "BSEB 12th Arts" },
  bseb_12_326: { code: "326", name: "12th Economics (अर्थशास्त्र - Arts)", group: "BSEB 12th Arts" },
  bseb_12_324: { code: "324", name: "12th Psychology (मनोविज्ञान)", group: "BSEB 12th Arts" },
  bseb_12_325: { code: "325", name: "12th Sociology (समाजशास्त्र)", group: "BSEB 12th Arts" },
  bseb_12_319: { code: "319", name: "12th Home Science (गृह विज्ञान)", group: "BSEB 12th Arts" },
  bseb_12_320: { code: "320", name: "12th Philosophy (दर्शनशास्त्र)", group: "BSEB 12th Arts" },
  bseb_12_318: { code: "318", name: "12th Music (संगीत)", group: "BSEB 12th Arts" },

  // ==================== BSEB CLASS 12TH (INTER COMMERCE) ====================
  bseb_12_220: { code: "220", name: "12th Accountancy (लेखाशास्त्र)", group: "BSEB 12th Commerce" },
  bseb_12_217: { code: "217", name: "12th Business Studies (व्यवसाय अध्ययन)", group: "BSEB 12th Commerce" },
  bseb_12_218: { code: "218", name: "12th Entrepreneurship (उद्यमिता)", group: "BSEB 12th Commerce" },
  bseb_12_219: { code: "219", name: "12th Economics (अर्थशास्त्र - Commerce)", group: "BSEB 12th Commerce" },

  // ==================== BSEB CLASS 12TH (LANGUAGES) ====================
  bseb_12_lang_hindi: { code: "106/206/306", name: "12th Hindi (हिंदी - Sc/Com/Arts)", group: "BSEB 12th Languages" },
  bseb_12_lang_eng: { code: "105/124/205", name: "12th English (अंग्रेजी - Sc/Com/Arts)", group: "BSEB 12th Languages" },
  bseb_12_lang_urdu: { code: "107/207/307", name: "12th Urdu (उर्दू)", group: "BSEB 12th Languages" },
  bseb_12_lang_sanskrit: { code: "109/209/309", name: "12th Sanskrit (संस्कृत)", group: "BSEB 12th Languages" },
  bseb_12_lang_maithili: { code: "108/208/308", name: "12th Maithili (मैथिली)", group: "BSEB 12th Languages" },

  // ==================== COMPETITIVE & SARKARI EXAMS ====================
  bihar_police_constable: { code: "CSBC", name: "CSBC बिहार पुलिस कांस्टेबल", group: "Govt Job Exams" },
  bihar_daroga_si: { code: "BPSSC", name: "BPSSC बिहार दारोगा (SI)", group: "Govt Job Exams" },
  bssc_inter_level: { code: "BSSC", name: "BSSC इंटर स्तरीय (10+2)", group: "Govt Job Exams" },
  ssc_gd_constable: { code: "SSC", name: "SSC GD कांस्टेबल (10th Pass)", group: "Govt Job Exams" },
  rrb_group_d_alp: { code: "RRB", name: "Railway RRB (Group D / ALP)", group: "Govt Job Exams" }
};

export default function AdminQuizManager({ adminToken, apiBaseUrl }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [entryMode, setEntryMode] = useState("single");
  const [bulkJsonText, setBulkJsonText] = useState("");

  const [newQuiz, setNewQuiz] = useState({
    title: "",
    subject: "bseb_10_110",
    slot: "slot_1",
    quiz_date: new Date().toISOString().split("T")[0],
    duration_minutes: 15
  });

  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctOpt, setCorrectOpt] = useState("A");
  const [explanation, setExplanation] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken.trim()}`
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/all-quizzes`, { headers: authHeaders });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setQuizzes(data.data);
      }
    } catch (e) {
      console.error("Quizzes fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsForQuiz = async (quizId) => {
    setLoadingQuestions(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/quiz-questions/${quizId}`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) {
        setQuizQuestions(data.data || []);
      }
    } catch (e) {
      console.error("Questions fetch failed:", e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestionsForQuiz(quiz.id);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/create-quiz`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(newQuiz)
      });
      const data = await res.json();
      if (data.success) {
        alert("नया टेस्ट स्लॉट सफलतापूर्वक बन गया!");
        setNewQuiz({ ...newQuiz, title: "" });
        fetchQuizzes();
      }
    } catch (e) {
      alert("Quiz create karne me error!");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await fetch(`${apiBaseUrl}/api/quiz/admin/toggle-status/${id}?is_active=${!currentStatus}`, {
        method: "POST",
        headers: authHeaders
      });
      fetchQuizzes();
      if (selectedQuiz?.id === id) {
        setSelectedQuiz(prev => ({ ...prev, is_active: !currentStatus }));
      }
    } catch (e) {
      alert("Status change error");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("क्या आप वाकई इस पूरे टेस्ट और इसके सभी प्रश्नों को डिलीट करना चाहते हैं?")) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/quiz/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      if (res.ok) {
        alert("टेस्ट डिलीट हो गया!");
        if (selectedQuiz?.id === id) {
          setSelectedQuiz(null);
          setQuizQuestions([]);
        }
        fetchQuizzes();
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("इस प्रश्न को हटाएं?")) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/question/${questionId}?quiz_id=${selectedQuiz.id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      if (res.ok) {
        fetchQuestionsForQuiz(selectedQuiz.id);
        fetchQuizzes();
      }
    } catch (e) {
      alert("Question delete failed");
    }
  };

  const handleAddSingleQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    const payload = {
      quiz_id: selectedQuiz.id,
      questions: [
        {
          question_text: questionText,
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_option: correctOpt,
          explanation: explanation
        }
      ]
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/add-questions`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setQuestionText("");
        setOptA("");
        setOptB("");
        setOptC("");
        setOptD("");
        setExplanation("");
        fetchQuestionsForQuiz(selectedQuiz.id);
        fetchQuizzes();
      }
    } catch (e) {
      alert("Question save failed");
    }
  };

  const handleAddBulkQuestions = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    let parsed = [];
    try {
      parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) throw new Error("JSON array hona chahiye");
    } catch (err) {
      alert("अमान्य JSON फॉर्मेट! कृपया सही JSON ऐरे पेस्ट करें।");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/add-questions`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ quiz_id: selectedQuiz.id, questions: parsed })
      });
      if (res.ok) {
        alert(`${parsed.length} प्रश्न एक साथ जुड़ गए!`);
        setBulkJsonText("");
        fetchQuestionsForQuiz(selectedQuiz.id);
        fetchQuizzes();
      }
    } catch (e) {
      alert("Bulk add failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="text-blue-700" size={22} /> BiharFast Universal Quiz Control Station
          </h1>
          <p className="text-xs text-slate-500">
            BSEB 10th, 12th (Science/Arts/Commerce) और सरकारी नौकरी परीक्षाओं के लिए टेस्ट व प्रश्न प्रबंधित करें
          </p>
        </div>
        <button
          onClick={fetchQuizzes}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> रिफ्रेश लिस्ट
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Create New Slot (Col 4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-b pb-2.5">
            <Plus size={16} className="text-blue-600" /> 1. नया टेस्ट स्लॉट बनाएं
          </h2>

          <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">शीर्षक (Title) *</label>
              <input
                type="text"
                required
                placeholder="उदा. BSEB 10th गणित Official Model Paper 2026 Set 01"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-blue-600"
              />
            </div>

            {/* Target Subject Selector with Official Codes */}
            <div>
              <label className="block mb-1">परीक्षा व विषय (Official Code) *</label>
              <select
                value={newQuiz.subject}
                onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white text-xs focus:outline-blue-600 max-h-56"
              >
                <optgroup label="BSEB Class 10th (Matric Official)">
                  <option value="bseb_10_110">110 - Mathematics (गणित)</option>
                  <option value="bseb_10_112">112 - Science (विज्ञान)</option>
                  <option value="bseb_10_111">111 - Social Science (सामाजिक विज्ञान)</option>
                  <option value="bseb_10_101">101 - MIL-Hindi (हिंदी)</option>
                  <option value="bseb_10_105">105 - SIL-Sanskrit (संस्कृत)</option>
                  <option value="bseb_10_103">103 - MIL-Urdu (उर्दू)</option>
                  <option value="bseb_10_104">104 - MIL-Maithili (मैथिली)</option>
                  <option value="bseb_10_102">102 - MIL-Bangla (बांग्ला)</option>
                  <option value="bseb_10_106">106 - SIL-Hindi (Non-Hindi)</option>
                  <option value="bseb_10_113">113 - English (अंग्रेजी)</option>
                  <option value="bseb_10_114">114 - Advanced Mathematics</option>
                  <option value="bseb_10_115">115 - Commerce</option>
                  <option value="bseb_10_116">116 - Economics</option>
                </optgroup>

                <optgroup label="BSEB Class 12th (Inter Science)">
                  <option value="bseb_12_117">117 - Physics (भौतिक विज्ञान)</option>
                  <option value="bseb_12_118">118 - Chemistry (रसायन विज्ञान)</option>
                  <option value="bseb_12_119">119 - Biology (जीव विज्ञान)</option>
                  <option value="bseb_12_121">121 - Mathematics (गणित)</option>
                  <option value="bseb_12_120">120 - Agriculture (कृषि)</option>
                  <option value="bseb_12_122">122 - Computer Science</option>
                </optgroup>

                <optgroup label="BSEB Class 12th (Inter Arts)">
                  <option value="bseb_12_321">321 - History (इतिहास)</option>
                  <option value="bseb_12_322">322 - Political Science (राजनीति शास्त्र)</option>
                  <option value="bseb_12_323">323 - Geography (भूगोल)</option>
                  <option value="bseb_12_326">326 - Economics (अर्थशास्त्र)</option>
                  <option value="bseb_12_324">324 - Psychology (मनोविज्ञान)</option>
                  <option value="bseb_12_325">325 - Sociology (समाजशास्त्र)</option>
                  <option value="bseb_12_319">319 - Home Science (गृह विज्ञान)</option>
                  <option value="bseb_12_320">320 - Philosophy (दर्शनशास्त्र)</option>
                  <option value="bseb_12_318">318 - Music (संगीत)</option>
                </optgroup>

                <optgroup label="BSEB Class 12th (Inter Commerce)">
                  <option value="bseb_12_220">220 - Accountancy (लेखाशास्त्र)</option>
                  <option value="bseb_12_217">217 - Business Studies (व्यवसाय अध्ययन)</option>
                  <option value="bseb_12_218">218 - Entrepreneurship (उद्यमिता)</option>
                  <option value="bseb_12_219">219 - Economics (अर्थशास्त्र)</option>
                </optgroup>

                <optgroup label="BSEB Class 12th (Languages)">
                  <option value="bseb_12_lang_hindi">106/206/306 - Hindi (हिंदी)</option>
                  <option value="bseb_12_lang_eng">105/124/205 - English (अंग्रेजी)</option>
                  <option value="bseb_12_lang_urdu">107/207/307 - Urdu (उर्दू)</option>
                  <option value="bseb_12_lang_sanskrit">109/209/309 - Sanskrit (संस्कृत)</option>
                  <option value="bseb_12_lang_maithili">108/208/308 - Maithili (मैथिली)</option>
                </optgroup>

                <optgroup label="Bihar Government Competitive Exams">
                  <option value="bihar_police_constable">CSBC बिहार पुलिस कांस्टेबल</option>
                  <option value="bihar_daroga_si">BPSSC बिहार दारोga (SI)</option>
                  <option value="bssc_inter_level">BSSC इंटर स्तरीय (10+2)</option>
                  <option value="ssc_gd_constable">SSC GD कांस्टेबल</option>
                  <option value="rrb_group_d_alp">Railway RRB (Group D/ALP)</option>
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1">दिनांक</label>
                <input
                  type="date"
                  value={newQuiz.quiz_date}
                  onChange={(e) => setNewQuiz({ ...newQuiz, quiz_date: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block mb-1">अवधि (Min)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={newQuiz.duration_minutes}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration_minutes: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xs transition cursor-pointer"
            >
              स्लॉट सेव करें
            </button>
          </form>
        </div>

        {/* Center: Test List & Manage (Col 4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Layers size={16} className="text-indigo-600" /> 2. टेस्ट लिस्ट ({quizzes.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-bold">क्लिक करके चुनें</span>
          </div>

          <div className="space-y-2 max-h-130 overflow-y-auto pr-1">
            {quizzes.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-bold">
                कोई टेस्ट स्लॉट नहीं मिला। नया स्लॉट बनाएं।
              </div>
            ) : (
              quizzes.map((q) => {
                const isSelected = selectedQuiz?.id === q.id;
                const subjectInfo = EXAM_SUBJECT_MAP[q.subject] || {
                  code: "EXAM",
                  name: q.subject || "General",
                  group: "General"
                };

                return (
                  <div
                    key={q.id}
                    onClick={() => handleSelectQuiz(q)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected ? "border-blue-600 bg-blue-50/70 shadow-xs" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[9px] font-black uppercase shrink-0">
                          {subjectInfo.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 truncate">
                          {subjectInfo.name}
                        </span>
                      </div>
                      <p className="font-black text-xs text-slate-900 truncate">{q.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        📅 {q.quiz_date} | {q.total_questions || 0} प्रश्न | {q.duration_minutes || 15} मिनट
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(q.id, q.is_active);
                        }}
                        className={`px-2 py-1 rounded-lg font-black text-[10px] flex items-center gap-1 cursor-pointer ${
                          q.is_active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        <Power size={11} /> {q.is_active ? "LIVE" : "OFF"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuiz(q.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete Entire Test"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Question Manager & Viewer (Col 4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <ListOrdered size={16} className="text-emerald-600" /> 3. प्रश्न कंट्रोल
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setEntryMode("single")}
                className={`px-2 py-0.5 rounded-md cursor-pointer ${entryMode === "single" ? "bg-white shadow-xs text-blue-700" : "text-slate-600"}`}
              >
                Single Form
              </button>
              <button
                type="button"
                onClick={() => setEntryMode("bulk")}
                className={`px-2 py-0.5 rounded-md cursor-pointer ${entryMode === "bulk" ? "bg-white shadow-xs text-blue-700" : "text-slate-600"}`}
              >
                Bulk JSON
              </button>
            </div>
          </div>

          {!selectedQuiz ? (
            <div className="p-8 text-center text-xs text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 font-bold">
              ⚠️ बीच वाली लिस्ट से एक टेस्ट चुनें!
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
                <span className="truncate">🎯 {selectedQuiz.title}</span>
                <span className="shrink-0 bg-blue-200 px-2 py-0.5 rounded-full text-[10px]">
                  {quizQuestions.length} Questions
                </span>
              </div>

              {/* Single Form Add */}
              {entryMode === "single" && (
                <form onSubmit={handleAddSingleQuestion} className="space-y-2 text-xs font-bold text-slate-700">
                  <textarea
                    required
                    rows="2"
                    placeholder="प्रश्न टाइप करें..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium focus:outline-blue-600"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input type="text" placeholder="Opt A" required value={optA} onChange={e => setOptA(e.target.value)} className="p-2 border rounded-lg" />
                    <input type="text" placeholder="Opt B" required value={optB} onChange={e => setOptB(e.target.value)} className="p-2 border rounded-lg" />
                    <input type="text" placeholder="Opt C" required value={optC} onChange={e => setOptC(e.target.value)} className="p-2 border rounded-lg" />
                    <input type="text" placeholder="Opt D" required value={optD} onChange={e => setOptD(e.target.value)} className="p-2 border rounded-lg" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <select value={correctOpt} onChange={e => setCorrectOpt(e.target.value)} className="p-2 border rounded-lg bg-white font-black text-emerald-700">
                      <option value="A">Ans: A</option>
                      <option value="B">Ans: B</option>
                      <option value="C">Ans: C</option>
                      <option value="D">Ans: D</option>
                    </select>
                    <input type="text" placeholder="स्पष्टीकरण..." value={explanation} onChange={e => setExplanation(e.target.value)} className="col-span-2 p-2 border rounded-lg font-medium" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition cursor-pointer">
                    + प्रश्न सेव करें
                  </button>
                </form>
              )}

              {/* Bulk JSON Paste */}
              {entryMode === "bulk" && (
                <form onSubmit={handleAddBulkQuestions} className="space-y-2">
                  <textarea
                    rows="6"
                    required
                    placeholder='[{"question_text":"सवाल","option_a":"A","option_b":"B","option_c":"C","option_d":"D","correct_option":"A","explanation":""}]'
                    value={bulkJsonText}
                    onChange={(e) => setBulkJsonText(e.target.value)}
                    className="w-full p-2 border font-mono text-[10px] rounded-xl focus:outline-blue-600"
                  />
                  <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs cursor-pointer">
                    Bulk JSON इंपोर्ट करें
                  </button>
                </form>
              )}

              {/* View Existing Questions & Delete */}
              <div className="border-t pt-3 space-y-2">
                <span className="text-[11px] font-black text-slate-800">मौजूदा प्रश्न ({quizQuestions.length})</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {loadingQuestions ? (
                    <div className="text-[11px] text-slate-400">लोड हो रहा है...</div>
                  ) : quizQuestions.length === 0 ? (
                    <div className="text-[10px] text-slate-400">इस टेस्ट में अभी कोई प्रश्न नहीं है।</div>
                  ) : (
                    quizQuestions.map((q, idx) => (
                      <div key={q.id} className="p-2 border rounded-lg bg-slate-50 text-[11px] flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800 truncate">
                          {idx + 1}. {q.question_text} (Ans: {q.correct_option})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

AdminQuizManager.propTypes = {
  adminToken: PropTypes.string.isRequired,
  apiBaseUrl: PropTypes.string.isRequired
};