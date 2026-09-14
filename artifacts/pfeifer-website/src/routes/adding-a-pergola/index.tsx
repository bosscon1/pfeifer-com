import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/adding-a-pergola/")!;

export const Route = createFileRoute("/adding-a-pergola/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
