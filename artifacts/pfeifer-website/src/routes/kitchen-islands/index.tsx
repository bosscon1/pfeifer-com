import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/kitchen-islands/")!;

export const Route = createFileRoute("/kitchen-islands/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
