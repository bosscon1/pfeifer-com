import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/garage-with-room/")!;

export const Route = createFileRoute("/garage-with-room/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
