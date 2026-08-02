// SOHOFI BRICO — Storefront build log

# Phase 1 — Foundation  (in progress)

- [x] Config: env (zod), knex (sqlite dev / mysql prod), cache, pino logger
- [x] Migrations: base catalogue, extend catalogue, customers, media+SEO,
      cart/reservations, commerce (orders/payments/shipping/coupons), content
- [x] `shared/` — constants, money, slug, zod schemas (client + server)
- [ ] Install deps, `.env`, `public/`
- [ ] Fix seed syntax error; add commerce + content seeds; `db/seed.js` runner
- [ ] Middleware: security/CSP, error envelope, rate limit, validate, csrf
- [ ] Express API bootstrap (`server/app.js` + `server/index.js`)
- [ ] Vite SSR server (`server/ssr.js`) — dev middleware + prod static
- [ ] i18n FR (default) + AR (RTL), locale-prefixed routes
- [ ] Design system primitives (button, badge, input, card, price, rating, stepper)
- [ ] Layout shell: topbar, header, mega-nav, footer, mobile drawer, WhatsApp FAB
- [ ] DoD: `bun run dev` serves an SSR'd page in both locales

# Phase 2 — Catalogue
- [ ] Home, Category (facets), Product detail, Search + typeahead
- [ ] JSON-LD, sitemap.xml, robots.txt, hreflang, canonical

# Phase 3 — Commerce
- [ ] Cart, guest checkout, shipping zones, COD, order + confirmation

# Phase 4 — Payments  ·  Phase 5 — Accounts  ·  Phase 6 — Admin  ·  Phase 7 — Hardening

---

## Decisions taken (can be revisited)
- DB: Knex. `better-sqlite3` in dev sandbox, `mysql2` in prod — same migrations, dialect-guarded.
- Ports: SSR+web on `PORT` (3000 here, 4000 in the map), standalone API on 4001.
  API router is also mounted same-origin on the SSR app so cookies/CSRF stay simple.
- Aesthetic: industrial / brutalist quincaillerie — ink + bone, signal orange, hazard
  stripes, hard offset shadows, Archivo display + IBM Plex Sans/Arabic.
- SSR uses `renderToString` (not `renderToPipeableStream`) so `react-helmet-async` can
  collect head tags before the first byte. Streaming is a Phase 7 perf item.
- No Redis in the sandbox — rate limiting + cache use an in-memory driver behind an
  interface so swapping in `ioredis` later is a one-file change.
- Passwords: `bcryptjs` in the sandbox (no native build step); `argon2id` is a
  one-line swap in `utils/password.js` on a real host.
