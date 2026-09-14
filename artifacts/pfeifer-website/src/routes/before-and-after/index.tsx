import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

const jobs = [
  {
    title: "New screened porch",
    place: "Fayetteville, GA",
    src: "/images/porch.jpg",
    alt: "New screened porch in Fayetteville, GA",
  },
  {
    title: "New TREX deck & covered porch",
    place: "Peachtree City, GA",
    src: "/images/hero-deck.jpg",
    alt: "Trex deck and covered porch in Peachtree City",
  },
  {
    title: "New attached garage",
    place: "Peachtree City, GA",
    src: "/images/garage.jpg",
    alt: "New attached garage in Peachtree City",
  },
  {
    title: "New deck and covered porch",
    place: "Peachtree City, GA",
    src: "/images/hero-porch.jpg",
    alt: "Deck and covered porch in Peachtree City",
  },
  {
    title: "Outdoor living & pavilion",
    place: "Peachtree City, GA",
    src: "/images/hero-decks.jpg",
    alt: "Pool pavilion and outdoor living in Peachtree City",
  },
];

export const Route = createFileRoute("/before-and-after/")({
  head: () => ({
    meta: [
      { title: "Before and After Photos" },
      {
        name: "description",
        content:
          "Before and after photos of porches, decks, and garages by Pfeifer Building Company in Peachtree City and Fayetteville.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/before-and-after/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageHero
        image="/images/hero-porch.jpg"
        alt="Finished covered porch"
        title="Before and after photos"
        lede="A sample of porches, decks, and garages we have finished in Fayette County."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 sm:grid-cols-2">
          {jobs.map((j) => (
            <figure key={j.title}>
              <img src={j.src} alt={j.alt} className="aspect-16/10 w-full object-cover" />
              <figcaption className="mt-3">
                <p className="font-display text-xl text-ink">{j.title}</p>
                <p className="text-sm uppercase tracking-wide text-muted">{j.place}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          More work lives on the{" "}
          <Link to="/portfolio/" className="text-pfeifer no-underline hover:underline">
            project gallery
          </Link>{" "}
          and the individual service pages.
        </p>
      </section>
      <CtaBand />
    </main>
  );
}
