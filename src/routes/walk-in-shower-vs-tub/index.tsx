import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/walk-in-shower-vs-tub/")!;

export const Route = createFileRoute("/walk-in-shower-vs-tub/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
