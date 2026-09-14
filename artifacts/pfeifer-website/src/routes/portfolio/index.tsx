import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SERVICES } from "@/data/site";

const extra = [
  { src: "/images/deck-stairs.jpg", alt: "Rebuilt deck stairs and railings", cat: "Decks" },
  { src: "/images/porch.jpg", alt: "Screened porch addition", cat: "Porches" },
];

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio | Pfeifer Building Company" },
      {
        name: "description",
        content:
          "Project gallery — decks, kitchens, baths, garages, additions, and basements in Fayette and Coweta Counties.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/portfolio/" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  return (
    <main>
      <PageHero
        image="/images/hero-deck.jpg"
        alt="Composite deck and covered porch in Fayette County"
        title="Project gallery"
        lede="A sample of decks, kitchens, baths, garages, additions, and basements we build in Fayette and Coweta Counties."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.href} to={s.href} className="group no-underline">
              <img src={s.image} alt={s.title} className="aspect-16/10 w-full object-cover" />
              <h2 className="mt-3 font-display text-xl text-ink group-hover:text-pfeifer">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.blurb}</p>
            </Link>
          ))}
          {extra.map((e) => (
            <figure key={e.src}>
              <img src={e.src} alt={e.alt} className="aspect-16/10 w-full object-cover" />
              <figcaption className="mt-3 font-display text-xl text-ink">{e.cat}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
