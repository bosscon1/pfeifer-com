import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Site admin | Pfeifer Building Company" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  return (
    <AdminShell title="Office dashboard">
      <p className="max-w-2xl text-muted">
        Change the listed office details here. Reviews, homepage lines, and team photos will be
        added next. The public WordPress site is not affected until you say it is time to cut over.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/contact/"
          className="border border-line bg-paper p-5 no-underline hover:border-pfeifer"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-pfeifer">
            Ready
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">Contact and office</h2>
          <p className="mt-2 text-sm text-muted">
            Phone, email, address, hours, and the service-area sentence used across the site.
          </p>
        </Link>
        <Link
          to="/admin/redirects/"
          className="border border-line bg-paper p-5 no-underline hover:border-pfeifer"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-pfeifer">
            Ready
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">404s and redirects</h2>
          <p className="mt-2 text-sm text-muted">
            Find missing old URLs, pick a live page, and publish a 301.
          </p>
        </Link>
        <Link
          to="/admin/photos/"
          className="border border-line bg-paper p-5 no-underline hover:border-pfeifer"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-pfeifer">
            Ready
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">Photo galleries</h2>
          <p className="mt-2 text-sm text-muted">
            List folders and upload job photos. Each file is resized, named, and watermarked.
          </p>
        </Link>
        <div className="border border-line bg-paper p-5 opacity-70">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Next
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">Reviews</h2>
          <p className="mt-2 text-sm text-muted">Edit the static 5-star quotes by hand.</p>
        </div>
        <div className="border border-line bg-paper p-5 opacity-70">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Next
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">Homepage and banner</h2>
          <p className="mt-2 text-sm text-muted">Office-closed notice and hero lines.</p>
        </div>
        <div className="border border-line bg-paper p-5 opacity-70">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Next
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">Team</h2>
          <p className="mt-2 text-sm text-muted">Names, roles, and later headshots.</p>
        </div>
      </div>
    </AdminShell>
  );
}
