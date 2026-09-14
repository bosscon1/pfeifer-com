import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/city-page";

export const Route = createFileRoute("/fayetteville-ga/")({
  head: () => ({
    meta: [
      { title: "Fayetteville, GA" },
      { name: "description", content: "Remodeling and construction in Fayetteville, GA — kitchens, baths, additions, and restorations by Pfeifer Building Company." },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/fayetteville-ga/" }],
  }),
  component: () => (
    <CityPage
      city="Fayetteville"
      county="Fayette County"
      title="Remodeling & construction services in Fayetteville, GA"
      lede="From kitchen and bathroom renovations to full-scale additions, more than 25 years of craftsmanship in the heart of Fayette County."
      why="We know Fayetteville — historic downtown and the newer neighborhoods expanding across the county seat. City building codes, zoning, and a mix of old and new houses. Licensed and insured. We serve homeowners and businesses across Fayette County, including Peachtree City, Tyrone, and Brooks. Referrals, five-star reviews, and people we still talk to after the punch list."
    />
  ),
});
