import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SERVICES } from "@/data/site";

export const Route = createFileRoute("/category/services/")({
  head: () => ({
    meta: [
      { title: "Services offered by Pfeifer" },
      {
        name: "description",
        content:
          "Decks, kitchens, baths, garages, additions, basements, commercial, and full-home remodels in Fayette and Coweta Counties.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/category/services/" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <main>
      <PageHero
        image="/images/hero-deck.jpg"
        alt="Deck and outdoor living work by Pfeifer"
        title="Services offered by Pfeifer"
        lede="The work we actually take — close to our suppliers and our customer base."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link key={s.href} to={s.href} className="flex gap-4 border border-line p-4 no-underline">
              <img src={s.image} alt="" className="size-28 shrink-0 object-cover" />
              <div>
                <h2 className="font-display text-2xl text-ink">{s.title}</h2>
                <p className="mt-2 text-sm text-muted">{s.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
