import { createFileRoute } from "@tanstack/react-router";
import { BidForm } from "@/components/bid-form";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/get-started/")({
  head: () => ({
    meta: [
      { title: "Get Started | Pfeifer Building Company" },
      {
        name: "description",
        content:
          "Request a bid from Pfeifer Building Company. Tell us the project type and your Fayette or Coweta neighborhood.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/get-started/" }],
  }),
  component: GetStarted,
});

function GetStarted() {
  return (
    <main>
      <PageHero
        image="/images/kitchen.jpg"
        alt="Kitchen remodel in Fayette County"
        title="Get started"
        lede="Name, phone, city, and what you want built. We will follow up from the Tyrone office."
      />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <p className="mb-8 text-muted">
          Prefer to talk now? Call{" "}
          <a href={SITE.phoneHref} className="font-semibold text-pfeifer">
            {SITE.phone}
          </a>
          .
        </p>
        <BidForm />
      </section>
    </main>
  );
}
