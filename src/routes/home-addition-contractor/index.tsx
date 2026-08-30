import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";

export const Route = createFileRoute("/home-addition-contractor/")({
  head: () => ({
    meta: [
      { title: "Home Additions by Pfeifer" },
      {
        name: "description",
        content:
          "Room additions, second stories, in-law suites, sunrooms, and porches in Fayette and Coweta Counties.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/home-addition-contractor/" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      image="/images/addition.jpg"
      eyebrow="Expand the house you have"
      title="Home Additions by Pfeifer"
      lede="Seamless room additions, second stories, mother-in-law suites, sunrooms, and full expansions — 30+ years in Fayette and Coweta."
      sections={[
        {
          heading: "What we add",
          body: "Second-story additions, in-law suites and ADUs, sunrooms and four-season rooms, covered and screened porches, master suite expansions, family rooms, garage additions with bonus rooms, kitchen extensions and bump-outs.",
        },
        {
          heading: "Design-build, matched to the house",
          body: "One team from sketches through final inspection. The addition should look like it always belonged there — roofline, siding, and trim — not a box bolted on in 2026.",
        },
        {
          heading: "Licensed, insured, warrantied",
          body: "Georgia general contractor. Permits, $3 million liability, workmanship warranty. Cost-plus so the numbers stay visible.",
        },
      ]}
      photos={[
        { src: "/images/addition.jpg", alt: "Room addition matching a brick ranch" },
        { src: "/images/porch.jpg", alt: "Screened porch addition" },
        { src: "/images/full-home.jpg", alt: "Whole-house exterior after addition" },
      ]}
    />
  );
}
