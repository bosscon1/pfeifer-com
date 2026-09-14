import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/basement-remodels/")({
  head: () => ({
    meta: [
      { title: "Basement Remodels by Pfeifer" },
      {
        name: "description",
        content:
          "Finish a basement in Peachtree City, Tyrone, or Fayetteville — family rooms, theaters, bars, offices, and guest suites.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/basement-remodels/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/basement.jpg"
      eyebrow="Below grade"
      title="Basement Remodels by Pfeifer"
      lede="Turn wasted square footage into a family room, theater, bar, office, or guest suite."
      sections={[
        {
          heading: "Why finish it",
          body: "A professionally finished basement adds comfort and usable space. Moisture-resistant materials, climate, and a layout that matches how you actually live — gym, playroom, wet bar, or theater.",
        },
        {
          heading: "Design through punch list",
          body: "We handle design, permits, and the trades. Cost-plus pricing. Workmanship warranty. No mystery allowances.",
        },
        {
          heading: "Local basement work",
          body: "Peachtree City, Fayetteville, Tyrone, and the rest of Fayette and Coweta. Below-grade work in Georgia means moisture first, then the pretty stuff.",
        },
      ]}
      photos={[
        { src: "/images/basement.jpg", alt: "Finished basement rec room with wet bar" },
        { src: "/images/bathroom.jpg", alt: "Lower-level bathroom finishes" },
        { src: "/images/kitchen.jpg", alt: "Secondary kitchen or bar-quality cabinets" },
      ]}
    />
  );
}
