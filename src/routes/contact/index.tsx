import { createFileRoute } from "@tanstack/react-router";
import { BidForm } from "@/components/bid-form";
import { PageHero } from "@/components/page-hero";
import { SixReasons } from "@/components/six-reasons";
import { SITE } from "@/data/site";
import { orgJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/contact/")({
  head: () => ({
    meta: [
      { title: "Get in Touch" },
      {
        name: "description",
        content:
          "Contact Pfeifer Building Company in Tyrone, GA. Call 770-487-1380 or email office@pfeiferbuild.com.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/contact/" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd() }} />
      <PageHero
        image="/images/garage.jpg"
        alt="Tyrone office area garage project"
        eyebrow="Tyrone office"
        title="Get in Touch"
        lede="There are several ways to reach us. The office is open 9am–5pm weekdays. Your project manager is available by phone or text when you need them."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Contact us</h2>
          <p className="mt-4 text-muted">
            {SITE.addressLine}
            <br />
            {SITE.cityLine}
          </p>
          <p className="mt-4">
            <a href={SITE.phoneHref} className="font-semibold text-pfeifer no-underline">
              {SITE.phone}
            </a>
          </p>
          <p className="mt-2">
            <a href={SITE.emailHref} className="text-pfeifer no-underline">
              {SITE.email}
            </a>
          </p>
          <p className="mt-6">
            <a
              href={SITE.mapsHref}
              className="inline-flex min-h-11 items-center border border-pfeifer px-4 text-sm font-bold uppercase tracking-wide text-pfeifer no-underline"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
          </p>
        </div>
        <BidForm />
      </section>
      <SixReasons />
    </main>
  );
}
