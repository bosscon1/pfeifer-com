import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, articleHead } from "@/components/article-page";
import { ARTICLES } from "@/data/articles";

const article = ARTICLES.find((a) => a.href === "/jb-autowerks-in-tyrone/")!;

export const Route = createFileRoute("/jb-autowerks-in-tyrone/")({
  head: () => articleHead(article),
  component: () => <ArticlePage article={article} />,
});
