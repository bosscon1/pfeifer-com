import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";
import { loadGalleryAlbum } from "@/lib/gallery.functions";

const HERO = "/images/poolhouses/pfeifer-peachtree-city-pool-house-01.jpg";

export const Route = createFileRoute("/pool-houses-by-pfeifer/")({
  head: () => ({
    meta: [
      { title: "Pool Houses by Pfeifer" },
      {
        name: "description",
        content:
          "Pool houses, cabanas, pool baths, and outdoor kitchens in Peachtree City, Fayetteville, and across Fayette and Coweta Counties.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/pool-houses-by-pfeifer/" }],
  }),
  loader: async () => {
    try {
      return await loadGalleryAlbum({ data: { category: "poolhouses" } });
    } catch {
      return {
        featuredUrl: HERO,
        videoUrl: null as string | null,
        overlay: 55,
        photos: [] as { src: string; fullSrc: string; alt: string; name: string }[],
      };
    }
  },
  component: Page,
});

function Page() {
  const album = Route.useLoaderData();
  return (
    <ServicePage
      image={album.featuredUrl || HERO}
      video={album.videoUrl || undefined}
      overlay={album.overlay}
      eyebrow="Outdoor living"
      title="Pool Houses by Pfeifer"
      lede="A cabana, a pool bath, or a full pool house — built to match the house you already have."
      sections={[
        {
          heading: "Pool houses and cabanas",
          body: "From a changing room at the water’s edge to a full pool house with a bath and kitchen. We have built these in Peachtree City, Fayetteville, and across Fayette and Coweta. Stucco, stone, and roofing that read as part of the house, not a kit dropped in the yard.",
        },
        {
          heading: "Outdoor kitchen and bath",
          body: "Many pool houses are really an outdoor kitchen, a half bath, and a covered sitting area. We coordinate plumbing, electrical, and the finish so it looks like it has always been there. Grills, counters, trellis, and storage are part of the same job.",
        },
        {
          heading: "Permits and the backyard",
          body: "We pull the permits and take the job through inspection. Lot coverage, setbacks, and HOA drawings are the same work we already do on garages and porches. If you want the pool house this season, start with a site visit.",
        },
      ]}
      photos={album.photos}
      photoLayout="masonry"
    />
  );
}
