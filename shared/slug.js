/**
 * Slugs. FR gets accent-folded ASCII (`perceuse-à-percussion` -> `perceuse-a-percussion`).
 * AR keeps native Arabic letters — modern browsers and Google handle them fine and they
 * are punycode/percent-encoded on the wire.
 */

const ARABIC = /[\u0600-\u06FF]/;

const stripDiacritics = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Arabic marks (tashkeel + tatweel) carry no lexical value in a URL.
const stripTashkeel = (s) => s.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u0640]/g, "");

export function slugify(input, locale = "fr") {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  if (locale === "ar" || ARABIC.test(raw)) {
    return stripTashkeel(raw)
      .replace(/[^\u0621-\u064A0-9a-zA-Z\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 200);
  }

  return stripDiacritics(raw)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

/** Append `-2`, `-3`… until `exists(candidate)` returns false. */
export async function uniqueSlug(base, exists) {
  let candidate = base;
  let n = 1;
  while (await exists(candidate)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export const isArabic = (s) => ARABIC.test(String(s ?? ""));
