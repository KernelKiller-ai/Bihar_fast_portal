import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../api/supabase";
export { useAuth } from './authContext';
import { attachPendingStudentAttempt } from "../utils/studentHistory";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const user = session?.user ?? null;

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) console.error("Unable to restore student session:", error);
      const restoredSession = data?.session ?? null;
      if (restoredSession) attachPendingStudentAttempt(restoredSession.user.id);
      setSession(restoredSession);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession) attachPendingStudentAttempt(nextSession.user.id);
      setSession(nextSession);
      setLoading(false);
      if (nextSession) setIsLoginModalOpen(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    if (!supabase) {
      return { error: new Error("Google login is not configured for this deployment.") };
    }

    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  async function signOut() {
    if (!supabase) return { error: new Error("Authentication is not configured.") };
    const result = await supabase.auth.signOut();
    if (!result.error) setSession(null);
    return result;
  }

  const value = {
    user,
    session,
    loading,
    isLoginModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false),
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
