# NEXMOD — nexmod.lk

Production website for **Nexmod**, a premium car accessories studio at 71 Sri Saranankara Road, Dehiwala, Sri Lanka. Official EZ Lip USA agent for Sri Lanka.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

**Trilingual** — English, Sinhala and Tamil. 346 statically prerendered pages.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Other scripts: `npm start` (serve the production build), `npm run typecheck`.

---

## ⚠️ Before you launch — read this

Some data in this repo is **placeholder** and must be replaced with the owner's real figures. It is realistic and clearly marked, but it is not real.

| What | Where | Action |
|---|---|---|
| **All product prices** | `src/data/products.ts` | Replace every `price`, `compareAt` and variant price. Marked in a header comment. |
| **All service prices** | `src/data/services.ts` | Replace every `fromPrice` and `priceNote`. |
| **Email address** | `src/data/site.ts` → `contact.email` | Currently `hello@nexmod.lk` — confirm or change. |
| **Map coordinates** | `src/data/site.ts` → `address.latitude/longitude` | Approximate. Replace with the exact pin from the Google Business Profile. |
| **Free delivery threshold** | `src/data/site.ts` → `delivery.freeThreshold` | Currently Rs. 15,000. Confirm the real policy. |
| **Delivery fee** | `src/lib/cart.tsx` → `DELIVERY_FEE` | Currently Rs. 650 flat. Confirm. |
| **Product photography** | `src/components/Visual.tsx` | See "Adding real photos" below. |
| **Payment gateway** | `src/app/api/orders/route.ts` | No gateway connected. See "Going live with payments". |
| **Booking delivery** | `src/app/api/bookings/route.ts` | Bookings are logged, not emailed. See "Receiving bookings". |

Search the codebase for `PLACEHOLDER` to find every one of these.

---

## Architecture

```
src/
  app/
    [locale]/             ALL pages live here — /en, /si, /ta
  i18n/                   Locale config, dictionaries, content translations
  proxy.ts                Locale detection and redirect
```

```
src/app/[locale]/         Routes (App Router)
    api/bookings/         Booking endpoint — validates + logs (integration seam)
    api/orders/           Order endpoint — validates + logs (integration seam)
    articles/             Blog: index, [slug], category/, tag/
    categories/[slug]/    Product category pages
    products/[slug]/      Product detail pages
    services/[slug]/      Service detail pages
    studio/               INTERNAL SEO planning tool (noindex, robots-blocked)
    sitemap.ts            Auto-generated, excludes scheduled posts
    robots.ts             Blocks /studio, /checkout, /api
    feed.xml/             RSS 2.0, excludes scheduled posts
    icon.tsx              Generated favicon
    opengraph-image.tsx   Generated social card
  components/             UI — all typed, no external UI library
  data/                   ALL CONTENT LIVES HERE
    site.ts               Business facts, hours, contact, payments, delivery
    types.ts              Shared types for everything below
    categories.ts         9 product categories
    products.ts           36 products
    services.ts           12 services
    articles.ts           14 articles (8 live, 6 scheduled)
    calendar.ts           SEO content calendar + GBP post templates + checklist
  lib/
    cart.tsx              Cart state, localStorage, WhatsApp order builder
    content.ts            Scheduled-publishing logic
    seo.ts                Metadata helpers
    schema.ts             JSON-LD generators
```

**Content is data, not markup.** Everything the site says lives in `src/data/`. To change a price, add a product, or write an article, you edit a typed TypeScript file — no CMS, no database, no markup to break.

---

## Languages

Three locales, all prefixed: `/en`, `/si`, `/ta`. An unprefixed request is
redirected by `src/proxy.ts`, which prefers a stored cookie, then
`Accept-Language`, then English. An explicit URL always wins, so shared links
behave.

`app/[locale]/layout.tsx` is the root layout — there is deliberately no
`app/layout.tsx`. That is what lets `<html lang>` be set per locale while every
page stays statically prerendered.

Internal links go through `LocaleLink` (`src/i18n/client.tsx`), which reads the
locale from `usePathname()`. That works during server rendering, so the HTML a
crawler receives already carries the right prefix.

### What is translated

