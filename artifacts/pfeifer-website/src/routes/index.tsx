import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { HeroVideo } from "@/components/hero-video";
import { ReviewBanner } from "@/components/review-banner";
import { SERVICES, SITE, TEAM } from "@/data/site";
import { withBase } from "@/lib/preview-base";
import { orgJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pfeifer Building Co | Decks, Kitchens, Baths, Garages & More" },
      {
        name: "description",
        content:
          "Pfeifer Building Company has served Fayette and Coweta Counties since 1997 — decks, kitchens, bathrooms, garages, additions, and more from Tyrone, GA.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://pfeiferbuild.com/" },
      { rel: "preload", as: "image", href: withBase("/images/hero-porch.jpg") },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd() }} />
      <section className="relative min-h-dvh overflow-hidden bg-charcoal">
        <HeroVideo src="/videos/hero-porch.mp4" poster="/images/hero-porch.jpg" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/45 to-ink/30" />
        <div className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4 pb-20 pt-44 text-center text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-cream">
            Fayette & Coweta Counties · Since 1997
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            Transform your space with Pfeifer.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/90 md:text-lg">
            Pfeifer Building Company has served the Fayette and Coweta County area for almost 30
            years. In that time we have installed thousands of decks, kitchens, bathrooms, detached
            garages, home additions, and more. Trust your property to the carpenters, painters, and
            tradesmen here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/get-started/"
              className="inline-flex min-h-12 items-center bg-pfeifer px-6 font-sans text-sm font-bold uppercase tracking-wide text-paper no-underline hover:bg-pfeifer-dark"
            >
              Start here
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-12 items-center border border-paper px-6 font-sans text-sm font-bold uppercase tracking-wide text-paper no-underline"
            >
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <img
            src={withBase("/images/full-home.jpg")}
            alt="Georgia home with a matching addition and covered porch"
            className="aspect-4/3 w-full object-cover"
          />
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-pfeifer">
              The Pfeifer Building Co. story
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              Founded in 1997 by homebuilders who stayed local
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Duey Pfeifer started the company after years building new houses for Ravin Homes. As
              Peachtree City filled in, the work shifted to improving the homes already here. Quality
              and customer service — not a revolving door of crews — is still the point.
            </p>
            <Link
              to="/about/"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-pfeifer no-underline"
            >
              Read more <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Services provided by Pfeifer Building Company
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            If your project is not listed, ask. We will tell you if we can take it. Click a category
            for the gallery and the details.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="group overflow-hidden bg-paper no-underline shadow-sm"
              >
                <img src={withBase(s.image)} alt="" className="aspect-16/10 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-display text-xl text-ink group-hover:text-pfeifer">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-cream">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-paper">Numbers that still mean something</h2>
          <p className="mt-3 max-w-2xl text-cream/75">
            Pfeifer Building Company has been around a long time, and we will still be here. Choose
            the company that follows through.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-display text-5xl text-paper">1500+</p>
              <p className="mt-2 text-sm text-cream/75">
                Satisfied customers in Fayette and Coweta Counties alone.
              </p>
            </div>
            <div>
              <p className="font-display text-5xl text-paper">98%</p>
              <p className="mt-2 text-sm text-cream/75">Customer satisfaction rate.</p>
            </div>
            <div>
              <p className="font-display text-5xl text-paper">500+</p>
              <p className="mt-2 text-sm text-cream/75">
                Construction permits pulled in Peachtree City in the last 10 years.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ReviewBanner />

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-ink">Meet the Pfeifer team</h2>
          <p className="mt-3 max-w-2xl text-muted">
            From Duey’s design and estimating to Brooks on the jobs and Brian in the office, it is
            the same people you will talk to next month.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <article key={m.name} className="border border-line p-5">
                <div className="flex size-14 items-center justify-center bg-pfeifer font-display text-lg text-paper">
                  {m.initials}
                </div>
                <h3 className="mt-4 font-display text-xl text-ink">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-pfeifer">
                  {m.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-ink">Our process is simple</h2>
          <p className="mt-3 max-w-2xl text-muted">
            After 30 years we have ironed out the wrinkles. It starts with communication.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Initial consultation",
                b: "Talk through the idea with a project manager so the plan actually matches the house and the budget.",
              },
              {
                n: "02",
                t: "Design & planning",
                b: "We design the project, pull permits, and coordinate the trades before anyone swings a hammer.",
              },
              {
                n: "03",
                t: "Construction",
                b: "Materials, inspections, and install to spec. Then we get you through the last punch list.",
              },
            ].map((s) => (
              <li key={s.n} className="border border-line bg-paper p-6">
                <p className="font-display text-2xl text-pfeifer">{s.n}</p>
                <h3 className="mt-2 font-display text-xl">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-ink">Recent covered porch</h2>
          <p className="mt-2 text-muted">Before-and-after style work we do every season in Peachtree City.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <img src={withBase("/images/porch.jpg")} alt="Screened porch addition looking onto a Georgia yard" className="aspect-16/10 w-full object-cover" />
            <img src={withBase("/images/hero-deck.jpg")} alt="Composite deck with white railings" className="aspect-16/10 w-full object-cover" />
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
