import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/decking-and-handrails/")!;

export const Route = createFileRoute("/decking-and-handrails/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
