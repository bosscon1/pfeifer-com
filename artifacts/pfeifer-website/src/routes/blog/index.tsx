import { createFileRoute } from "@tanstack/react-router";
import { BlogShell } from "@/components/blog-listing";
import { blogArticles, pageSlice } from "@/data/taxonomy";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Articles, News, and Events | Pfeifer Building Company" },
      {
        name: "description",
        content:
          "Notes on decks, porches, kitchens, baths, garages, and remodeling in Fayette and Coweta Counties.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pfeiferbuild.com/blog/" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const all = blogArticles();
  return (
    <BlogShell
      title="Articles, News, and Events"
      lede="Practical notes for homeowners in Fayette and Coweta — filter by month or topic."
      articles={pageSlice(1, all)}
      page={1}
      total={all.length}
    />
  );
}
