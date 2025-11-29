# Front-end Best Practices & Vite Optimization Checklist

## 🎯 Goals (React + Vite + TypeScript)
- Keep core web vitals green (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Maintain lean bundles (<200KB gzipped per route) with aggressive code-splitting
- Ship secure, maintainable code with automated guardrails
- Guarantee accessibility, SEO hygiene, and resilient UX
- Control memory footprint in dev & prod to avoid regressions

---

## 🔄 Stack Snapshot (Nov 27, 2025)
- `npm view vite version` → confirm on Vite 5.x/6.x (current stable as of Nov 2025)
- React 19.2 + TypeScript 5.6+ + Vite (Rollup 4, esbuild 0.24)
- Package manager: `yarn@4` (per repo lockfile)
- Target runtimes: Node 20+, modern evergreen browsers with optional legacy build via `@vitejs/plugin-legacy`

---

## 📦 Dependencies & Package Management

### ✅ Checklist
- [ ] Run `npx depcheck` + `pnpm prune` weekly to drop unused deps
- [ ] `npm audit --production` in CI for security regressions
- [ ] Prefer ESM-friendly libs (`lodash-es`, `date-fns`) for tree shaking
- [ ] Enforce locked versions for infra libs (React, Vite plugins)
- [ ] Keep build tooling in `devDependencies` only
- [ ] Track bundle impact before adding deps via `npx bundlephobia your-lib`
- [ ] Remove duplicate sub-deps via `npx yarn-deduplicate --strategy highest`

### 🧰 Tools & Quick Checks
- `depcheck`, `npm-check`, `pnpm outdated`
- `bundlephobia.com`, `packagephobia.com`
- `synp` (sync lockfiles between npm/yarn/pnpm)
- GitHub Dependabot / Renovate for automated PRs

### 📝 Example
```json
{
  "scripts": {
    "deps:audit": "npm audit --omit=dev",
    "deps:clean": "depcheck || true"
  }
}
```

### 🎬 Scenario (Vite Storefront)
Problem: Monorepo storefront built with Vite ballooned to 2.4 MB bundle + duplicated React.
Solution: `depcheck` removed 17 unused libs, swapped `moment` → `date-fns`, aligned React versions via `yarn dedupe`, split analytics SDK into dynamic import. Result: 1.1 MB bundle, build time -35%.

---

## 🔍 Bundling Analysis & Optimization (Vite)

### ✅ Checklist
- [ ] Generate bundle stats on every prod build
- [ ] Watch for chunks >200KB (gz) and vendor duplication
- [ ] Inspect Rollup tree-shaking warnings
- [ ] Remove legacy polyfills when targeting evergreen browsers
- [ ] Ensure source maps exist for debugging (but excluded from prod deploy artifacts)

### 🧰 Tools & Quick Checks
- `rollup-plugin-visualizer`, `bunchee`, `source-map-explorer`
- `vite-plugin-inspect` (dev analysis), `vite-bundle-inspector`
- `pnpm dlx unbundle analyze dist/assets/*.js`

### 📝 Example (`vite.config.ts`)
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({ filename: 'dist/stats.html' })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js']
        }
      }
    }
  }
}));
```
Run: `VITE_ANALYZE=1 vite build --mode analyze` → open `dist/stats.html`.

### 🎬 Scenario (Analytics Dashboard)
Bundle over 3 MB from charts + editor. Added manual chunks, lazy loaded chart/editor entry via dynamic import, replaced `lodash` with `lodash-es`. New initial chunk: 980 KB, TTI improved from 7.8 s → 2.4 s.

---

## 🚀 Code Splitting / Lazy Loading / Tree Shaking

### ✅ Checklist
- [ ] Dynamic `import()` every route-level feature
- [ ] Use `React.lazy` + `Suspense` for heavy widgets
- [ ] Configure `build.rollupOptions.output.manualChunks` per domain (auth, dashboard, vendors)
- [ ] Prefer smaller libraries or native APIs so tree-shaking removes dead code
- [ ] Ensure all shared utilities are side-effect-free for Rollup
- [ ] Use `import.meta.glob` for route-level lazy loading in Vite

### 🧰 Tools & Quick Checks
- `vite-plugin-route-split` for automatic page chunks
- React DevTools Profiler to confirm lazy components only mount when needed
- `esbuild-analyzer` to verify tree shaking

### 📝 Example
```tsx
const ChartPanel = React.lazy(() => import('./ChartPanel'));

