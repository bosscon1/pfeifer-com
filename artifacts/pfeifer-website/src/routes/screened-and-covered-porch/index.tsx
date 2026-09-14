import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/screened-and-covered-porch/")!;

export const Route = createFileRoute("/screened-and-covered-porch/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
