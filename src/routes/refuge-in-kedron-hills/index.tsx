import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/refuge-in-kedron-hills/")!;

export const Route = createFileRoute("/refuge-in-kedron-hills/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
