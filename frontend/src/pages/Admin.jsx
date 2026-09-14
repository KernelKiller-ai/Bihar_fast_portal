import { useState, useEffect, useMemo } from "react";
import { 
  PlusCircle, KeyRound, CheckCircle, AlertCircle, Loader2, 
  FileText, Edit3, Trash2, Check, RefreshCw, ExternalLink, 
  Search, Eye, Clock, ShieldCheck, X, Sparkles, Inbox, Ban
} from "lucide-react";

// Production Backend URL (Fallback handled)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

export default function Admin() {
  const [authPin, setAuthPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Navigation: 'inbox' | 'all' | 'pending' | 'new'
  const [activeTab, setActiveTab] = useState("inbox");
  
  // Data States
  const [posts, setPosts] = useState([]);
  const [inboxItems, setInboxItems] = useState([]);
  const [quotaStats, setQuotaStats] = useState({ used: 0, remaining: 10, limit: 10 });
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Manual Creation Form
  const [formData, setFormData] = useState({
    title: "",
    department: "UPSC (All India)",
    category: "jobs",
    total_posts: "",
    last_date: "",
    eligibility: "",
    apply_url: "",
    pdf_url: "",
    fees: "Gen/OBC: ₹0 | SC/ST: ₹0",
    short_desc: "",
  });

  const loadDashboardData = async () => {
    setLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      await Promise.all([
        fetchPosts(),
        fetchInbox(),
        fetchQuota()
      ]);
    } catch (err) {
      console.error("Dashboard initial load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuota = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/quota-stats`);
      if (res.ok) {
        const data = await res.json();
        setQuotaStats(data);
      }
    } catch (err) {
      console.warn("Quota fetch error:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts`);
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

  const fetchInbox = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inbox?status=unprocessed`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const json = await res.json();
      setInboxItems(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Inbox fetch error:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (authPin.trim() === "biharfast2026") {
      setIsAuthenticated(true);
      setFeedback({ type: "", message: "" });
      loadDashboardData();
    } else {
      setFeedback({ type: "error", message: "गलत पिन! कृपया सही एडमिन पासवर्ड दर्ज करें।" });
    }
  };

  // Human-Triggered AI Enrichment (Strictly <= 10/day)
  const handleEnrichAndPublish = async (inboxId) => {
    if (quotaStats.remaining <= 0) {
      alert("आज का 10 AI Posts का कोटा समाप्त हो चुका है! कल नया कोटा उपलब्ध होगा।");
      return;
    }

    setActionLoading(`ai_${inboxId}`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inbox/${inboxId}/enrich-and-publish`, {
        method: "POST"
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "AI processing failed");
      }

      setInboxItems(prev => prev.filter(i => i.id !== inboxId));
      if (data.quota) setQuotaStats(data.quota);
      
      setFeedback({ 
        type: "success", 
        message: `सफलता! नोटिस Gemini AI द्वारा तैयार करके पोर्टल पर लाइव पब्लिश कर दिया गया! (Slug: ${data.slug})` 
      });

      fetchPosts();
    } catch (err) {
      setFeedback({ type: "error", message: `AI Enrichment Failed: ${err.message}` });
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Raw Notice from Inbox (0 Tokens spent)
  const handleRejectInboxItem = async (inboxId) => {
    if (!window.confirm("क्या आप इस नोटिस को रिजेक्ट/डिलीट करना चाहते हैं? (बिना AI उपयोग के)")) return;

    setActionLoading(`rej_${inboxId}`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inbox/${inboxId}/reject`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Reject request failed");

      setInboxItems(prev => prev.filter(i => i.id !== inboxId));
      setFeedback({ type: "success", message: "नोटिस को रिजेक्ट कर दिया गया (Zero AI Tokens)." });
    } catch (err) {
      setFeedback({ type: "error", message: `Reject error: ${err.message}` });
    } finally {
      setActionLoading(null);
    }
  };

  // Status Toggle for Existing Notice (Approve / Draft)
  const handleStatusChange = async (postId, newStatus) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${postId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Edit Existing Notice
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
        headers: { "Content-Type": "application/json" },
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

  // Manual New Post Submit
  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sync-secret": authPin,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setFeedback({ type: "success", message: "मैन्युअल पोस्ट लाइव पब्लिश हो गई!" });
      setFormData({
        title: "",
        department: "UPSC (All India)",
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
      setFeedback({ type: "error", message: `Manual publish error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Filtered Live Posts
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.filter(post => {
      const q = searchQuery.toLowerCase().trim();
      const match = !q || 
        (post.title && post.title.toLowerCase().includes(q)) ||
        (post.department && post.department.toLowerCase().includes(q));

      if (activeTab === "pending") return match && post.status === "pending_approval";
      if (activeTab === "all") return match;
      return true;
    });
  }, [posts, searchQuery, activeTab]);

  // Filtered Inbox Items
  const filteredInbox = useMemo(() => {
    if (!Array.isArray(inboxItems)) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return inboxItems;
    return inboxItems.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.department && item.department.toLowerCase().includes(q))
    );
  }, [inboxItems, searchQuery]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0B4F8A] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <KeyRound size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">BiharFast Control Room</h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">All-India Scraper Inbox & AI Publisher</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin PIN"
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
        
        {/* Top Header & Quota Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="text-[#0B4F8A]" size={28} /> All-India Sovereign Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Human-in-the-Loop Content Gate • Zero Token Waste Architecture
            </p>
          </div>

          {/* Daily AI Quota Counter Card */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 min-w-60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" /> Daily AI Quota
              </span>
              <span className={`font-black px-2 py-0.5 rounded-full text-[10px] ${
                quotaStats.remaining > 0 ? "bg-amber-200 text-amber-900" : "bg-rose-200 text-rose-900"
              }`}>
                {quotaStats.used} / {quotaStats.limit} used
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden mt-1.5">
              <div 
                className={`h-full transition-all duration-300 ${quotaStats.remaining > 0 ? "bg-amber-500" : "bg-rose-500"}`}
                style={{ width: `${(quotaStats.used / quotaStats.limit) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-amber-800/80 mt-1 font-semibold text-right">
              {quotaStats.remaining} generation{quotaStats.remaining === 1 ? "" : "s"} left today
            </p>
          </div>
        </div>

        {/* Action Tabs Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap gap-2 items-center">
            {/* 1. Raw Scraped Inbox */}
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "inbox" 
                  ? "bg-[#0B4F8A] text-white shadow-xs" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Inbox size={15} /> 
              Scraped Inbox ({inboxItems.length})
              {inboxItems.length > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black ml-1">
                  NEW
                </span>
              )}
            </button>

            {/* 2. Live Posts */}
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "all" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Live Posts ({posts.length})
            </button>

            {/* 3. Manual New Post */}
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "new" ? "bg-emerald-700 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <PlusCircle size={15} /> New Post
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

        {/* ==================== TAB 1: SCRAPED INBOX (HUMAN DECISION GATE) ==================== */}
        {activeTab === "inbox" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Inbox className="text-[#0B4F8A]" size={17} /> Raw Scraped Feed (Zero AI Tokens Spent)
                </h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Ye notices official websites se naye aaye hain. Decide karein kise Gemini se enrich karna hai.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter inbox..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-[#0B4F8A]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-black tracking-wider text-slate-500 uppercase border-b border-slate-200">
                    <th className="p-4">Raw Notice Title & Board</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Source Links</th>
                    <th className="p-4 text-right">Action (Decide)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400 font-bold">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin text-[#0B4F8A]" size={18} />
                          Inbox लोड हो रहा है...
                        </div>
                      </td>
                    </tr>
                  ) : filteredInbox.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-slate-400 font-bold">
                        Inbox खाली है! Scraper के अगले चक्र की प्रतीक्षा करें।
                      </td>
                    </tr>
                  ) : (
                    filteredInbox.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 max-w-md">
                          <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="bg-blue-50 text-[#0B4F8A] text-[10px] font-black px-2 py-0.5 rounded">
                              {item.department}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.created_at).toLocaleDateString("hi-IN")}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="capitalize font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                            {item.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {item.pdf_url && (
                              <a
                                href={item.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-bold underline flex items-center gap-1"
                              >
                                PDF <ExternalLink size={11} />
                              </a>
                            )}
                            {item.apply_url && (
                              <a
                                href={item.apply_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-[11px] font-bold underline flex items-center gap-1"
                              >
                                Portal <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reject / Ignore Button */}
                            <button
                              onClick={() => handleRejectInboxItem(item.id)}
                              disabled={actionLoading === `rej_${item.id}`}
                              className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Reject & Ignore Notice (0 Tokens)"
                            >
                              <Ban size={13} />
                              Reject
                            </button>

                            {/* Human Triggered AI Enrich & Publish Button */}
                            <button
                              onClick={() => handleEnrichAndPublish(item.id)}
                              disabled={actionLoading === `ai_${item.id}` || quotaStats.remaining <= 0}
                              className="px-3 py-1.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                              title="Enrich with Gemini AI & Publish Live"
                            >
                              {actionLoading === `ai_${item.id}` ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Sparkles size={13} />
                              )}
                              AI Enrich & Publish
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

        {/* ==================== TAB 2: LIVE NOTICES TABLE ==================== */}
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
                Showing {filteredPosts.length} live posts
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

        {/* ==================== TAB 3: MANUAL NEW POST CREATOR ==================== */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6">
              Create Direct Manual Notification (All India / State)
            </h2>
            <form onSubmit={handleNewSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">Notice / Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SSC CGL Recruitment 2026: Apply Online for 14,000+ Posts"
                  required
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
                  <optgroup label="Central & All-India">
                    <option value="UPSC (All India)">UPSC (Civil Services & Defence)</option>
                    <option value="SSC (All India)">SSC (CGL, CHSL, GD, MTS)</option>
                    <option value="Railway RRB (Central)">Railway RRB Central</option>
                    <option value="IBPS Banking">IBPS (Bank PO & Clerk)</option>
                    <option value="India Post (GDS)">India Post (Dak Sevak)</option>
                  </optgroup>
                  <optgroup label="Bihar Government">
                    <option value="BPSC">BPSC</option>
                    <option value="CSBC Bihar">CSBC (Police Constable)</option>
                    <option value="BPSSC (Bihar Police SI)">BPSSC (Bihar Daroga)</option>
                    <option value="BSSC Bihar">BSSC Staff Selection</option>
                    <option value="BTSC Bihar">BTSC Technical Service</option>
                  </optgroup>
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
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Total Posts</label>
                <input
                  type="text"
                  value={formData.total_posts}
                  onChange={(e) => setFormData({ ...formData, total_posts: e.target.value })}
                  placeholder="e.g. 14,500 पद"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Last Date *</label>
                <input
                  type="text"
                  value={formData.last_date}
                  onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
                  placeholder="e.g. 25 नवम्बर 2026"
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="e.g. 10th / 12th / Graduate in Any Stream"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Official Apply Link</label>
                <input
                  type="url"
                  value={formData.apply_url}
                  onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                  placeholder="https://ssc.gov.in"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Official PDF Link</label>
                <input
                  type="url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://ssc.gov.in/notice.pdf"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows="3"
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  placeholder="Notification overview..."
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
                  {loading ? "पब्लिश हो रहा है..." : "सीधे पोर्टल पर लाइव पब्लिश करें"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== EDIT MODAL ==================== */}
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
                  <label className="block text-xs font-black text-slate-700 mb-1">Short Description</label>
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