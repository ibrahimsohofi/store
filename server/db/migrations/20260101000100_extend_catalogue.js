import { addColumnIfMissing, addFullText, dropFullText, isMysql, money } from "../helpers.js";

/** Columns the storefront needs on the existing back-office tables. */
export async function up(knex) {
  await addColumnIfMissing(knex, "categories", "parent_id", (t) =>
    t.integer("parent_id").unsigned().nullable().index(),
  );
  await addColumnIfMissing(knex, "categories", "position", (t) => t.integer("position").defaultTo(0));
  await addColumnIfMissing(knex, "categories", "is_visible_online", (t) =>
    t.boolean("is_visible_online").defaultTo(true),
  );

  await addColumnIfMissing(knex, "products", "is_online", (t) =>
    t.boolean("is_online").defaultTo(false),
  );
  await addColumnIfMissing(knex, "products", "compare_at_price", (t) =>
    money(t, "compare_at_price").nullable(),
  );
  await addColumnIfMissing(knex, "products", "short_description_fr", (t) =>
    t.string("short_description_fr", 500).nullable(),
  );
  await addColumnIfMissing(knex, "products", "short_description_ar", (t) =>
    t.string("short_description_ar", 500).nullable(),
  );
  await addColumnIfMissing(knex, "products", "rating_avg", (t) =>
    t.decimal("rating_avg", 3, 2).defaultTo(0),
  );
  await addColumnIfMissing(knex, "products", "rating_count", (t) =>
    t.integer("rating_count").defaultTo(0),
  );
  await addColumnIfMissing(knex, "products", "sold_count", (t) =>
    t.integer("sold_count").defaultTo(0),
  );

  await knex.schema.alterTable("products", (t) => {
    t.index(["is_online", "is_active", "category_id"], "idx_products_online");
  });

  await addFullText(knex, "products", "ft_products", [
    "name",
    "name_fr",
    "name_ar",
    "description",
    "tags",
  ]);
}

export async function down(knex) {
  await dropFullText(knex, "products", "ft_products");
  await knex.schema.alterTable("products", (t) => {
    t.dropIndex(["is_online", "is_active", "category_id"], "idx_products_online");
  });
  if (isMysql(knex)) {
    await knex.schema.alterTable("products", (t) => {
      t.dropColumn("is_online");
      t.dropColumn("compare_at_price");
      t.dropColumn("short_description_fr");
      t.dropColumn("short_description_ar");
      t.dropColumn("rating_avg");
      t.dropColumn("rating_count");
      t.dropColumn("sold_count");
    });
    await knex.schema.alterTable("categories", (t) => {
      t.dropColumn("parent_id");
      t.dropColumn("position");
      t.dropColumn("is_visible_online");
    });
  }
}
