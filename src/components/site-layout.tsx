import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const internal = pathname.startsWith("/internal");

  if (internal) {
    return <div className="min-h-dvh bg-paper">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
