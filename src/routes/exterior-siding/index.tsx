import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/exterior-siding/")!;

export const Route = createFileRoute("/exterior-siding/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
