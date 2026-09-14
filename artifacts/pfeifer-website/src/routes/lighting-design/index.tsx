import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/lighting-design/")!;

export const Route = createFileRoute("/lighting-design/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