export function AnalyticsSection() {
  return (
    <Suspense fallback={<Skeleton />}> 
      <ChartPanel />
    </Suspense>
  );
}

// Vite glob import for CMS routes
const cmsRoutes = import.meta.glob('../pages/cms/**/*.tsx', { eager: false });
```

### 🎬 Scenario (Content Platform)
Landing page originally pulled WYSIWYG + analytics clients. Shifted to `import.meta.glob` based lazy routing, chunked vendor charts, and deferred marketing widgets to `requestIdleCallback`. Result: 85% reduction in first-load JS.

---

## ⚡ Remove Extra React Renders

### ✅ Checklist
- [ ] Wrap stable components with `React.memo`
- [ ] Memoize derived data via `useMemo`
- [ ] Keep handler identities via `useCallback`
- [ ] Split contexts: per domain (auth/theme/data)
- [ ] Virtualize large lists (`react-window`, `tanstack-virtual`)
- [ ] Profile with React DevTools in StrictMode

### 🧰 Tools & Quick Checks
- React DevTools Profiler
- `why-did-you-render` (dev-only)
- `eslint-plugin-react-hooks` to enforce deps arrays

### 📝 Example
```tsx
const PriceChart = React.memo(({ points }) => <Chart data={points} />);

const handleFilter = useCallback((criteria) => {
  dispatch({ type: 'filter', payload: criteria });
}, [dispatch]);
```

### 🎬 Scenario (Real-time Trading UI)
Charts re-rendered 12x/sec. Added memoized selectors + `React.memo`, replaced context with Zustand store for streaming quotes. CPU usage dropped 60%, battery drain resolved on MacBooks.

---

## 💾 Memory Usage (RAM)

### ✅ Checklist
- [ ] Clean up `setInterval`, `requestAnimationFrame`, and event listeners inside `useEffect`
- [ ] Close WebSocket / SSE connections on unmount
- [ ] Stream large payloads via pagination/infinite scroll
- [ ] Cap cache sizes (LRU, WeakMap)
- [ ] Use `react-window` for tables >500 rows
- [ ] Inspect heap snapshots monthly in Chrome DevTools

### 🧰 Tools & Quick Checks
- Chrome DevTools Performance & Memory tabs
- `why-is-node-running` for lingering handles in dev
- `react-window`, `react-virtuoso`
- Browser Performance Timeline (record >30s sessions)

### 📝 Example
```ts
useEffect(() => {
  const ws = new WebSocket(url);
  return () => ws.close();
}, [url]);

