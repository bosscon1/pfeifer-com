import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/in-law-additions/")!;

export const Route = createFileRoute("/in-law-additions/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
