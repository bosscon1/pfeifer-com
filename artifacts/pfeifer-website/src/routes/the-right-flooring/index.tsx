import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/the-right-flooring/")!;

export const Route = createFileRoute("/the-right-flooring/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
