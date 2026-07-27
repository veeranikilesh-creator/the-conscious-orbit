# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Vite dev server with HMR
npm run build    # production build to dist/
npm run preview  # serve the built bundle
npm run lint     # oxlint (not ESLint)
```

There is no test framework configured — no test runner, no test files.

## Stack

React 19 + Vite 8, JavaScript only (`.jsx`, no TypeScript). Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**; Tailwind is pulled in with `@import "tailwindcss"` at the top of `src/index.css` and all customization lives in that file as plain CSS. `framer-motion` for animation, `lucide-react` for icons, `ogl` for the WebGL shader background.

Lint config is `.oxlintrc.json` (oxlint, with the `react` and `oxc` plugins). Only `react/rules-of-hooks` and `react/only-export-components` are enabled.

## Architecture

This is a single-page marketing + dashboard demo for "The Conscious Orbit", a venture-strategy platform. **All data is hardcoded** — there is no backend, no router, no auth, and no data fetching. "Generating a report" and "logging in" are `setTimeout` simulations (`App.jsx:96`, `Login.jsx:23`).

### Routing

Routing is a single `page` string in `App.jsx` state (`'home' | 'login' | 'dashboard'`), switched by early `return`s wrapped in `AnimatePresence`. Navigation happens by passing callbacks down (`onEnter`, `onLogin`, `onBack`, `goHome`). There is no react-router — adding a URL-driven route means restructuring this state machine.

### Dashboard structure

Inside the dashboard page, two orthogonal selectors drive everything:

- `activeVertical` — one of the five `VERTICALS` (students, institutions, msmes, industries, startups), chosen from the marquee in the `Topbar`.
- `mainView` — `'pipeline' | 'intake' | 'board'`, chosen from `MainViewTabs`.

`mainView` picks the panel; `activeVertical` then picks which engine renders inside the intake panel (`StartupMarketEngine`, `MsmeOptimizationEngine`, `IndustryAnalysisEngine`, or the generic fallback). Adding a vertical means touching both the `VERTICALS` array and the conditional dispatch at `App.jsx:180-203`.

### Files

- `src/App.jsx` (~1100 lines) — page routing, dashboard shell, plus several inline components: `Topbar`, `ScrollVelocityRow`, `ThreeLayerEngine`, `KanbanBoard`, `GenerateReportModal`, `VerticalHero`. Domain constants (`VERTICALS`, `CLUSTER_TABS`, `FLAGSHIP_TRACKS`, `KANBAN_COLUMNS`, `SEED_REPORTS`) are defined at the top.
- `src/components/ui.jsx` — the design-system primitives every other file imports: `GlassPanel`, `RoyalButton`, `GhostButton`, `Field`/`Input`/`Textarea`/`Select` (all sharing the exported `fieldBase` class string), `StatusBadge`/`StatusDot`, `OrbitBrand`, `RoyalBackground`. New UI should compose these rather than re-inventing panel/button markup.
- `src/components/VentureProcessor.jsx` — the 4-stage pipeline view (RECEIVED → PENDING → PROCESSED → PUBLISHED), with per-stage module/input/output metadata in the `PIPELINE` constant.
- `src/components/VerticalEngines.jsx` — the three per-vertical calculators. These hold the only real logic in the app: TAM/SAM/SOM derivation via `useMemo` in `StartupMarketEngine`.
- `src/components/DarkVeil.jsx` — OGL/WebGL CPPN shader, mounted through `RoyalBackground`. Heavy; it's rendered at `resolutionScale={0.75}` and low opacity behind a dark overlay.
- `src/components/Homepage.jsx`, `Login.jsx` — the two non-dashboard pages.

The report lifecycle is a four-status string enum used consistently across `App.jsx` (`moveReport` order array, `KANBAN_COLUMNS`), `ui.jsx` (`STATUS_STYLES`, `StatusDot` colors), and `VentureProcessor.jsx` (`PIPELINE[].stage`). Changing or adding a status requires updating all of them.

### Styling conventions

Colors are written as **literal Tailwind arbitrary values** in JSX (`text-[#D4AF37]`, `border-[rgba(212,175,55,0.18)]`), not as theme tokens — the CSS custom properties defined in `index.css` `:root` are largely unused by the components. Match the surrounding literal-hex style when editing; a global palette change means a find-and-replace across `src/`.

The palette: `#050505` background, `#0E0E0E`/`#111111` surfaces, `#D4AF37` primary gold, `#F4D67A` light gold, `#CFCFCF`/`#9A9A9A` secondary/muted text. Note that class names still say "red" from an earlier theme (`.btn-royal-red`, `bg-royal-mesh`) but render gold.

Reusable non-utility styles live in `src/index.css`: `.card-royal-luxury` (used by `GlassPanel`), `.btn-royal-red`, `.btn-royal-gold-outline`, `.field-luxury-gold`, `.flip-card*`, `.scroll-velocity-*`. `src/App.css` is intentionally empty.

## Known issues worth knowing before you edit

- `Sidebar` in `App.jsx:396` and its `sidebarOpen` state are dead code (the `Topbar` replaced it). `RoyalHeading` is imported into `App.jsx` but unused, as is `src/components/PulpSenseHero.jsx` and the standalone `PulpSenseHero.html` at the repo root. `npm run lint` reports these as warnings; the build is otherwise clean.
- The empty `the-conscious-orbit/` directory at the repo root is not part of the build.
