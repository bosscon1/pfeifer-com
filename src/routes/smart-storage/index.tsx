import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/smart-storage/")!;

export const Route = createFileRoute("/smart-storage/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
