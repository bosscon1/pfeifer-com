import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { CITIES, SITE } from "@/data/site";

export const Route = createFileRoute("/service-area/")({
  head: () => ({
    meta: [
      { title: "Current Service Area" },
      {
        name: "description",
        content:
          "Pfeifer Building Company works in Fayette and Coweta Counties — Peachtree City, Tyrone, Fayetteville, Brooks, Newnan, and Senoia.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/service-area/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageHero
        image="/images/full-home.jpg"
        alt="Homes in Fayette and Coweta Counties"
        title="Current service area"
        lede="Pfeifer is near you — as long as you live in Fayette or Coweta Counties."
      />
      <article className="mx-auto max-w-3xl px-4 py-14">
        <p className="leading-relaxed text-muted">
          Chances are we have done work in your neighborhood. We stay in these two counties on
          purpose: suppliers, inspectors, and the people who call us back in five years. We do not
          chase jobs three counties over.
        </p>
        <h2 className="mt-10 font-display text-2xl text-ink">Cities we work in</h2>
        <ul className="mt-4 space-y-2">
          {CITIES.map((c) => (
            <li key={c.href}>
              <Link to={c.href} className="text-pfeifer no-underline hover:underline">
                {c.name}, GA
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Also Sharpsburg, Turin, Palmetto, Fairburn, and the rest of Fayette and Coweta when the
          job is a fit. If you are outside those counties, we will say so.
        </p>
        <h2 className="mt-10 font-display text-2xl text-ink">A note on privacy</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Older versions of this page showed a map of completed jobs. Please do not stalk those
          houses or knock on the door. We value our customers’ privacy and we do not send
          strangers to their porch.
        </p>
        <p className="mt-8 text-sm text-muted">
          Office: {SITE.addressLine}, {SITE.cityLine} · {SITE.phone}
        </p>
      </article>
      <CtaBand title="In Fayette or Coweta?" />
    </main>
  );
}
