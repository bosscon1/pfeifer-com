import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/home-addition-vs-buying/")!;

export const Route = createFileRoute("/home-addition-vs-buying/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
