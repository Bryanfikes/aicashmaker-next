# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Payload at localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run generate:types      # Regenerate payload-types.ts from collection schemas
npm run generate:importmap  # Regenerate Payload admin import map
npx tsx scripts/seed-admin.ts  # Create first admin user (fresh installs only)
```

The Payload admin panel is at `/admin`.

## Required Environment Variables

```
DATABASE_URI          # Postgres connection string (Supabase)
PAYLOAD_SECRET        # Secret for Payload auth tokens
STRIPE_SECRET_KEY     # Stripe secret key
STRIPE_WEBHOOK_SECRET # Stripe webhook signing secret
NEXT_PUBLIC_SITE_URL  # Public URL (https://aicashmaker.com in prod)
```

## Architecture

This is a **Next.js 15 + Payload CMS 3** monorepo. Payload is embedded directly into Next.js — there is no separate CMS server.

### Route groups

- `app/(frontend)/` — public-facing site (Nav + Footer layout)
- `app/(payload)/` — Payload admin panel (mounted at `/admin`) and its API

Both share the same Next.js process. Payload's API is auto-mounted by the `withPayload()` wrapper in `next.config.ts`.

### Data fetching

Pages call `getPayload()` from `lib/payload.ts` directly — no HTTP requests, no REST/GraphQL. This is a server-side Payload SDK call that hits the database. All content pages use `export const dynamic = 'force-dynamic'` because content changes at any time.

`lib/payload.ts` guards against calling the DB during `next build` (no database at build time on Vercel) and caches the Payload instance across hot reloads in dev.

### Payload collections

Defined in `collections/`. All collections are registered in `payload.config.ts`. Key ones:

| Collection | Purpose |
|---|---|
| `tools` | AI tool listings with ratings, pricing, affiliate links, pros/cons, income potential |
| `blog-posts` | Blog articles |
| `side-hustles` | Side hustle guides |
| `products` | Creator marketplace products (sold via Stripe) |
| `orders` | Purchase records created by Stripe webhook |
| `creators` | Creator profiles linked to products |
| `tool-submissions` / `product-submissions` | User-submitted content pending review |
| `newsletter-subscribers` | Email list |
| `categories` | Shared taxonomy for tools/content |

After changing any collection schema, run `npm run generate:types` to update `payload-types.ts`.

### Stripe payment flow

1. Client POSTs to `/api/stripe/checkout` → creates a Stripe Checkout Session
2. Stripe redirects to `/checkout/success`
3. Stripe sends webhook to `/api/stripe/webhook` → `handleCheckoutCompleted` creates an `Order` doc in Payload
4. Platform takes 20% of product sales; creator keeps 80% (`PLATFORM_FEE_PERCENT` in `lib/stripe.ts`)
5. Advertising packages (featured listing, newsletter sponsorship, full review, bundle) are defined in `lib/stripe.ts` as `ADVERTISING_PACKAGES`

### Affiliate redirect

`/go/[slug]` — reads the tool's `affiliateLink` from Payload and redirects. All affiliate links in the UI point here, not directly to external URLs.

### Shared utilities

`lib/utils.ts` — `formatPrice`, `formatDate`, `slugify`, `truncate`

### Monaco editor mock

`mocks/monaco-editor-react.js` is aliased in via webpack for SSR builds. Payload's admin CodeEditor component crashes during SSR without a Monaco context; the mock stubs it out safely.

### Deployment

Deployed to Vercel. `vercel.json` is minimal — Vercel auto-detects the Next.js framework. Database is Supabase Postgres.
