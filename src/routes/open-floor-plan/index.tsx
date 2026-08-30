import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/open-floor-plan/")!;

export const Route = createFileRoute("/open-floor-plan/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
