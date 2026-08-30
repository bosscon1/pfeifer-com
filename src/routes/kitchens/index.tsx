import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/kitchens/")({
  head: () => ({
    meta: [
      { title: "Kitchen Remodels" },
      {
        name: "description",
        content:
          "Kitchen renovations in Peachtree City and Fayette County — cabinets, quartz, tile, and full remodels by Pfeifer Building Company.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/kitchens/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/kitchen.jpg"
      eyebrow="Interiors"
      title="Kitchen Remodels"
      lede="Upgrade and update the room you actually live in."
      sections={[
        {
          heading: "Kitchen renovations",
          body: "The kitchen is the most used room in the house. Outdated finishes and a bad layout waste that space. A remodel is not just prettier cabinets — it is how the room works every morning.",
        },
        {
          heading: "Countertops, cabinets, tile, appliances, and finishes",
          body: "We work with leading cabinet manufacturers and local tile suppliers, plus quality countertop fabricators in Atlanta, so you have a real selection of finishes and function — not one catalog.",
        },
        {
          heading: "Trusted kitchen installer in Peachtree City",
          body: "Modern, farmhouse, or something in between. We manage the job from the first idea through the last punch list so the kitchen is both beautiful and practical.",
        },
      ]}
      photos={[
        { src: "/images/kitchen.jpg", alt: "White shaker kitchen with quartz island" },
        { src: "/images/full-home.jpg", alt: "Home exterior after remodel" },
        { src: "/images/bathroom.jpg", alt: "Related interior finish work" },
      ]}
    />
  );
}
