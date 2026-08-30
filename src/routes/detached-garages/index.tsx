import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/detached-garages/")({
  head: () => ({
    meta: [
      { title: "Detached Garages by Pfeifer" },
      {
        name: "description",
        content:
          "New detached and attached garages, RV buildings, and bonus rooms above in Fayette and Coweta Counties.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/detached-garages/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/garage.jpg"
      eyebrow="Outbuildings"
      title="Detached Garages by Pfeifer"
      lede="More storage, a shop, or a bonus room — without crowding the house you already have."
      sections={[
        {
          heading: "New detached garages",
          body: "RV garages, hobby shops, contractor buildings, even work for the film industry. We take the job from permit application through certificate of occupancy. Mechanic pits in the slab and lifts are work we have already done.",
        },
        {
          heading: "Single-story and attached",
          body: "Classic attached garages, pole barns, and single-car additions. Lot size and setbacks sometimes make an attached garage easier to permit than a detached one. We will tell you which.",
        },
        {
          heading: "Garage with bonus room",
          body: "Park below, office or living space above — often the cheapest way to add isolated square footage. We have attached these to an existing wood deck so the house and garage read as one.",
        },
      ]}
      photos={[
        { src: "/images/garage.jpg", alt: "Two-story detached garage with bonus room" },
        { src: "/images/addition.jpg", alt: "Matching addition on a brick ranch" },
        { src: "/images/full-home.jpg", alt: "HardiePlank exterior with new porch" },
      ]}
    />
  );
}
