import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    await router.invalidate();
    navigate({ to: "/" });
  }

  async function google() {
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setErr(result.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Sign in</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">BPML Governance Platform</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px]" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px]" />
          {err && <p className="text-[12px] text-destructive">{err}</p>}
          <button type="submit" disabled={busy}
            className="w-full rounded-md bg-primary px-3 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="my-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <button onClick={google}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px] font-medium hover:bg-surface-hover">
          Continue with Google
        </button>
        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
