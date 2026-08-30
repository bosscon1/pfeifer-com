import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/opening-up-your-living-space/")!;

export const Route = createFileRoute("/opening-up-your-living-space/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
