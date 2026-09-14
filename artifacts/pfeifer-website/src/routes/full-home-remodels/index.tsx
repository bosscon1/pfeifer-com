import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/full-home-remodels/")({
  head: () => ({
    meta: [
      { title: "Full Home Remodels" },
      {
        name: "description",
        content:
          "Whole-house remodels in Peachtree City, Senoia, and Fayette County — kitchens, baths, systems, and exteriors under one GC.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/full-home-remodels/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/full-home.jpg"
      eyebrow="Whole house"
      title="Full Home Remodels"
      lede="Update layout, systems, and finishes so the house you own works like the house you want."
      sections={[
        {
          heading: "More than a kitchen",
          body: "Full-home remodels in Fayette and Coweta breathe new life into dated houses. Layout, light, and traffic flow first. Then kitchens and baths as the centerpieces — cabinets, counters, floors, fixtures.",
        },
        {
          heading: "Systems and the shell",
          body: "A bigger or more open house needs electrical and HVAC that match. Exteriors often move with the interior — siding, roofing, entries, and outdoor living so the street view matches the work inside.",
        },
        {
          heading: "One contractor",
          body: "Pfeifer manages the details in Peachtree City, Senoia, and the surrounding towns so the result is one house, not a stack of unfinished trades.",
        },
      ]}
      photos={[
        { src: "/images/full-home.jpg", alt: "Remodeled Georgia home exterior" },
        { src: "/images/kitchen.jpg", alt: "Kitchen as part of a full-home remodel" },
        { src: "/images/addition.jpg", alt: "Addition tied into a full remodel" },
      ]}
    />
  );
}
