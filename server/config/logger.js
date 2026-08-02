import { randomUUID } from "node:crypto";
import pino from "pino";
import pinoHttp from "pino-http";
import env from "./env.js";

const redact = {
  paths: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "*.password",
    "*.password_hash",
    "*.token",
    "*.refresh_token",
    "*.card",
  ],
  censor: "[redacted]",
};

export const logger = pino({
  level: env.LOG_LEVEL,
  redact,
  base: { app: "storefront" },
  ...(env.isProd
    ? {}
    : {
        transport: {
          target: "pino/file",
          options: { destination: 1 },
        },
      }),
});

export const httpLogger = () =>
  pinoHttp({
    logger,
    redact,
    genReqId: (req, res) => {
      const existing = req.headers["x-request-id"];
      const id = existing || randomUUID();
      res.setHeader("x-request-id", id);
      return id;
    },
    autoLogging: {
      ignore: (req) =>
        req.url.startsWith("/@") ||
        req.url.startsWith("/src/") ||
        req.url.startsWith("/node_modules/") ||
        req.url === "/favicon.svg",
    },
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  });

export default logger;
