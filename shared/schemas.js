import { z } from "zod";
import { LOCALES, MAX_QTY_PER_LINE, PAGE_SIZE } from "./constants.js";

/** One schema, two consumers: `validate()` on the API and `zodResolver` in forms. */

export const locale = z.enum(LOCALES);

/** Moroccan mobile: 0612345678 / +212612345678 / 00212612345678 */
export const phoneMA = z
  .string()
  .trim()
  .regex(/^(?:\+212|00212|0)([5-7]\d{8})$/, "phone.invalid")
  .transform((v) => `+212${v.replace(/^(?:\+212|00212|0)/, "")}`);

export const email = z.string().trim().toLowerCase().email("email.invalid").max(190);

export const password = z
  .string()
  .min(8, "password.tooShort")
  .max(128)
  .regex(/[a-z]/, "password.needsLower")
  .regex(/[A-Z0-9]/, "password.needsUpperOrDigit");

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(PAGE_SIZE),
});

export const productListQuery = paginationQuery.extend({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(220).optional(),
  brand: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === undefined ? undefined : Array.isArray(v) ? v : [v])),
  min: z.coerce.number().min(0).optional(),
  max: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z
    .enum(["relevance", "newest", "price_asc", "price_desc", "rating", "bestsellers"])
    .default("relevance"),
});

export const suggestQuery = z.object({
  q: z.string().trim().min(2, "search.tooShort").max(80),
  limit: z.coerce.number().int().min(1).max(12).default(8),
});

export const addToCart = z.object({
  productId: z.coerce.number().int().positive(),
  qty: z.coerce.number().int().min(1).max(MAX_QTY_PER_LINE).default(1),
});

export const updateCartItem = z.object({
  qty: z.coerce.number().int().min(0).max(MAX_QTY_PER_LINE),
});

export const couponCode = z.object({
  code: z.string().trim().min(2).max(60).toUpperCase(),
});

export const address = z.object({
  fullName: z.string().trim().min(3, "address.nameRequired").max(190),
  phone: phoneMA,
  line1: z.string().trim().min(5, "address.lineRequired").max(255),
  line2: z.string().trim().max(255).optional().or(z.literal("")),
  landmark: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(2, "address.cityRequired").max(120),
  region: z.string().trim().max(120).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().length(2).default("MA"),
});

export const checkoutQuote = z.object({
  city: z.string().trim().min(2).max(120),
  carrier: z.string().trim().max(60).optional(),
  couponCode: z.string().trim().max(60).optional(),
});

export const placeOrder = z.object({
  email: email.optional().or(z.literal("")),
  shipping: address,
  billingSameAsShipping: z.boolean().default(true),
  billing: address.optional(),
  carrier: z.string().trim().max(60),
  paymentMethod: z.enum(["cod", "cmi", "payzone", "bank_transfer"]).default("cod"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "checkout.mustAcceptTerms" }) }),
});

export const register = z.object({
  firstName: z.string().trim().min(2).max(90),
  lastName: z.string().trim().min(2).max(90),
  email,
  phone: phoneMA,
  password,
  locale: locale.default("fr"),
  acceptsMarketing: z.boolean().default(false),
});

export const login = z.object({
  email,
  password: z.string().min(1, "password.required").max(128),
});

export const review = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(190).optional().or(z.literal("")),
  body: z.string().trim().min(10, "review.tooShort").max(2000),
  authorName: z.string().trim().min(2).max(120),
  email: email.optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot — bots fill it, humans never see it
});

export const contact = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  phone: phoneMA.optional(),
  subject: z.string().trim().min(3).max(190),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(), // honeypot
});

export const newsletter = z.object({
  email,
  locale: locale.default("fr"),
});
