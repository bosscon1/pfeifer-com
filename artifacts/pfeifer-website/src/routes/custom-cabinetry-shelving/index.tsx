import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/custom-cabinetry-shelving/")!;

export const Route = createFileRoute("/custom-cabinetry-shelving/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
