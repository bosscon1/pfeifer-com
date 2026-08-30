import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/perfect-downstairs-living/")!;

export const Route = createFileRoute("/perfect-downstairs-living/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
