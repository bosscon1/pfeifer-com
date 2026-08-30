import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/decks-by-pfeifer/")({
  head: () => ({
    meta: [
      { title: "Decks by Pfeifer" },
      {
        name: "description",
        content:
          "Deck rebuilds, Trex and composite, KDAT, and covered decks in Peachtree City, Tyrone, and across Fayette and Coweta Counties.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://pfeiferbuild.com/decks-by-pfeifer/" },
      { rel: "preload", as: "image", href: "/images/hero-decks.jpg" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/hero-decks.jpg"
      video="/videos/hero-decks.mp4"
      eyebrow="Outdoor living"
      title="Decks by Pfeifer"
      lede="Build a new deck or remodel the one you have. Wood rebuilds, composite, KDAT, covered decks, stairs, and rails."
      sections={[
        {
          heading: "Rebuild wood decks",
          body: "Pfeifer often has more decks under construction at one time than many contractors build in a year. Wood decks are a large part of the shop. We have crews dedicated to demolition and rebuilds across Fayette and Coweta.",
        },
        {
          heading: "Composite deck installer",
          body: "Composite is popular because it does not split, splinter, rot, or need the same yearly upkeep as raw wood. As a leading Trex installer in Fayette and Coweta, we also install TimberTech, MoistureShield, and other local boards when they fit the job.",
        },
        {
          heading: "Peachtree City’s deck contractor",
          body: "We install most composite brands and pressure-treated KDAT. Covered decks are routine. If the structure is sound, we salvage it and replace boards, stairs, and handrails instead of tearing the whole thing down.",
        },
      ]}
      photos={[
        { src: "/images/hero-deck.jpg", alt: "Elevated composite deck with white railings" },
        { src: "/images/deck-stairs.jpg", alt: "Rebuilt wood deck stairs and railings" },
        { src: "/images/porch.jpg", alt: "Covered porch connected to a deck" },
      ]}
    />
  );
}
