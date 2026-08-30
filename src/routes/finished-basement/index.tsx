import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/finished-basement/")!;

export const Route = createFileRoute("/finished-basement/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
