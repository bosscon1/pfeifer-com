import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/choosing-paint-colors/")!;

export const Route = createFileRoute("/choosing-paint-colors/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
