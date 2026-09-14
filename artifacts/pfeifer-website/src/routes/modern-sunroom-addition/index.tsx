import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/modern-sunroom-addition/")!;

export const Route = createFileRoute("/modern-sunroom-addition/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
