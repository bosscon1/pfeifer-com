import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/bathroom-remodeling/")!;

export const Route = createFileRoute("/bathroom-remodeling/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
