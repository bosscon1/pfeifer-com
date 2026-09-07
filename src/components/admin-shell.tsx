import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isStaffEmail, staffEmailError } from "@/lib/staff-email";
import { Logo } from "@/components/logo";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const allowed = Boolean(user && isStaffEmail(user.primaryEmail));

  useEffect(() => {
    if (isPending || !user || allowed) return;
    void signOut().catch(() => {});
  }, [isPending, user, allowed]);

  if (isPending) {
    return (
      <div className="min-h-dvh bg-cream">
        <div className="h-16 bg-pfeifer" />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="h-8 w-48 animate-pulse bg-line" />
          <div className="mt-6 h-40 animate-pulse bg-paper" />
        </div>
      </div>
    );
  }

  if (!user || !allowed) return <RedirectToSignIn to="/login/" />;

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="bg-pfeifer text-paper">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/admin/" className="flex items-center gap-3 text-paper no-underline">
            <Logo compact />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em]">
              Site admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="font-sans text-sm text-paper/85 no-underline hover:text-paper">
              View public site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">{user.primaryEmail}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export { staffEmailError };