const cache = new Map();
function setCache(key, value) {
  cache.set(key, value);
  if (cache.size > 100) cache.delete(cache.keys().next().value);
}
```

### 🎬 Scenario (Data Viz)
Heatmap page leaked 1.5 GB after 20 min. Virtualized rows, destroyed Chart.js instances on unmount, and throttled history caching to 50 entries. RAM stabilized at 220 MB.

---

## ⚙️ Build / Runtime / Server Config (Vite)

### ✅ Checklist
- [ ] Enable `build.minify: 'esbuild'` (fast) or `'terser'` when needing legacy syntax control
- [ ] Use `esbuildTarget: 'es2022'` for modern browsers + `@vitejs/plugin-legacy` for fallback
- [ ] Configure asset caching headers via reverse proxy (Caddy/Nginx/Vercel headers)
- [ ] Separate env files: `.env`, `.env.production`, `.env.local`
- [ ] Prefer SSR/SSG using Vite SSR or frameworks (e.g., Remix/Vike) if SEO-critical
- [ ] Enable Brotli/Gzip on CDN or hosting layer

### 🧰 Tools & Quick Checks
- `npx vite build --profile` (prints timing)
- `vite-bundle-visualizer` for rollup outputs
- `doppler`, `1Password CLI` for secrets management

### 📝 Example `vite.config.ts`
```ts
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => ({
  plugins: [react(), legacy({ targets: ['defaults', 'not IE 11'] })],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  build: {
    minify: 'esbuild',
    cssCodeSplit: true,
    target: 'es2022',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: { assetFileNames: 'assets/[hash][extname]' }
    }
  }
}));
```
Env usage: `import.meta.env.VITE_API_URL` (never expose secrets without `VITE_` prefix).

### 🎬 Scenario (SaaS Dashboard)
Prod bundle served stale assets. Added CDN cache headers + `output.hashing`, switched to standalone Docker image with `node:20-alpine`, enabled Brotli at edge. Result: 40% faster cold starts.

---

## 🔐 Security & Maintainability

### ✅ Checklist
- [ ] Enforce TypeScript `strict: true`, `noImplicitAny`, `exactOptionalPropertyTypes`
- [ ] Lint & format with `eslint --max-warnings=0` + Prettier
- [ ] Sanitize user input (`isomorphic-dompurify`, Zod validation)
- [ ] Ship CSP & security headers via hosting layer
- [ ] Rate-limit API routes (Upstash, Cloudflare Turnstile, etc.)
- [ ] Review dependencies with `npm audit`, `socket.dev`
- [ ] Document architecture decisions (ADR in repo)

### 🧰 Tools & Quick Checks
- `eslint-plugin-security`, `eslint-plugin-deprecation`
- `npm audit`, `snyk test`, `socket cli`
- `@vercel/edge-config` or KV for serverless secrets
- `Lighthouse` security section, `Mozilla Observatory`

### 📝 Example
```ts
import { z } from 'zod';

const feedbackSchema = z.object({
  message: z.string().trim().min(5).max(5000),
  email: z.string().email().optional()
});

export async function submitFeedback(body: unknown) {
  const data = feedbackSchema.parse(body);
  return db.insert(data);
}
```

### 🎬 Scenario (Comments Service)
Users injected scripts via Markdown. Added DOMPurify on client preview + server-side schema validation + CSP `script-src 'self'`. XSS reports dropped to zero.

---

## 🧪 CI / Performance Tracking

### ✅ Checklist
- [ ] GitHub Actions pipeline: `lint`, `typecheck`, `test`, `build`, `analyze`
- [ ] Failing budgets via `bundlesize` or `size-limit`
- [ ] Lighthouse CI on preview URLs
- [ ] Upload Web Vitals to analytics (BigQuery, Amplitude, Sentry Performance)
- [ ] Synthetic + RUM monitoring (SpeedCurve, Calibre)
- [ ] Auto-open PRs for outdated deps (Dependabot/Renovate)

### 🧰 Tools & Quick Checks
- `size-limit` + `@size-limit/preset-big-lib`
- `lighthouse-ci`, `treosh/lighthouse-ci-action`
- `vitest --runInBand` for deterministic CI tests
- `msw` + `playwright` for E2E/perf smoke tests

### 📝 Example GitHub Action
```yaml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: corepack enable
      - run: yarn install --immutable
      - run: yarn lint && yarn test --runInBand && yarn typecheck
      - run: yarn build
      - run: yarn analyze || true
      - run: npx size-limit
