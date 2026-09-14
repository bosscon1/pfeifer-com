import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/building-an-outdoor-kitchen/")!;

export const Route = createFileRoute("/building-an-outdoor-kitchen/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
