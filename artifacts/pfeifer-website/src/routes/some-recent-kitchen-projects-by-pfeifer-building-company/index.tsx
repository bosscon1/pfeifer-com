import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/some-recent-kitchen-projects-by-pfeifer-building-company/")!;

export const Route = createFileRoute("/some-recent-kitchen-projects-by-pfeifer-building-company/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
