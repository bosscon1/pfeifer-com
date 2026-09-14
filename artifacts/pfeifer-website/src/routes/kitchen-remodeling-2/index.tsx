import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/kitchen-remodeling-2/")!;

export const Route = createFileRoute("/kitchen-remodeling-2/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
