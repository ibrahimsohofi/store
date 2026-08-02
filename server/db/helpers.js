/**
 * Migration helpers — one migration file must run on both `better-sqlite3` (dev sandbox)
 * and `mysql2` (production `products_manager` schema). Everything dialect-specific is
 * funnelled through here.
 */

export const isSqlite = (knex) => knex.client.config.client === "better-sqlite3";
export const isMysql = (knex) => !isSqlite(knex);

/** JSON column: native on mysql, TEXT on sqlite. */
export const json = (knex, table, name) =>
  isSqlite(knex) ? table.text(name) : table.json(name);

/** Enum: native-ish on mysql, TEXT + CHECK constraint on sqlite. */
export const enumCol = (knex, table, name, values) =>
  isSqlite(knex) ? table.text(name).checkIn(values) : table.enu(name, values);

/** All money is DECIMAL(10,2). Never floats. */
export const money = (table, name) => table.decimal(name, 10, 2);

/** created_at / updated_at pair. */
export const stamps = (knex, table) => {
  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
};

/** Add a column only when it is missing — existing prod tables are already populated. */
export const addColumnIfMissing = async (knex, tableName, columnName, build) => {
  const exists = await knex.schema.hasColumn(tableName, columnName);
  if (exists) return false;
  await knex.schema.alterTable(tableName, (t) => build(t));
  return true;
};

/** MySQL-only FULLTEXT index; silently skipped on sqlite. */
export const addFullText = async (knex, tableName, indexName, columns) => {
  if (!isMysql(knex)) return false;
  await knex.raw(`ALTER TABLE \`${tableName}\` ADD FULLTEXT KEY \`${indexName}\` (${columns
    .map((c) => `\`${c}\``)
    .join(", ")})`);
  return true;
};

export const dropFullText = async (knex, tableName, indexName) => {
  if (!isMysql(knex)) return false;
  await knex.raw(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
  return true;
};

/** Drop a list of tables in reverse dependency order. */
export const dropAll = async (knex, tables) => {
  for (const t of [...tables].reverse()) {
    await knex.schema.dropTableIfExists(t);
  }
};
