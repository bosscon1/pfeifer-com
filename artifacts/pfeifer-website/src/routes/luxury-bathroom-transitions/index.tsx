import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/luxury-bathroom-transitions/")!;

export const Route = createFileRoute("/luxury-bathroom-transitions/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