| Layer | Status |
|---|---|
| UI chrome, nav, commerce, filters, forms | **Translated** — `src/i18n/dictionaries/` |
| Category and service names + taglines | **Translated** — `src/i18n/content.ts` |
| Product taglines | **Translated** — `src/i18n/content.ts` |
| Product **names** | English by design — they are identifiers |
| Technical terms (carbon fibre, EZ Lip, LED, KOKO) | English by design — how customers actually speak |
| Long-form article bodies | English — see below |

Article bodies stay English deliberately. They are technical documents, and a
machine-grade translation would read worse than the English does. When the owner
has them professionally translated, the strings go in `src/i18n/content.ts` —
one file, no application code to touch.

Adding a key to `dictionaries/en.ts` makes it **required** in `si.ts` and
`ta.ts`, so a missing translation is a TypeScript error rather than a blank
space on the site.

### Typography

Sinhala and Tamil have taller ascenders and deeper descenders than Latin, and
the Latin display face is tracked at `-0.028em` which damages Indic letterforms.
Each locale gets Noto Sans Sinhala/Tamil, neutral tracking, looser line-height,
and drops the uppercase transform on labels where it carries no meaning.

---

## Scheduled publishing

This is how the "daily posting" requirement works. **Give an article a future `publishedAt` date and it publishes itself.**

```ts
// src/data/articles.ts
{
  slug: "toyota-vitz-modification-guide",
  title: "Toyota Vitz Modification Guide",
  publishedAt: "2026-09-20",   // ← future date = scheduled
  ...
}
```

Until 20 September 2026, that article:
- does not appear in `/articles`
- returns **404** at its own URL
- is **absent from the sitemap**
- is **absent from the RSS feed**

On the date, it appears everywhere automatically. Article pages use `revalidate = 3600`, so this happens **without a deploy**.

Verified working — 8 articles live, 6 scheduled, 0 leaks into sitemap or feed.

The queue is visible at **`/studio`**.

---

## `/studio` — the internal SEO tool

Not linked from the site, `noindex`, and blocked in `robots.txt`. It contains:

1. **Publishing queue** — every scheduled article and its date
2. **Weekly posting rhythm** — a repeatable 7-day cycle with **ready-to-paste copy templates** for Google Business Profile, Instagram, Facebook and TikTok, plus a shoot list for each day
3. **Local SEO checklist** — 13 tasks ranked critical/high/medium with frequency
4. **Keyword map** — one target keyword per page so pages never cannibalise each other
5. **Article pipeline** — 10 planned articles with target keywords, ranked by opportunity

All of it is driven by `src/data/calendar.ts`. Edit that file, the page updates.

### The Google Business Profile part

GBP posts expire after 7 days, so consistency beats volume. The weekly plan gives a post type per day (finished work / education / product / process / offer / customer proof / new article) with fill-in-the-blank copy.

The highest-impact items on the checklist, in order:
1. Complete the GBP profile fully — every field, all 12 services listed individually
2. Post to GBP 3–4× per week
3. Ask every satisfied customer for a review (94 → 150+ would dominate the local pack)
4. Reply to every review within 48 hours
5. Submit the sitemap to Search Console and request indexing per article

---

## SEO implementation

- **Metadata** — every page routes through `pageMeta()` in `src/lib/seo.ts`; titles are length-capped so Google does not truncate them mid-word
- **Canonicals** — set on every page
- **JSON-LD** — a connected `@graph` of Organization → LocalBusiness → WebSite in the root layout, plus per-page `Product` (with `AggregateOffer`), `Service` (with `OfferCatalog`), `Article`, `BreadcrumbList`, `FAQPage`, `CollectionPage`, `ItemList`, `ContactPage`
- **LocalBusiness** typed as `AutoPartsStore` + `AutoBodyShop` with geo, opening hours (including the Friday closure), `AggregateRating` 4.5/94, and `areaServed`
- **Open Graph images** — generated per page at the edge via `next/og`; products show price, services show duration, articles show read time
- **Sitemap** — 228 URLs with 912 `xhtml:link` alternates, daily revalidation, priority-weighted
- **hreflang** — reciprocal set plus `x-default` on every page and in the sitemap
- **RSS** — RSS 2.0 at `/feed.xml`
- **Breadcrumbs** — visible nav and JSON-LD emitted from one source so they cannot drift
- **Internal linking** — products ↔ categories ↔ services ↔ articles are cross-linked in every direction; tag and category archives create additional crawl surface
- **Geo meta tags** — `geo.region`, `geo.position`, `ICBM` for local search
- **Security headers** — HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy in `next.config.ts`

