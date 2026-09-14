import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { articlesByYear, uniqueMonths } from "@/data/taxonomy";

export const Route = createFileRoute("/$year/")({
  beforeLoad: ({ params }) => {
    if (!/^\d{4}$/.test(params.year)) throw notFound();
    if (articlesByYear(params.year).length === 0) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.year} articles | Pfeifer Building Company` },
      {
        name: "description",
        content: `Articles from ${params.year} by Pfeifer Building Company in Fayette and Coweta Counties.`,
      },
    ],
    links: [{ rel: "canonical", href: `https://pfeiferbuild.com/${params.year}/` }],
  }),
  component: YearArchive,
});

function YearArchive() {
  const { year } = Route.useParams();
  const months = uniqueMonths().filter((m) => m.year === year);
  const count = articlesByYear(year).length;
  return (
    <main>
      <PageHero
        image="/images/addition.jpg"
        alt="Remodeling work in Fayette County"
        title={year}
        lede={`${count} articles from ${year}.`}
      />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <ul className="space-y-3">
          {months.map((m) => (
            <li key={m.href}>
              <Link to="/$year/$month/" params={{ year: m.year, month: m.month }} className="text-pfeifer no-underline hover:underline">
                {m.label} ({m.count})
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm">
          <Link to="/blog/" className="text-pfeifer no-underline hover:underline">
            All articles
          </Link>
        </p>
      </section>
      <CtaBand />
    </main>
  );
}
