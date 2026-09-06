import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteLayout } from "@/components/site-layout";
import { withBase } from "@/lib/preview-base";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pfeifer Building Company" },
      { name: "theme-color", content: "#004AAD" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: withBase("/favicon.svg") },
      { rel: "stylesheet", href: appCss },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@400;500;600;700&display=swap",
          },
      { rel: "manifest", href: withBase("/__grok/manifest.webmanifest") },
      { rel: "apple-touch-icon", href: withBase("/__grok/icon-180.png") },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteLayout>
            <Outlet />
          </SiteLayout>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
