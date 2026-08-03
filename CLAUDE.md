# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

Two independent npm projects in one repo:

- repo root — the Vite/React frontend (`src/`)
- `server/` — an Express/MongoDB API, added later and **not yet consumed by the frontend**

They have separate `package.json` / `node_modules`. `npm install` at the root does not install the server's deps.

## Commands

```bash
# frontend (repo root)
npm install
npm run dev      # Vite dev server with HMR, :5173
npm run build    # production build to dist/
npm run preview  # serve the built bundle
npm run lint     # oxlint — note it lints server/ too, since it runs from the root

# backend
cd server
npm install
cp .env.example .env   # MONGODB_URI is the only one required
npm run dev            # node --watch, http://localhost:4000/api
npm start
```

There is no test framework anywhere in this repo — no runner, no test files.

## Frontend

React 19 + Vite 8, JavaScript only (`.jsx`, no TypeScript). Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**; Tailwind is pulled in with `@import "tailwindcss"` at the top of `src/index.css` and all customization lives in that file as plain CSS. `framer-motion` for animation, `lucide-react` for icons, `ogl` for the WebGL shader background. Lint config is `.oxlintrc.json` (oxlint with the `react` and `oxc` plugins; only `react/rules-of-hooks` and `react/only-export-components` are configured).

**All frontend data is hardcoded.** No router, no auth, no data fetching — there is not a single `fetch()` in `src/`. "Generating a report" and "logging in" are `setTimeout` simulations that mutate local state (`App.jsx:135`, `Login.jsx`).

### Routing

A single `page` string in `App.jsx` state (`'home' | 'login' | 'dashboard'`), switched by early `return`s wrapped in `AnimatePresence`. Navigation happens by passing callbacks down (`onEnter`, `onLogin`, `onBack`, `goHome`). Adding a URL-driven route means restructuring this state machine.

### Dashboard structure

Two orthogonal selectors drive everything:

- `activeVertical` — one of the five `VERTICALS` (students, institutions, msmes, industries, startups), chosen from the scroll-velocity marquee in `Topbar`.
- `mainView` — `'pipeline' | 'intake' | 'board'`, chosen from `MainViewTabs`.

`mainView` picks the panel; inside the intake panel `activeVertical` picks the engine (`StartupMarketEngine`, `MsmeOptimizationEngine`, `IndustryAnalysisEngine`, or `GenericVerticalPanel`). Adding a vertical means touching both `VERTICALS` in `src/constants.js` and the conditional dispatch around `App.jsx:241-271`.

Intake forms are **controlled from `App.jsx`** (`profile` / `clusters` state plus `setProfileField` / `setClusterField`), so values survive cluster-tab switches and are read by `handleGenerate` to compose the new report. Don't reintroduce local form state inside the engine components.

### Frontend files

- `src/constants.js` — `VERTICALS` and `REPORT_STATUSES`, the single source of truth shared by `App.jsx` and `Homepage.jsx`.
- `src/App.jsx` (~1200 lines) — page routing, dashboard shell, plus inline components: `Topbar`, `ScrollVelocityRow`, `MainViewTabs`, `VerticalHero`, `ThreeLayerEngine`, `GenericVerticalPanel`, `KanbanBoard`, `GenerateReportModal`. Domain constants (`CLUSTER_TABS`, `FLAGSHIP_TRACKS`, `KANBAN_COLUMNS`, `SEED_REPORTS`) sit at the top.
- `src/components/ui.jsx` — design-system primitives every other file imports: `GlassPanel`, `RoyalButton`, `GhostButton`, `Field`/`Input`/`Textarea`/`Select` (sharing the exported `fieldBase` class string), `StatusBadge`/`StatusDot`, `OrbitBrand`, `RoyalBackground`. Compose these rather than re-inventing panel/button markup.
- `src/components/VentureProcessor.jsx` — the 4-stage pipeline view, with per-stage module/input/output metadata in the `PIPELINE` constant.
- `src/components/VerticalEngines.jsx` — the three per-vertical calculators; the TAM/SAM/SOM derivation (`useMemo` in `StartupMarketEngine`) is the only real logic on the frontend. Channel-mix coverage is deliberately capped at 100% so SOM cannot exceed SAM.
- `src/components/DarkVeil.jsx` — OGL/WebGL CPPN shader, mounted through `RoyalBackground`. Heavy; rendered at `resolutionScale={0.75}` and low opacity behind a dark overlay, and it releases the GL context on unmount.

