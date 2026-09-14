import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/commercial-projects/")!;

export const Route = createFileRoute("/commercial-projects/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
