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

Two exist and they are **not** equivalent — see `CLAUDE.md` for the full
comparison. In short: `server/` computes real scores, `server_python/` records
state without running the calculators.

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

Falls back to a local SQLite file when no Postgres is configured, so it needs
no setup.

### Pointing the frontend at a backend

`src/api.js` defaults to `http://localhost:8000/api`, falling back to
`http://localhost:4000/api`. To override, copy `.env.example` to `.env.local`
and set `VITE_API_URL`. Vite inlines this at build time, so changing it means
restarting `npm run dev`.

## Sharing your work

Push to `main` on GitHub — that is how everyone else gets it. Pull before you
start, since several people commit to this repo daily.