### Styling conventions

Colors are written as **literal Tailwind arbitrary values** in JSX (`text-[#D4AF37]`, `border-[rgba(212,175,55,0.18)]`), not theme tokens — the CSS custom properties in `index.css` `:root` are largely unused by components. Match the surrounding literal-hex style; a palette change means a find-and-replace across `src/`.

Palette: `#050505` background, `#0E0E0E`/`#111111` surfaces, `#D4AF37` primary gold, `#F4D67A` light gold, `#CFCFCF`/`#9A9A9A` secondary/muted text. Class names still say "red" from an earlier theme (`.btn-royal-red`, `bg-royal-mesh`) but render gold.

Reusable non-utility styles live in `src/index.css`: `.card-royal-luxury` (used by `GlassPanel`), `.btn-royal-red`, `.btn-royal-gold-outline`, `.field-luxury-gold`, `.flip-card*`, `.scroll-velocity-*`.

## Backend (`server/`)

Node + Express 5 + Mongoose, ESM, zod for input validation. `server/README.md` has the full endpoint table and folder map — read it before touching the API.

The core idea is two coupled state machines over a `Report`:

- `state/reportState.js` — the linear status chain `RECEIVED → PENDING → PROCESSED → PUBLISHED`. Every change goes through `assertTransition()` (illegal jumps 400 rather than being silently written) and is appended to `report.transitions`.
- `state/actionPipeline.js` — pairs each status with an action (`SCRUMING`, `REQUIREMENT`, `MAPPING`, `DELIVERED`) and with the modules that must have results before the report may leave that status. `requireStageComplete()` gates `POST /advance` with a **409** listing the missing module keys; reverting is ungated.

Ten report-generation modules in `server/src/modules/` each export `{ key, title, action, inputSchema, run }`; `run(input, context)` returns `{ output, score, integrations? }`. They are dispatched exclusively through the registry in `modules/index.js` — adding a module means one import and one entry there, plus adding its key to a stage in `PIPELINE_STAGES`. One generic controller handler (`moduleController.js`) drives all ten and upserts a `ModuleResult` (unique on report+module, so re-running overwrites).

`industryReport` (module 7) is the consolidator: it weights every other module's score into the Conscious Orbital Score and passes a dossier to the AI decision engine, writing the verdict back to `report.score` / `report.decision`.

Both integrations degrade instead of throwing: without `ANTHROPIC_API_KEY`, `integrations/aiProvider.js` returns a deterministic heuristic verdict; without SpyFu credentials, `integrations/spyfu.js` returns clearly-labelled placeholder data. Keep that property — the pipeline is expected to always complete.

Read env through `config/env.js`, not `process.env`. There is **no authentication** on any endpoint.

### Frontend ↔ backend

`Report.toJSON()` deliberately emits `{ id, name, vertical, tags, status, score }` — the exact shape `KanbanBoard` renders — and the four statuses are shared verbatim across `src/constants.js` (`REPORT_STATUSES`, `KANBAN_COLUMNS`), `ui.jsx` (`STATUS_STYLES`, `StatusDot`), `VentureProcessor.jsx` (`PIPELINE[].stage`) and the server's `reportState.js`. Changing or adding a status means updating all of them. Wiring the UI up means replacing `SEED_REPORTS` with `GET /api/reports` and mapping the board's Back/Advance buttons to `POST /revert` / `POST /advance`.

## Known dead weight

`src/components/PulpSenseHero.jsx` and the standalone `PulpSenseHero.html` at the repo root are unused, as is the empty `the-conscious-orbit/` directory. `npm run lint` currently reports one warning (an unused import in `server/src/modules/customerDiscovery.js`); the build is otherwise clean.
