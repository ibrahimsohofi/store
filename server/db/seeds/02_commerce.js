/**
 * Shipping zones + rates + coupons.
 *
 * Zones are resolved by city name (normalised, accent-folded) at checkout; anything that
 * matches no zone falls through to `national`. Rates are per-carrier so the shopper picks
 * "Amana 48 h" or "Retrait magasin" and the price is server-authoritative.
 */

const json = (knex, value) =>
  knex.client.config.client === "better-sqlite3" ? JSON.stringify(value) : JSON.stringify(value);

const ZONES = [
  {
    code: "casa",
    name_fr: "Grand Casablanca",
    name_ar: "الدار البيضاء الكبرى",
    cities: ["Casablanca", "Mohammedia", "Bouskoura", "Dar Bouazza", "Nouaceur", "Berrechid"],
    regions: ["Casablanca-Settat"],
    free_shipping_threshold: 400,
    position: 10,
    rates: [
      {
        carrier: "pickup",
        name_fr: "Retrait en magasin — Hay Mohammadi, Casablanca",
        name_ar: "السحب من المتجر — الحي المحمدي، الدار البيضاء",
        price: 0,
        eta_min_days: 0,
        eta_max_days: 1,
        cod_allowed: true,
      },
      {
        carrier: "sohofi",
        name_fr: "Livraison SOHOFI — même journée avant 14 h",
        name_ar: "توصيل سوهوفي — نفس اليوم قبل الساعة 14",
        price: 25,
        eta_min_days: 0,
        eta_max_days: 1,
        cod_allowed: true,
      },
      {
        carrier: "sohofi",
        name_fr: "Livraison lourde / palette (> 30 kg)",
        name_ar: "توصيل البضائع الثقيلة (أكثر من 30 كغ)",
        price: 120,
        min_weight_kg: 30,
        eta_min_days: 1,
        eta_max_days: 2,
        cod_allowed: true,
      },
    ],
  },
  {
    code: "axe-atlantique",
    name_fr: "Axe Rabat — Kénitra — El Jadida",
    name_ar: "محور الرباط — القنيطرة — الجديدة",
    cities: ["Rabat", "Salé", "Témara", "Skhirat", "Kénitra", "El Jadida", "Settat"],
    regions: ["Rabat-Salé-Kénitra"],
    free_shipping_threshold: 600,
    position: 20,
    rates: [
      {
        carrier: "amana",
        name_fr: "Amana — 24 à 48 h",
        name_ar: "أمانة — من 24 إلى 48 ساعة",
        price: 35,
        eta_min_days: 1,
        eta_max_days: 2,
        cod_allowed: true,
      },
      {
        carrier: "ctm",
        name_fr: "CTM Messagerie — retrait agence",
        name_ar: "CTM ميساجري — السحب من الوكالة",
        price: 30,
        eta_min_days: 1,
        eta_max_days: 2,
        cod_allowed: true,
      },
    ],
  },
  {
    code: "grandes-villes",
    name_fr: "Grandes villes",
    name_ar: "المدن الكبرى",
    cities: [
      "Marrakech",
      "Fès",
      "Meknès",
      "Tanger",
      "Tétouan",
      "Agadir",
      "Oujda",
      "Safi",
      "Béni Mellal",
      "Nador",
      "Khouribga",
    ],
    regions: ["Marrakech-Safi", "Fès-Meknès", "Tanger-Tétouan-Al Hoceïma", "Souss-Massa", "Oriental"],
    free_shipping_threshold: 800,
    position: 30,
    rates: [
      {
        carrier: "amana",
        name_fr: "Amana — 48 à 72 h",
        name_ar: "أمانة — من 48 إلى 72 ساعة",
        price: 45,
        eta_min_days: 2,
        eta_max_days: 3,
        cod_allowed: true,
      },
      {
        carrier: "ctm",
        name_fr: "CTM Messagerie — retrait agence",
        name_ar: "CTM ميساجري — السحب من الوكالة",
        price: 38,
        eta_min_days: 2,
        eta_max_days: 3,
        cod_allowed: true,
      },
      {
        carrier: "ozon",
        name_fr: "Ozon Express — 48 h à domicile",
        name_ar: "أوزون إكسبرس — 48 ساعة إلى المنزل",
        price: 55,
        eta_min_days: 1,
        eta_max_days: 2,
        cod_allowed: true,
      },
    ],
  },
  {
    code: "national",
    name_fr: "Reste du Maroc",
    name_ar: "باقي المغرب",
    cities: [],
    regions: [],
    free_shipping_threshold: 1200,
    position: 90,
    rates: [
      {
        carrier: "amana",
        name_fr: "Amana — 72 h à 5 jours",
        name_ar: "أمانة — من 72 ساعة إلى 5 أيام",
        price: 60,
        eta_min_days: 3,
        eta_max_days: 5,
        cod_allowed: true,
      },
      {
        carrier: "ctm",
        name_fr: "CTM Messagerie — retrait agence",
        name_ar: "CTM ميساجري — السحب من الوكالة",
        price: 48,
        eta_min_days: 3,
        eta_max_days: 5,
        cod_allowed: true,
      },
    ],
  },
];

const COUPONS = [
  {
    code: "BIENVENUE10",
    type: "percent",
    value: 10,
    min_subtotal: 300,
    max_discount: 200,
    usage_limit: 2000,
    per_customer_limit: 1,
  },
  {
    code: "CHANTIER150",
    type: "fixed",
    value: 150,
    min_subtotal: 1500,
    usage_limit: 500,
    per_customer_limit: 2,
  },
  {
    code: "LIVRAISONOFFERTE",
    type: "free_shipping",
    value: 0,
    min_subtotal: 250,
    usage_limit: null,
    per_customer_limit: 3,
  },
];

export async function seed(knex) {
  await knex("shop_coupon_redemptions").del();
  await knex("shop_coupons").del();
  await knex("shop_shipping_rates").del();
  await knex("shop_shipping_zones").del();

  for (const zone of ZONES) {
    const rows = await knex("shop_shipping_zones")
      .insert({
        code: zone.code,
        name_fr: zone.name_fr,
        name_ar: zone.name_ar,
        cities: json(knex, zone.cities),
        regions: json(knex, zone.regions),
        free_shipping_threshold: zone.free_shipping_threshold,
        position: zone.position,
        is_active: true,
      })
      .returning("id");
    const zoneId = typeof rows[0] === "object" ? rows[0].id : rows[0];

    await knex("shop_shipping_rates").insert(
      zone.rates.map((r) => ({
        zone_id: zoneId,
        carrier: r.carrier,
        name_fr: r.name_fr,
        name_ar: r.name_ar,
        price: r.price,
        min_weight_kg: r.min_weight_kg ?? 0,
        max_weight_kg: r.max_weight_kg ?? null,
        eta_min_days: r.eta_min_days,
        eta_max_days: r.eta_max_days,
        cod_allowed: r.cod_allowed,
        is_active: true,
      })),
    );
  }

  const now = new Date();
  const in90Days = new Date(now.getTime() + 90 * 86400 * 1000);

  await knex("shop_coupons").insert(
    COUPONS.map((c) => ({
      ...c,
      used_count: 0,
      starts_at: now,
      ends_at: in90Days,
      is_active: true,
    })),
  );
}
