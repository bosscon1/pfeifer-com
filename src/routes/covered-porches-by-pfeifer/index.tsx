import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/covered-porches-by-pfeifer/")({
  head: () => ({
    meta: [
      { title: "Covered Porches by Pfeifer" },
      {
        name: "description",
        content:
          "Covered and screened porches in Peachtree City, Tyrone, and across Fayette and Coweta Counties. Fireplaces, T&G ceilings, and HOA drawings.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/covered-porches-by-pfeifer/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/hero-porch.jpg"
      video="/videos/hero-porch.mp4"
      eyebrow="Outdoor living"
      title="Covered Porches by Pfeifer"
      lede="Build a covered or screened porch you will actually sit on — shade, rain, and fewer gnats, tied into the house you already own."
      sections={[
        {
          heading: "Screen porch builders & remodelers",
          body: "We design and build custom outdoor rooms across Fayette and Coweta that let you use the backyard without bugs, weather, or debris. Screen an existing porch or build new with a real roof. Both are weekly work for this shop.",
        },
        {
          heading: "Covered porch contractors",
          body: "A professionally built covered porch adds usable square footage and curb appeal. We tailor modern or traditional details to the house. Materials we actually use: KDAT, cedar, Fypon, Hardie — chosen so the porch still looks right with minimal upkeep.",
        },
        {
          heading: "Peachtree City’s screened porch contractor",
          body: "We produce drawings for HOA, city, or county submittal. Fireplace, tongue-and-groove ceilings, LED, heaters, fans, and TV outlets are part of the build, not a change-order at the end. Trim and flashing that last in Georgia weather.",
        },
      ]}
      photos={[
        { src: "/images/porch.jpg", alt: "Covered porch in Peachtree City, GA" },
        { src: "/images/hero-porch.jpg", alt: "Porch interior with fireplace and seating" },
        { src: "/images/hero-deck.jpg", alt: "Deck connected to a covered porch" },
      ]}
    />
  );
}
