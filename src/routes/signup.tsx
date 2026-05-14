import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (data.session) {
      await router.invalidate();
      navigate({ to: "/" });
    } else {
      setMsg("Check your inbox to confirm your email, then sign in.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Create account</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">First user becomes admin automatically.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px]" />
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px]" />
          <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px]" />
          {err && <p className="text-[12px] text-destructive">{err}</p>}
          {msg && <p className="text-[12px] text-muted-foreground">{msg}</p>}
          <button type="submit" disabled={busy}
            className="w-full rounded-md bg-primary px-3 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
