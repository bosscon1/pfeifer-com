import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/durable-materials/")!;

export const Route = createFileRoute("/durable-materials/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
