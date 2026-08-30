import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/what-commercial-construction-actually-looks-like/")!;

export const Route = createFileRoute("/what-commercial-construction-actually-looks-like/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
