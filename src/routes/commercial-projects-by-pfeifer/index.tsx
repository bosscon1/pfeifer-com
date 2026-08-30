import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/commercial-projects-by-pfeifer/")!;

export const Route = createFileRoute("/commercial-projects-by-pfeifer/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
