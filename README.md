# CalculioHub

Production-ready Next.js calculator suite with **150** programmatic SEO tools across 10 categories.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- `next-themes` dark/light mode

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Structure

- `data/calculators.json` — all 150 calculator definitions
- `src/lib/formulas.ts` — client-side calculation engine
- `src/app/tools/[slug]/page.tsx` — static tool pages + metadata
- `src/app/sitemap.ts` — XML sitemap for all tool URLs
