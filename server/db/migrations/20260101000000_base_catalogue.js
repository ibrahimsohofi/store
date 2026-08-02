import { enumCol, money, stamps } from "../helpers.js";

/**
 * Base catalogue. In production these tables already live in `products_manager` and this
 * migration is a no-op. In the dev sandbox (fresh sqlite file) we recreate a faithful
 * subset so the storefront can be developed standalone.
 */
export async function up(knex) {
  if (!(await knex.schema.hasTable("suppliers"))) {
    await knex.schema.createTable("suppliers", (t) => {
      t.increments("id").primary();
      t.string("name", 160).notNullable();
      t.string("contact_name", 160);
      t.string("phone", 32);
      t.string("email", 190);
      t.string("city", 90);
      t.boolean("is_active").defaultTo(true);
      stamps(knex, t);
    });
  }

  if (!(await knex.schema.hasTable("categories"))) {
    await knex.schema.createTable("categories", (t) => {
      t.increments("id").primary();
      t.string("name", 160).notNullable();
      t.string("name_fr", 160);
      t.string("name_ar", 160);
      t.text("description");
      t.string("image_url", 500);
      t.string("icon", 60);
      t.boolean("is_active").defaultTo(true);
      stamps(knex, t);
    });
  }

  if (!(await knex.schema.hasTable("products"))) {
    await knex.schema.createTable("products", (t) => {
      t.increments("id").primary();
      t.string("sku", 64).notNullable().unique();
      t.string("barcode", 64).index();
      t.string("name", 240).notNullable();
      t.string("name_fr", 240);
      t.string("name_ar", 240);
      t.text("description");
      t.text("description_fr");
      t.text("description_ar");
      t.string("brand", 120).index();
      t.string("unit", 32).defaultTo("piece");
      money(t, "price").notNullable().defaultTo(0);
      money(t, "cost_price").defaultTo(0);
      t.integer("stock_quantity").notNullable().defaultTo(0);
      t.integer("min_stock").defaultTo(0);
      t.integer("category_id").unsigned().index().references("id").inTable("categories").onDelete("SET NULL");
      t.integer("supplier_id").unsigned().index().references("id").inTable("suppliers").onDelete("SET NULL");
      t.string("image_url", 500);
      t.string("tags", 500);
      t.decimal("weight_kg", 8, 3);
      t.string("dimensions", 120);
      t.integer("warranty_months").defaultTo(0);
      t.boolean("is_active").defaultTo(true);
      t.boolean("is_featured").defaultTo(false);
      stamps(knex, t);
    });
  }

  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (t) => {
      t.increments("id").primary();
      t.string("username", 90).notNullable().unique();
      t.string("email", 190).notNullable().unique();
      t.string("password_hash", 255).notNullable();
      t.string("full_name", 190);
      enumCol(knex, t, "role", ["admin", "manager", "cashier"]).defaultTo("cashier");
      t.boolean("is_active").defaultTo(true);
      stamps(knex, t);
    });
  }
}

export async function down(knex) {
  // Never drop the back-office catalogue from a storefront rollback.
  if (knex.client.config.client !== "better-sqlite3") return;
  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("categories");
  await knex.schema.dropTableIfExists("suppliers");
  await knex.schema.dropTableIfExists("users");
}
