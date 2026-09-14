import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/outdoor-kitchen/")({
  head: () => ({
    meta: [
      { title: "Outdoor Kitchen" },
      {
        name: "description",
        content:
          "Outdoor kitchens in Peachtree City and Fayette County — grills, counters, and covered structures by Pfeifer Building Company.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/outdoor-kitchen/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/porch.jpg"
      eyebrow="Outdoor living"
      title="Outdoor Kitchen"
      lede="A grill on the patio is not an outdoor kitchen. Counters, gas, power, and a roof that belongs on the house are."
      sections={[
        {
          heading: "What the job actually is",
          body: "Structure first — often a covered porch or pavilion — then gas, electrical, water if you want a sink, and finishes that survive Georgia weather. We build these with the same crews that do porches and decks, not a separate “outdoor living” franchise.",
        },
        {
          heading: "Covered vs. open",
          body: "A roof keeps the cook and the equipment usable in July rain. Screen is optional. HOA review in Peachtree City will have opinions about the roof and the masonry. We would rather have that paper before we set the island.",
        },
        {
          heading: "Built with the rest of the outdoor room",
          body: "Most outdoor kitchens we build sit on a porch or next to a pool pavilion. See covered porches and decks if the kitchen is only one piece of a larger backyard.",
        },
      ]}
      photos={[
        { src: "/images/porch.jpg", alt: "Covered outdoor living with room for a kitchen" },
        { src: "/images/hero-porch.jpg", alt: "Porch interior that can take outdoor cooking" },
        { src: "/images/hero-deck.jpg", alt: "Deck adjacent to an outdoor kitchen" },
      ]}
    />
  );
}
