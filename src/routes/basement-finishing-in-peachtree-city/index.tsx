import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/basement-finishing-in-peachtree-city/")!;

export const Route = createFileRoute("/basement-finishing-in-peachtree-city/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
