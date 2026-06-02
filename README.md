iCloud project path: `Documents/_AI-Workspace/Codex/Capstone` inside iCloud Drive. On this Mac that resolves through `/Users/dolly/Documents/`, but `dolly` is machine-specific.

# The Vinyl Concierge

The Vinyl Concierge is an AI-powered music curator and staff inventory dashboard for Curate Records & Books. The app turns a customer's artists, genres, mood, and listening environment into a hand-picked vinyl stack with warm shop-clerk notes, then provides private owner insights for stock planning and merchandising.

## Current Status

- Repository root on this Mac: `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone`.
- Cross-Mac path to use conceptually: `Documents/_AI-Workspace/Codex/Capstone` inside iCloud Drive.
- Source handoff: imported from Google AI Studio, now maintained with ChatGPT Codex and GitHub.
- Product brief: `PRD.md`.
- Developer handoff: `HANDOFF.md`.
- Local app: React, Vite, Tailwind, Motion, and an Express server.
- Recommendation engine: local in-repo catalog logic in `src/recommender.ts`; no Gemini or Google API key required.
- Owner Insights dashboard: local synthetic analytics in `src/syntheticOwnerInsights.ts`, modeling 101 recommendation sessions for assignment business-intelligence screenshots.
- Brand references: source PDFs and implementation notes in `docs/brand/`.
- GitHub repository: `https://github.com/msuzann3/capstone-vinyl-concierge`.
- GitHub Pages: `https://msuzann3.github.io/capstone-vinyl-concierge/`.
- Pages source: static front end published from the `main` branch via GitHub Actions.
- Original imported zip/archive wrapper: kept locally in `Handoff from Google/` and ignored by git.

GitHub Pages hosts the working prototype. Recommendations are generated in the browser from project code, so the Pages version does not need a backend or API key.

## Start-of-Session Checklist

Michelle works across multiple Macs through iCloud Drive. At the beginning of every session:

1. Check the GitHub copy of `README.md`.
2. Check the GitHub copy of `CHANGELOG.md`.
3. Read `docs/brand/BRAND_NOTES.md` before visual or voice changes.
4. Check `git status`.
5. Confirm whether work should target the GitHub Pages prototype or a future hosted backend.
6. Preserve Michelle's supplied wording unless she asks for rewriting.

At the end of meaningful work:

1. Update `README.md` if the project state, setup, deployment, or next steps changed.
2. Add a dated entry to `CHANGELOG.md`.
3. Commit and push the updates to GitHub so whichever Mac Michelle opens next has the latest project context.

## Local Setup

Prerequisites:

- Node.js 20 or newer.

Install dependencies:

```bash
npm install
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
├── docs/brand/
├── server.ts
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── index.css
│   ├── main.tsx
│   ├── recommender.ts
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

- Replace the default synthetic inventory with real Curate Records & Books inventory data when available.
- Add the remaining Assignment 2 focused features after Michelle approves the first Owner Insights enhancement.
- Decide later whether the final Capstone MVP should use Discogs, a database, or another external data source; the current Assignment 2 dashboard intentionally stays local and synthetic.
- Replace inline SVG logo approximations with production logo image assets if the original files become available outside the PDF.
- Decide whether owner insights should remain passcode-gated only on the client or move to authenticated server-side access.
