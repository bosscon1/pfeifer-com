import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";

export const Route = createFileRoute("/tyrone-ga/")({
  head: () => ({
    meta: [
      { title: "Tyrone, GA" },
      {
        name: "description",
        content:
          "Pfeifer Building Company is based in Tyrone, GA. Remodeling and construction throughout Fayette County.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/tyrone-ga/" }],
  }),
  component: () => (
    <CityPage
      city="Tyrone"
      county="Fayette County"
      title="Remodeling & construction services in Tyrone, GA"
      lede="The office is here. Kitchens, expansions, and older-home updates across Tyrone and greater Fayette County."
      why="Tyrone is a tight-knit town of about 7,000. Personalized service and dependable work matter. We know local permitting, neighborhood guidelines, and what actually gets built here. Residential and commercial — Peachtree City, Fayetteville, and beyond."
    />
  ),
});
