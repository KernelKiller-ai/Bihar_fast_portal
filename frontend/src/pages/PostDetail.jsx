import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import JobLayout from "../components/layouts/JobLayout";
import AdmitCardLayout from "../components/layouts/AdmitCardLayout";
import ResultLayout from "../components/layouts/ResultLayout";
import { 
  ArrowLeft, 
  Loader2, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Calculator, 
  ShieldCheck, 
  FileText,
  ExternalLink
} from "lucide-react";
import { generateSlug } from "../utils/slug";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

const DEDICATED_HUBS = [
  { match: ["rtps", "caste", "income", "residential", "niwas", "aay", "jati"], link: "/rtps-bihar", title: "RTPS Bihar Direct Portal" },
  { match: ["udyami", "mukhyamantri udyami"], link: "/udyami-yojana", title: "मुख्यमंत्री उद्यमी योजना Hub" },
  { match: ["matric", "10th result", "bseb 10th"], link: "/bseb-matric-10th", title: "BSEB 10th Matric Hub" },
  { match: ["inter", "12th result", "bseb 12th"], link: "/bseb-inter-12th", title: "BSEB 12th Inter Hub" },
  { match: ["kyp", "kushal yuva"], link: "/kyp-bihar", title: "कुशल युवा कार्यक्रम (KYP) Hub" },
  { match: ["student credit card", "bscc", "mnssby"], link: "/student-credit-card", title: "स्टूडेंट क्रेडिट कार्ड Hub" },
  { match: ["cuet", "cuet ug"], link: "/cuet-ug-admission", title: "CUET UG Admission Portal" },
];

