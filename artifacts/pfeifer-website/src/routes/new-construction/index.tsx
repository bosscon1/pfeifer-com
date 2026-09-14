import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/new-construction/")!;

export const Route = createFileRoute("/new-construction/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
