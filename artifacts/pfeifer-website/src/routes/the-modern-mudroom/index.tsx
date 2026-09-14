import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/the-modern-mudroom/")!;

export const Route = createFileRoute("/the-modern-mudroom/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
