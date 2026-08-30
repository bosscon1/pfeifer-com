import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/why-hire-local/")!;

export const Route = createFileRoute("/why-hire-local/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
