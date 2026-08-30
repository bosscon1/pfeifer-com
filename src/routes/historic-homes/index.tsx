import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/historic-homes/")!;

export const Route = createFileRoute("/historic-homes/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
