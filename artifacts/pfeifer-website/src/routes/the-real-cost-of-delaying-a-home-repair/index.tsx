import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/the-real-cost-of-delaying-a-home-repair/")!;

export const Route = createFileRoute("/the-real-cost-of-delaying-a-home-repair/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
