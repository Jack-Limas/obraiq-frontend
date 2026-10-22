@AGENTS.md

# ObraIQ Frontend

Web app of ObraIQ: a platform to manage, track the finances of and predict risks for construction projects of ANY type, for construction companies in Nariño, Colombia. Brand: ObraIQ (never "Obrix" or "Dalid").

Part of three repositories: obraiq-frontend (this one), obraiq-backend (REST API, business rules) and obraiq-ai (Gemini, called only by the backend). The frontend talks ONLY to the backend through NEXT_PUBLIC_API_URL; the API contract is documented in the obraiq-backend README. No shared code between repositories.

## Stack
- Next.js 16 (App Router; the file is src/proxy.ts, not middleware.ts), React 19, Tailwind v4 (@custom-variant dark and tokens in @theme of globals.css), next-intl (routes under [locale]), TanStack Query + createResourceHooks, Zustand (auth), react-hook-form + zod, Recharts, framer-motion, react-markdown + remark-gfm for AI answers.
- Responsive WEB app (not a native mobile app). Spanish by default + English, with a visible selector. Light theme by default + dark, with a visible selector. Both must work on EVERY screen (login, landing, errors and empty states included).

## Course concepts already implemented (do not break)
- Web Worker: public/workers/project-analysis.worker.js (plain JS on purpose, because of Turbopack).
- SharedWorker: public/workers/analysis-broadcast.shared-worker.js.
- SharedArrayBuffer + crossOriginIsolated: COOP/COEP headers in next.config.ts; that is why every external <img> has crossOrigin="anonymous" (Cloudinary included).
- postMessage, metrics/INP. Service Worker: pending, do NOT implement until the owner asks.

## Rendering strategy (conscious decision per screen)
- CSR ("use client" + TanStack Query) for ALL private and financial screens: they need a session, data depends on the role and changes with every approval or transfer, they are very interactive and have no SEO value. Do NOT turn them into SSG or ISR.
- SSG for the public landing and informational pages without user data (generateStaticParams for es/en and setRequestLocale).
- Login: public, prerendered with a CSR form; do not force SSR. SSR and ISR are not used; document them if they are ever added.
- Keep docs/rendering-strategy.md up to date and verify it against the `next build` output.

## What the UI shows
- Money: COP without decimals, always COP even in English. Use formatCOP (src/lib/format.ts) EVERYWHERE.
- Cost efficiency (CPI) shows "—" when there are no expenses and is explained with a translated tooltip. PENDING expenses are shown apart ("pending approval").
- Sidebar and tabs only show what the role can use. Residents never see other residents' balances, global statistics, costs or inventory value.
- Business figures are computed by the backend: never trust or recompute client-side totals as the source of truth.
- AI features are optional: a 503 with code AI_QUOTA_EXCEEDED shows the "quota used up" message with retryAfterSeconds; a 502 shows the generic "unavailable" message. The rest of the screen keeps working.

## Conventions
- Code, names, comments and commits in ENGLISH. User-visible text only through next-intl: es.json and en.json with EXACTLY the same keys (npm run i18n:check). Zero hardcoded strings in JSX (placeholders, aria-labels, titles, metadata and error messages included). alert() and confirm() are forbidden: use translated toasts and modals.
- TypeScript strict: no `any` or `as any`. React 19 rules: no synchronous setState inside useEffect, no Math.random()/Date.now() during render, pure components.
- UI: ONLY semantic tokens (bg-bg, bg-surface, bg-surface-2, border-line, text-ink, text-ink-muted, bg-accent, text-critical, text-success, text-warning, font-mono-data); no fixed colors that break a theme. ALWAYS test light and dark. Visible focus, respect prefers-reduced-motion, designed loading/empty/error states. One orchestrated entry animation per screen; hover-lift only on interactive cards. Mobile-first on the screens residents use.
- Backend enums (status, type, priority, category, severity, role, payment method) are never shown raw: always through translated keys.
- Do not invent fields that do not exist in the API; if a design brings them, adapt it to real fields and tell the owner.
- Do not add dependencies without justifying them.

## Workflow
- SMALL, frequent commits, Conventional Commits in English: one commit per logical change. NEVER `git push`.
- Before calling something done: `npx tsc --noEmit`, `npm run lint`, `npm run i18n:check` and `npm run build`. Fix every error.
- Forbidden: editing `.env.local`, printing or committing secrets or cookies.
- At the end of each task: summary of changes, commits created, how to test it manually and pending items or decisions.
