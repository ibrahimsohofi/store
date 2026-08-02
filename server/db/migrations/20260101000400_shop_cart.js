import { dropAll, enumCol, money, stamps } from "../helpers.js";

const TABLES = [
  "shop_carts",
  "shop_cart_items",
  "shop_stock_reservations",
  "shop_wishlist_items",
];

export async function up(knex) {
  await knex.schema.createTable("shop_carts", (t) => {
    t.increments("id").primary();
    t.string("token", 64).notNullable().unique(); // guest cookie
    t.integer("customer_id").unsigned().nullable().index()
      .references("id").inTable("shop_customers").onDelete("SET NULL");
    t.string("currency", 3).defaultTo("MAD");
    t.string("locale", 2).defaultTo("fr");
    t.string("coupon_code", 60).nullable();
    t.timestamp("expires_at").notNullable().index();
    t.timestamp("reminder_sent_at").nullable(); // abandoned-cart job
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_cart_items", (t) => {
    t.increments("id").primary();
    t.integer("cart_id").unsigned().notNullable().index()
      .references("id").inTable("shop_carts").onDelete("CASCADE");
    t.integer("product_id").unsigned().notNullable().index()
      .references("id").inTable("products").onDelete("CASCADE");
    t.integer("qty").notNullable().defaultTo(1);
    money(t, "unit_price_snapshot").notNullable(); // price frozen at add-time
    stamps(knex, t);
    t.unique(["cart_id", "product_id"], { indexName: "uq_cart_product" });
  });

  /**
   * Holds stock for ~20 min between "start checkout" and "payment confirmed" so two
   * shoppers cannot both buy the last unit. `releaseReservations` frees expired rows.
   */
  await knex.schema.createTable("shop_stock_reservations", (t) => {
    t.increments("id").primary();
    t.string("reservation_id", 64).notNullable().index();
    t.integer("product_id").unsigned().notNullable().index()
      .references("id").inTable("products").onDelete("CASCADE");
    t.integer("cart_id").unsigned().nullable().index();
    t.integer("order_id").unsigned().nullable().index(); // set once confirmed
    t.integer("qty").notNullable();
    enumCol(knex, t, "status", ["held", "committed", "released", "expired"]).defaultTo("held");
    t.timestamp("expires_at").notNullable().index();
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_wishlist_items", (t) => {
    t.increments("id").primary();
    t.integer("customer_id").unsigned().notNullable().index()
      .references("id").inTable("shop_customers").onDelete("CASCADE");
    t.integer("product_id").unsigned().notNullable().index()
      .references("id").inTable("products").onDelete("CASCADE");
    stamps(knex, t);
    t.unique(["customer_id", "product_id"], { indexName: "uq_wishlist_customer_product" });
  });
}

export async function down(knex) {
  await dropAll(knex, TABLES);
}
