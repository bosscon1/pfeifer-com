import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/walk-in-pantries/")!;

export const Route = createFileRoute("/walk-in-pantries/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
