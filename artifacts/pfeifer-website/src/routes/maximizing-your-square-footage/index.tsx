import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/maximizing-your-square-footage/")!;

export const Route = createFileRoute("/maximizing-your-square-footage/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
