import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/outdoor-living/")!;

export const Route = createFileRoute("/outdoor-living/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
