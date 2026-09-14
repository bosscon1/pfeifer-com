import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/commercial-buildings/")({
  head: () => ({
    meta: [
      { title: "Commercial Construction" },
      {
        name: "description",
        content:
          "Commercial buildings and tenant buildouts in Fayette and Coweta Counties. Licensed Georgia GC — fire, ADA, and county review.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/commercial-buildings/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/commercial.jpg"
      eyebrow="Commercial GC"
      title="Commercial Construction"
      lede="Build the next commercial project with a licensed Georgia general contractor who already knows the county, the fire marshall, and ADA."
      sections={[
        {
          heading: "Commercial buildings and structures",
          body: "A business cannot live in the garage forever. New buildings, expansions, or investment work — we GC the job.",
        },
        {
          heading: "Commercial experience matters",
          body: "Plenty of remodelers are not licensed as a Georgia GC. Even fewer belong on commercial work. Fire codes, ADA, health department, and environmental review are a different animal from a kitchen.",
        },
        {
          heading: "Tenant buildouts",
          body: "We deal with city and county building departments, health departments, and the fire marshall. That is the work. The finishes come after the reviews.",
        },
      ]}
      photos={[
        { src: "/images/commercial.jpg", alt: "Commercial storefront buildout" },
        { src: "/images/garage.jpg", alt: "Commercial-scale outbuilding" },
        { src: "/images/full-home.jpg", alt: "Exterior construction quality" },
      ]}
    />
  );
}
