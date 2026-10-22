# Confluence Buildathon 2026

A scroll-led static homepage prototype for the IEEE Computer Society PESU Student Branch. Built with Astro, TypeScript, Tailwind CSS, and GSAP/ScrollTrigger.

## Local development

Requirements: Node.js 20.3+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Astro (normally http://localhost:4321).

## Build and checks

```sh
npm run check
npm run build
npm run preview
```

Astro generates a static site in `dist/`. The site can be deployed to Vercel as an Astro static project; no server runtime or environment variables are required. The `site` and canonical URL in `astro.config.mjs` / metadata are placeholders and should be replaced with the official domain before launch.

The seven track names and event facts are maintained in `src/data/site.ts`. Motion is initialized in the browser, uses a pinned horizontal scene on desktop, becomes a natural vertical sequence on small screens, and respects `prefers-reduced-motion`.

## Institutional logos

The organiser area and footer use the logo images supplied for this event:

- `public/ieee-computer-society-pesu-student-branch.png`
- `public/pes-university.png`

The first is the IEEE Computer Society PES University Student Branch Chapter lockup; the second is the PES University mark. The component sets each image to preserve its aspect ratio.
