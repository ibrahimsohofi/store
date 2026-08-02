import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const bool = (def) =>
  z
    .union([z.boolean(), z.string()])
    .default(def)
    .transform((v) => (typeof v === "boolean" ? v : ["1", "true", "yes", "on"].includes(v.toLowerCase())));

const num = (def) => z.coerce.number().default(def);

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: num(3000),
    API_PORT: num(4001),
    SITE_URL: z.string().url().default("http://localhost:3000"),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),

    DB_CLIENT: z.enum(["better-sqlite3", "mysql2"]).default("better-sqlite3"),
    DB_FILE: z.string().default("./data/storefront.sqlite"),
    DB_HOST: z.string().default("127.0.0.1"),
    DB_PORT: num(3306),
    DB_USER: z.string().default("root"),
    DB_PASSWORD: z.string().default(""),
    DB_NAME: z.string().default("products_manager"),

    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: num(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: num(0),

    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().default("auto"),
    S3_BUCKET: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_PUBLIC_URL: z.string().optional(),

    SENTRY_DSN: z.string().optional(),

    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
    ACCESS_TOKEN_TTL: z.string().default("15m"),
    REFRESH_TOKEN_TTL_DAYS: num(30),

    DEFAULT_LOCALE: z.enum(["fr", "ar"]).default("fr"),
    CURRENCY: z.string().length(3).default("MAD"),
    VAT_RATE: num(0.2),
    FREE_SHIPPING_THRESHOLD: num(600),

    TRUST_PROXY: bool("true"),
  })
  .transform((e) => ({
    ...e,
    isProd: e.NODE_ENV === "production",
    isDev: e.NODE_ENV === "development",
    dbFileAbsolute: path.resolve(process.cwd(), e.DB_FILE),
    locales: ["fr", "ar"],
  }));

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((i) => `  · ${i.path.join(".")}: ${i.message}`).join("\n");
  console.error(`\n[env] Invalid configuration — refusing to boot.\n${details}\n`);
  process.exit(1);
}

export const env = parsed.data;
export default env;
