import { useState, useMemo } from "react";
import { 
  PlusCircle, KeyRound, CheckCircle, AlertCircle, Loader2, 
  FileText, Edit3, Check, RefreshCw,
  Search, Eye, Clock, ShieldCheck, X, Trophy, Layers, Trash2
} from "lucide-react";
import AdminQuizManager from "../components/AdminQuizManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

export default function Admin() {
  const [authPin, setAuthPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Navigation Tabs: 'all' | 'new' | 'quiz'
  const [activeTab, setActiveTab] = useState("all");
  
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Manual Creation Form with 800+ Word Content & SEO Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    department: "BPSC",
    category: "jobs",
    total_posts: "",
    last_date: "",
    eligibility: "",
    apply_url: "",
    pdf_url: "",
    short_desc: "",
    meta_title: "",
    meta_desc: "",
    content: "",
    faqs: [
      { q: "", a: "" },
      { q: "", a: "" }
    ],
    how_to_apply: [""],
    selection_process: [""]
  });

  const authHeaders = (token = authPin, includeJson = false) => ({
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  });

  const loadDashboardData = async (token = authPin) => {
    setLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      await fetchPosts(token);
    } catch (err) {
      console.error("Dashboard initial load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (token = authPin) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const json = await res.json();

      let list = [];
      if (Array.isArray(json)) list = json;
      else if (Array.isArray(json?.data)) list = json.data;
      else if (typeof json?.data === "string") {
        try { list = JSON.parse(json.data); } catch { list = []; }
      }
      setPosts(list);
    } catch (err) {
      console.error("Admin fetch posts error:", err);
      setFeedback({ type: "error", message: `Live posts load error: ${err.message}` });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = authPin.trim();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error(res.status === 401 ? "गलत Admin Token! कृपया सही Token डालें।" : `HTTP ${res.status}`);
      setIsAuthenticated(true);
      setFeedback({ type: "", message: "" });
      await loadDashboardData(token);
    } catch (err) {
      setIsAuthenticated(false);
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${postId}/status`, {
        method: "POST",
        headers: authHeaders(authPin, true),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: newStatus } : p));
      setFeedback({ type: "success", message: `स्टेटस '${newStatus}' में बदल दिया गया!` });
    } catch (err) {
      setFeedback({ type: "error", message: `Update error: ${err.message}` });
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (post) => {
    setEditingPost({ ...post });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading("modal_save");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${editingPost.id}`, {
        method: "PUT",
        headers: authHeaders(authPin, true),
        body: JSON.stringify(editingPost),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const updated = json?.data || editingPost;

      setPosts(prev => prev.map(p => p.id === editingPost.id ? updated : p));
      setIsEditModalOpen(false);
      setFeedback({ type: "success", message: "पोस्ट सफलता से अपडेट हो गई!" });
    } catch (err) {
      setFeedback({ type: "error", message: `Edit save error: ${err.message}` });
    } finally {
      setActionLoading(null);
    }
  };

  // Helper for dynamic form arrays
  const handleFaqChange = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const addFaqField = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { q: "", a: "" }] });
  };

  const removeFaqField = (index) => {
    setFormData({ ...formData, faqs: formData.faqs.filter((_, i) => i !== index) });
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    // Clean empty FAQs and steps
    const cleanedPayload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      meta_title: formData.meta_title || formData.title,
      meta_desc: formData.meta_desc || formData.short_desc,
      faqs: formData.faqs.filter(f => f.q.trim() && f.a.trim()),
      how_to_apply: formData.how_to_apply.filter(s => s.trim()),
      selection_process: formData.selection_process.filter(s => s.trim())
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts`, {
        method: "POST",
        headers: authHeaders(authPin, true),
        body: JSON.stringify(cleanedPayload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);

      setFeedback({ type: "success", message: "नया हाई-वैल्यू आर्टिकल सीधे पोर्टल पर लाइव हो गया!" });
      setFormData({
        title: "",
        slug: "",
        department: "BPSC",
        category: "jobs",
        total_posts: "",
        last_date: "",
        eligibility: "",
        apply_url: "",
        pdf_url: "",
        short_desc: "",
        meta_title: "",
        meta_desc: "",
        content: "",
        faqs: [{ q: "", a: "" }, { q: "", a: "" }],
        how_to_apply: [""],
        selection_process: [""]
      });
      fetchPosts();
      setActiveTab("all");
    } catch (err) {
      setFeedback({ type: "error", message: `Publish error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.filter(post => {
      const q = searchQuery.toLowerCase().trim();
      return !q || 
        (post.title && post.title.toLowerCase().includes(q)) ||
        (post.department && post.department.toLowerCase().includes(q));
    });
  }, [posts, searchQuery]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0B4F8A] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <KeyRound size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">BiharFast Control Room</h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">100% Manual Publishing • Class 10th Quiz Engine</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin access token"
              value={authPin}
              onChange={(e) => setAuthPin(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold border-2 border-slate-200 rounded-xl py-3 px-4 focus:border-[#0B4F8A] focus:outline-none transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#0B4F8A] hover:bg-[#083b66] text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer text-sm tracking-wide"
            >
              Verify Admin Access
            </button>
          </form>

          {feedback.type === "error" && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="text-[#0B4F8A]" size={28} /> BiharFast Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manual High-Value Authoring • AdSense Ready Architecture
            </p>
          </div>
        </div>

        {/* Action Tabs Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "all" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Layers size={15} /> Live Posts ({posts.length})
            </button>

            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "new" ? "bg-emerald-700 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <PlusCircle size={15} /> New In-Depth Post
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "quiz" 
                  ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-md scale-[1.02]" 
                  : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              <Trophy size={15} className={activeTab === "quiz" ? "text-yellow-200" : "text-amber-600"} /> 
              🎯 10th Quiz Hub
            </button>
          </div>

          <button
            onClick={loadDashboardData}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback.message && (
          <div
            className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {feedback.message}
            </div>
            <button onClick={() => setFeedback({ type: "", message: "" })} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* TAB: 10TH QUIZ MANAGER */}
        {activeTab === "quiz" && (
          <AdminQuizManager 
            adminToken={authPin} 
            apiBaseUrl={API_BASE_URL} 
          />
        )}

        {/* TAB: LIVE POSTS */}
        {activeTab === "all" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Live posts me se search karein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:border-[#0B4F8A] focus:outline-none"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total: {filteredPosts.length} posts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-black tracking-wider text-slate-500 uppercase border-b border-slate-200">
                    <th className="p-4">Notice & Dept</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Last Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 font-bold">
                        कोई पोस्ट नहीं मिली
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id || post.slug} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 max-w-sm">
                          <div className="font-bold text-slate-900 line-clamp-2">{post.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-50 text-[#0B4F8A] text-[10px] font-black px-2 py-0.5 rounded">
                              {post.department}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {post.total_posts || "पदों की संख्या देखें"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="capitalize font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                            {post.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                              post.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-300"
                            }`}
                          >
                            {post.status === "published" && <Check size={12} />}
                            {post.status || "published"}
                          </span>
                        </td>

                        <td className="p-4 text-slate-500 font-semibold">{post.last_date || "—"}</td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(post)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit3 size={15} />
                            </button>

                            <a
                              href={`/post/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                              title="View Public Page"
                            >
                              <Eye size={15} />
                            </a>

                            <button
                              onClick={() => handleStatusChange(post.id, post.status === "published" ? "draft" : "published")}
                              disabled={actionLoading === post.id}
                              className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg border border-slate-200 transition cursor-pointer"
                              title="Toggle Publish / Draft"
                            >
                              <Clock size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: MANUAL NEW POST CREATOR */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6">
              Create In-Depth High-Value Article (800+ Words Guide)
            </h2>
            <form onSubmit={handleNewSubmit} className="space-y-6">
              
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 mb-1">Notice / Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. BPSC 70th Combined Competitive Exam 2026: Notification, Syllabus & Apply"
                    required
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Slug (URL Keyword) *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. bpsc-70th-cce-notification-2026"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Board / Commission *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  >
                    <option value="BPSC">BPSC Bihar</option>
                    <option value="CSBC Bihar">CSBC Police</option>
                    <option value="BPSSC (Bihar Police SI)">BPSSC Daroga</option>
                    <option value="BSSC Bihar">BSSC Staff Selection</option>
                    <option value="BTSC Bihar">BTSC Technical</option>
                    <option value="SSC (All India)">SSC Central</option>
                    <option value="Railway RRB (Central)">Railway RRB</option>
                    <option value="UPSC (All India)">UPSC All India</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  >
                    <option value="jobs">Government Jobs</option>
                    <option value="admit_card">Admit Card</option>
                    <option value="results">Exam Results</option>
                    <option value="schemes">Government Schemes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Total Posts</label>
                  <input
                    type="text"
                    value={formData.total_posts}
                    onChange={(e) => setFormData({ ...formData, total_posts: e.target.value })}
                    placeholder="e.g. 1,957 पद"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Last Date *</label>
                  <input
                    type="text"
                    value={formData.last_date}
                    onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
                    placeholder="e.g. 30 अक्टूबर 2026"
                    required
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Apply URL</label>
                  <input
                    type="url"
                    value={formData.apply_url}
                    onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                    placeholder="https://bpsc.bih.nic.in"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">PDF Notification Link</label>
                  <input
                    type="url"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                    placeholder="https://bpsc.bih.nic.in/doc.pdf"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>
              </div>

              {/* SEO Meta Tags Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SEO Metadata (Google Search)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="Title for Google Snippet (60 chars)"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={formData.meta_desc}
                      onChange={(e) => setFormData({ ...formData, meta_desc: e.target.value })}
                      placeholder="Short summary for Google (160 chars)"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                </div>
              </div>

              {/* Full Detailed Content (Core 800+ Words) */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  Full Article Content (HTML / Formatted Text) *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Yahan poora 800–1000 words ka comprehensive guide daalein (Heading tags, Paragraphs, Exam Pattern, Cut-off rules).
                </p>
                <textarea
                  rows="14"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="<h2>भर्ती परीक्षा का संपूर्ण विवरण</h2><p>बिहार लोक सेवा आयोग ने...</p>"
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-mono focus:outline-[#0B4F8A]"
                />
              </div>

              {/* Dynamic FAQs Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Frequently Asked Questions (FAQs)
                  </h3>
                  <button
                    type="button"
                    onClick={addFaqField}
                    className="text-xs text-[#0B4F8A] font-bold hover:underline cursor-pointer"
                  >
                    + Add Another Question
                  </button>
                </div>

                {formData.faqs.map((faq, index) => (
                  <div key={index} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder={`Question ${index + 1}`}
                        value={faq.q}
                        onChange={(e) => handleFaqChange(index, "q", e.target.value)}
                        className="w-full border border-slate-200 rounded-md p-2 text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder={`Answer ${index + 1}`}
                        value={faq.a}
                        onChange={(e) => handleFaqChange(index, "a", e.target.value)}
                        className="w-full border border-slate-200 rounded-md p-2 text-xs"
                      />
                    </div>
                    {formData.faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFaqField(index)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B4F8A] hover:bg-[#083b66] text-white font-black py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                  {loading ? "पब्लिश हो रहा है..." : "सीधे पोर्टल पर लाइव पब्लish करें (Clean Index)"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditModalOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-[#0B4F8A]" /> Edit Notification Details
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Post Title</label>
                  <input
                    type="text"
                    value={editingPost.title || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={editingPost.department || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, department: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Category</label>
                    <select
                      value={editingPost.category || "jobs"}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    >
                      <option value="jobs">jobs</option>
                      <option value="admit_card">admit_card</option>
                      <option value="results">results</option>
                      <option value="schemes">schemes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Detailed Content</label>
                  <textarea
                    rows="8"
                    value={editingPost.content || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:outline-[#0B4F8A]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === "modal_save"}
                    className="px-5 py-2 bg-[#0B4F8A] hover:bg-[#083b66] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {actionLoading === "modal_save" && <Loader2 size={14} className="animate-spin" />}
                    बदलाव सुरक्षित करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}