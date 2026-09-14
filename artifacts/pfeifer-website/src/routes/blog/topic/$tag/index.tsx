import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogShell } from "@/components/blog-listing";
import { articlesByTag, isTag, TAG_LABEL } from "@/data/taxonomy";

export const Route = createFileRoute("/blog/topic/$tag/")({
  beforeLoad: ({ params }) => {
    if (!isTag(params.tag)) throw notFound();
  },
  head: ({ params }) => {
    const label = isTag(params.tag) ? TAG_LABEL[params.tag] : params.tag;
    return {
      meta: [
        { title: `${label} articles | Pfeifer Building Company` },
        {
          name: "description",
          content: `Articles tagged ${label} — Pfeifer Building Company in Fayette and Coweta Counties.`,
        },
      ],
      links: [{ rel: "canonical", href: `https://pfeiferbuild.com/blog/topic/${params.tag}/` }],
    };
  },
  component: TopicPage,
});

function TopicPage() {
  const { tag } = Route.useParams();
  const list = articlesByTag(tag);
  const label = isTag(tag) ? TAG_LABEL[tag] : tag;
  return (
    <BlogShell
      title={label}
      lede={`Articles about ${label.toLowerCase()} from the shop notes.`}
      articles={list}
      activeTag={tag}
    />
  );
}
