import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/wine-cellar/")!;

export const Route = createFileRoute("/wine-cellar/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
