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
- Class context: `docs/class-context/drive-context.md`; primary Drive references are `capstone-combined.pdf` and Michelle's weekly submitted `.docx` files. Current course point: Module 4 backend/governance work has begun from the Week 3 checkpoint.
- Local app: React, Vite, Tailwind, Motion, Firebase client SDK, and a production Express server.
- Recommendation engine: Firestore-backed catalog reads in `src/recommender.ts`, with the local in-repo catalog retained as a fallback when the `albums` collection is empty or unavailable. The ranker weights selected genres/styles, exact catalog artist matches, mood/listening context, and nearby tags inferred from matched catalog artists; unknown artists do not get invented relationships. No Gemini or Google API key required.
- Image generation: no active OpenAI image model configuration, image endpoint, or `gpt-image-2` reference exists in this repo; the prototype does not generate images.
- Collection Insights: customer-facing local heuristics in `src/recommender.ts` estimate collection coverage and suggest missing albums/artists plus exploration areas after recommendations are displayed.
- Customer-facing side: active recommendation experience in `src/App.tsx`, `src/recommender.ts`, and related components. The header opens a Firebase sign-in / registration screen with Google OAuth plus email/password fallback, and signed-in customer recommendation sessions save privately under `users/{uid}/sessions`.
- Business-facing side: active Owner Intelligence Dashboard in `src/components/OwnerIntelligenceDashboard.tsx`, with local synthetic owner data still present for demo continuity plus live Firestore aggregate demand reads from `demandSignals` for signed-in owners. The header has a Customer / Owner switch; this side is additive and does not replace the customer experience.
- Owner Insights dashboard: the older staff-ledger analytics panel in `src/components/OwnerInsightsView.tsx` still exists on the customer side, using synthetic analytics in `src/syntheticOwnerInsights.ts`.
- Brand references: source PDFs, implementation notes, and production logo PNGs in `docs/brand/`.
- Week 3 Google AI Studio owner-intelligence handoff: original zip is kept locally in ignored folder `Handoff from Google/week3-owner-intelligence/`; active source is adapted into the app rather than copied over wholesale.
- Module 4 Firebase backend pack: source handoff is in local folder `Firebase Build Pack/`; active integrated files now include `src/firebase.ts`, `src/auth.ts`, `src/sessions.ts`, `src/ownerSignals.ts`, `firestore.rules`, `scripts/seedAlbums.mjs`, and `schema_diagram.html`.
- Module 4 backend state: the `Seed Firestore Catalog` GitHub Action seeds a diverse 111-title Discogs-backed store catalog into Firestore, `config/system` has been set with recommendations and Discogs enabled, and the repo `firestore.rules` file is published to Firebase.
- Module 4 Firebase evidence: `docs/class-context/firebase-evidence/firebase-data-snapshot-2026-06-18.png` is a redacted live Firestore data screenshot showing `albums`, `config`, `demandSignals`, and masked `users`; regenerate the HTML/SVG/JSON source files with `npm run firebase:evidence`.
- Firebase Auth state: Google sign-in and email/password sign-in are enabled, and the authorized domains include `localhost`, `vinyl-concierge.firebaseapp.com`, `vinyl-concierge.web.app`, and `msuzann3.github.io`.
- Firebase browser API key state: GitHub secret scanning alert `#1` was reviewed on 2026-06-18; the key is the Firebase web client config key, now restricted in Google Cloud Console to HTTP referrers for GitHub Pages, Firebase Hosting, `localhost`, and `127.0.0.1`, while retaining the Firebase-related API allowlist.
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

The local built preview runs at:

```text
http://localhost:3000
```

The production Express server is still built with `npm run build` and can be run with `npm run start`. Direct hot-reload Vite is available as `npm run dev:vite`, and the older Express/Vite middleware dev wrapper is available as `npm run dev:server`, but normal local preview should use `npm run dev`.

## Useful Commands

```bash
npm run lint
npm run build
npm run start
npm run seed:albums
npm run firebase:evidence
npm run dev:vite
npm run dev:server
```

`npm run lint` runs TypeScript checks. `npm run build` creates the production front-end bundle and compiled server bundle in `dist/`.

## Repository Structure

```text
.
├── .github/workflows/pages.yml
├── .github/workflows/seed-firestore.yml
├── HANDOFF.md
├── PRD.md
├── README.md
├── CHANGELOG.md
├── docs/class-context/
├── docs/brand/
├── firebase.json
├── firestore.rules
├── schema_diagram.html
├── scripts/seedAlbums.mjs
├── server.ts
├── src/
│   ├── App.tsx
│   ├── auth.ts
│   ├── components/
│   ├── firebase.ts
│   ├── index.css
│   ├── main.tsx
│   ├── ownerSignals.ts
│   ├── recommender.ts
│   ├── sessions.ts
│   └── types.ts
└── vite.config.ts
```

## Deployment Notes

GitHub Pages is configured through `.github/workflows/pages.yml`.

Firestore catalog seeding is configured through `.github/workflows/seed-firestore.yml`. Run it manually from GitHub Actions after adding repository secrets `DISCOGS_TOKEN` and `FIREBASE_SERVICE_ACCOUNT_JSON`.

Tailwind v4 source detection is limited in `src/index.css` with `source("./")` so ignored local handoff zip folders are not scanned during builds.

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
- Continue merging the customer-facing recommendation flow and business-facing owner workflow into one coherent feedback loop. Week 3 intentionally stays synthetic and does not claim live POS, purchase-history, customer-account, Discogs, or inventory integration yet.
- Firestore rules are live in Firebase as ruleset `projects/vinyl-concierge/rulesets/f430f4a9-7696-4c9b-bea8-b8ff8a7b6386`, published on 2026-06-17. Public catalog/config reads, signed-in customer session writes, and signed-in demand-signal creates are now allowed by rules.
- Use `docs/class-context/firebase-evidence/firebase-data-snapshot-2026-06-18.png` as the Module 4 Firebase data screenshot. It was generated from live Firestore data and masks user IDs, emails, names, and profile image URLs.
- Use the manual GitHub Action `Seed Firestore Catalog` to populate the Firestore `albums` collection from GitHub secrets instead of Michelle's local machine.
- Optional local fallback: create local-only `.env` with `DISCOGS_TOKEN=...` and local-only `serviceAccount.json`, then run `npm run seed:albums`; neither local file should be committed.
- `config/system` is already set to `{ recommendationsEnabled: true, discogsEnabled: true }` for the Module 4 kill switch/config proof point.
- Sign in once as Michelle, then manually change Michelle's `users/{uid}.role` from `customer` to `owner` in Firebase so the owner dashboard can read aggregate demand.
- Use `schema_diagram.html` for the Module 4 ER/schema screenshot.
- Continue replacing remaining inline SVG logo approximations with production logo image assets where it improves clarity and layout; the header already uses the production PNG brandmark.
- Decide whether owner insights should remain passcode-gated only on the client or move to authenticated server-side access.
