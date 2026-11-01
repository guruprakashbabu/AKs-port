# S. Akash – Performance Marketing Casebook

Professional Angular 18 rebuild of the single-file `prebilling ak.html` casebook.
The content is split into focused, standalone components with a refined design system,
dark-mode support, lazy-loaded routes and a reusable chart.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm start           # opens http://localhost:4200

# 3. Production build
npm run build       # emits to dist/akash-portfolio
```

> Requires Node 18.19+ (Angular 18). The project uses hash-based routing so it can
> be hosted on any static host (GitHub Pages, S3, Netlify) without URL rewrites.

## Project structure

```
src/
├── app/
│   ├── app.component.ts         Root shell (header + outlet + footer + lightbox)
│   ├── app.config.ts            Standalone bootstrap config
│   ├── app.routes.ts            Lazy-loaded portfolio + gallery routes
│   │
│   ├── models/
│   │   └── types.ts             Shared type definitions
│   │
│   ├── services/
│   │   ├── data.service.ts      Casebook content (leaks, cases, labs, …)
│   │   ├── theme.service.ts     Dark/light mode with localStorage
│   │   └── lightbox.service.ts  Global image viewer state
│   │
│   ├── components/
│   │   ├── header.component.ts         Sticky nav + theme toggle
│   │   ├── hero.component.ts           Hero + stat cards
│   │   ├── leaks.component.ts          Interactive 5-step diagnosis
│   │   ├── cases.component.ts          Filterable case grid
│   │   ├── results-lab.component.ts    Channel tabs + KPI + table + chart
│   │   ├── chart.component.ts          Reusable SVG line chart
│   │   ├── timeline.component.ts       Recent-work feed
│   │   ├── process.component.ts        How I work (3 phases)
│   │   ├── testimonials.component.ts   Quotes + bio
│   │   ├── contact-cta.component.ts    Final CTA
│   │   ├── footer.component.ts         Footer with contact links
│   │   └── lightbox.component.ts       Keyboard-friendly image viewer
│   │
│   └── pages/
│       ├── portfolio.component.ts      Composes the portfolio sections
│       └── gallery.component.ts        Per-channel screenshot gallery
│
├── index.html
├── main.ts
└── styles.css                   Design tokens + base styles
```

## Design system

All components inherit from the tokens defined in `src/styles.css`:

- **Palette** – Blue `#2437B5` + lime `#C8F169` with semantic ok/warn/bad.
- **Typography** – Bricolage Grotesque for display, Figtree for body copy.
- **Elevation** – Three shadow levels (`--shadow-sm/md/lg`).
- **Radii** – Four-step scale (10/14/20/28px).
- **Motion** – Shared easing curves + reduced-motion opt-out.
- **Dark mode** – Full support via `[data-theme="dark"]` (also follows OS pref).

## Content updates

Edit `src/app/services/data.service.ts` to change hero stats, leaks, case studies,
lab KPIs/tables, timeline, phases, skills, testimonials or bio. Changes propagate
to every component automatically.

## Image assets

Add logos, business photos and your profile picture to `public/` and reference
them from the data service. The gallery page lets you upload screenshots at
runtime (stored in memory for the session).
