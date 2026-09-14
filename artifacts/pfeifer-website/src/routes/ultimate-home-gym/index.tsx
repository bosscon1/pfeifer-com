import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/ultimate-home-gym/")!;

export const Route = createFileRoute("/ultimate-home-gym/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
