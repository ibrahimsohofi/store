import { dropAll, enumCol, stamps } from "../helpers.js";

const TABLES = ["shop_customers", "shop_addresses", "shop_refresh_tokens"];

export async function up(knex) {
  await knex.schema.createTable("shop_customers", (t) => {
    t.increments("id").primary();
    t.string("email", 190).notNullable().unique();
    t.string("phone", 32).index(); // Morocco +212
    t.string("password_hash", 255);
    t.string("first_name", 90);
    t.string("last_name", 90);
    t.timestamp("email_verified_at").nullable();
    t.timestamp("phone_verified_at").nullable();
    enumCol(knex, t, "locale", ["fr", "ar"]).defaultTo("fr");
    enumCol(knex, t, "status", ["active", "blocked", "pending"]).defaultTo("active");
    t.boolean("accepts_marketing").defaultTo(false);
    t.integer("failed_logins").defaultTo(0);
    t.timestamp("locked_until").nullable();
    t.timestamp("last_login_at").nullable();
    t.integer("linked_customer_id").unsigned().nullable().index(); // in-store customers.id
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_addresses", (t) => {
    t.increments("id").primary();
    t.integer("customer_id").unsigned().nullable().index()
      .references("id").inTable("shop_customers").onDelete("CASCADE");
    enumCol(knex, t, "type", ["shipping", "billing"]).defaultTo("shipping");
    t.string("full_name", 190).notNullable();
    t.string("phone", 32).notNullable();
    t.string("line1", 255).notNullable();
    t.string("line2", 255);
    t.string("landmark", 255);
    t.string("city", 120).notNullable().index();
    t.string("region", 120);
    t.string("postal_code", 20);
    t.string("country", 2).defaultTo("MA");
    t.boolean("is_default").defaultTo(false);
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_refresh_tokens", (t) => {
    t.increments("id").primary();
    t.integer("customer_id").unsigned().notNullable().index()
      .references("id").inTable("shop_customers").onDelete("CASCADE");
    t.string("token_hash", 255).notNullable().unique();
    t.string("family", 64).notNullable().index(); // reuse-detection family
    t.timestamp("expires_at").notNullable();
    t.timestamp("revoked_at").nullable();
    t.string("user_agent", 255);
    t.string("ip_hash", 64);
    stamps(knex, t);
  });
}

export async function down(knex) {
  await dropAll(knex, TABLES);
}