346 pages statically prerendered across three locales.

---

## Commerce

Three order paths, deliberately — because Nexmod already takes most orders on WhatsApp:

1. **Cart → checkout** — full form, server-side total recomputation, COD / card / bank / KOKO / Mintpay
2. **Cart → WhatsApp** — builds a formatted order message and opens WhatsApp with it prefilled
3. **Product page → WhatsApp** — a fitment enquiry for a single product

The cart supports variants, quantity, and a **per-line installation toggle** (workshop fitting vs delivery). Delivery is waived automatically when every line is being fitted. Cart state persists in `localStorage`.

### Going live with payments

`src/app/api/orders/route.ts` validates the order, recomputes the total server-side (never trusting the client), and returns a reference. It does **not** take payment.

To connect a gateway — **PayHere** (2.69–3.30%) or **OnePay** (~1% on LankaQR) are the usual Sri Lankan choices — create the payment session in the marked block and return its redirect URL instead of a bare reference. Persist the order *before* redirecting so a dropped callback cannot lose it.

KOKO and Mintpay are separate BNPL integrations. Build their commission into list prices rather than surcharging at checkout.

Until a gateway is connected, COD and bank transfer work end to end via manual confirmation — which is how the business already operates.

### Receiving bookings

`src/app/api/bookings/route.ts` validates (including rejecting Fridays, when the workshop is closed) and logs. Add email (Resend/SendGrid), a Google Sheets append, or a CRM call in the marked block.

The booking form also produces a prefilled WhatsApp message with identical details, presented as an equal option — so bookings reach the workshop today regardless.

---

## Adding real photos

There is no product photography yet, so rather than ship broken images or grey boxes, every product and service renders a **generated visual**: a deterministic gradient keyed to its category, a CSS carbon-weave texture, and the category glyph. It looks designed rather than missing.

When photos arrive, replace `src/components/Visual.tsx` with `next/image`. Every call site passes the same props, so nothing else changes.

Suggested shoot list, in priority order:
1. EZ Lip fitted, front three-quarter — the highest-value product
2. Carbon fibre before/after pairs
3. Tyre lettering close-ups
4. Workshop interior with a car on a bay
5. Each service mid-process (this is the strongest trust content you can produce)

---

## Content model

To add a **product**: append to `src/data/products.ts`. TypeScript enforces required fields. It appears in the catalogue, its category, the sitemap and search automatically.

To add a **service**: append to `src/data/services.ts` — same story.

To add an **article**: append to `src/data/articles.ts`. The body is a typed block array (`p`, `h2`, `h3`, `ul`, `ol`, `quote`, `callout`, `table`), which keeps content structured and reusable rather than trapped in markup.

To change **business facts** — hours, phone, address, payment methods, delivery policy: `src/data/site.ts` only. It flows to the header, footer, contact page, JSON-LD and geo meta tags.

---

## Design system

Dark-first automotive aesthetic — carbon blacks, one hot accent (`#ff2d20`), Inter and Inter Tight.

Theme handling covers all three states: explicit light, explicit dark, and system default. Light values sit on bare `:root`; dark overrides both `prefers-color-scheme` and `[data-theme="dark"]`. An inline script in the root layout applies the stored choice before first paint, so there is no flash.

Accessibility: skip link, focus-visible rings, `aria-expanded` on all disclosures, `aria-live` on filter results, semantic landmarks, and a `prefers-reduced-motion` block that disables all animation.

---

## Deployment

Deploys to Vercel with zero configuration. Set `metadataBase` correctly by keeping `site.url` in `src/data/site.ts` accurate.

**DNS note:** `nexmod.lk` is registered but was not serving a site at the time of build — there is no A record. Point it at the host before launch.

### Launch checklist

- [ ] Replace all placeholder prices
- [ ] Confirm email address and map coordinates
- [ ] Point `nexmod.lk` DNS at the host
- [ ] Verify the domain in Google Search Console
- [ ] Submit `https://nexmod.lk/sitemap.xml`
- [ ] Claim and complete the Google Business Profile (see `/studio`)
- [ ] Add all 12 services to the GBP Services section
- [ ] Connect a payment gateway, or confirm COD-only at launch
- [ ] Wire booking notifications to email
- [ ] Add real photography
- [ ] Have a native speaker review the Sinhala and Tamil strings in `src/i18n/`
- [ ] Test a live order and a live booking end to end
