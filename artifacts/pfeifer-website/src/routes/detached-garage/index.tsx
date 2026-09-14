import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/detached-garage/")!;

export const Route = createFileRoute("/detached-garage/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
