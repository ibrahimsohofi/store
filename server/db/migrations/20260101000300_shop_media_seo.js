import { dropAll, stamps } from "../helpers.js";

const TABLES = [
  "shop_product_images",
  "shop_product_seo",
  "shop_category_seo",
  "shop_redirects",
];

/**
 * Media + SEO. The back-office `products` table only carries a single `image_url`;
 * the shop needs a real gallery and per-locale slugs/meta.
 */
export async function up(knex) {
  await knex.schema.createTable("shop_product_images", (t) => {
    t.increments("id").primary();
    t.integer("product_id").unsigned().notNullable().index()
      .references("id").inTable("products").onDelete("CASCADE");
    t.string("url", 500).notNullable();
    t.string("alt_fr", 255);
    t.string("alt_ar", 255);
    t.integer("width").defaultTo(0);
    t.integer("height").defaultTo(0);
    t.string("blur_data", 255); // tiny base64 / dominant colour placeholder
    t.integer("position").defaultTo(0);
    t.boolean("is_primary").defaultTo(false);
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_product_seo", (t) => {
    t.increments("id").primary();
    t.integer("product_id").unsigned().notNullable().index()
      .references("id").inTable("products").onDelete("CASCADE");
    t.string("locale", 2).notNullable();
    t.string("slug", 220).notNullable();
    t.string("meta_title", 190);
    t.string("meta_description", 320);
    t.string("og_image", 500);
    t.string("canonical_override", 500);
    t.boolean("noindex").defaultTo(false);
    stamps(knex, t);
    t.unique(["locale", "slug"], { indexName: "uq_product_seo_locale_slug" });
    t.unique(["product_id", "locale"], { indexName: "uq_product_seo_product_locale" });
  });

  await knex.schema.createTable("shop_category_seo", (t) => {
    t.increments("id").primary();
    t.integer("category_id").unsigned().notNullable().index()
      .references("id").inTable("categories").onDelete("CASCADE");
    t.string("locale", 2).notNullable();
    t.string("slug", 220).notNullable();
    t.string("meta_title", 190);
    t.string("meta_description", 320);
    t.text("intro_html"); // long-tail category copy, FR/AR
    t.string("og_image", 500);
    t.boolean("noindex").defaultTo(false);
    stamps(knex, t);
    t.unique(["locale", "slug"], { indexName: "uq_category_seo_locale_slug" });
    t.unique(["category_id", "locale"], { indexName: "uq_category_seo_cat_locale" });
  });

  // Slug changes must never produce a 404.
  await knex.schema.createTable("shop_redirects", (t) => {
    t.increments("id").primary();
    t.string("from_path", 500).notNullable().unique();
    t.string("to_path", 500).notNullable();
    t.integer("status").defaultTo(301);
    t.integer("hits").defaultTo(0);
    stamps(knex, t);
  });
}

export async function down(knex) {
  await dropAll(knex, TABLES);
}
