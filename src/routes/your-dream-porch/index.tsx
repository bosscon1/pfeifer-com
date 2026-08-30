import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/your-dream-porch/")!;

export const Route = createFileRoute("/your-dream-porch/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
