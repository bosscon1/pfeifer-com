import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";

export const Route = createFileRoute("/peachtree-city-ga/")({
  head: () => ({
    meta: [
      { title: "Peachtree City, GA" },
      {
        name: "description",
        content:
          "Remodeling and construction in Peachtree City, Fayette County. Kitchens, additions, decks, and repairs by Pfeifer Building Company.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/peachtree-city-ga/" }],
  }),
  component: () => (
    <CityPage
      city="Peachtree City"
      county="Fayette County"
      title="Remodeling & construction services in Peachtree City, GA"
      lede="Kitchen renovations, additions, and structural work from a local team with more than 25 years on the ground in PTC."
      why="We combine local knowledge, craftsmanship, and community ties. Licensed and insured for residential and commercial work, with deep experience in Fayette, Brooks, Tyrone, and the surrounding towns. Five-star reviews, neighbor referrals, and we are still here after the punch list."
    />
  ),
});