export default function PostDetail({ notices = [] }) {
  const { slug } = useParams();

  const localCandidate = notices.find((item) => item.slug === slug || String(item.id) === String(slug)) || null;
  
  // Agar local post me Gemini fields pehle se available hain to local use karein, warna API se full record mangwayein
  const hasEnrichedData = Boolean(localCandidate && (localCandidate.short_desc || localCandidate.how_to_apply));
  const localPost = hasEnrichedData ? localCandidate : null;

  const [fetchedPost, setFetchedPost] = useState(null);
  const [loading, setLoading] = useState(!localPost && Boolean(slug && slug !== "undefined"));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    if (localPost || !slug || slug === "undefined") {
      return;
    }

    let isMounted = true;
    async function fetchSinglePost() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
        const json = await res.json();
        
        if (isMounted && json.success && json.data) {
          const item = json.data;
          setFetchedPost({
            ...item,
            id: item.id || item.slug,
            slug: item.slug,
            title: item.title,
            department: item.department,
            category: item.category,
            totalPosts: item.total_posts || item.totalPosts || "अधिसूचना देखें",
            lastDate: item.last_date || item.lastDate || "सक्रिय सूचना",
            eligibility: item.eligibility || "विज्ञापन देखें",
            qualification_details: item.qualification_details,
            pdfUrl: item.pdf_url || item.pdfUrl,
            applyUrl: item.apply_url || item.applyUrl || item.pdf_url || item.pdfUrl,
            download_url: item.download_url || item.apply_url || item.pdf_url,
            // Gemini Generated Dynamic Fields
            short_desc: item.short_desc || "",
            how_to_apply: Array.isArray(item.how_to_apply) ? item.how_to_apply : [],
            selection_process: Array.isArray(item.selection_process) ? item.selection_process : [],
            extra_links: Array.isArray(item.extra_links) ? item.extra_links : []
          });
        }
      } catch (err) {
        console.error("Failed to fetch post detail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSinglePost();

    return () => {
      isMounted = false;
    };
  }, [slug, localPost]);

  const post = localPost || fetchedPost;

  // Dynamic SEO Injection with High-Value Descriptions
  useEffect(() => {
    if (!post) return;

    document.title = `${post.title} | BiharFast Official`;

    const setMeta = (attr, val, content) => {
      let tag = document.querySelector(`meta[${attr}="${val}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, val);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Use authentic AI summary for Google Meta Description if available
    const desc = post.short_desc 
      ? post.short_desc.slice(0, 155) + "..." 
      : `${post.department || "Bihar Govt"}: ${post.title}. Eligibility: ${post.eligibility || "See Details"}. Last Date: ${post.lastDate || "Active"}. Direct Apply Online & Official Notification PDF.`;

    setMeta("name", "description", desc);
    setMeta("property", "og:title", `${post.title} - BiharFast`);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "article");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://biharfast.in/post/${post.slug || slug}`);
  }, [post, slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#0B4F8A]" size={36} />
        <p className="text-xs font-bold text-slate-700">अधिसूचना लोड हो रही है...</p>
      </div>
    );
  }

  if (!post || !slug || slug === "undefined") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">अधिसूचना नहीं मिली</h2>
        <p className="text-xs text-slate-600 mt-1">यह सूचना हटा दी गई है या लिंक अमान्य है।</p>
        <Link to="/" className="mt-4 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> वापस होम पेज पर जाएं
        </Link>
      </div>
    );
  }

  const category = (post.category || post.type || "").toLowerCase().trim();
  const slugLower = (post.slug || slug || "").toLowerCase();
  const titleLower = (post.title || "").toLowerCase();

  const matchedHub = DEDICATED_HUBS.find((h) =>
    h.match.some((keyword) => slugLower.includes(keyword) || titleLower.includes(keyword))
  );

  const relatedNotices = notices
    .filter((n) => {
      const nSlug = n.slug || generateSlug(n);
      const isDifferent = nSlug !== slug && String(n.id) !== String(post.id);
      const isSimilar = (n.category && n.category.toLowerCase() === category) || 
                        (n.department && n.department.toUpperCase() === post.department?.toUpperCase());
      return isDifferent && isSimilar;
    })
    .slice(0, 4);

  const displayRelated = relatedNotices.length > 0 
    ? relatedNotices 
    : notices.filter((n) => (n.slug || generateSlug(n)) !== slug).slice(0, 4);

  const renderActiveLayout = () => {
    switch (category) {
      case "admit_card":
      case "admitcard":
      case "admit-card":
        return <AdmitCardLayout post={post} />;
      case "result":
      case "results":
        return <ResultLayout post={post} />;
      case "jobs":
      case "job":
      case "latest-jobs":
      case "services":
      case "schemes":
      default:
        return <JobLayout post={post} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* 1. Accessible Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mb-4 overflow-x-auto pb-1">
        <Link to="/" className="hover:text-blue-700 transition flex items-center gap-1 shrink-0">
          Home
        </Link>
        <ChevronRight size={13} className="text-slate-400 shrink-0" />
        <Link to="/" className="hover:text-blue-700 transition capitalize shrink-0">
          {category || "Updates"}
        </Link>
        <ChevronRight size={13} className="text-slate-400 shrink-0" />
        <span className="font-bold text-slate-800 bg-slate-200/60 px-2 py-0.5 rounded shrink-0">
          {post.department || "Official Notice"}
        </span>
        <ChevronRight size={13} className="text-slate-400 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-50 sm:max-w-md">
          {post.title}
        </span>
      </nav>

      {/* Dedicated Hub Alert Banner */}
      {matchedHub && (
        <div className="mb-4 p-3.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <Sparkles size={18} className="text-amber-300 shrink-0 animate-pulse" />
            <span>
              इस सेवा के लिए <strong>डायरेक्ट सुपर-फास्ट पोर्टल</strong> उपलब्ध है: बिना किसी देरी के सीधे लिंक का उपयोग करें।
            </span>
          </div>
          <Link
            to={matchedHub.link}
            className="bg-white text-blue-900 hover:bg-amber-100 px-3.5 py-1.5 rounded-lg font-black text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>{matchedHub.title}</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      )}

      {/* 2. Main Post Content Layout */}
      {renderActiveLayout()}

      {/* 3. Free Aspirant Utilities Hub */}
      <section className="mt-8 bg-linear-to-r from-blue-50 via-slate-50 to-emerald-50 border border-blue-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full">
              Free Aspirant Utilities
            </span>
            <h2 className="text-base font-black text-slate-900 mt-1">
              आवेदन में मदद के लिए फ्री टूल्स (Self-Apply Utilities)
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-bold">100% Client-Side Safe</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to="/#cyber-tools-section"
            className="p-3.5 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 rounded-xl transition flex items-center gap-3 group shadow-xs"
          >
            <div className="p-2.5 rounded-lg bg-blue-700 text-white shrink-0 group-hover:scale-105 transition">
              <Camera size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-blue-800">Photo & Sign Resizer</p>
              <p className="text-[11px] text-slate-600">20KB–50KB साइज में कंप्रेस करें</p>
            </div>
          </Link>

          <Link
            to="/#cyber-tools-section"
            className="p-3.5 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-xl transition flex items-center gap-3 group shadow-xs"
          >
            <div className="p-2.5 rounded-lg bg-emerald-700 text-white shrink-0 group-hover:scale-105 transition">
              <Calculator size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-emerald-800">Age Calculator</p>
              <p className="text-[11px] text-slate-600">कट-ऑफ तारीख व छूट की गणना</p>
            </div>
          </Link>

          <Link
            to="/rtps-bihar"
            className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-400 rounded-xl transition flex items-center gap-3 group shadow-xs"
          >
            <div className="p-2.5 rounded-lg bg-indigo-700 text-white shrink-0 group-hover:scale-105 transition">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-indigo-800">RTPS Bihar Hub</p>
              <p className="text-[11px] text-slate-600">जाति, आय, निवास 1-क्लिक डाउनलोड</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Semantic Related Circulars Section */}
      {displayRelated.length > 0 && (
        <section className="mt-8 border-t border-slate-200 pt-6 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-600" />
              संबंधित अन्य आधिकारिक सूचनाएं (Related Updates)
            </h2>
            <Link to="/" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
              सभी देखें <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {displayRelated.map((rel) => {
              const relSlug = rel.slug || generateSlug(rel);
              return (
                <Link
                  key={rel.id || relSlug}
                  to={`/post/${relSlug}`}
                  className="p-4 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-xl transition flex items-center justify-between group shadow-xs"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                        {rel.department || "BIHAR"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                        <FileText size={11} /> {rel.last_date || rel.lastDate || "सक्रिय"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-800 line-clamp-1">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      योग्यता: {rel.eligibility || "विज्ञापन देखें"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-700 group-hover:text-white transition shrink-0">
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-white" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

PostDetail.propTypes = {
  notices: PropTypes.arrayOf(PropTypes.object)
};