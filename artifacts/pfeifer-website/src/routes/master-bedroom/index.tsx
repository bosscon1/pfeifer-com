import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/master-bedroom/")!;

export const Route = createFileRoute("/master-bedroom/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
