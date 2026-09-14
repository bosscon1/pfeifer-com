import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/functional-kitchen/")!;

export const Route = createFileRoute("/functional-kitchen/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
