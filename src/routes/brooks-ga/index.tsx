import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";

export const Route = createFileRoute("/brooks-ga/")({
  head: () => ({
    meta: [
      { title: "Brooks, GA" },
      {
        name: "description",
        content:
          "Construction and remodeling in Brooks, Fayette County — additions, repairs, and renovations by Pfeifer Building Company.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/brooks-ga/" }],
  }),
  component: () => (
    <CityPage
      city="Brooks"
      county="Fayette County"
      title="Remodeling & construction services in Brooks, GA"
      lede="Work that fits a smaller Fayette County community — space, privacy, and Southern character."
      why="Brooks is not a subdivision mill. Homes here blend acreage and small-town feel. We focus on thoughtful design, energy, and craftsmanship that belongs on the lot. Personalized service and clear timelines from start to finish."
    />
  ),
});
