# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

Three independent projects in one repo, with **two competing backends**:

- repo root — the Vite/React frontend (`src/`)
- `server/` — Express 5 + Mongoose/MongoDB, ESM JavaScript. Complete: ten calculator modules, two state machines, zod validation, AI + SpyFu integrations.
- `server_python/` — FastAPI + SQLAlchemy, Postgres with a SQLite fallback. The frontend's default target. Originally a persistence shim; in 2026-08 it became a **full port of the Express engine** — same ten calculators, same state machines, same gate, same response envelopes. See below.

Each has its own dependency manifest. `npm install` at the root installs neither backend's deps.

## Commands

```bash
# frontend (repo root)
npm install
npm run dev      # Vite dev server with HMR + --host, :5173
npm run build    # production build to dist/
npm run preview  # serve the built bundle
npm run lint     # oxlint — note it lints server/ too, since it runs from the root

# Express/Mongo backend
cd server && npm install
cp .env.example .env       # MONGODB_URI is the only required var
npm run dev                # node --watch, http://localhost:4000/api

# FastAPI backend
cd server_python && pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # http://localhost:8000/api
```

There is **no test framework anywhere in this repo** — no runner, no test files, no test script. To exercise backend logic, import the modules directly in a scratch `.mjs` file run from inside `server/` (so `node_modules` resolves) and call `run(input, context)`; every calculator is a pure function. `server/` has `mongodb-memory-server` as a devDependency for database-backed checks without installing MongoDB.

## The two backends are behavioural twins — keep them that way

`server_python/` is a line-for-line port of the Express engine, **verified score-identical**: the same intake driven through both backends produces the same ten module scores, the same Orbital Score, and the same verdict. Any behavioural change to one backend must be mirrored in the other (module formulas, weights, gate logic, envelopes), or the two will silently diverge again — which is exactly the state this port was built to end.

The shared architecture, in both stacks:

- **Ten calculator modules**, each with key/title/action, an input schema (zod in `server/src/modules/*.js`, pydantic in `server_python/modules/*.py`) and a pure `run(input, context)` returning `{ output, score }`. Registries: `server/src/modules/index.js` / `server_python/modules/__init__.py`.
- **Two coupled state machines**: `RECEIVED → PENDING → PROCESSED → PUBLISHED` paired with `SCRUMING / REQUIREMENT / MAPPING / DELIVERED` (`server/src/state/` / `server_python/state.py`). Advancing is **gated** — a 409 lists the missing module keys; reverting is ungated.
- **`industryReport` (module 7) is the consolidator** — it weights every other module's score into the Conscious Orbital Score (weights in `MODULE_WEIGHTS`, identical in both), hands a dossier to the AI decision engine, and the controller writes the verdict back to `report.score` / `report.decision`.
- **Integrations degrade, never throw**: no `GEMINI_API_KEY` → deterministic heuristic verdict; no SpyFu creds → labelled placeholder data (`server/src/integrations/` / `server_python/integrations/`). Keep that property.
- **Same envelopes**: success shapes (`{ report }`, `{ report, pipeline }`, `{ result, report }`) and the flat error envelope `{ error, message, issues? }` — the FastAPI exception handlers deliberately mimic Express's `errorHandler.js`, including 422 zod/pydantic issues as `{ path, message, code }`.
- Health: both return `{ ok, db: 'connected' | 'disconnected', integrations, uptimeSeconds }`; `src/api.js#checkHealth()` also still accepts the older FastAPI shape.

