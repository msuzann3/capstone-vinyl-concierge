iCloud project path: `Documents/_AI-Workspace/Codex/Capstone` inside iCloud Drive. On the MacBook Pro, use `/Users/michelle/Documents/_AI-Workspace/Codex/Capstone`; on the MacBook Air, the same synced project appears under `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone`.

# The Vinyl Concierge

The Vinyl Concierge is an AI-powered music curator and staff inventory dashboard for Curate Records & Books. The app turns a customer's artists, genres, mood, and listening environment into a hand-picked vinyl stack with warm shop-clerk notes, then provides private owner insights for stock planning and merchandising.

## Current Status

- Current working Mac for June/July 2026: MacBook Pro.
- Repository root on the MacBook Pro: `/Users/michelle/Documents/_AI-Workspace/Codex/Capstone`.
- Repository root on the MacBook Air: `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone`.
- Cross-Mac path to use conceptually: `Documents/_AI-Workspace/Codex/Capstone` inside iCloud Drive.
- Source handoff: imported from Google AI Studio, now maintained with ChatGPT Codex and GitHub.
- Product brief: `PRD.md`.
- Developer handoff: `HANDOFF.md`.
- Class context: `docs/class-context/drive-context.md`; primary Drive references are `capstone-combined.pdf` and Michelle's weekly submitted `.docx` files. Current course point: Week 3 / Module 3.
- Local app: React, Vite, Tailwind, Motion, and an Express server.
- Recommendation engine: local in-repo catalog logic in `src/recommender.ts`; the Assignment 2 catalog now contains 35 albums with genre, mood, and listening-context tags for broader recommendation variety. No Gemini or Google API key required.
- Image generation: no active OpenAI image model configuration, image endpoint, or `gpt-image-2` reference exists in this repo; the prototype does not generate images.
- Collection Insights: customer-facing local heuristics in `src/recommender.ts` estimate collection coverage and suggest missing albums/artists plus exploration areas after recommendations are displayed.
- Owner Insights dashboard: local synthetic analytics in `src/syntheticOwnerInsights.ts`, now modeling 113 recommendation sessions across indie folk, jazz, alternative, singer-songwriter, classic rock, country, audiophile, and adjacent customer profiles for assignment business-intelligence screenshots.
- Brand references: source PDFs, implementation notes, and production logo PNGs in `docs/brand/`.
- Latest catalog/UI polish: the header now uses the production Curate brandmark asset; the genre selector uses Classic Rock and Country instead of Trip-Hop and Electronic; the recommendation catalog now includes Dolly Parton and a country-rock bridge record; Owner Insights now includes Country and Americana browser profiles; the right-side bulletin board now shows Curate Community store information; recommendation cards use non-playback Staff Pick indicators.
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
4. Read `docs/class-context/drive-context.md` before assignment-driven feature, writing, or handoff work.
5. Check `git status`.
6. Confirm whether work should target the GitHub Pages prototype or a future hosted backend.
7. Preserve Michelle's supplied wording unless she asks for rewriting.

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
├── docs/class-context/
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
- Continue polishing Assignment 2 screenshots around the customer recommendation flow, Collection Insights, and the Owner Insights dashboard.
- For strong Assignment 2 screenshots, use test profiles that emphasize indie/alternative songwriting, jazz/fusion listening, and soul/classic-rock dinner-party listening.
- Decide later whether the final Capstone MVP should use Discogs, a database, or another external data source; the current Assignment 2 dashboard intentionally stays local and synthetic.
- Continue replacing remaining inline SVG logo approximations with production logo image assets where it improves clarity and layout; the header already uses the production PNG brandmark.
- Decide whether owner insights should remain passcode-gated only on the client or move to authenticated server-side access.
