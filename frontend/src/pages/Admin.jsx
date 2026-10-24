import { useState, useMemo, useRef, useEffect } from "react";
import { 
  PlusCircle, CheckCircle, AlertCircle, Loader2, 
  FileText, Edit3, Check, RefreshCw,
  Search, Eye, Clock, ShieldCheck, X, Trophy, Layers, Trash2, Sparkles,
  ImagePlus, Lock, LogIn
} from "lucide-react";
import AdminQuizManager from "../components/AdminQuizManager";
import { supabase, isSupabaseConfigured } from "../api/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

const categoryFieldConfig = {
  jobs: {
    showTotalPosts: true,
    totalPostsLabel: "Total Posts / Vacancies",
    totalPostsPlaceholder: "उदा. 1,957 पद",
    lastDateLabel: "Apply Last Date",
    lastDatePlaceholder: "उदा. 30 अक्टूबर 2026",
    eligibilityLabel: "Eligibility Criteria",
    eligibilityPlaceholder: "उदा. 10th/12th/Graduate",
    applyUrlLabel: "Direct Apply Online URL",
    pdfUrlLabel: "Official Notification PDF Link",
  },
  admit_card: {
    showTotalPosts: false,
    totalPostsFallback: "जारी (Released)",
    lastDateLabel: "Exam Date / Schedule",
    lastDatePlaceholder: "उदा. 15 से 22 नवम्बर 2026",
    eligibilityLabel: "Login Requirement",
    eligibilityPlaceholder: "उदा. Application No. & DOB / Password",
    applyUrlLabel: "Direct Admit Card Download Link (Server 1)",
    pdfUrlLabel: "Exam Notice / Guidelines PDF Link",
  },
  results: {
    showTotalPosts: false,
    totalPostsFallback: "Result Declared",
    lastDateLabel: "Result Declaration Date",
    lastDatePlaceholder: "उदा. 24 अक्टूबर 2026",
    eligibilityLabel: "Credentials Required",
    eligibilityPlaceholder: "उदा. Roll Code & Roll Number",
    applyUrlLabel: "Direct Result / Scorecard Link",
    pdfUrlLabel: "Merit List / Cut-off PDF Link",
  },
  schemes: {
    showTotalPosts: true,
    totalPostsLabel: "योजना लाभ (Financial Benefit / Grant)",
    totalPostsPlaceholder: "उदा. ₹10,000 प्रोत्साहन राशि / ₹4 लाख तक लोन",
    lastDateLabel: "आवेदन की अंतिम तिथि (या सक्रिय)",
    lastDatePlaceholder: "उदा. सक्रिय योजना / 31 दिसम्बर 2026",
    eligibilityLabel: "पात्रता एवं जरूरी दस्तावेज",
    eligibilityPlaceholder: "उदा. बिहार स्थायी निवासी, 12th 1st Division, आधार, आय",
    applyUrlLabel: "आधिकारिक ऑनलाइन आवेदन लिंक",
    pdfUrlLabel: "सरकारी दिशा-निर्देश / दिशा-निर्देश PDF",
  },
  scholarship: {
    showTotalPosts: true,
    totalPostsLabel: "Scholarship Amount / Benefit",
    totalPostsPlaceholder: "उदा. ₹10,000 वार्षिक छात्रवृत्ति",
    lastDateLabel: "Application Last Date",
    lastDatePlaceholder: "उदा. 31 दिसम्बर 2026",
    eligibilityLabel: "Student Eligibility",
    eligibilityPlaceholder: "उदा. बिहार निवासी, कक्षा/आय सीमा",
    applyUrlLabel: "Official Scholarship Application URL",
    pdfUrlLabel: "Official Scholarship Guidelines PDF",
  },
  syllabus: {
    showTotalPosts: false,
    totalPostsFallback: "Syllabus Available",
    lastDateLabel: "Exam Date / Schedule",
    lastDatePlaceholder: "उदा. आधिकारिक परीक्षा कार्यक्रम देखें",
    eligibilityLabel: "Applicable Exam / Qualification",
    eligibilityPlaceholder: "उदा. BPSC प्रारंभिक परीक्षा",
    applyUrlLabel: "Official Exam / Syllabus URL",
    pdfUrlLabel: "Official Syllabus PDF Link",
  },
  answer_key: {
    showTotalPosts: false,
    totalPostsFallback: "Answer Key Released",
    lastDateLabel: "Objection Last Date / Release Date",
    lastDatePlaceholder: "उदा. आपत्ति की अंतिम तिथि 31 अक्टूबर 2026",
    eligibilityLabel: "Login Requirements",
    eligibilityPlaceholder: "उदा. Roll Number & Date of Birth",
    applyUrlLabel: "Official Answer Key / Objection URL",
    pdfUrlLabel: "Official Answer Key PDF Link",
  },
};

