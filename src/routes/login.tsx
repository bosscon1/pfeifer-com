import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isStaffEmail, staffEmailError, STAFF_EMAIL_DOMAIN } from "@/lib/staff-email";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Staff sign in | Pfeifer Building Company" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Login,
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const staffUser = Boolean(user && isStaffEmail(user.primaryEmail));

  useEffect(() => {
    if (isPending || !user || staffUser) return;
    setError(staffEmailError());
    void signOut().catch(() => {});
  }, [isPending, user, staffUser]);

  if (!isPending && staffUser) return <Navigate to="/admin/" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!isStaffEmail(trimmed)) {
      setError(staffEmailError());
      return;
    }
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email: trimmed,
          password,
          name: name.trim() || trimmed,
        });
        if (err) throw new Error(err.message || "Could not create the account.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: trimmed,
          password,
        });
        if (err) throw new Error(err.message || "Could not sign in.");
      }
      window.location.assign("/admin/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-4 py-12">
      <div className="w-full max-w-md border border-line bg-paper p-8 shadow-sm">
        <div className="flex justify-center bg-pfeifer px-4 py-3">
          <Logo compact />
        </div>
        <p className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Staff only
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">Sign in to site admin</h1>
        <p className="mt-2 text-sm text-muted">
          Use an @{STAFF_EMAIL_DOMAIN} email. Personal Gmail and other domains cannot open admin.
          Homeowners should use{" "}
          <Link to="/contact/" className="text-pfeifer">
            Contact
          </Link>{" "}
          or call the office.
        </p>

        {isPending ? (
          <div className="mt-8 h-24 animate-pulse bg-cream" />
        ) : authEnabled ? (
          <>
            <div className="mt-6 space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  className="w-full min-h-11 border border-line px-4 font-sans text-sm font-semibold text-ink hover:bg-cream"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/admin/" })}
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Google only works if that Google account is @{STAFF_EMAIL_DOMAIN}.
            </p>

            <p className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-muted">
              or office email
            </p>

            <form className="mt-4 space-y-3" onSubmit={(e) => void onSubmit(e)}>
              {mode === "up" ? (
                <label className="block text-sm">
                  Name
                  <input
                    className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </label>
              ) : null}
              <label className="block text-sm">
                Email
                <input
                  type="email"
                  required
                  className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder={`you@${STAFF_EMAIL_DOMAIN}`}
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  type="password"
                  required
                  minLength={8}
                  className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                />
              </label>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full min-h-12 bg-pfeifer font-sans text-sm font-bold uppercase tracking-wide text-paper hover:bg-pfeifer-dark disabled:opacity-60"
              >
                {busy ? "Working…" : mode === "up" ? "Create staff account" : "Sign in"}
              </button>
            </form>
            <button
              type="button"
              className="mt-4 w-full text-sm text-pfeifer"
              onClick={() => {
                setMode(mode === "up" ? "in" : "up");
                setError("");
              }}
            >
              {mode === "up" ? "Already have an account? Sign in" : "First time? Create a staff account"}
            </button>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
