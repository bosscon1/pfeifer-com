import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/second-story-addition/")!;

export const Route = createFileRoute("/second-story-addition/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
