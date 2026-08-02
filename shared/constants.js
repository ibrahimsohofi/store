/** Shared by the API and the React app. Plain JS, no build step. */

export const LOCALES = ["fr", "ar"];
export const DEFAULT_LOCALE = "fr";
export const RTL_LOCALES = ["ar"];
export const CURRENCY = "MAD";
export const VAT_RATE = 0.2;

export const isRtl = (locale) => RTL_LOCALES.includes(locale);

/** Locale-prefixed URL segments — the AR site gets real Arabic slugs, not transliterated FR. */
export const URL_SEGMENTS = {
  fr: {
    home: '',
    category: "categorie",
    product: "produit",
    search: "recherche",
    cart: "panier",
    checkout: "commande",
    orderConfirmation: "order-confirmation",
    confirmation: "confirmation",
    account: "compte",
    orders: "commandes",
    addresses: "adresses",
    wishlist: "favoris",
    page: "p",
    guides: "guides",
    login: "connexion",
    register: "inscription",
  },
  ar: {
    category: "الفئة",
    product: "منتج",
    search: "بحث",
    cart: "السلة",
    checkout: "إتمام الطلب",
    orderConfirmation: "تأكيد الطلب",
    account: "حسابي",
    orders: "طلباتي",
    addresses: "العناوين",
    wishlist: "المفضلة",
    page: "ص",
    guides: "أدلة",
    login: "دخول",
    register: "تسجيل",
  },
};

/** Build a locale-correct path. `path('fr','product','perceuse-bosch')`. */
export function path(locale, key, ...rest) {
  const lang = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  if (!key) return `/${lang}`;
  const seg = URL_SEGMENTS[lang][key] ?? key;
  return `/${lang}/${[seg, ...rest.filter(Boolean)].join("/")}`;
}

export const SORTS = [
  { value: "relevance", labelKey: "sort.relevance" },
  { value: "newest", labelKey: "sort.newest" },
  { value: "price_asc", labelKey: "sort.priceAsc" },
  { value: "price_desc", labelKey: "sort.priceDesc" },
  { value: "rating", labelKey: "sort.rating" },
  { value: "bestsellers", labelKey: "sort.bestsellers" },
];

export const PAYMENT_METHODS = [
  { value: "cod", labelKey: "payment.cod", recommended: true },
  { value: "cmi", labelKey: "payment.card" },
  { value: "bank_transfer", labelKey: "payment.transfer" },
];

/** Cities used by shipping-zone resolution + the address form autocomplete. */
export const MA_CITIES = [
  "Casablanca",
  "Mohammedia",
  "Rabat",
  "Salé",
  "Témara",
  "Kénitra",
  "Marrakech",
  "Fès",
  "Meknès",
  "Tanger",
  "Tétouan",
  "Agadir",
  "Oujda",
  "Safi",
  "El Jadida",
  "Béni Mellal",
  "Nador",
  "Khouribga",
  "Settat",
  "Berrechid",
  "Laâyoune",
  "Dakhla",
  "Errachidia",
  "Ouarzazate",
  "Essaouira",
];

export const PAGE_SIZE = 24;
export const CART_TTL_DAYS = 30;
export const RESERVATION_TTL_MINUTES = 20;
export const MAX_QTY_PER_LINE = 99;
