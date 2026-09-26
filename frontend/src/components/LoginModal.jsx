import { useEffect, useState } from "react";
import { LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BENEFITS = [
  "Save Test History",
  "Detailed Performance Analysis",
  "State-wide Leaderboard",
];

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoginModalOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLoginModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) setError(authError.message || "Google से साइन इन नहीं हो सका। कृपया फिर कोशिश करें।");
    } catch (authError) {
      setError(authError.message || "Google से साइन इन नहीं हो सका। कृपया फिर कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeLoginModal();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-login-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="h-2 bg-linear-to-r from-amber-400 via-white to-emerald-500" />
        <button
          type="button"
          onClick={closeLoginModal}
          aria-label="लॉगिन विंडो बंद करें"
          className="absolute right-4 top-5 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={19} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
            <LockKeyhole size={23} />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-sky-700">Student Account</p>
          <h2 id="student-login-title" className="mt-1 text-2xl font-black text-slate-950">
            BiharFast Student Portal
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            अपनी परीक्षा तैयारी को एक जगह रखें और हर प्रयास के साथ प्रगति देखें।
          </p>

          <ul className="mt-5 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={15} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
          >
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.25 5.48-4.73 7.18l7.64 5.93c4.46-4.12 7.17-10.2 7.17-17.58Z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.64-5.93c-2.12 1.42-4.83 2.25-8.26 2.25-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
            </svg>
            {loading ? "Google पर जा रहे हैं..." : "Continue with Google"}
          </button>

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-800">
              {error}
            </p>
          )}

          <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
            आपकी प्रोफ़ाइल जानकारी सुरक्षित रहती है। टेस्ट इतिहास इस डिवाइस पर सहेजा जाता है; हम आपका Google पासवर्ड नहीं देखते।
          </p>
        </div>
      </section>
    </div>
  );
}