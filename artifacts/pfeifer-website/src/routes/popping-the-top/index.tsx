import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/popping-the-top/")!;

export const Route = createFileRoute("/popping-the-top/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
