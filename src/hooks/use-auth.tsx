import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "viewer";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  hasRole: (r: AppRole) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;

    const loadRole = async (uid: string | undefined) => {
      if (!uid) { setRole(null); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (!active) return;
      const roles = (data ?? []).map((r) => r.role as AppRole);
      setRole(roles.includes("admin") ? "admin" : roles.includes("viewer") ? "viewer" : null);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      // Defer Supabase calls outside the listener
      setTimeout(() => loadRole(s?.user?.id), 0);
      router.invalidate();
      queryClient.invalidateQueries();
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      loadRole(data.session?.user?.id).finally(() => active && setLoading(false));
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [router, queryClient]);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    role,
    loading,
    hasRole: (r) => role === r || (r === "viewer" && role === "admin"),
    signOut: async () => { await supabase.auth.signOut(); },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
