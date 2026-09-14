import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/energy-efficient/")!;

export const Route = createFileRoute("/energy-efficient/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
