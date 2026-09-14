import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/category/blogposts/")({
  beforeLoad: () => {
    throw redirect({ to: "/blog/" });
  },
  component: () => null,
});
