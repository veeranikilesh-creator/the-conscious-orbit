# The Conscious Orbit

Venture intelligence workspace — a React dashboard that runs ventures through a
four-stage pipeline (RECEIVED → PENDING → PROCESSED → PUBLISHED) and scores them.

**This project is not hosted anywhere.** Everyone runs it locally; git is the
only distribution channel. Clone the repo and follow the steps below.

## Requirements

- Node.js 22 (see `.nvmrc`)
- Python 3.11+ — only if you want the FastAPI backend
- MongoDB — only if you want the Express backend

## Run the frontend

```bash
npm install
npm run dev      # http://localhost:5173  (--host, so phones on the same Wi-Fi can reach it)
```

That is enough to use the whole UI. **The backend is optional.** With no API
reachable the dashboard reports `offline` and falls back to a built-in
simulation — every screen works, but scores are generated locally rather than
computed.

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # serve the built bundle
npm run lint     # oxlint (also lints server/, since it runs from the root)
```

There is no test framework in this repo.

## Run a backend (optional)

Two exist and they are behavioural twins — the FastAPI backend is a full port
of the Express engine (same ten calculators, same gated state machine, same
response envelopes), verified to produce identical scores for identical
inputs. Pick whichever stack you have installed; the frontend cannot tell
them apart.

### Express + MongoDB — `server/`

```bash
cd server
npm install
cp .env.example .env     # MONGODB_URI is the only required var
npm run dev              # http://localhost:4000/api
```

Needs a MongoDB instance. Both external integrations degrade gracefully:
without `ANTHROPIC_API_KEY` the decision engine returns a deterministic
heuristic verdict, and without SpyFu credentials module 6 returns labelled
placeholder data. The pipeline always completes.

### FastAPI + SQLite — `server_python/`

```bash
cd server_python
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # http://localhost:8000/api
```

Uses Postgres when `DATABASE_URL` (or `POSTGRES_URI`) is set; otherwise falls
back to a local SQLite file (`conscious_orbit_local_v2.db`), so it needs no
setup. The same `ANTHROPIC_API_KEY` / SpyFu degradation rules apply as for
the Express backend.

### Pointing the frontend at a backend

`src/api.js` defaults to `http://localhost:8000/api`, falling back to
`http://localhost:4000/api`. To override, copy `.env.example` to `.env.local`
and set `VITE_API_URL`. Vite inlines this at build time, so changing it means
restarting `npm run dev`.

## Sharing your work

Push to `main` on GitHub — that is how everyone else gets it. Pull before you
start, since several people commit to this repo daily.
