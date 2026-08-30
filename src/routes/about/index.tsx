import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { TEAM } from "@/data/site";

export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "About Pfeifer Building Company" },
      {
        name: "description",
        content:
          "Pfeifer Building Company has renovated kitchens, bathrooms, garages, additions, and decks in Fayette and Coweta Counties since 1997.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/about/" }],
  }),
  component: About,
});

function About() {
  return (
    <main>
      <PageHero
        image="/images/full-home.jpg"
        alt="Georgia home remodeled by Pfeifer Building Company"
        eyebrow="Company"
        title="About Pfeifer Building Company"
        lede="28 years of exceptional craftsmanship in Fayette and Coweta Counties."
      />
      <article className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-lg leading-relaxed text-ink">
          Pfeifer Building Company has been renovating kitchens, bathrooms, garages, additions,
          decks, and homes since 1997, and is known throughout Fayette and Coweta counties for
          craftsmanship and customer satisfaction.
        </p>
        <p className="mt-5 leading-relaxed text-muted">
          Founded as a small team dedicated to the work, Pfeifer grew into a name homeowners in
          south metro Atlanta actually recognize — primarily Fayette and Coweta. We serve
          residential clients, commercial and industrial customers, and government municipalities.
        </p>
        <p className="mt-5 leading-relaxed text-muted">
          Trade magazines have listed the company among the top 500 building companies nationally,
          and we have received awards for construction and customer service. We do not put a license
          number on this page; ask the office if you need paperwork.
        </p>
      </article>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-ink">The people you will deal with</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {TEAM.map((m) => (
              <article key={m.name} className="border border-line bg-paper p-6">
                <div className="flex size-14 items-center justify-center bg-pfeifer font-display text-lg text-paper">
                  {m.initials}
                </div>
                <h3 className="mt-4 font-display text-2xl">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-pfeifer">
                  {m.role}
                </p>
                <p className="mt-3 leading-relaxed text-muted">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
