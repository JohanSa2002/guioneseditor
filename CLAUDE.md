# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered video script analysis and generation system. Analyzes TikTok/Reels/Shorts via a 5-step pipeline (extract audio → Whisper transcription → GPT-4o 49-field analysis → vector embeddings → Supabase storage) and generates new scripts using top-performing references.

## Development Commands

**Start both services (two terminals required):**

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm install && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm install && npm run dev
```

The frontend Vite dev server proxies `/api/*` to `http://localhost:3001`, so no CORS issues in development.

There are no test or lint scripts configured.

## Architecture

This is a **monorepo with three layers**:

### `/frontend` — Vue 3 + Vite + Tailwind
- Single-page app with 7 views (Dashboard, Analysis list/detail/create, Scripts, Generate, Login)
- Routes defined in [frontend/src/router/index.js](frontend/src/router/index.js)
- API calls centralized in [frontend/src/lib/api.js](frontend/src/lib/api.js)
- Auth is a mock Pinia store ([frontend/src/stores/auth.js](frontend/src/stores/auth.js)) with hardcoded credentials — not production-ready
- Design system: dark Obsidian theme. Colors defined in [frontend/tailwind.config.js](frontend/tailwind.config.js) as semantic tokens (`canvas`, `surface`, `ink`, `accent`, etc.). Fonts: Bricolage Grotesque (headlines) + Outfit (body)

### `/backend` — Express.js (local) + `/api` (Vercel serverless)
Two parallel sets of endpoint files exist:
- `/backend/api/` — used by Express server locally
- `/api/` (root) — Vercel serverless functions for production

When modifying API logic, **both files must be kept in sync** (or changes made to the root `/api/` file if targeting production).

Core pipeline modules in `/backend/lib/`:
| Module | Role |
|--------|------|
| `extractor.js` | RapidAPI Social Download → audio URL (TikTok/Reels/Shorts) |
| `transcriptor.js` | Whisper-1 → text transcript |
| `analizador.js` | GPT-4o → 49-field JSON analysis (storytelling, Cialdini, neuromarketing) |
| `validador.js` | Zod schema validation of GPT-4o output |
| `embeddings.js` | OpenAI embeddings → pgvector |
| `generador.js` | GPT-4o script generation from top-scoring references |
| `supabase.js` | Supabase client (SERVICE_ROLE_KEY — bypasses RLS) |

### `/database` — Supabase PostgreSQL + pgvector
Migrations must be applied in order in the Supabase SQL console:
`01_schema → 02_funciones → 03_rls → 04_datos_prueba → 05_analisis_extendido → 06_guiones_generados → 07_diagnostico_contexto`

Two primary tables:
- **`guiones`** — analyzed scripts, ~49 fields including enums, Cialdini booleans, psychographic scores (1-100), and a `embedding_vector` pgvector column
- **`guiones_generados`** — AI-generated scripts linked to `guiones` references via `referencias_ids UUID[]`

## Environment Variables

Create `/backend/.env`:
```
OPENAI_API_KEY=...
RAPIDAPI_KEY=...         # Social Download All In One API
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3001
```

For Vercel production, these same variables must be set in the Vercel project dashboard (the `/api/*.js` functions read from `process.env`).

## Key Constraints

- **Dual file sync**: The `/api/*.js` (Vercel) and `/backend/api/*.js` (Express) files implement the same logic — they diverged in past fixes. Always check both when debugging endpoint behavior.
- **No auth on backend endpoints**: API routes have no authentication middleware. Security relies on Supabase RLS + CORS. The service role key bypasses RLS, so backend lib files must never be exposed client-side.
- **Vercel function timeout**: Set to 60s in `vercel.json`. The full analysis pipeline (extract + transcribe + GPT-4o) can take 30-50s on long videos.
- **Node 24.x** required for backend (`--watch` flag in dev script).
