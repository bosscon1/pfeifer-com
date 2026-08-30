import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/transparent-pricing/")!;

export const Route = createFileRoute("/transparent-pricing/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
