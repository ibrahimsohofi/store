import { CURRENCY, VAT_RATE } from "./constants.js";

/**
 * Money rule: never trust a float. Everything is rounded to 2 decimals through
 * `round2` before it is stored or compared, and totals are always recomputed
 * server-side.
 */
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export const toNumber = (v) => {
  const n = typeof v === "string" ? Number.parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatters = new Map();

function formatter(locale) {
  const tag = locale === "ar" ? "ar-MA" : "fr-MA";
  if (!formatters.has(tag)) {
    formatters.set(
      tag,
      new Intl.NumberFormat(tag, {
        style: "currency",
        currency: CURRENCY,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        numberingSystem: "latn", // Moroccan shops price in Western digits, even in AR
      }),
    );
  }
  return formatters.get(tag);
}

/** `1299.5` -> `1 299,50 MAD` (fr) / `1 299,50 MAD` with RTL marks (ar). */
export const formatMoney = (value, locale = "fr") => formatter(locale).format(toNumber(value));

/** Price without the currency symbol — for inputs and JSON-LD. */
export const formatAmount = (value) => round2(toNumber(value)).toFixed(2);

/** Split a TTC (tax-inclusive) amount into HT + TVA. Moroccan prices are displayed TTC. */
export function splitVat(ttc, rate = VAT_RATE) {
  const gross = round2(ttc);
  const net = round2(gross / (1 + rate));
  return { net, vat: round2(gross - net), gross };
}

export const percentOff = (price, compareAt) => {
  const p = toNumber(price);
  const c = toNumber(compareAt);
  if (!c || c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
};

export const sum = (rows, pick) => round2(rows.reduce((acc, r) => acc + toNumber(pick(r)), 0));
