import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import http from "node:http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// The workspace router assigns /api/* to this service, while the Pfeifer
// website owns its Better Auth handler. Forward only that auth namespace to
// the website dev service so sign-in requests and OAuth callbacks reach the
// handler that created them.
app.use("/api/auth", (req, res) => {
  const upstream = new URL(
    `/api/auth${req.url}`,
    process.env.PFEIFER_WEBSITE_INTERNAL_URL ?? "http://127.0.0.1:22501",
  );
  const headers = {
    ...req.headers,
    host: req.headers.host,
    "x-forwarded-host": req.headers.host,
    "x-forwarded-proto": req.headers["x-forwarded-proto"] ?? "https",
  };
  const proxy = http.request(
    upstream,
    { method: req.method, headers },
    (upstreamResponse) => {
      res.status(upstreamResponse.statusCode ?? 502);
      for (const [name, value] of Object.entries(upstreamResponse.headers)) {
        if (value !== undefined) res.setHeader(name, value);
      }
      upstreamResponse.pipe(res);
    },
  );
  proxy.on("error", (error) => {
    logger.error({ err: error }, "Pfeifer auth upstream failed");
    if (!res.headersSent) {
      res.status(502).json({ error: "Authentication service is unavailable." });
    } else {
      res.end();
    }
  });
  req.pipe(proxy);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
