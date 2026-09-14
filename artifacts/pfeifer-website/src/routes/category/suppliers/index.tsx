import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

const posts = [
  {
    href: "/decking-options/",
    title: "Decking Options",
    excerpt:
      "Wood vs. composite is a maintenance decision as much as a budget decision. Trex and KDAT both have a place.",
  },
  {
    href: "/decking-and-handrails/",
    title: "Decking and Handrails",
    excerpt: "The walking surface and the rail specified together so the deck is one job.",
  },
];

export const Route = createFileRoute("/category/suppliers/")({
  head: () => ({
    meta: [
      { title: "Suppliers" },
      {
        name: "description",
        content:
          "Suppliers, brands, and products Pfeifer Building Company uses on Fayette and Coweta jobs — decking, rails, and more.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/category/suppliers/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageHero
        image="/images/hero-deck.jpg"
        alt="Composite decking and rails"
        title="Suppliers"
        lede="Suppliers, brands, products, and ideas we believe in and use every day."
      />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <ul className="divide-y divide-line">
          {posts.map((p) => (
            <li key={p.href} className="py-8">
              <h2 className="font-display text-2xl">
                <Link to={p.href} className="text-ink no-underline hover:text-pfeifer">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-muted">{p.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </main>
  );
}
