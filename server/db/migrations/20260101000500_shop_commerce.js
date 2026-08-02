import { dropAll, enumCol, json, money, stamps } from "../helpers.js";

const TABLES = [
  "shop_shipping_zones",
  "shop_shipping_rates",
  "shop_coupons",
  "shop_orders",
  "shop_order_items",
  "shop_order_events",
  "shop_payments",
  "shop_shipments",
  "shop_coupon_redemptions",
];

export const ORDER_STATUS = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];
export const PAYMENT_STATUS = ["unpaid", "authorised", "paid", "refunded", "partially_refunded", "failed"];
export const FULFILMENT_STATUS = ["unfulfilled", "partial", "fulfilled", "returned"];

export async function up(knex) {
  await knex.schema.createTable("shop_shipping_zones", (t) => {
    t.increments("id").primary();
    t.string("code", 40).notNullable().unique();
    t.string("name_fr", 120).notNullable();
    t.string("name_ar", 120);
    json(knex, t, "cities"); // ["Casablanca","Mohammedia"]
    json(knex, t, "regions");
    money(t, "free_shipping_threshold").nullable();
    t.integer("position").defaultTo(0);
    t.boolean("is_active").defaultTo(true);
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_shipping_rates", (t) => {
    t.increments("id").primary();
    t.integer("zone_id").unsigned().notNullable().index()
      .references("id").inTable("shop_shipping_zones").onDelete("CASCADE");
    t.string("carrier", 60).notNullable(); // amana / ctm / ozon / pickup
    t.string("name_fr", 120).notNullable();
    t.string("name_ar", 120);
    money(t, "price").notNullable().defaultTo(0);
    t.decimal("min_weight_kg", 8, 3).defaultTo(0);
    t.decimal("max_weight_kg", 8, 3).nullable();
    t.integer("eta_min_days").defaultTo(1);
    t.integer("eta_max_days").defaultTo(3);
    t.boolean("cod_allowed").defaultTo(true);
    t.boolean("is_active").defaultTo(true);
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_coupons", (t) => {
    t.increments("id").primary();
    t.string("code", 60).notNullable().unique();
    enumCol(knex, t, "type", ["percent", "fixed", "free_shipping"]).defaultTo("percent");
    money(t, "value").notNullable().defaultTo(0);
    money(t, "min_subtotal").defaultTo(0);
    money(t, "max_discount").nullable();
    t.integer("usage_limit").nullable();
    t.integer("per_customer_limit").defaultTo(1);
    t.integer("used_count").defaultTo(0);
    t.timestamp("starts_at").nullable();
    t.timestamp("ends_at").nullable();
    t.boolean("is_active").defaultTo(true);
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_orders", (t) => {
    t.increments("id").primary();
    t.string("order_number", 32).notNullable().unique(); // SB-2026-000123
    t.integer("customer_id").unsigned().nullable().index()
      .references("id").inTable("shop_customers").onDelete("SET NULL");
    t.integer("shipping_address_id").unsigned().nullable()
      .references("id").inTable("shop_addresses").onDelete("SET NULL");
    t.integer("billing_address_id").unsigned().nullable()
      .references("id").inTable("shop_addresses").onDelete("SET NULL");

    // guest snapshot — an order must stand alone even if the account is deleted
    t.string("email", 190);
    t.string("phone", 32).index();
    t.string("customer_name", 190);

    enumCol(knex, t, "status", ORDER_STATUS).defaultTo("pending").index();
    enumCol(knex, t, "payment_status", PAYMENT_STATUS).defaultTo("unpaid").index();
    enumCol(knex, t, "fulfilment_status", FULFILMENT_STATUS).defaultTo("unfulfilled");

    money(t, "subtotal").notNullable().defaultTo(0);
    money(t, "discount_total").notNullable().defaultTo(0);
    money(t, "shipping_total").notNullable().defaultTo(0);
    money(t, "tax_total").notNullable().defaultTo(0); // TVA 20 %
    money(t, "grand_total").notNullable().defaultTo(0);
    t.string("currency", 3).defaultTo("MAD");

    t.string("coupon_code", 60).nullable();
    t.string("shipping_carrier", 60);
    t.string("shipping_method", 120);
    t.string("payment_method", 40).defaultTo("cod");
    t.string("channel", 20).defaultTo("online");
    t.string("locale", 2).defaultTo("fr");
    t.text("notes");
    t.string("idempotency_key", 80).nullable().index();
    json(knex, t, "totals_breakdown");
    t.timestamp("placed_at").nullable();
    t.timestamp("cancelled_at").nullable();
    t.integer("mirrored_sale_id").unsigned().nullable(); // sales_manager sale id
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_order_items", (t) => {
    t.increments("id").primary();
    t.integer("order_id").unsigned().notNullable().index()
      .references("id").inTable("shop_orders").onDelete("CASCADE");
    t.integer("product_id").unsigned().nullable().index(); // no FK: history must survive deletes
    // full snapshot — never JOIN live products for order history
    t.string("sku", 64);
    t.string("name_fr", 240);
    t.string("name_ar", 240);
    t.string("image_url", 500);
    t.string("slug_fr", 220);
    money(t, "unit_price").notNullable();
    money(t, "compare_at_price").nullable();
    t.integer("qty").notNullable().defaultTo(1);
    money(t, "line_total").notNullable();
    t.decimal("tax_rate", 5, 4).defaultTo(0.2);
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_order_events", (t) => {
    t.increments("id").primary();
    t.integer("order_id").unsigned().notNullable().index()
      .references("id").inTable("shop_orders").onDelete("CASCADE");
    t.string("type", 60).notNullable(); // status_changed / payment / note / email_sent
    t.string("from_value", 60);
    t.string("to_value", 60);
    enumCol(knex, t, "actor_type", ["system", "admin", "customer"]).defaultTo("system");
    t.string("actor_ref", 90);
    t.text("message");
    json(knex, t, "meta");
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("shop_payments", (t) => {
    t.increments("id").primary();
    t.integer("order_id").unsigned().notNullable().index()
      .references("id").inTable("shop_orders").onDelete("CASCADE");
    enumCol(knex, t, "provider", ["cmi", "payzone", "cod", "bank_transfer", "stripe"]).defaultTo("cod");
    t.string("provider_ref", 190).nullable().index();
    money(t, "amount").notNullable();
    money(t, "amount_refunded").defaultTo(0);
    t.string("currency", 3).defaultTo("MAD");
    enumCol(knex, t, "status", ["initiated", "authorised", "captured", "failed", "refunded", "cancelled"])
      .defaultTo("initiated");
    t.string("failure_reason", 255);
    json(knex, t, "raw_payload");
    t.string("webhook_event_id", 190).nullable().unique(); // replay protection
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_shipments", (t) => {
    t.increments("id").primary();
    t.integer("order_id").unsigned().notNullable().index()
      .references("id").inTable("shop_orders").onDelete("CASCADE");
    t.string("carrier", 60).notNullable();
    t.string("tracking_number", 120).index();
    t.string("tracking_url", 500);
    t.decimal("weight_kg", 8, 3);
    enumCol(knex, t, "status", ["pending", "in_transit", "delivered", "failed", "returned"])
      .defaultTo("pending");
    t.timestamp("shipped_at").nullable();
    t.timestamp("delivered_at").nullable();
    stamps(knex, t);
  });

  await knex.schema.createTable("shop_coupon_redemptions", (t) => {
    t.increments("id").primary();
    t.integer("coupon_id").unsigned().notNullable().index()
      .references("id").inTable("shop_coupons").onDelete("CASCADE");
    t.integer("order_id").unsigned().notNullable().index()
      .references("id").inTable("shop_orders").onDelete("CASCADE");
    t.integer("customer_id").unsigned().nullable().index();
    t.string("email", 190).index(); // guests are limited by email too
    money(t, "amount").notNullable().defaultTo(0);
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await dropAll(knex, TABLES);
}
