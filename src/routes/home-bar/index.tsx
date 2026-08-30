import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/home-bar/")!;

export const Route = createFileRoute("/home-bar/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
