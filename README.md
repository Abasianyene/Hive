# Hive

Hive is a single-repo social app with a Vite frontend and an Express backend. The backend now serves the built frontend, exposes the app API on the same origin, and provides Socket.IO presence updates for the messaging screen.

## What was fixed

- Removed hardcoded secrets and placeholder-only deployment assumptions.
- Collapsed the backend into one server process for API, sockets, and static frontend hosting.
- Replaced frontend hardcoded `localhost` URLs with environment-aware API helpers.
- Fixed broken routes, auth pages, profile page, copilot page, and messages page so the frontend builds cleanly.
- Added root deployment scripts, Docker support, and environment examples.

## Local development

1. Install dependencies from the repo root:
   - `npm ci`
2. Start the backend:
   - `npm run dev:backend`
3. Start the frontend:
   - `npm run dev:frontend`

The Vite dev server proxies `/api` and `/socket.io` to the backend on `http://localhost:5001`.

## Demo accounts

- `jane@hive.demo` / `Password123!`
- `john@hive.demo` / `Password123!`

## Production build

1. Install dependencies:
   - `npm ci`
2. Build the frontend:
   - `npm run build`
3. Start the app:
   - `npm start`

The backend serves `frontend/dist` automatically when the build exists.

## Recommended free deploy target

The best free fit for this app is Render because the app runs as one Express web service that also serves the built frontend and keeps a Socket.IO server alive. This repository includes [render.yaml](C:\Users\Abasi\OneDrive\Documents\GitHub\Hive\render.yaml) so you can create the service from a Blueprint instead of entering settings by hand.

### Render deploy steps

1. Push this repository to GitHub.
2. In Render, create a new Blueprint and point it at the repo.
3. Confirm the generated web service settings from `render.yaml`.
4. After the service is created, open the environment settings and optionally add:
   - `OPENAI_API_KEY` if you want Copilot enabled.
   - `MONGODB_URI` if you want durable data instead of demo-only file storage.
5. Deploy and verify:
   - `/api/health`
   - `/login`
   - `/messages`

### Important free-tier caveat

This app uses file-backed storage by default in `backend/data/app-data.json`, and free Render web services use an ephemeral filesystem. That means local data is lost when the service restarts, redeploys, or spins down. The backend now also supports `MONGODB_URI`, so you can keep Render as the host and attach a free MongoDB Atlas cluster for durable users, profiles, and messages.

Render note: the service does not set `NODE_ENV=production` during the build step. That is intentional, because the frontend build depends on Vite and TypeScript devDependencies. Production mode is applied at runtime in the `startCommand` instead.

## Environment variables

Backend values are documented in [backend/.env.example](C:\Users\Abasi\OneDrive\Documents\GitHub\Hive\backend\.env.example).

Frontend values are documented in [frontend/.env.example](C:\Users\Abasi\OneDrive\Documents\GitHub\Hive\frontend\.env.example).

## Deploy notes

- `PORT` is respected for managed hosts like Render, Railway, and Fly.io.
- If `OPENAI_API_KEY` is not set, the Copilot page stays available but returns a clear configuration message instead of crashing.
- Profile, auth, and messages work out of the box with file-based persistence. For long-lived production data, connect an external database before launch.
