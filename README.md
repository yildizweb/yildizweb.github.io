# YILDIZ Tief & Netzausbau GmbH website

Static, bilingual GitHub Pages website. The German routes remain at the site root; complete English equivalents are under `/en/`.

## Structure

- `tools/build-site.mjs`: central DE/EN content, route map and static HTML generator
- `assets/css/site.css`: design tokens, components, responsive layout and reduced-motion styles
- `assets/js/site.js`: navigation, fibre-process motion, gallery, lightbox, consent, map and contact fallback
- `assets/brand`, `assets/icons`, `assets/images`, `assets/media`: optimised transparent brand files, project/stock imagery and the local hero video
- `THIRD_PARTY_ASSETS.md`: asset origin and usage notes
- `tools/audit-site.mjs`: route, language-pair, local target, SEO and JSON-LD checks
- `tools/browser.spec.mjs`: Chromium smoke and interaction tests
- `tools/responsive.spec.mjs`: DE/EN overflow, clipping, asset and interaction QA across 320–1920 px

Generated HTML is committed so the site can be served directly by GitHub Pages without a production build step.

## Commands

```bash
npm install
npm run build
npm run audit
npm run test:browser
npm run test:responsive
ruby -run -ehttpd . -p4173
```

The browser tests expect the local HTTP server to be running at `http://127.0.0.1:4173`.

## Deployment

No deployment is performed by the build or audit scripts. Publishing remains the responsibility of the repository owner.