Differences that remain: the stack (Mongoose/MongoDB vs SQLAlchemy/Postgres-or-SQLite), ids (ObjectId strings vs `r_<hex>`), and JS-vs-Python float formatting in a few summary strings. `server_python/scoring.py#js_round` exists because Python's banker's rounding differs from JS `Math.round` — use it, not `round()`, in module math. SQLAlchemy JSON columns are not mutation-tracked: **reassign, never mutate in place** (see `_mark_module_complete`). The SQLite fallback file is `conscious_orbit_local_v2.db` (v1 had the shim's schema).

To verify parity after touching module logic: run both backends (`server/dev-memory.mjs` on :4000, uvicorn on :8000) and drive the same intake through each via `src/api.js` — a scratch script comparing `moduleResults[*].score` catches any drift.

## Frontend

React 19 + Vite 8, JavaScript only (`.jsx`, no TypeScript). Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**; Tailwind is pulled in with `@import "tailwindcss"` at the top of `src/index.css` and all customization lives in that file as plain CSS. Default breakpoints only, so **there is no `xs:`** — writing one silently yields a permanently-hidden element. `framer-motion` for animation, `lenis` for smooth scrolling, `lucide-react` for icons, `ogl` for the WebGL shader background. Lint config is `.oxlintrc.json` (oxlint with the `react` and `oxc` plugins; only `react/rules-of-hooks` and `react/only-export-components` are configured).

In 2026-08 the entire frontend was replaced wholesale with the redesigned UI from `github.com/Nehal-1826/Conscious-orbit` (deployed preview: ui-conscious.vercel.app), imported as a verbatim copy, then the two dashboards were wired to the backend through `src/api.js` — the integration layer (endpoint wrappers, `buildModuleInputs()`, `generateReportViaApi()`, dual-backend health/error normalisation). Talk to the API by importing from `src/api.js`, never by writing new fetch code. Both dashboards health-check on mount and fall back to their seed-data simulation when no backend answers, so the app stays usable offline. Queries/tickets, client profiles and project registrations remain simulations — no endpoints exist for them.

### Routing and auth

No router. A single `page` string in `App.jsx` state (`'home' | 'contact' | 'login' | 'admin-dashboard' | 'dashboard'`), switched by early `return`s wrapped in `AnimatePresence`. Login is a UI simulation (**no real authentication**): an Executive/Admin flip-card toggle calls `onLogin('admin' | 'executive')`, which routes to `AdminDashboard` or `ExecutiveDashboard`. The admin card asks for a "security key" but nothing validates it.

### Dashboard structure

The two dashboards are **self-contained monoliths** — they take only `onLogout`/`onGoHome` props and own all their state internally:

- `src/components/ExecutiveDashboard.jsx` (~1400 lines) — the user portal: projects, query desk, intelligence modules, tracking; seed data at the top (`INITIAL_MY_PROJECTS`, `INITIAL_QUERIES`, `INITIAL_INTELLIGENCE_MODULES`), submission/analysis flows simulated with staged `setTimeout`s.
- `src/components/AdminDashboard.jsx` (~1200 lines) — the admin console: the ten modules, client profiles, project registrations, reports, tickets, each with its own filter state and seed constants.

`App.jsx` (~1000 lines) still carries the older dashboard shell (VERTICALS marquee, cluster tabs, Kanban, `SEED_REPORTS`) below its routing — most of it unreachable now that login routes to the two dashboard components. Treat that residue as theirs; confirm before pruning it.

### Frontend files

- `src/components/ui.jsx` — design-system primitives (`GlassPanel`, `RoyalButton`, `Field`/`Input`/`Select`, `StatusBadge`, `OrbitBrand`…). Compose these rather than re-inventing panel/button markup. Note `src/components/ui/` (lowercase dir) is a *different thing* — shadcn-style pieces (`badge`, `card-carousel`, `hero-parallax`, `sticky-scroll-reveal`) using `class-variance-authority` and `swiper`.
- `src/components/Homepage.jsx`, `Contact.jsx` — public pages.
- `src/components/VerticalEngines.jsx` — the three per-vertical calculators; the TAM/SAM/SOM derivation is the only real logic on the frontend.
- `src/components/DarkVeil.jsx` / `LiquidEther.jsx` — OGL/WebGL background shaders (heavy; DarkVeil releases the GL context on unmount).
- `src/api.js` — the orphaned API client described above.

### Styling conventions

Colors are written as **literal Tailwind arbitrary values** in JSX (`text-[#D4AF37]`, `border-[rgba(212,175,55,0.18)]`), not theme tokens — the CSS custom properties in `index.css` `:root` are largely unused by components. Match the surrounding literal-hex style; a palette change means a find-and-replace across `src/`.

Palette: `#050505` background, `#0E0E0E`/`#111111` surfaces, `#D4AF37` primary gold, `#F4D67A` light gold, `#CFCFCF`/`#9A9A9A` secondary/muted text. Class names still say "red" from an earlier theme (`.btn-royal-red`, `bg-royal-mesh`) but render gold.

Reusable non-utility styles live in `src/index.css`: `.card-royal-luxury` (used by `GlassPanel`), `.btn-royal-red`, `.field-luxury-gold`, `.flip-card*`, `.scroll-velocity-*`, `.domain-scroller`. Touch-specific behaviour is handled there too — under `@media (hover: none)` the flip cards collapse to a single face (their back-face content is otherwise unreachable by finger) and `.hover-reveal` forces `opacity: 1` for controls that would only appear on `group-hover`.

## Express backend (`server/`)

`server/README.md` has the full endpoint table and folder map — read it before touching the API.

The core idea is two coupled state machines over a `Report`:

- `state/reportState.js` — the linear status chain `RECEIVED → PENDING → PROCESSED → PUBLISHED`. Every change goes through `assertTransition()` (illegal jumps 400 rather than being silently written) and is appended to `report.transitions`.
- `state/actionPipeline.js` — pairs each status with an action (`SCRUMING`, `REQUIREMENT`, `MAPPING`, `DELIVERED`) and with the modules that must have results before the report may leave that status. `requireStageComplete()` gates `POST /advance` with a 409 listing the missing module keys; reverting is ungated.

Modules are dispatched exclusively through the registry in `modules/index.js` — adding one means an import and an entry there, plus adding its key to a stage in `PIPELINE_STAGES`. One generic controller handler (`moduleController.js`) drives all ten and upserts a `ModuleResult` (unique on report+module, so re-running overwrites).

Both integrations degrade instead of throwing: without `GEMINI_API_KEY`, `integrations/aiProvider.js` returns a deterministic heuristic verdict; without SpyFu credentials, `integrations/spyfu.js` returns clearly-labelled placeholder data. Keep that property — the pipeline is expected to always complete.

Read env through `config/env.js`, not `process.env`.

## Frontend ↔ backend

`Report.toJSON()` deliberately emits `{ id, name, vertical, tags, status, score }` — the exact shape `KanbanBoard` renders — and the four statuses are shared verbatim across `src/constants.js` (`REPORT_STATUSES`, `KANBAN_COLUMNS`), `ui.jsx` (`STATUS_STYLES`, `StatusDot`), `VentureProcessor.jsx` (`PIPELINE[].stage`), `server/src/state/reportState.js` and `server_python/main.py` (`STAGE_FLOW`). Changing or adding a status means updating all five.

`src/api.js` holds the whole integration: endpoint wrappers, `buildModuleInputs()` (which derives all ten module payloads from the intake form) and `generateReportViaApi()`, which creates a report and drives it RECEIVED → PUBLISHED by running each stage's gating modules before each `POST /advance`, then runs `industryReport` to write the score and verdict.

**Three mappings exist because the Express server is stricter than the UI**, and all three were found by hitting real validation errors:
- custom domains (`domain_<ts>`) fall back to the `startups` vertical (`vertical` is a five-value enum)
- the six intake business models collapse onto the four `BUSINESS_MODELS` accepts
- `Scaleup` is not in the `Client` model's `STAGES` enum and maps to `Growth`

The intake form does not collect TAM, competitor prices, or feasibility ratings, so `buildModuleInputs()` supplies documented defaults for those. Scores are therefore partly driven by placeholders, not purely by user input.

The Express error envelope is flat — `{ error, message, issues? }` — not nested; `issues` carries zod field paths.

## Deployment

**There is none — this is deliberate.** The project is distributed through git and run locally by each team member; `README.md` is the setup guide. Netlify hosting was removed along with `netlify.toml` and `public/_redirects`, so don't reintroduce a deploy config or a hosting step without being asked.

`server/render.yaml` remains as a Render blueprint for the Express API should hosting ever come back, but nothing consumes it.

`VITE_API_URL` (see `.env.example`) still points the frontend at a non-default API. Vite inlines it at build time, so changing it requires restarting the dev server, not just editing the env.

## Known dead weight

`src/components/PulpSenseHero.jsx` and the standalone `PulpSenseHero.html` at the repo root are unused. `docs/superpowers/` contains a plan and spec for a *third* backend (TypeScript + Prisma + Postgres) that was never built and contradicts both existing ones — treat it as historical, not as direction. `npm run lint` reports one pre-existing warning (an unused import in `server/src/modules/customerDiscovery.js`); the build is otherwise clean.

## Client-facing features beyond the report pipeline

Added in 2026-08 alongside the pipeline, all additive — none of them touch
report state, the admin Report Tracking section or the review/approve flow:

- **AI provider is Gemini**, not Claude. `integrations/gemini.{py,js}` speak the
  REST API directly (no SDK dependency) and translate JSON Schema into Gemini's
  stricter dialect — it rejects `additionalProperties` and only allows enums on
  strings, so `_to_gemini_schema()` / `toGeminiSchema()` exist to convert. Both
  `generate_json` helpers return `None`/`null` on *any* failure (missing
  `GEMINI_API_KEY`, network error, safety block, unparseable output) and every
  caller falls back to its deterministic heuristic. Env: `GEMINI_API_KEY`,
  `GEMINI_MODEL` (default `gemini-3.6-flash`, the latest GA model). Gemini 3 moved structured output to `generationConfig.responseFormat.text` and warns against lowering `temperature`, so the client detects the generation from the model name, picks the right shape, leaves temperature alone on 3.x, and retries once with the other shape if a request fails.
- **Documents** — `routers/documents.py`, `DocumentUpload.jsx`. Bytes go to
  `server_python/uploads/` under a UUID name; only metadata is in the database.
  Extension allow-list plus a 15 MB cap. Admins mount the same component with
  `canDelete={false}` so they can read client evidence without removing it.
- **Queries** — `routers/queries.py`, `QueriesPanel.jsx`. One component serves
  both sides via `role="client" | "admin"`; a client only ever receives their own
  thread because the client view filters by `clientEmail`.
- **Indian Brand Equity** — `routers/brand_equity.py`, `BrandEquityForm.jsx`.
  Five Aaker pillars, weighted in `strength.brand_equity_score()`, nudged ±8 by
  real repeat-rate so self-reported loyalty without repeat customers scores
  down. Re-submitting for the same `reportId` updates rather than duplicating.
- **Strength bands** — `strength.py`. `_report_json()` adds two on read:
  `scoreBand` bands the result, `dataBand` bands the *evidence* (intake
  completeness + word count, with `enriched: true` at 50+ words). Both are
  computed on read, so the stored shape is unchanged. Render them with
  `StrengthBadge.jsx` so the categorisation looks identical everywhere.

`src/index.css` carries global responsive guarantees: `overflow-x: hidden` on
`html`/`body` so one wide element can't make the page scroll sideways, plus
`min-height: 40px` on controls and `font-size: 16px` on inputs under
`(pointer: coarse)` — the latter stops iOS zooming on focus. Wide content
should scroll inside its own `.scroll-x` container; tab strips use
`.no-scrollbar`. Tables get a real `<table>` above `sm:` and stacked cards
below it rather than a horizontally-scrolling table on a phone.

The client dashboard's sections come from the `NAV_SECTIONS` array in
`ExecutiveDashboard.jsx` — add an entry there and the tab row picks it up.
