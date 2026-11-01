import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../api/supabase";
import { useAuth } from "../context/AuthContext.jsx";

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return undefined;

    let active = true;
    async function verifyAdmin() {
      const email = (user.email || "").trim().toLowerCase();
      if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
        navigate("/admin", { replace: true });
        return;
      }

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Unable to sign out unauthorized account:", signOutError.message);
      }
      navigate("/", {
        replace: true,
        state: {
          accessDenied: signOutError
            ? "Access Denied. This account is not authorized, and sign-out failed. Please clear the session before trying again."
            : "Access Denied. Only the configured BiharFast administrator can access the control room.",
        },
      });
    }

    verifyAdmin().catch((authError) => {
      console.error("Admin account verification failed:", authError);
      if (active) setError("Unable to verify the administrator account. Please try again.");
    });

    return () => {
      active = false;
    };
  }, [loading, user, navigate]);

  const handleGoogleSignIn = async () => {
    setError("");
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase authentication is not configured for this deployment.");
      return;
    }
    if (!ADMIN_EMAIL) {
      setError("Admin login is disabled until VITE_ADMIN_EMAIL is configured.");
      return;
    }

    setSigningIn(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/admin-login` },
      });
      if (authError) {
        console.error("Google admin sign-in failed:", authError.message);
        setError("Google sign-in failed. Please try again.");
      }
    } catch (authError) {
      console.error("Google admin sign-in failed:", authError);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  if (loading || user || signingIn) {
    return (
      <main className="grid min-h-[65vh] place-items-center px-4">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-600">
          <Loader2 className="animate-spin" size={18} />
          {signingIn ? "Google sign-in is starting..." : "Checking administrator access..."}
        </p>
      </main>
    );
  }

  return (
    <main className="grid min-h-[65vh] place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <ShieldCheck className="mx-auto text-sky-800" size={38} />
        <div>
          <h1 className="text-2xl font-black text-slate-900">BiharFast Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600">This area is restricted to the configured site administrator.</p>
        </div>
        {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</p>}
        {!ADMIN_EMAIL && !error && (
          <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">
            Admin login is disabled until VITE_ADMIN_EMAIL is configured.
          </p>
        )}
        <button
          type="button"
          disabled={!ADMIN_EMAIL || signingIn}
          onClick={handleGoogleSignIn}
          className="w-full rounded-xl bg-sky-800 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue with Google
        </button>
      </section>
    </main>
  );
}
