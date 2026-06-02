# The Vinyl Concierge

The Vinyl Concierge is an AI-powered music curator and staff inventory dashboard for Curate Records & Books. The app turns a customer's artists, genres, mood, and listening environment into a hand-picked vinyl stack with warm shop-clerk notes, then provides private owner insights for stock planning and merchandising.

## Current Status

- Source handoff: Google AI Studio export in this repository.
- Product brief: `PRD.md`.
- Developer handoff: `HANDOFF.md`.
- Local app: React, Vite, Tailwind, Motion, and an Express server.
- AI service: Gemini through the server-side `@google/genai` client.
- GitHub Pages: publishes the static front end from the `main` branch via GitHub Actions.

GitHub Pages can host the interactive front-end shell and default recommendation display. The Gemini recommendation endpoint requires the Express server with `GEMINI_API_KEY`, so live AI recommendations need local server mode or a separate hosted backend.

## Start-of-Session Checklist

Michelle works across multiple Macs through iCloud Drive. At the beginning of every session:

1. Read this `README.md`.
2. Read `CHANGELOG.md`.
3. Check `git status`.
4. Confirm whether work should target local server mode, GitHub Pages, or a future hosted backend.
5. Preserve Michelle's supplied wording unless she asks for rewriting.

At the end of meaningful work:

1. Update this `README.md` if the project state, setup, deployment, or next steps changed.
2. Add a dated entry to `CHANGELOG.md`.
3. Commit and push changes when Michelle asks for GitHub continuity or publishing.

## Local Setup

Prerequisites:

- Node.js 20 or newer.
- A Gemini API key for AI recommendations.

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Then add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run locally:

```bash
npm run dev
```

The local Express/Vite app runs at:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run lint
npm run build
npm run start
```

`npm run lint` runs TypeScript checks. `npm run build` creates the production front-end bundle and compiled server bundle in `dist/`.

## Repository Structure

```text
.
├── .github/workflows/pages.yml
├── HANDOFF.md
├── PRD.md
├── README.md
├── CHANGELOG.md
├── server.ts
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
└── vite.config.ts
```

## Deployment Notes

GitHub Pages is configured through `.github/workflows/pages.yml`.

The Pages build uses:

```bash
npm ci
npm run build:pages
```

The published artifact is `dist/`.

## Next Steps

- Confirm whether the GitHub Pages version is intended as a static demo or whether AI recommendations should be wired to a hosted backend.
- Replace the default synthetic inventory with real Curate Records & Books inventory data when available.
- Decide whether owner insights should remain passcode-gated only on the client or move to authenticated server-side access.
