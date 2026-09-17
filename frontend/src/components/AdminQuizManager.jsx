import React, { useState, useEffect } from "react";
import { Plus, Power, Trash2, ListOrdered, CheckCircle, RefreshCw, Layers } from "lucide-react";

export default function AdminQuizManager({ adminToken, apiBaseUrl }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // New Quiz Form State
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    subject: "science",
    slot: "slot_1",
    quiz_date: new Date().toISOString().split("T")[0],
    duration_minutes: 15
  });

  // Question Form State
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctOpt, setCorrectOpt] = useState("A");
  const [explanation, setExplanation] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/quiz/admin/all-quizzes`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) setQuizzes(data.data);
    } catch (e) {
      console.error("Quizzes fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

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
        alert("नया क्विज स्लॉट बन गया!");
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
    } catch (e) {
      alert("Status change error");
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) {
      alert("कृपया पहले लिस्ट में से कोई क्विज चुनें!");
      return;
    }

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
        alert("प्रश्न सफलतापूर्वक जुड़ गया!");
        setQuestionText("");
        setOptA("");
        setOptB("");
        setOptC("");
        setOptD("");
        setExplanation("");
        fetchQuizzes();
      }
    } catch (e) {
      alert("Question save failed");
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">BiharFast Quiz Control Engine</h1>
          <p className="text-xs text-slate-500">लाइव क्विज शुरू/बंद करें, नया पेपर बनाएं और प्रश्न जोड़ें</p>
        </div>
        <button
          onClick={fetchQuizzes}
          className="p-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>रिफ्रेश</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create New Quiz Batch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
            <Plus size={16} className="text-blue-600" />
            1. नया टेस्ट स्लॉट बनाएं
          </h2>
          <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs font-bold text-slate-700">
            <div>
              <label>शीर्षक (Title):</label>
              <input
                type="text"
                required
                placeholder="उदा. BSEB 10th विज्ञान टेस्ट 01"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>विषय (Subject):</label>
                <select
                  value={newQuiz.subject}
                  onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                >
                  <option value="science">Science (विज्ञान)</option>
                  <option value="math">Mathematics (गणित)</option>
                  <option value="hindi">Hindi (हिंदी)</option>
                  <option value="social_science">Social Science (सामाजिक विज्ञान)</option>
                  <option value="sanskrit">Sanskrit (संस्कृत)</option>
                </select>
              </div>
              <div>
                <label>स्लॉट (Slot):</label>
                <select
                  value={newQuiz.slot}
                  onChange={(e) => setNewQuiz({ ...newQuiz, slot: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                >
                  <option value="slot_1">Slot 1 (सुबह 7AM - 1PM)</option>
                  <option value="slot_2">Slot 2 (शाम 5PM - 10:30PM)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>दिनांक (Date):</label>
                <input
                  type="date"
                  value={newQuiz.quiz_date}
                  onChange={(e) => setNewQuiz({ ...newQuiz, quiz_date: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label>अवधि (Minutes):</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={newQuiz.duration_minutes}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration_minutes: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition mt-2"
            >
              स्लॉट सेव करें
            </button>
          </form>
        </div>

        {/* Center Column: Existing Quizzes List & Live Toggle */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
            <Layers size={16} className="text-indigo-600" />
            2. टेस्ट लिस्ट व ऑन/ऑफ कंट्रोल
          </h2>

          <div className="space-y-2.5 overflow-y-auto max-h-125 pr-1">
            {quizzes.map((q) => {
              const isSelected = selectedQuiz?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuiz(q)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    isSelected ? "border-blue-600 bg-blue-50/50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-black text-slate-900">{q.title}</p>
                    <p className="text-[11px] text-slate-500">
                      📅 {q.quiz_date} | {q.slot} | {q.total_questions || 0} प्रश्न
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(q.id, q.is_active);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-black text-[11px] flex items-center gap-1 transition ${
                      q.is_active
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                    }`}
                  >
                    <Power size={12} />
                    <span>{q.is_active ? "LIVE (ON)" : "OFF"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Question Adder for Selected Quiz */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
            <ListOrdered size={16} className="text-emerald-600" />
            3. प्रश्न जोड़ें
          </h2>
          {selectedQuiz ? (
            <p className="text-[11px] text-blue-700 font-bold mb-3 bg-blue-50 p-2 rounded-lg">
              चयनित: {selectedQuiz.title} ({selectedQuiz.quiz_date})
            </p>
          ) : (
            <p className="text-[11px] text-rose-600 font-bold mb-3 bg-rose-50 p-2 rounded-lg">
              ⚠️ प्रश्न जोड़ने के लिए बीच वाली लिस्ट से एक टेस्ट चुनें!
            </p>
          )}

          <form onSubmit={handleAddQuestion} className="space-y-2.5 text-xs font-bold text-slate-700">
            <div>
              <label>प्रश्न (Question Text):</label>
              <textarea
                required
                rows="2"
                placeholder="प्रश्न टाइप करें..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg border border-slate-300 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Option A:</label>
                <input
                  type="text"
                  required
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label>Option B:</label>
                <input
                  type="text"
                  required
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label>Option C:</label>
                <input
                  type="text"
                  required
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label>Option D:</label>
                <input
                  type="text"
                  required
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label>सही उत्तर:</label>
                <select
                  value={correctOpt}
                  onChange={(e) => setCorrectOpt(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-300 font-black bg-white text-emerald-700"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="col-span-2">
                <label>स्पष्टीकरण (Explanation):</label>
                <input
                  type="text"
                  placeholder="उत्तर का कारण..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedQuiz}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-md transition mt-2"
            >
              प्रश्न सेव करें
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}