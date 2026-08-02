#!/usr/bin/env node
import process from "node:process";
import db from "../config/knex.js";
import logger from "../config/logger.js";

async function main() {
  const [files] = await db.seed.run();
  logger.info({ files }, files.length ? "seeded" : "no seed files found");
}

main()
  .catch((err) => {
    logger.error({ err: err.message, stack: err.stack }, "seed failed");
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
