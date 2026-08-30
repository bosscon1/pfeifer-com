import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/screened-in-porches/")!;

export const Route = createFileRoute("/screened-in-porches/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
