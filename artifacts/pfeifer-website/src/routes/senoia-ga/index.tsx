import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";

export const Route = createFileRoute("/senoia-ga/")({
  head: () => ({
    meta: [
      { title: "Senoia, GA" },
      { name: "description", content: "Remodeling and construction in Senoia, GA — historic homes, kitchens, additions, and new work by Pfeifer Building Company." },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/senoia-ga/" }],
  }),
  component: () => (
    <CityPage
      city="Senoia"
      county="Coweta County"
      title="Remodeling & construction services in Senoia, GA"
      lede="Senoia is a growing Coweta County city with Southern charm and a cinematic main street. Restorations and modern work both belong here."
      why="Heritage architecture and new development in the same town. We bring permitting, finish carpentry, and a crew that already drives Senoia Road. Kitchen and bath remodels, additions, and historic work that respects the house. Local, responsive, and still here after the job."
    />
  ),
});
