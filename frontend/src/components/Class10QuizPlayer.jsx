import { useCallback, useEffect, useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bihar-fast-portal.onrender.com';
const EMPTY_STATE = { isLive: false, timing: null, quiz: null, questions: [] };

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function isValidScoreResponse(data) {
  return Boolean(
    data && Number.isInteger(data.total_questions) && Number.isInteger(data.attempted)
      && Number.isInteger(data.correct_count) && Number.isInteger(data.wrong_count)
      && Number.isInteger(data.score) && typeof data.accuracy_percentage === 'number'
      && Array.isArray(data.results)
      && data.results.every((item) => item && typeof item.id === 'string')
  );
}

export default function Class10QuizPlayer() {
  const [quizState, setQuizState] = useState(EMPTY_STATE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const answersRef = useRef({});
  const submittingRef = useRef(false);

  useEffect(() => {
    answersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  const loadLiveTest = async () => {
    setLoading(true);
    setErrorMessage('');
    setScoreResult(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/today`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Quiz load failed (${response.status})`);

      if (data.is_live && data.quiz && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuizState({ isLive: true, timing: data.timing_status || null, quiz: data.quiz, questions: data.questions });
        setTimeLeft(Math.max(1, Number(data.quiz.duration_minutes || 15) * 60));
      } else {
        setQuizState({ isLive: false, timing: data.timing_status || null, quiz: null, questions: [] });
      }
    } catch (error) {
      console.error('Quiz load error:', error);
      setQuizState(EMPTY_STATE);
      setErrorMessage(error.message || 'Quiz load failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (submittingRef.current || !quizState.quiz) return;
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizState.quiz.id, answers: answersRef.current }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Submission failed (${response.status})`);
      if (!isValidScoreResponse(data)) throw new Error('Invalid score response from server');
      setScoreResult(data);
    } catch (error) {
      console.error('Quiz submission error:', error);
      setErrorMessage(error.message || 'सबमिशन त्रुटि! पुनः प्रयास करें।');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [quizState.quiz]);

  useEffect(() => {
    if (!quizState.isLive || scoreResult) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [handleSubmitQuiz, quizState.isLive, scoreResult]);

  useEffect(() => {
    // Initial server hydration is intentionally stateful.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLiveTest();
  }, []);

  const selectAnswer = (option) => {
    const question = quizState.questions[currentIndex];
    if (!question || scoreResult) return;
    setSelectedAnswers((previous) => ({ ...previous, [question.id]: option }));
  };

  if (loading) {
    return <div className="flex min-h-[460px] flex-col items-center justify-center rounded-3xl border bg-white p-8 shadow-sm"><div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" /><p className="text-sm font-bold text-slate-700">परीक्षा सर्वर से कनेक्ट हो रहा है...</p></div>;
  }

  if (errorMessage && !quizState.isLive && !scoreResult) {
    return <div className="mx-auto my-8 max-w-2xl rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl"><p className="mb-5 font-bold text-rose-700">{errorMessage}</p><button onClick={loadLiveTest} className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white">पुनः प्रयास करें</button></div>;
  }

  if (scoreResult) {
    return (
      <div className="mx-auto my-6 max-w-3xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl md:p-8">
        <div className="border-b border-slate-100 pb-6 text-center"><span className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">परीक्षा सफलतापूर्वक संपन्न</span><h2 className="text-2xl font-black text-slate-900">{quizState.quiz?.title}</h2><div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-3"><Metric label="प्राप्तांक" value={`${scoreResult.score}/${scoreResult.total_questions}`} tone="indigo" /><Metric label="सही उत्तर" value={scoreResult.correct_count} tone="emerald" /><Metric label="गलत उत्तर" value={scoreResult.wrong_count} tone="rose" /></div><p className="mt-4 text-sm font-bold text-slate-700">सटीकता: {scoreResult.accuracy_percentage}%</p></div>
        <div className="mt-6 space-y-4">{scoreResult.results.map((item, index) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"><p className="font-bold text-slate-900">#{index + 1} {item.question_text}</p><p className="mt-2 text-sm text-slate-600">आपका उत्तर: {item.user_choice || 'अचिह्नित'}</p><p className="text-sm font-bold text-emerald-700">सही उत्तर: {item.correct_option}</p>{item.explanation && <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.explanation}</p>}</div>)}</div>
        <button onClick={loadLiveTest} className="mt-6 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white">पुनः अभ्यास करें</button>
      </div>
    );
  }

  if (!quizState.isLive) {
    return <div className="mx-auto my-8 max-w-2xl rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl"><span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">सत्र वर्तमान में बंद है</span><h2 className="text-2xl font-black text-slate-900">BSEB Matric Daily Test Series</h2><p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{quizState.timing?.message || 'वर्तमान स्लॉट समाप्त हो गया है।'}</p><button onClick={loadLiveTest} className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white">स्थिति पुनः जाँचें</button></div>;
  }

  const currentQuestion = quizState.questions[currentIndex];
  const attemptedCount = Object.keys(selectedAnswers).length;
  return (
    <div className="mx-auto my-6 max-w-3xl rounded-3xl border border-slate-100 bg-white p-4 shadow-xl md:p-6">
      {errorMessage && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{errorMessage}</div>}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{quizState.timing?.slot_name}</span><h1 className="mt-2 line-clamp-1 text-lg font-black text-slate-900">{quizState.quiz?.title}</h1></div><div className={`rounded-2xl border px-3 py-2 font-mono text-lg font-black ${timeLeft <= 180 ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-800 bg-slate-900 text-white'}`}>{formatTimer(timeLeft)}</div></div>
      <div className="mb-5 flex items-center justify-between text-xs font-bold text-slate-500"><span>प्रगति: {attemptedCount} / {quizState.questions.length}</span><span>{Math.round((attemptedCount / quizState.questions.length) * 100)}%</span></div>
      {currentQuestion && <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50/70 p-5"><p className="mb-3 text-xs font-black uppercase text-slate-400">प्रश्न {currentIndex + 1} / {quizState.questions.length}</p><h2 className="mb-6 text-base font-bold leading-relaxed text-slate-900">{currentQuestion.question_text}</h2><div className="space-y-3">{['A', 'B', 'C', 'D'].map((option) => { const isSelected = selectedAnswers[currentQuestion.id] === option; return <button key={option} onClick={() => selectAnswer(option)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-950' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{option}</span><span>{currentQuestion[`option_${option.toLowerCase()}`]}</span></button>; })}</div></div>}
      <div className="flex items-center justify-between gap-3"><button disabled={currentIndex === 0} onClick={() => setCurrentIndex((previous) => previous - 1)} className="rounded-xl border px-5 py-3 text-sm font-bold disabled:opacity-30">← पिछला</button><div className="flex gap-2">{currentIndex < quizState.questions.length - 1 && <button onClick={() => setCurrentIndex((previous) => previous + 1)} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">अगला →</button>}<button disabled={submitting} onClick={handleSubmitQuiz} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'जाँच जारी...' : 'सबमिट करें'}</button></div></div>
    </div>
  );
}

function Metric({ label, value, tone }) {
  const toneClasses = { indigo: 'bg-indigo-50 text-indigo-700', emerald: 'bg-emerald-50 text-emerald-700', rose: 'bg-rose-50 text-rose-700' };
  return <div className={`rounded-2xl p-3 ${toneClasses[tone]}`}><p className="text-xs font-bold">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}
