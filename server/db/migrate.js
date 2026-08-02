#!/usr/bin/env node
import process from "node:process";
import db from "../config/knex.js";
import logger from "../config/logger.js";

const arg = process.argv.slice(2);
const rollback = arg.includes("--rollback");
const status = arg.includes("--status");

async function main() {
  if (status) {
    const [completed, pending] = await Promise.all([db.migrate.list()]).then(([r]) => r);
    logger.info(
      { completed: completed.map((m) => m.name ?? m), pending: pending.map((m) => m.file ?? m) },
      "migration status",
    );
    return;
  }

  if (rollback) {
    const [batch, files] = await db.migrate.rollback();
    logger.info({ batch, files }, files.length ? "rolled back" : "nothing to roll back");
    return;
  }

  const [batch, files] = await db.migrate.latest();
  logger.info({ batch, files }, files.length ? "migrated" : "already up to date");
}

main()
  .catch((err) => {
    logger.error({ err: err.message, stack: err.stack }, "migration failed");
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
