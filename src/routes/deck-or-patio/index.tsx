import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/deck-or-patio/")!;

export const Route = createFileRoute("/deck-or-patio/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
