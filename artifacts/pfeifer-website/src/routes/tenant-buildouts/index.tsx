import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/tenant-buildouts/")!;

export const Route = createFileRoute("/tenant-buildouts/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
