/**
 * Absolute origin of the storefront, safe to read on the server (SSR) and in
 * the browser bundle. `process` does not exist in the client bundle, so the
 * value is sourced from Vite's `import.meta.env` (set `VITE_SITE_URL` in .env)
 * which resolves to the same string on both sides — no hydration mismatch.
 */
export const SITE_URL = import.meta.env?.VITE_SITE_URL || 'http://localhost:3000';

export default SITE_URL;
