import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/laundry-room-design/")!;

export const Route = createFileRoute("/laundry-room-design/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
