/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../api/supabase";
import { AuthContext, useAuth } from "./authContext";

// Re-export ताकि बाकी फाइलों के इम्पोर्ट न टूटें
export { AuthContext, useAuth };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const user = session?.user ?? null;

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) console.error("Unable to restore Supabase session:", error);
      const restoredSession = data?.session ?? null;
      setSession(restoredSession);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}