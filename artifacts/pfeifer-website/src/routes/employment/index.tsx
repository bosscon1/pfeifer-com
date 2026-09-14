import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/employment/")({
  head: () => ({
    meta: [
      { title: "Employment" },
      {
        name: "description",
        content:
          "Work at Pfeifer Building Company in Tyrone, GA — carpenters, trades, and office roles for a Fayette and Coweta GC.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/employment/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageHero
        image="/images/full-home.jpg"
        alt="Pfeifer jobsite in Fayette County"
        title="Employment"
        lede="We hire people who want to stay in Fayette and Coweta and do the work correctly."
      />
      <article className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-display text-2xl text-ink">Working here</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Pfeifer Building Company is a licensed Georgia general contractor based in Tyrone. The
          shop is residential and commercial work in two counties — decks, kitchens, baths,
          garages, additions, and the occasional commercial building. We are not a traveling crew
          and we are not a hiring mill.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          We are not advertising a specific opening on this page. If you are a carpenter,
          tradesman, or project person who already lives in the area and wants to work for a
          company that has been here since 1997, send a short note and a resume to{" "}
          <a href={SITE.emailHref}>{SITE.email}</a> or call {SITE.phone}. We will tell you honestly
          whether there is a seat.
        </p>
        <p className="mt-4 text-sm text-muted">
          Office: {SITE.addressLine}, {SITE.cityLine}
        </p>
      </article>
      <CtaBand title="Questions about the shop?" />
    </main>
  );
}