const standardDepartments = [
  ["BPSC", "BPSC Bihar"],
  ["CSBC Bihar", "CSBC Police"],
  ["BPSSC (Bihar Police SI)", "BPSSC Daroga"],
  ["BSSC Bihar", "BSSC Staff Selection"],
  ["BTSC Bihar", "BTSC Technical"],
  ["SSC (All India)", "SSC Central"],
  ["Railway RRB (Central)", "Railway RRB"],
  ["UPSC (All India)", "UPSC All India"],
];

const schemeDepartments = [
  ["Social Welfare Department, Bihar", "Social Welfare Department, Bihar"],
  ["Education Department, Bihar", "Education Department, Bihar"],
  ["Industries Department, Bihar", "Industries Department, Bihar"],
  ["Bihar Government (General)", "Bihar Government (General)"],
];

export default function Admin() {
  // ==================== AUTH STATE (Supabase session + role gate) ====================
  // The static PIN was removed: identity now comes from the Supabase session
  // and the backend verifies role via the profiles table.
  const [authState, setAuthState] = useState("loading"); // 'loading' | 'signed_out' | 'forbidden' | 'authorized'
  const [authError, setAuthError] = useState("");
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "", link: "" });
  const [extracting, setExtracting] = useState(false);
  const [extractorFile, setExtractorFile] = useState(null);
  const [extractorText, setExtractorText] = useState("");
  const extractorFileInput = useRef(null);

  // Author card (live profile details)
  const [author, setAuthor] = useState({ name: "", email: "", avatar: "", role: "" });
  const [authorToken, setAuthorToken] = useState("");   // Supabase access token (render-safe)
  const accessTokenRef = useRef(null);   // latest Supabase access token (async helpers)
  const uploadInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    image_url: "",
    tags: "",
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
  const categoryFields = categoryFieldConfig[formData.category] || categoryFieldConfig.jobs;

  // ==================== AUTH HELPERS ====================
  const getBearerToken = async () => {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase.auth.getSession();
    accessTokenRef.current = data?.session?.access_token || null;
    return accessTokenRef.current;
  };

  const authHeaders = async (includeJson = false) => {
    const token = await getBearerToken();
    return {
      ...(includeJson ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ==================== ROLE GATE (profiles table) ====================
  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setAuthState("signed_out");
          setAuthError("Supabase login is not configured for this deployment.");
          setAuthCheckDone(true);
        }
        return;
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (isMounted) setAuthCheckDone(true);
        if (sessionError || !data?.session) {
          if (isMounted) setAuthState("signed_out");
          return;
        }

        const session = data.session;
        accessTokenRef.current = session.access_token;
        setAuthorToken(session.access_token);
        const meta = session.user?.user_metadata || {};
        if (isMounted) {
          setAuthor({
            name: meta.full_name || meta.name || session.user.email?.split("@")[0] || "",
            email: session.user.email || "",
            avatar: meta.avatar_url || meta.picture || "",
            role: "",
          });
        }

        // Fetch the role from the profiles table (backend enforces it again).
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // Table missing / RLS error etc. — treat as no access.
          console.warn("Profile lookup failed:", profileError.message);
        }

        const role = (profile?.role || "").toLowerCase();
        if (isMounted) {
          setAuthor((prev) => ({
            ...prev,
            role: role || "—",
            name: profile?.full_name || prev.name,
          }));
          setAuthState(role === "admin" || role === "creator" ? "authorized" : "forbidden");
        }
      } catch (err) {
        console.error("Admin auth check failed:", err);
        if (isMounted) {
          setAuthState("signed_out");
          setAuthCheckDone(true);
        }
      }
    }

    checkAdminAccess();
    return () => { isMounted = false; };
  }, []);

  // ==================== IMAGE UPLOAD (Supabase Storage: post-images) ====================
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback({ type: "error", message: "केवल image files अपलोड करें (JPG/PNG/WebP)." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: "error", message: "Image size 5 MB से कम होनी चाहिए।" });
      return;
    }

    setUploadingImage(true);
    setFeedback({ type: "", message: "" });
    try {
      const token = await getBearerToken();
      if (!token) {
        setFeedback({ type: "error", message: "Upload के लिए login आवश्यक है।" });
        return;
      }

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
      if (!urlData?.publicUrl) throw new Error("Public URL could not be generated.");

      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setFeedback({ type: "error", message: `Image upload failed: ${err.message}` });
    } finally {
      setUploadingImage(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setFeedback({ type: "", message: "", link: "" });
    try {
      await fetchPosts();
    } catch (err) {
      console.error("Dashboard initial load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/posts`, { headers });
      if (res.status === 403) {
        setAuthState("forbidden");
        return;
      }
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

  // Auto-load posts once authorized
  useEffect(() => {
    if (authState === "authorized" && posts.length === 0) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

  const handleStatusChange = async (postId, newStatus) => {
    setActionLoading(postId);
    try {
      const headers = await authHeaders(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${postId}/status`, {
        method: "POST",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.status === 401 || res.status === 403) {
        setFeedback({ type: "error", message: res.status === 401
          ? "सत्र समाप्त हो गया। पृष्ठ को रीफ्रेश करें और दोबारा लॉगिन करें।"
          : "आपके पास इस क्रिया की अनुमति नहीं है।" });
        if (res.status === 403) setAuthState("forbidden");
        return;
      }
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
      const headers = await authHeaders(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${editingPost.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editingPost),
      });
      if (res.status === 401 || res.status === 403) {
        setFeedback({ type: "error", message: res.status === 401
          ? "सत्र समाप्त हो गया। पृष्ठ को रीफ्रेश करें और दोबारा लॉगिन करें।"
          : "आपके पास इस क्रिया की अनुमति नहीं है।" });
        return;
      }
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
    setFeedback({ type: "", message: "", link: "" });

    // Tags: comma-separated string -> cleaned array
    const tagArray = (formData.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 15);

    // Clean empty FAQs and steps
    const cleanedPayload = {
      ...formData,
      tags: tagArray,
      total_posts: categoryFields.showTotalPosts
        ? formData.total_posts
        : categoryFields.totalPostsFallback,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      meta_title: formData.meta_title || formData.title,
      meta_desc: formData.meta_desc || formData.short_desc,
      faqs: formData.faqs.filter(f => f.q.trim() && f.a.trim()),
      how_to_apply: formData.how_to_apply.filter(s => s.trim()),
      selection_process: formData.selection_process.filter(s => s.trim())
    };

    try {
      const headers = await authHeaders(true);
      if (!headers.Authorization) {
        setFeedback({ type: "error", message: "प्रकाशित करने के लिए कृपया पहले लॉगिन करें।" });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/posts/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(cleanedPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setFeedback({ type: "error", message: "सत्र समाप्त हो गया है। कृपया पृष्ठ रीफ्रेश करके दोबारा लॉगिन करें।" });
        setAuthState("signed_out");
        return;
      }
      if (res.status === 403) {
        setFeedback({ type: "error", message: data.detail || "आपके खाते को प्रकाशित करने की अनुमति नहीं है।" });
        setAuthState("forbidden");
        return;
      }
      if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);

      const slug = data.slug || cleanedPayload.slug;
      setFeedback({
        type: "success",
        message: "नया हाई-वैल्यू आर्टिकल सीधे पोर्टल पर लाइव हो गया!",
        link: `/post/${slug}`,
      });
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
        image_url: "",
        tags: "",
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

  const handleExtractNotification = async () => {
    if (!extractorFile && !extractorText.trim()) {
      setFeedback({ type: "error", message: "एक PDF अपलोड करें या नोटिफिकेशन टेक्स्ट पेस्ट करें।" });
      return;
    }

    setExtracting(true);
    setFeedback({ type: "", message: "" });
    try {
      const body = new FormData();
      if (extractorFile) body.append("file", extractorFile);
      else body.append("raw_text", extractorText);

      const response = await fetch(`${API_BASE_URL}/api/admin/ai/extract`, {
        method: "POST",
        headers: await authHeaders(),
        body,
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        setFeedback({ type: "error", message: response.status === 401
          ? "सत्र समाप्त हो गया। पृष्ठ को रीफ्रेश करें और दोबारा लॉगिन करें।"
          : "आपके पास AI extraction की अनुमति नहीं है।" });
        return;
      }
      if (!response.ok) {
        throw new Error(result.detail || `HTTP ${response.status}`);
      }

      const extracted = result.data;
      if (!extracted || typeof extracted !== "object") {
        throw new Error("AI response did not contain extracted post fields.");
      }

      setFormData((current) => ({
        ...current,
        title: extracted.title || current.title,
        slug: extracted.slug || current.slug,
        category: extracted.category || current.category,
        department: extracted.department || current.department,
        total_posts: extracted.total_vacancies || extracted.total_posts || "",
        last_date: extracted.last_date || extracted.exam_date || "",
        eligibility: extracted.eligibility || "",
        apply_url: extracted.apply_url || "",
        pdf_url: extracted.pdf_url || "",
        short_desc: extracted.short_desc || "",
        meta_title: extracted.title || current.meta_title,
        meta_desc: extracted.short_desc || current.meta_desc,
        content: extracted.content || "",
      }));
      setExtractorFile(null);
      setExtractorText("");
      if (extractorFileInput.current) extractorFileInput.current.value = "";
      setFeedback({ type: "success", message: "AI extraction complete. Fields are ready for your review." });
    } catch (err) {
      setFeedback({ type: "error", message: `AI extraction error: ${err.message}` });
    } finally {
      setExtracting(false);
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

  // ==================== AUTH TRIGGER ====================
  // Supabase JS v2 has NO supabase.auth.signInWithGoogle() — the official
  // method is auth.signInWithOAuth({ provider: 'google' }). Calling the
  // non-existent method throws TypeError (caught previously as an unhandled
  // promise rejection crashing the click handler).
  const handleAdminAuthAction = async () => {
    if (!supabase) {
      setAuthError("Supabase login is not configured for this deployment.");
      return;
    }
    try {
      if (authState === "forbidden") {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Sign out failed:", error.message);
        }
        window.location.reload();
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) {
        console.error("Google sign-in failed:", error.message);
        setAuthError(`Google sign-in failed: ${error.message}`);
      }
    } catch (err) {
      // Never crash the UI on an auth error — log it and surface a banner.
      console.error("Admin auth action failed:", err);
      setAuthError(
        err instanceof Error
          ? `Authentication error: ${err.message}`
          : "Authentication error. Please try again."
      );
    }
  };

  // ==================== AUTH GATE SCREENS ====================
  if (!authCheckDone || authState === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-xs font-bold">
        <Loader2 className="animate-spin mr-2" size={18} /> Checking access...
      </div>
    );
  }

  if (authState === "signed_out" || authState === "forbidden") {
    const forbidden = authState === "forbidden";
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-inner ${
            forbidden ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-[#0B4F8A]"
          }`}>
            {forbidden ? <Lock size={32} /> : <LogIn size={32} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {forbidden ? "Access Denied / अनधिकृत" : "BiharFast Control Room"}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              {forbidden
                ? "यह क्षेत्र केवल admin या creator भूमिका वाले खातों के लिए है। आपके खाते को प्रवेश अनुमति नहीं है।"
                : (authError || "सुरक्षित प्रकाशन केंद्र में प्रवेश के लिए लॉगिन करें।")}
            </p>
            {forbidden && author.email && (
              <p className="text-[11px] text-slate-400 mt-2">Signed in as: {author.email}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdminAuthAction}
            className="w-full bg-[#0B4F8A] hover:bg-[#083b66] text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer text-sm tracking-wide"
          >
            {forbidden ? "Sign Out & Switch Account" : "Continue with Google"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header with live author card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="text-[#0B4F8A]" size={28} /> BiharFast Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manual High-Value Authoring • AdSense Ready Architecture
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center font-black text-sm">
                {(author.name || "A").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <p className="text-xs font-black text-slate-900 leading-tight">{author.name || "Admin"}</p>
              <p className="text-[10px] font-bold text-slate-500">{author.role.toUpperCase()} • {author.email}</p>
            </div>
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

        {/* Global Feedback Banner (with live post link) */}
        {feedback.message && (
          <div
            className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
              {feedback.link && (
                <a
                  href={feedback.link}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-emerald-900 hover:text-emerald-700"
                >
                  लाइव पोस्ट देखें →
                </a>
              )}
            </div>
            <button onClick={() => setFeedback({ type: "", message: "", link: "" })} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* TAB: 10TH QUIZ MANAGER */}
        {activeTab === "quiz" && (
          <AdminQuizManager 
            adminToken={authorToken}
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

            <details className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
              <summary className="cursor-pointer text-sm font-black text-indigo-950">
                AI Auto-Fill from Notification
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-600">
                  Upload a text-based PDF or paste notification text. Extracted fields will populate the form for review before publishing.
                </p>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="ai-notification-pdf">
                    Notification PDF
                  </label>
                  <input
                    ref={extractorFileInput}
                    id="ai-notification-pdf"
                    type="file"
                    accept="application/pdf,.pdf"
                    disabled={extracting}
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setExtractorFile(file);
                      if (file) setExtractorText("");
                    }}
                    className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:font-bold file:text-indigo-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="ai-notification-text">
                    Or paste notification text
                  </label>
                  <textarea
                    id="ai-notification-text"
                    rows="5"
                    value={extractorText}
                    disabled={extracting}
                    onChange={(event) => {
                      const text = event.target.value;
                      setExtractorText(text);
                      if (text.trim()) {
                        setExtractorFile(null);
                        if (extractorFileInput.current) extractorFileInput.current.value = "";
                      }
                    }}
                    placeholder="यहाँ पूरी सरकारी अधिसूचना का टेक्स्ट पेस्ट करें..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium focus:outline-[#0B4F8A] disabled:opacity-60"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleExtractNotification}
                  disabled={extracting || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-black text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {extracting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  {extracting ? "Extracting notification..." : "Extract & Auto-Fill"}
                </button>
              </div>
            </details>

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
                    {(formData.category === "schemes" ? schemeDepartments : standardDepartments)
                      .map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({
                      ...formData,
                      category: e.target.value,
                      department: e.target.value === "schemes"
                        ? (schemeDepartments.some(([value]) => value === formData.department)
                          ? formData.department
                          : "Bihar Government (General)")
                        : (standardDepartments.some(([value]) => value === formData.department)
                          ? formData.department
                          : "BPSC"),
                      total_posts: "",
                      last_date: "",
                      eligibility: "",
                      apply_url: "",
                      pdf_url: "",
                    })}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                  >
                    <option value="jobs">Government Jobs</option>
                    <option value="admit_card">Admit Card</option>
                    <option value="results">Exam Results</option>
                    <option value="schemes">Government Schemes</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="answer_key">Answer Key</option>
                  </select>
                </div>

                <div
                  key={formData.category}
                  className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 category-fields-enter"
                >
                  {categoryFields.showTotalPosts && (
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">{categoryFields.totalPostsLabel}</label>
                      <input
                        type="text"
                        value={formData.total_posts}
                        onChange={(e) => setFormData({ ...formData, total_posts: e.target.value })}
                        placeholder={categoryFields.totalPostsPlaceholder}
                        className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">{categoryFields.lastDateLabel} *</label>
                    <input
                      type="text"
                      value={formData.last_date}
                      onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
                      placeholder={categoryFields.lastDatePlaceholder}
                      required
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">{categoryFields.eligibilityLabel}</label>
                    <input
                      type="text"
                      value={formData.eligibility}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      placeholder={categoryFields.eligibilityPlaceholder}
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">{categoryFields.applyUrlLabel}</label>
                    <input
                      type="url"
                      value={formData.apply_url}
                      onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">{categoryFields.pdfUrlLabel}</label>
                    <input
                      type="url"
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>

                  {/* Instagram-style Cover Image: upload to Supabase Storage or paste URL */}
                  <div className="sm:col-span-2 p-4 bg-gradient-to-br from-rose-50/60 to-orange-50/60 border border-rose-100 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                        <ImagePlus size={13} className="inline mr-1 -mt-0.5" /> Cover Image (Instagram-style)
                      </label>
                      {formData.image_url && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove image
                        </button>
                      )}
                    </div>

                    {formData.image_url ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-sm">
                        <img
                          src={formData.image_url}
                          alt="Cover preview"
                          className="w-full aspect-[16/9] object-cover"
                          onError={(e) => { e.currentTarget.style.opacity = "0.4"; }}
                        />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Live Preview
                        </span>
                      </div>
                    ) : (
                      <div className="max-w-sm aspect-[16/9] rounded-xl border-2 border-dashed border-slate-300 bg-white/70 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <ImagePlus size={28} />
                        <p className="text-[11px] font-bold">कोई image चुनी नहीं गई</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                      <input
                        ref={uploadInputRef}
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageUpload}
                        className="flex-1 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0B4F8A] file:px-3 file:py-2 file:font-bold file:text-white"
                      />
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="...या image URL पेस्ट करें"
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:outline-[#0B4F8A]"
                      />
                    </div>
                    {uploadingImage && (
                      <p className="text-[11px] font-bold text-[#0B4F8A] flex items-center gap-1.5">
                        <Loader2 size={13} className="animate-spin" /> Uploading to Supabase Storage (post-images)...
                      </p>
                    )}
                  </div>

                  {/* Tags (comma separated) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. BPSC, 70th CCE, Notification, Sarkari Naukri"
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                    {formData.tags.trim() && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.tags.split(",").map((t, i) => t.trim() && (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            #{t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
                      <option value="scholarship">scholarship</option>
                      <option value="syllabus">syllabus</option>
                      <option value="answer_key">answer_key</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Last Date / Exam Date</label>
                    <input
                      type="text"
                      value={editingPost.last_date || editingPost.lastDate || editingPost.exam_date || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, last_date: e.target.value })}
                      placeholder="उदा. 31 अक्टूबर 2026 / परीक्षा कार्यक्रम देखें"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Eligibility / Login Requirements</label>
                    <input
                      type="text"
                      value={editingPost.eligibility || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, eligibility: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Official Apply / Download URL</label>
                    <input
                      type="url"
                      value={editingPost.apply_url || editingPost.applyUrl || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, apply_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Official PDF URL</label>
                    <input
                      type="url"
                      value={editingPost.pdf_url || editingPost.pdfUrl || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, pdf_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-700 mb-1">Short Summary</label>
                    <textarea
                      rows="3"
                      value={editingPost.short_desc || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, short_desc: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-[#0B4F8A]"
                    />
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