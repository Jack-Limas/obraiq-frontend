# ObraIQ — Frontend

Web app of **ObraIQ**, a platform to manage, track the finances of and predict risks for construction projects of any type (buildings, roads, bridges, schools, health centers, warehouses, remodeling, sports facilities, pools, retaining walls) for construction companies in Nariño, Colombia.

Next.js 16 (App Router) + React 19 + Tailwind v4 + next-intl (Spanish/English) + TanStack Query. Light and dark themes, responsive, with a Web Worker, a SharedWorker and `crossOriginIsolated` (COOP/COEP) for SharedArrayBuffer.

## Repositories

| Repository | Role |
|---|---|
| **obraiq-frontend** (this one) | Next.js web app (Vercel) |
| [obraiq-backend](https://github.com/Jack-Limas/obraiq-backend) | REST API, business rules, database (Render + Neon) |
| [obraiq-ai](https://github.com/Jack-Limas/obraiq-ai) | AI service: the only component that talks to Gemini (Render) |

## Architecture

```
 Browser
   │  HTTPS, cookies (JWT access + refresh)
   ▼
 obraiq-frontend  (Next.js, Vercel, :3000)
   │  REST  NEXT_PUBLIC_API_URL
   ▼
 obraiq-backend   (Fastify, Render, :4000) ──── Prisma ────▶ PostgreSQL (Neon)
   │                    └──────────────────── uploads ────▶ Cloudinary
   │  HTTP + X-Internal-Key
   ▼
 obraiq-ai        (Fastify, Render, :4100) ─── @google/genai ─▶ Gemini
```

The frontend only talks to the backend. It never calls the AI service or Gemini directly.

## Run it locally

Requirements: Node.js 22+ and a running [obraiq-backend](https://github.com/Jack-Limas/obraiq-backend) (by default on `http://localhost:4000`).

```bash
npm ci
cp .env.example .env.local   # NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run i18n:check` | `es.json` and `en.json` have the same keys and every key used in code exists |
| `npx tsc --noEmit` | Type check |

## Environment variables

See [.env.example](.env.example). `NEXT_PUBLIC_*` values are embedded in the browser bundle: never put a secret there.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Base URL of obraiq-backend (no trailing slash) |

## Contract with the backend

- Every request goes to `NEXT_PUBLIC_API_URL` with `withCredentials` (httpOnly cookies) and a Bearer fallback when the browser blocks third-party cookies.
- Success bodies are `{ data }`; errors are `{ error, code?, ...extra }`. The UI translates by HTTP status and `code` (for example `PASSWORD_CHANGE_REQUIRED`, `ACCOUNT_DISABLED`).
- AI: `POST /assistant/ask` returns Markdown in `data.answer`; `POST /reports/summary` returns Markdown in `data.summary`. A `503` with `code: "AI_QUOTA_EXCEEDED"` and `retryAfterSeconds` shows the "quota used up" message; a `502` shows the generic "AI unavailable" message.
- The backend must allow this app's exact origin in `FRONTEND_URL` (CORS and cookies).

The full list of endpoints and the AI error contract are in the [backend README](https://github.com/Jack-Limas/obraiq-backend#contract-with-the-frontend).

## Documentation

- [docs/rendering-strategy.md](docs/rendering-strategy.md): rendering pattern per screen (CSR/SSG), justification, advantages and bottlenecks
- [docs/deployment.md](docs/deployment.md): reconnecting the Vercel project to this repository
- [docs/publish.md](docs/publish.md): git commands to publish this repository
