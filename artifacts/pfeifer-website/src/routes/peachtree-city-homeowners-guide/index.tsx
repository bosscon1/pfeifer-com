import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/peachtree-city-homeowners-guide/")!;

export const Route = createFileRoute("/peachtree-city-homeowners-guide/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
