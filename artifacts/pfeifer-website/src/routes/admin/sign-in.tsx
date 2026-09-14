import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/sign-in")({
  head: () => ({
    meta: [
      { title: "Staff sign in | Pfeifer Building Company" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Navigate to="/login/" />,
});
