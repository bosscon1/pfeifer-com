import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/starting-a-bathroom-remodel/")!;

export const Route = createFileRoute("/starting-a-bathroom-remodel/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
