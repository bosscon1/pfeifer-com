import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { BlogShell } from "@/components/blog-listing";
import { blogArticles, pageCount, pageSlice } from "@/data/taxonomy";

export const Route = createFileRoute("/blog/page/$page/")({
  beforeLoad: ({ params }) => {
    const n = Number(params.page);
    if (!Number.isInteger(n) || n < 1) throw notFound();
    if (n === 1) throw redirect({ to: "/blog/" });
    const total = blogArticles().length;
    if (n > pageCount(total)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Articles, page ${params.page} | Pfeifer Building Company` },
      {
        name: "description",
        content: `Blog page ${params.page} — remodeling notes from Pfeifer Building Company in Fayette and Coweta Counties.`,
      },
    ],
    links: [{ rel: "canonical", href: `https://pfeiferbuild.com/blog/page/${params.page}/` }],
  }),
  component: BlogPaged,
});

function BlogPaged() {
  const { page } = Route.useParams();
  const n = Number(page);
  const all = blogArticles();
  return (
    <BlogShell
      title="Articles, News, and Events"
      lede={`Page ${n} of notes for homeowners in Fayette and Coweta.`}
      articles={pageSlice(n, all)}
      page={n}
      total={all.length}
    />
  );
}
