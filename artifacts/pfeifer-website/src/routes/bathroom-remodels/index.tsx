import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/bathroom-remodels/")({
  head: () => ({
    meta: [
      { title: "Bathroom Remodels" },
      {
        name: "description",
        content:
          "Bathroom renovations in Fayette and Coweta Counties — walk-in showers, tile, plumbing, and licensed general contracting by Pfeifer.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/bathroom-remodels/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/bathroom.jpg"
      eyebrow="Interiors"
      title="Bathroom Remodels"
      lede="Upgrade fixtures and finishes so guests are not afraid of the hall bath."
      sections={[
        {
          heading: "Bathroom renovations",
          body: "A bathroom is not most people’s favorite room, but outdated tile and a rolling plastic shower door make a house feel tired. Time to replace lime-green tile with a pan and tile that last.",
        },
        {
          heading: "What actually goes wrong",
          body: "The room is small. The trades are not. Demo is the easy part. Moving a light, converting copper stub-outs to PEX without relying on push-fit fittings, and getting a shower pan right are where jobs go sideways. Tile looks easy on television. It is not practice work.",
        },
        {
          heading: "Licensed GC, local work",
          body: "We work almost exclusively in Fayette and Coweta. Chances are we have already built in your neighborhood. Call and we will put a quote together.",
        },
      ]}
      photos={[
        { src: "/images/bathroom.jpg", alt: "Walk-in tiled shower and quartz vanity" },
        { src: "/images/kitchen.jpg", alt: "Interior remodel finishes" },
        { src: "/images/basement.jpg", alt: "Lower-level bath and rec space" },
      ]}
    />
  );
}
