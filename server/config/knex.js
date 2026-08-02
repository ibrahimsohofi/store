import fs from "node:fs";
import path from "node:path";
import knexFactory from "knex";
import env from "./env.js";

const isSqlite = env.DB_CLIENT === "better-sqlite3";

if (isSqlite) {
  fs.mkdirSync(path.dirname(env.dbFileAbsolute), { recursive: true });
}

export const knexConfig = {
  client: env.DB_CLIENT,
  connection: isSqlite
    ? { filename: env.dbFileAbsolute }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        charset: "utf8mb4",
        timezone: "Z",
        decimalNumbers: true,
        supportBigNumbers: true,
      },
  useNullAsDefault: isSqlite,
  pool: isSqlite
    ? {
        min: 1,
        max: 1,
        afterCreate: (conn, done) => {
          conn.pragma("journal_mode = WAL");
          conn.pragma("foreign_keys = ON");
          done(null, conn);
        },
      }
    : { min: 2, max: 10 },
  migrations: {
    directory: path.resolve(process.cwd(), "server/db/migrations"),
    tableName: "shop_knex_migrations",
    loadExtensions: [".js"],
  },
  seeds: {
    directory: path.resolve(process.cwd(), "server/db/seeds"),
    loadExtensions: [".js"],
  },
};

export const db = knexFactory(knexConfig);

/** Dialect helpers so one migration file serves sqlite (dev) and mysql (prod). */
export const dialect = {
  isSqlite,
  isMysql: !isSqlite,
  /** JSON column: native on mysql, TEXT on sqlite. */
  json(table, name) {
    return isSqlite ? table.text(name) : table.json(name);
  },
  /** Enum: native on mysql, TEXT + CHECK on sqlite. */
  enum(table, name, values) {
    return isSqlite
      ? table.text(name).checkIn(values)
      : table.enu(name, values, { useNative: false });
  },
  /** DECIMAL(10,2) everywhere — never floats for money. */
  money(table, name) {
    return table.decimal(name, 10, 2);
  },
  timestamps(table) {
    table.timestamp("created_at").defaultTo(db.fn.now());
    table.timestamp("updated_at").defaultTo(db.fn.now());
  },
};

export default db;
