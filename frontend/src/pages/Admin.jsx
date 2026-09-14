import { useState, useEffect, useMemo } from "react";
import { 
  PlusCircle, KeyRound, CheckCircle, AlertCircle, Loader2, 
  FileText, Edit3, Trash2, Check, RefreshCw, ExternalLink, 
  Search, Eye, Clock, ShieldCheck, X
} from "lucide-react";

// Strictly Production Backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

export default function Admin() {
  const [authPin, setAuthPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'new'
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Edit Modal State
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New Notice Form State
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
    short_desc: "",
  });

  const fetchPosts = async () => {
    setLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      
      const json = await res.json();
      
      // Robust unpacking for production array formats
      let list = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (Array.isArray(json?.data)) {
        list = json.data;
      } else if (typeof json?.data === "string") {
        try {
          const parsed = JSON.parse(json.data);
          list = Array.isArray(parsed) ? parsed : [];
        } catch {
          list = [];
        }
      }
      
      setPosts(list);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setFeedback({ 
        type: "error", 
        message: `डेटा लोड करने में विफल: ${err.message}. कृपया सुनिश्चित करें कि Render सर्वर एक्टिव है!` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (authPin.trim() === "biharfast2026") {
      setIsAuthenticated(true);
      setFeedback({ type: "", message: "" });
      fetchPosts();
    } else {
      setFeedback({ type: "error", message: "गलत पिन! कृपया सही एडमिन पासवर्ड दर्ज करें।" });
    }
  };

  // Quick Action: Status Change (Approve / Draft)
  const handleStatusChange = async (postId, newStatus) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${postId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Status update failed (HTTP ${res.status})`);
      
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: newStatus } : p));
      setFeedback({ type: "success", message: `पोस्ट स्टेटस बदलकर '${newStatus}' कर दिया गया!` });
    } catch (err) {
      setFeedback({ type: "error", message: "स्टेटस अपडेट नहीं हो सका: " + err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Quick Action: Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("क्या आप वाकई इस पोस्ट को हमेशा के लिए हटाना चाहते हैं?")) return;
    
    setActionLoading(postId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${postId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setPosts(prev => prev.filter(p => p.id !== postId));
      setFeedback({ type: "success", message: "पोस्ट हटा दी गई!" });
    } catch (err) {
      setFeedback({ type: "error", message: "डिलीट नहीं हो सका: " + err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (post) => {
    setEditingPost({ ...post });
    setIsEditModalOpen(true);
  };

  // Save Post Edits
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading("modal_save");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPost),
      });
      if (!res.ok) throw new Error(`Edit failed (HTTP ${res.status})`);
      
      const json = await res.json();
      const updatedItem = json?.data || editingPost;
      
      setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedItem : p));
      setIsEditModalOpen(false);
      setFeedback({ type: "success", message: "पोस्ट सफलतापूर्वक अपडेट हो गई!" });
    } catch (err) {
      setFeedback({ type: "error", message: "अपडेट सेव नहीं हो सका: " + err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Manual New Post Submit
  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sync-secret": authPin,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      setFeedback({ type: "success", message: "नई सूचना सफलतापूर्वक पब्लिश हो गई!" });
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
        short_desc: "",
      });
      fetchPosts();
      setActiveTab("all");
    } catch (err) {
      setFeedback({
        type: "error",
        message: "पोस्ट पब्लिश नहीं हो सकी: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe Array Filtering
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.filter(post => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (post.title && post.title.toLowerCase().includes(q)) ||
        (post.department && post.department.toLowerCase().includes(q));
      
      if (activeTab === "pending") return matchesSearch && post.status === "pending_approval";
      if (activeTab === "all") return matchesSearch;
      return true;
    });
  }, [posts, searchQuery, activeTab]);

  const pendingCount = useMemo(() => {
    if (!Array.isArray(posts)) return 0;
    return posts.filter(p => p.status === "pending_approval").length;
  }, [posts]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0B4F8A] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <KeyRound size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">BiharFast Control Room</h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">एडमिन ऑथेंटिकेशन और लाइव पोस्ट मैनेजमेंट</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Secret Key"
              value={authPin}
              onChange={(e) => setAuthPin(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold border-2 border-slate-200 rounded-xl py-3 px-4 focus:border-[#0B4F8A] focus:outline-none transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#0B4F8A] hover:bg-[#083b66] text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer text-sm tracking-wide"
            >
              डैशबोर्ड अनलॉक करें
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
              <ShieldCheck className="text-[#0B4F8A]" size={28} /> BiharFast Sovereign Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Connected to Production Engine • Human-in-the-Loop Management
            </p>
          </div>
          
          {/* Action Tabs */}
          <div className="flex flex-wrap gap-2 items-center bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "pending" ? "bg-white text-amber-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock size={14} className="text-amber-500" /> 
              Pending Approvals 
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "new" ? "bg-[#0B4F8A] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PlusCircle size={14} /> New Post
            </button>
            <button
              onClick={fetchPosts}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Global Feedback Alert */}
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
            <button onClick={() => setFeedback({ type: "", message: "" })} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        )}

        {/* VIEW 1 & 2: POSTS LIST / PENDING QUEUE */}
        {activeTab !== "new" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Title ya Department se search karein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:border-[#0B4F8A] focus:outline-none"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredPosts.length} entries
              </span>
            </div>

            {/* Table */}
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
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-400 font-bold">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin text-[#0B4F8A]" size={18} />
                          डेटा लोड हो रहा है...
                        </div>
                      </td>
                    </tr>
                  ) : filteredPosts.length === 0 ? (
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
                              {post.total_posts || "अधिसूचना देखें"}
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
                                : post.status === "pending_approval"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
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
                            {post.status === "pending_approval" && (
                              <button
                                onClick={() => handleStatusChange(post.id, "published")}
                                disabled={actionLoading === post.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Approve & Publish Live"
                              >
                                <Check size={13} /> Approve
                              </button>
                            )}

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

                            {post.status === "published" ? (
                              <button
                                onClick={() => handleStatusChange(post.id, "draft")}
                                disabled={actionLoading === post.id}
                                className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg border border-slate-200 transition cursor-pointer"
                                title="Unpublish to Draft"
                              >
                                <Clock size={15} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                disabled={actionLoading === post.id}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-slate-200 transition cursor-pointer"
                                title="Archive Post"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
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

        {/* VIEW 3: NEW POST CREATOR */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6">
              Create New Verified Notification
            </h2>
            <form onSubmit={handleNewSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">Notice / Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. BPSC Assistant Engineer 2026: Apply Online"
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Department / Board *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
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
                <label className="block text-xs font-black text-slate-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                >
                  <option value="jobs">Government Jobs</option>
                  <option value="admit_card">Admit Card</option>
                  <option value="results">Exam Results</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Total Posts</label>
                <input
                  type="text"
                  name="total_posts"
                  value={formData.total_posts}
                  onChange={(e) => setFormData({ ...formData, total_posts: e.target.value })}
                  placeholder="e.g. 1,250 पद"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Last Date *</label>
                <input
                  type="text"
                  name="last_date"
                  value={formData.last_date}
                  onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
                  placeholder="e.g. 15 अक्टूबर 2026"
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="e.g. B.Tech / Diploma in Relevant Branch"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Official Apply Link</label>
                <input
                  type="url"
                  name="apply_url"
                  value={formData.apply_url}
                  onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                  placeholder="https://bpsc.bihar.gov.in"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Official PDF Link</label>
                <input
                  type="url"
                  name="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://bpsc.bihar.gov.in/notice.pdf"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows="3"
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  placeholder="Notice brief overview..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B4F8A] hover:bg-[#083b66] text-white font-black py-3 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                  {loading ? "पोस्ट पब्लिश हो रही है..." : "पोर्टल पर सुरक्षित पब्लिश करें"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: INLINE EDIT DIALOG FOR EXISTING POSTS */}
        {isEditModalOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
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
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Total Posts</label>
                    <input
                      type="text"
                      value={editingPost.total_posts || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, total_posts: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Last Date</label>
                    <input
                      type="text"
                      value={editingPost.last_date || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, last_date: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Apply URL</label>
                    <input
                      type="text"
                      value={editingPost.apply_url || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, apply_url: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">PDF URL</label>
                    <input
                      type="text"
                      value={editingPost.pdf_url || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, pdf_url: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Eligibility</label>
                  <input
                    type="text"
                    value={editingPost.eligibility || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, eligibility: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Short Description (Overview)</label>
                  <textarea
                    rows="3"
                    value={editingPost.short_desc || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, short_desc: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
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