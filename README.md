# Code Snippet Manager

A REST API and a bold, modern frontend for managing code snippets with tags, language metadata, and search. The frontend can run in demo mode or connect to a live API via a single environment variable.

## What is in this repo

- Backend API (Node.js + Express) scaffolding with SQLite planned
- Frontend (Next.js) in the `web/` directory
- Vercel-ready deployment for the frontend

## Features

- Create, edit, and delete snippets
- Filter by language and tag
- Keyword search (title + code)
- Toggle between demo data and live API
- Vercel deployment configuration included

## Tech stack

Backend:
- Node.js 20+
- Express
- SQLite (better-sqlite3)
- Zod validation
- Vitest + Supertest

Frontend:
- Next.js (App Router)
- React 18
- CSS with custom design system (no framework)

## Project structure

```
.
├── src/                  # API source (to be implemented)
├── web/                  # Next.js frontend
│   ├── app/
│   ├── next.config.js
│   └── package.json
├── vercel.json           # Vercel config (frontend root)
└── package.json          # Backend package.json
```

## Backend (API) - local development

The backend is scaffolded and ready for implementation. Run these commands once the API is built out:

```bash
npm install
npm run dev
```

## Frontend - local development

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

### Connect the frontend to a live API

Set `NEXT_PUBLIC_API_URL` to the base URL of your API:

```bash
export NEXT_PUBLIC_API_URL="https://your-api.example.com"
```

The UI will switch from demo mode to live API mode automatically.

## API endpoints (planned)

```
POST   /api/snippets
GET    /api/snippets
GET    /api/snippets/:id
PUT    /api/snippets/:id
DELETE /api/snippets/:id
GET    /api/snippets/search?q=
```

## Deploy frontend on Vercel

This repo is already configured for Vercel.

1) Import the repo in Vercel  
2) Set Root Directory to `web` (or rely on `vercel.json`)  
3) Add `NEXT_PUBLIC_API_URL` in Environment Variables (optional)  
4) Deploy

Vercel build settings:
- Build command: `npm run build`
- Output: Next.js default

## Notes

- The frontend runs without the backend (demo data included).
- Once the API is live, set `NEXT_PUBLIC_API_URL` to enable real data.

## License

MIT
