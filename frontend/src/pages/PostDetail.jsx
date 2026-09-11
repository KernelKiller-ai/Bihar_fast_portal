import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import JobLayout from "../components/layouts/JobLayout";
import AdmitCardLayout from "../components/layouts/AdmitCardLayout";
import ResultLayout from "../components/layouts/ResultLayout";
import RtpsLayout from "../components/layouts/RtpsLayout";
import UdyamiLayout from "../components/layouts/UdyamiLayout";
import BiharBhumiLayout from "../components/layouts/BiharBhumiLayout";
import { ArrowLeft, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function PostDetail({ notices = [] }) {
  const { slug } = useParams();

  // Notice array me check karein
  const localPost = notices.find((item) => item.slug === slug || String(item.id) === String(slug)) || null;
  const [fetchedPost, setFetchedPost] = useState(null);
  const [loading, setLoading] = useState(!localPost && Boolean(slug && slug !== "undefined"));

  useEffect(() => {
    if (localPost || !slug || slug === "undefined") {
      return;
    }

    let isMounted = true;
    async function fetchSinglePost() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          const item = json.data;
          // ...item se layout specific (steps, docs, rules) saari fields preserve hongi
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
            applyUrl: item.apply_url || item.applyUrl || item.pdf_url || item.pdfUrl
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#0B4F8A]" size={36} />
        <p className="text-xs font-bold text-slate-500">अधिसूचना लोड हो रही है...</p>
      </div>
    );
  }

  if (!post || !slug || slug === "undefined") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">अधिसूचना नहीं मिली</h2>
        <p className="text-xs text-slate-500 mt-1">यह सूचना हटा दी गई है या लिंक अमान्य है।</p>
        <Link to="/" className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> वापस होम पेज पर जाएं
        </Link>
      </div>
    );
  }

  const category = (post.category || post.type || "").toLowerCase().trim();
  const currentSlug = (post.slug || "").toLowerCase().trim();

  // RTPS Services Layout
  if (
    category === "services" ||
    category === "rtps" ||
    currentSlug.includes("rtps") ||
    currentSlug.includes("certificate") ||
    currentSlug.includes("aay-praman") ||
    currentSlug.includes("niwas-praman")
  ) {
    return <RtpsLayout post={post} />;
  }

  // Schemes / Udyami Layout
  if (
    category === "schemes" ||
    category === "yojana" ||
    category === "udyami" ||
    currentSlug.includes("udyami") ||
    currentSlug.includes("subsidy") ||
    currentSlug.includes("yojana")
  ) {
    return <UdyamiLayout post={post} />;
  }

  // Bihar Bhumi / Land Records Layout
  if (
    category === "bihar_bhumi" ||
    category === "bhoomi" ||
    category === "land" ||
    currentSlug.includes("bhumi") ||
    currentSlug.includes("lagan") ||
    currentSlug.includes("jamabandi") ||
    currentSlug.includes("dakhil-kharij")
  ) {
    return <BiharBhumiLayout post={post} />;
  }

  // Core Job and Examination Layouts
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
    default:
      return <JobLayout post={post} />;
  }
}

PostDetail.propTypes = {
  notices: PropTypes.arrayOf(PropTypes.object)
};