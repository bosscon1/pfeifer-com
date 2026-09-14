import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";

export const Route = createFileRoute("/newnan-ga/")({
  head: () => ({
    meta: [
      { title: "Newnan, GA" },
      {
        name: "description",
        content:
          "Custom renovations, additions, and builds in Newnan and Coweta County by Pfeifer Building Company.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/newnan-ga/" }],
  }),
  component: () => (
    <CityPage
      city="Newnan"
      county="Coweta County"
      title="Remodeling & construction services in Newnan, GA"
      lede="Renovations, additions, and full builds that respect Newnan’s mix of historic charm and new growth."
      why="Newnan is growing fast, which means opportunity and extra review. We know Coweta County’s permitting, neighborhood standards, and local building trends. Licensed, insured, and local — five-star reviews and referrals, not a crew from three counties over."
    />
  ),
});