```

### 🎬 Scenario (B2B SaaS)
Added Lighthouse CI gating (score ≥ 90) + `size-limit`. Two regressions caught pre-merge. Weekly RUM dashboard highlights LCP deviations >200 ms.

---

## 📄 HTML / General Markup

### ✅ Checklist
- [ ] `<!doctype html>` + `<html lang="en">`
- [ ] `<meta charset="utf-8">` + responsive viewport meta
- [ ] Semantic structure with `<main>`, `<nav>`, `<section>`
- [ ] Single `<h1>` per page, proper hierarchy afterwards
- [ ] Descriptive `alt` text, `aria-*` where needed
- [ ] Use `<link rel="preconnect">` for critical origins

### 🧰 Tools & Quick Checks
- `npm exec html-validate`, `axe DevTools`, `Pa11y`
- Chrome Lighthouse “Best Practices / Accessibility” tabs
- `aria-practices` reference

---

## 🎨 CSS & Styles

### ✅ Checklist
- [ ] Purge unused CSS (Tailwind JIT handles automatically)
- [ ] Prefer component-scoped styles or CSS Modules
- [ ] Inline critical CSS, lazy-load rest
- [ ] Use `font-display: swap` and self-host WOFF2 fonts
- [ ] Avoid deep selector chains (>3 levels)
- [ ] Leverage modern CSS (`:has`, container queries) while providing fallbacks

### 🧰 Tools & Quick Checks
- `lightningcss` (via Vite), `stylelint`, `csso`
- `critters` or `@builder.io/partytown` for CSS/3P deferral
- Chrome Coverage tab for unused CSS

---

## ⚙️ JavaScript / Behavior

### ✅ Checklist
- [ ] Ship only necessary JS (prefer HTML/CSS capabilities first)
- [ ] Wrap optional scripts with `requestIdleCallback`
- [ ] Mark third-party scripts as `async`/`defer`
- [ ] Store large state on server (RPC or streaming) instead of bundling

### 🧰 Tools & Quick Checks
- Vite dev overlay, `eslint-plugin-import`, `eslint-plugin-unused-imports`
- Chrome Performance panel + CPU throttling

---

## 🖼️ Assets (Images, Fonts, Media)

### ✅ Checklist
- [ ] Use AVIF/WebP via `vite-imagetools`
- [ ] Provide responsive `srcset` + `sizes`
- [ ] Enable `loading="lazy"`, `decoding="async"`
- [ ] Preload hero fonts/images if critical
- [ ] Serve via CDN (Cloudflare, Fastly) with HTTP/3

### 🧰 Tools & Quick Checks
- `vite-imagetools`, `squoosh-cli`, `sharp`
- `fontsource` packages + `subfont`
- `lqip-modern` for placeholders

---

## 🚀 Performance & Loading Strategy

### ✅ Checklist
- [ ] Preconnect to APIs/CDNs
- [ ] Use service worker or Workbox for offline-critical paths
- [ ] Apply Brotli/Gzip at CDN edge
- [ ] Track performance budgets in CI
- [ ] Monitor RUM (LCP/FID/CLS/TTFB)

### 🧰 Tools & Quick Checks
- `workbox-build`, `vite-plugin-pwa`
- Chrome Lighthouse, WebPageTest, SpeedCurve
- `pnpm perfbudgets` (custom scripts) for budgets

---

## ⚠️ Notes / Continuous Responsibilities
- Optimization is continuous—rerun budgets after every feature
- Document trade-offs (ADR) whenever adding large deps
- Pair perf work with monitoring alerts to avoid silent regressions
- Re-test on real devices (low-end Android, iPhone, throttled 3G)

---

## ✅ Quick Release Checklist (React + Vite)
- [ ] `yarn lint && yarn test && yarn typecheck`
- [ ] `yarn build && VITE_ANALYZE=1 yarn build` (inspect `dist/stats.html`)
- [ ] `npx size-limit` within budgets
- [ ] Lighthouse ≥90 on performance/accessibility/best practices/SEO
- [ ] Manual QA on mobile + throttled network
- [ ] Verify `.env.production` matches deployment secrets
- [ ] Smoke-test service worker / caching logic

---

## 📚 Resources
- [Vite Docs](https://vitejs.dev/guide/) / [Vite Performance Guide](https://vitejs.dev/guide/optimizing-production.html)
- [Rollup 4 Docs](https://rollupjs.org/)
- [React 19 Docs](https://react.dev/)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance Docs](https://developer.chrome.com/docs/devtools/)
- [SpeedCurve + Calibre guides](https://www.speedcurve.com/blog/)
