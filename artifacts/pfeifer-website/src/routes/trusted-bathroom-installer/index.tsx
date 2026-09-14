import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/trusted-bathroom-installer/")!;

export const Route = createFileRoute("/trusted-bathroom-installer/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
