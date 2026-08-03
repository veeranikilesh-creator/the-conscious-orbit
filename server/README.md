# Conscious Orbit — Backend API

Node.js + Express + MongoDB (Mongoose), ESM. Independent of the Vite frontend; nothing in `../src` was modified.

```bash
cd server
npm install
cp .env.example .env      # set MONGODB_URI at minimum
npm run dev               # http://localhost:4000/api
```

Both external integrations are optional. Without `ANTHROPIC_API_KEY` the decision engine returns a deterministic heuristic verdict; without SpyFu credentials module 6 returns clearly-labelled placeholder data. Neither ever throws, so the pipeline always completes.

## Folder structure

```
server/
├── package.json
├── .env.example
└── src/
    ├── index.js                  entry — connect db, listen, graceful shutdown
    ├── app.js                    express app: cors, json, morgan, routes, errors
    ├── config/
    │   ├── env.js                validated env access (import this, not process.env)
    │   └── db.js                 mongoose connect/disconnect
    ├── state/
    │   ├── reportState.js        RECEIVED → PENDING → PROCESSED → PUBLISHED
    │   └── actionPipeline.js     SCRUMING → REQUIREMENT → MAPPING → DELIVERED
    ├── models/
    │   ├── Client.js             Layer 1 — captured once at signup
    │   ├── Report.js             the unit of work + transition history
    │   └── ModuleResult.js       one doc per (report, module)
    ├── modules/                  the 10 report-generation modules
    │   ├── index.js              registry + uniform runModule()
    │   ├── customerDiscovery.js  1
    │   ├── profiling.js          2
    │   ├── marketSize.js         3
    │   ├── feasibility.js        4
    │   ├── pricing.js            5
    │   ├── marketResearch.js     6  → SpyFu
    │   ├── industryReport.js     7  → AI decision engine
    │   ├── businessModelValidation.js  8
    │   ├── gtm.js                9
    │   └── okr.js                10
    ├── integrations/
    │   ├── spyfu.js              competitor keyword/domain analysis
    │   └── aiProvider.js         Claude decision engine (claude-opus-5)
    ├── controllers/
    │   ├── reportController.js   CRUD + state transitions
    │   └── moduleController.js   one generic handler drives all 10 modules
    ├── routes/
    │   ├── index.js              /health, /pipeline, /modules, mounts
    │   ├── reportRoutes.js
    │   └── moduleRoutes.js
    ├── middleware/
    │   ├── asyncHandler.js
    │   ├── errorHandler.js       zod / mongoose / ApiError → HTTP
    │   └── loadReport.js         :reportId → req.report
    └── utils/
        ├── ApiError.js
        └── scoring.js            clamp, weightedScore, verdict, band
```

## State management

`state/reportState.js` enforces the linear progression. Transitions go through `assertTransition()`, so `RECEIVED → PUBLISHED` is rejected with a 400 rather than silently written. `step(from, ±1)` advances or reverts one stage. Every change is appended to `report.transitions`.

## Action pipeline

`state/actionPipeline.js` pairs each status with the work being done in it, and with the modules that must produce results before the report may leave:

| Status | Action | Modules gating the exit |
|---|---|---|
| `RECEIVED` | `SCRUMING` | customerDiscovery |
| `PENDING` | `REQUIREMENT` | profiling, businessModelValidation |
| `PROCESSED` | `MAPPING` | marketSize, feasibility, pricing, marketResearch, gtm, okr |
| `PUBLISHED` | `DELIVERED` | industryReport |

`requireStageComplete()` is mounted on `POST /advance` and returns **409** listing the missing module keys. Reverting is ungated.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Liveness + which integrations are configured |
| `GET` | `/api/pipeline` | Status list + stage definitions |
| `GET` | `/api/modules` | Catalogue of the 10 modules |
| `POST` | `/api/reports` | Create a report (opens at `RECEIVED`) |
| `GET` | `/api/reports` | List; filters: `status`, `vertical`, `search`, `limit`, `skip` |
| `GET` | `/api/reports/:id` | Report + all module results + pipeline view |
| `DELETE` | `/api/reports/:id` | Delete report and its results |
| `GET` | `/api/reports/:id/pipeline` | Status, action, gate state, transition history |
| `PATCH` | `/api/reports/:id/status` | Explicit transition (validated) |
| `POST` | `/api/reports/:id/advance` | One stage forward — **gated** |
| `POST` | `/api/reports/:id/revert` | One stage back |
| `GET` | `/api/reports/:id/modules` | All stored results |
| `POST` | `/api/reports/:id/modules/:key` | **Run a module** |
| `GET` | `/api/reports/:id/modules/:key` | One stored result |
| `DELETE` | `/api/reports/:id/modules/:key` | Clear a result (re-opens the gate) |

`:key` is one of `customerDiscovery`, `profiling`, `marketSize`, `feasibility`, `pricing`, `marketResearch`, `industryReport`, `businessModelValidation`, `gtm`, `okr`.

## Module contract

Every module exports `{ key, title, action, inputSchema, run }`. `run(input, context)` validates with zod, returns `{ output, score, integrations? }`. The controller upserts a `ModuleResult` (unique on report+module, so re-running overwrites) and marks the module complete. Modules 7 and 8 additionally receive sibling results via `context.moduleResults`.

Module 7 is the consolidator: it weights every other module's score into the Conscious Orbital Score, builds a dossier, and passes it to the AI decision engine, whose verdict is written back to `report.score` and `report.decision` (1 = PROCEED, 0 = PIVOT).

## Wiring the existing UI

`Report.toJSON()` already emits `{ id, name, vertical, tags, status, score }` — the exact shape the Kanban board renders — so the frontend can consume `GET /api/reports` without markup changes. Point it at the API with a `VITE_API_URL` env var and replace the `SEED_REPORTS` constant; the board's Back/Advance controls map to `POST /revert` and `POST /advance`.

## Not included

No authentication — every endpoint is open. Add auth middleware before exposing this beyond localhost. No tests, and the SpyFu endpoint paths follow their v2 API but should be checked against your plan.
