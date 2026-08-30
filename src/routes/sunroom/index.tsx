import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/sunroom/")({
  head: () => ({
    meta: [
      { title: "Sunroom" },
      {
        name: "description",
        content:
          "Sunroom additions in Fayette and Coweta Counties — three-season and four-season rooms with insulated glass by Pfeifer Building Company.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/sunroom/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/addition.jpg"
      eyebrow="Additions"
      title="Sunroom"
      lede="A sunroom is a real room with a lot of glass. It is not a screened porch with better marketing."
      sections={[
        {
          heading: "Sunroom additions: light, year-round",
          body: "Sunrooms suit Georgia when they are designed as three-season or four-season rooms on purpose. We build them throughout Fayette and Coweta — breakfast rooms, family rooms, and offices that happen to have a wall of glass.",
        },
        {
          heading: "Three-season vs four-season",
          body: "Three-season rooms have substantial glass and basic heat. They work spring through fall. Four-season rooms get insulation, proper glass, and HVAC so January is usable. Foundation, roof, and window spec follow the house and the energy code, not a patio kit.",
        },
        {
          heading: "Orientation, permits, and the existing house",
          body: "South glass overheats without shade. Match roof, trim, and access so it looks original. Permits and setbacks are the same as any addition. If you want the article version, read Modern Sunroom Addition.",
        },
      ]}
      photos={[
        { src: "/images/addition.jpg", alt: "Sunroom addition matching the house" },
        { src: "/images/porch.jpg", alt: "Related outdoor living space" },
        { src: "/images/full-home.jpg", alt: "Home exterior after an addition" },
      ]}
    />
  );
}
