import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/kitchen-design/")!;

export const Route = createFileRoute("/kitchen-design/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
