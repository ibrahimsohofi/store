import { dropAll, enumCol, json, stamps } from "../helpers.js";

const TABLES = [
  "shop_reviews",
  "shop_pages",
  "shop_settings",
  "shop_newsletter",
  "shop_audit_log",
];

export async function up(knex) {
  await knex.schema.createTable("shop_reviews", (t) => {
    t.increments("id").primary();
    t.integer("product_id").unsigned().notNullable().index()
      .references("id").inTable("products").onDelete("CASCADE");
    t.integer("customer_id").unsigned().nullable().index()
      .references("id").inTable("shop_customers").onDelete("SET NULL");
    t.integer("order_id").unsigned().nullable();
    t.string("author_name", 120).notNullable();
    t.string("email", 190);
    t.integer("rating").notNullable(); // 1..5
    t.string("title", 190);
    t.text("body");
    t.string("locale", 2).defaultTo("fr");
    t.boolean("is_verified_purchase").defaultTo(false);
    enumCol(knex, t, "status", ["pending", "approved", "rejected"]).defaultTo("pending").index();
    t.integer("helpful_count").defaultTo(0);
    t.string("ip_hash", 64);
    stamps(knex, t);
  });

  // CGV, retours, confidentialité, à-propos, contact, buying guides
  await knex.schema.createTable("shop_pages", (t) => {
    t.increments("id").primary();
    t.string("key", 60).notNullable(); // cgv / privacy / returns / about
    t.string("locale", 2).notNullable();
    t.string("slug", 190).notNullable();
    enumCol(knex, t, "type", ["page", "guide"]).defaultTo("page");
    t.string("title", 190).notNullable();
    t.string("excerpt", 320);
    t.text("body_html");
    t.string("meta_title", 190);
    t.string("meta_description", 320);
    t.string("cover_image", 500);
    t.boolean("is_published").defaultTo(true);
    t.integer("position").defaultTo(0);
    stamps(knex, t);
    t.unique(["locale", "slug"], { indexName: "uq_pages_locale_slug" });
    t.unique(["key", "locale"], { indexName: "uq_pages_key_locale" });
  });

  await knex.schema.createTable("shop_settings", (t) => {
    t.string("key", 90).primary();
    t.text("value");
    t.string("group", 60).defaultTo("general");
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("shop_newsletter", (t) => {
    t.increments("id").primary();
    t.string("email", 190).notNullable().unique();
    t.string("locale", 2).defaultTo("fr");
    t.string("confirm_token", 64);
    t.timestamp("confirmed_at").nullable();
    t.timestamp("unsubscribed_at").nullable();
    t.string("source", 60).defaultTo("footer");
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_audit_log", (t) => {
    t.increments("id").primary();
    t.string("actor_type", 20).defaultTo("admin");
    t.string("actor_ref", 90);
    t.string("action", 60).notNullable();
    t.string("entity", 60).notNullable();
    t.string("entity_id", 60);
    json(knex, t, "before");
    json(knex, t, "after");
    t.string("ip_hash", 64);
    t.string("user_agent", 255);
    t.timestamp("created_at").defaultTo(knex.fn.now()).index();
  });
}

export async function down(knex) {
  await dropAll(knex, TABLES);
}
