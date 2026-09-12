import { useState } from "react";
import { PlusCircle, KeyRound, CheckCircle, AlertCircle, Loader2, Briefcase, FileText } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

export default function Admin() {
  const [authPin, setAuthPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    title: "",
    department: "BPSC",
    category: "jobs",
    total_posts: "",
    last_date: "",
    eligibility: "",
    apply_url: "",
    pdf_url: "",
    fees: "Gen/OBC: ₹0 | SC/ST: ₹0",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple secret PIN (Ise aap apne hisab se badal sakte hain)
    if (authPin === "biharfast2026") {
      setIsAuthenticated(true);
      setFeedback({ type: "", message: "" });
    } else {
      setFeedback({ type: "error", message: "गलत पिन! कृपया सही सीक्रेट कोड दर्ज करें।" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": authPin,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setFeedback({ type: "success", message: "सूचना सफलतापूर्वक पोर्टल पर प्रकाशित हो गई!" });
      setFormData({
        title: "",
        department: "BPSC",
        category: "jobs",
        total_posts: "",
        last_date: "",
        eligibility: "",
        apply_url: "",
        pdf_url: "",
        fees: "Gen/OBC: ₹0 | SC/ST: ₹0",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: "पोस्ट पब्लिश नहीं हो सकी। कृपया सुनिश्चित करें कि बैकएंड API चालू है: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <KeyRound size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">BiharFast Admin Gate</h2>
            <p className="text-xs text-slate-500 mt-1">नया नोटिस या जॉब पब्लिश करने के लिए एडमिन पिन दर्ज करें।</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin PIN दर्ज करें"
              value={authPin}
              onChange={(e) => setAuthPin(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold border-2 border-slate-200 rounded-xl py-3 px-4 focus:border-blue-600 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#0B4F8A] hover:bg-[#083b66] text-white font-bold py-3 rounded-xl transition shadow-md cursor-pointer text-sm"
            >
              डैशबोर्ड खोलें
            </button>
          </form>

          {feedback.type === "error" && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <PlusCircle className="text-emerald-600" /> New Notice Publisher
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ से सबमिट की गई पोस्ट तुरंत होमपेज और रिस्पेक्टिव लेआउट पर लाइव हो जाएगी।
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
            Authorized Mode
          </span>
        </div>

        {feedback.message && (
          <div
            className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-700 mb-1">Notice / Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. BPSC TRE 4.0 Teacher Recruitment 2026: Apply Online"
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Department / Board *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            >
              <option value="BPSC">BPSC (Public Service)</option>
              <option value="CSBC">CSBC (Police Constable)</option>
              <option value="BPSSC">BPSSC (Daroga / SI)</option>
              <option value="BSSC">BSSC (Staff Selection)</option>
              <option value="BTSC">BTSC (Technical Service)</option>
              <option value="BCECEB">BCECEB (Entrance & Special)</option>
              <option value="RTPS Bihar">RTPS (Certificates & Services)</option>
              <option value="Bihar Bhumi">Revenue & Land Reforms</option>
              <option value="Udyog Vibhag">Industries Dept (Udyami)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Category (Tab Mapping) *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            >
              <option value="jobs">Government Jobs</option>
              <option value="admit_card">Admit Card</option>
              <option value="results">Exam Results</option>
              <option value="services">RTPS & Bhumi Services</option>
              <option value="schemes">Welfare Schemes (Yojana)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Total Vacancies / Benefit</label>
            <input
              type="text"
              name="total_posts"
              value={formData.total_posts}
              onChange={handleChange}
              placeholder="e.g. 2,450 पद / ₹10 लाख लोन"
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Last Date / Deadline *</label>
            <input
              type="text"
              name="last_date"
              value={formData.last_date}
              onChange={handleChange}
              placeholder="e.g. 30 अक्टूबर 2026"
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-700 mb-1">Eligibility Criteria</label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="e.g. 10th / 12th Pass or Graduate in Any Stream"
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Official Apply Link</label>
            <input
              type="url"
              name="apply_url"
              value={formData.apply_url}
              onChange={handleChange}
              placeholder="https://onlinebpsc.bihar.gov.in"
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Official PDF / Notice Link</label>
            <input
              type="url"
              name="pdf_url"
              value={formData.pdf_url}
              onChange={handleChange}
              placeholder="https://bpsc.bih.nic.in/advt.pdf"
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-blue-600"
            />
          </div>

          <div className="sm:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B4F8A] hover:bg-[#073963] text-white font-black py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
              {loading ? "पोस्ट पब्लिश हो रही है..." : "पोर्टल पर लाइव पब्लिश करें"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}