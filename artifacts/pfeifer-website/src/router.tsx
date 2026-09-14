import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const pagesPreview = import.meta.env.BASE_URL.replace(/\/$/, "") === "/pfeifer-com";
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    trailingSlash: "always",
    scrollRestoration: true,
    ...(pagesPreview ? { basepath: "/pfeifer-com" } : {}),
  });
}
