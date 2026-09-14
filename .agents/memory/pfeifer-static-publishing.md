---
name: Pfeifer static publishing
description: Production output requirements for publishing the imported TanStack Start site as a static Replit artifact.
---

Publish the public Pfeifer site with its dedicated static build rather than the default Nitro/Vercel build.

**Why:** The default build writes Vercel output and no configured static directory, while the static prerender writes `dist/client` and emits the root fallback as `_shell.html`. Replit static publishing requires an existing public directory with `index.html`.

**How to apply:** Keep production publishing pointed at the dedicated static build and `dist/client`; ensure that build creates `index.html` from the generated shell. Use the default build only when deliberately moving production to an SSR server.