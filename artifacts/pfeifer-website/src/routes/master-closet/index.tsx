import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/master-closet/")!;

export const Route = createFileRoute("/master-closet/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
