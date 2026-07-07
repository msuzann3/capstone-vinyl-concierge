iCloud project path: `Documents/_AI-Workspace/Codex/Capstone`. Treat this as the main shared project path on both Macs. Full paths such as `/Users/michelle/Documents/_AI-Workspace/Codex/Capstone` on the MacBook Pro and `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone` on the MacBook Air are machine-specific local resolutions of the same iCloud-synced folder.

# The Vinyl Concierge

The Vinyl Concierge is an AI-powered music curator and staff inventory dashboard for Curate Records & Books. The app turns a customer's artists, genres, mood, and listening environment into a hand-picked vinyl stack with warm shop-clerk notes, then provides private owner insights for stock planning and merchandising.

## Current Status

- Current working copy is the shared iCloud project folder; the active local resolution depends on which Mac is open.
- Shared repository root to use across both Macs: `Documents/_AI-Workspace/Codex/Capstone` inside iCloud Drive.
- MacBook Pro local resolution: `/Users/michelle/Documents/_AI-Workspace/Codex/Capstone`.
- MacBook Air local resolution: `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone`.
- Source handoff: imported from Google AI Studio, now maintained with ChatGPT Codex and GitHub.
- Product brief: `PRD.md`.
- Developer handoff: `HANDOFF.md`.
- Class context: `docs/class-context/drive-context.md`; primary Drive references are `capstone-combined.pdf`, the final business report instructions, Michelle's weekly submitted `.docx` files, and the assignment feedback document. Current course point: final business report preparation from the completed weekly prototype evidence.
- Local app: React, Vite, Tailwind, Motion, Firebase client SDK, and a production Express server.
- Recommendation engine: Firestore-backed catalog reads in `src/recommender.ts`, with the local in-repo catalog retained as a fallback when the `albums` collection is empty or unavailable. The ranker caps the prototype Firestore catalog read, weights structured genre/style tags, exact catalog artist matches, mood/listening context, and nearby tags inferred from matched catalog artists; weak matches are labeled as staff fallbacks instead of equally personalized recommendations. No Gemini or Google API key required.
- Image generation: no active OpenAI image model configuration, image endpoint, or `gpt-image-2` reference exists in this repo; the prototype does not generate images.
- Suggested Exploration Areas: customer-facing local heuristics in `src/recommender.ts` identify broader genres and store sections worth browsing after the five recommendations. The repeated album-level Shelf Expansion cards and unexplained internal tags are no longer shown.
- Customer-facing side: active recommendation experience in `src/App.tsx`, `src/recommender.ts`, and related components. The header opens a simplified Firebase Google sign-in screen, and signed-in customer recommendation sessions save privately under `users/{uid}/sessions`.
- Business-facing side: active Owner Intelligence Dashboard in `src/components/OwnerIntelligenceDashboard.tsx`, with local synthetic inventory/sales data retained for demo continuity plus a live Firestore customer-demand watchlist for signed-in owners. Signed-in customer recommendation sessions and heart/thumb responses create de-identified `demandSignals`; Owner Intelligence aggregates those signals by album, artist, and genre and turns them into cautious sourcing recommendations. The header has a Customer / Owner switch; this side is additive and does not replace the customer experience.
- Professor walkthrough: any tester can sign in with Google as a customer, submit one recommendation request, optionally heart/like/dislike a result, and select `View This Session in Owner Intelligence`. The owner screen then shows those exact five recommendations and customer responses as a de-identified, single-session sourcing review. A green `Saved to Firestore` status confirms the backend connection; the broader cross-customer aggregate remains restricted to accounts whose Firestore role is `owner`.
- Owner Insights dashboard: the older staff-ledger analytics panel in `src/components/OwnerInsightsView.tsx` still exists on the customer side, using synthetic analytics in `src/syntheticOwnerInsights.ts`.
- Brand references: source PDFs, implementation notes, and production logo PNGs in `docs/brand/`.
- Week 3 Google AI Studio owner-intelligence handoff: original zip is kept locally in ignored folder `Handoff from Google/week3-owner-intelligence/`; active source is adapted into the app rather than copied over wholesale.
- Module 4 Firebase backend pack: source handoff is in local folder `Firebase Build Pack/`; active integrated files now include `src/firebase.ts`, `src/auth.ts`, `src/sessions.ts`, `src/ownerSignals.ts`, `firestore.rules`, `scripts/seedAlbums.mjs`, and `schema_diagram.html`.
- Module 4 backend state: the `Seed Firestore Catalog` GitHub Action now contains 210 unique Discogs queries after removing `Punisher`. The live Firestore catalog currently has 110 album documents after the matching Phoebe Bridgers record was deleted on 2026-06-24. `config/system` has recommendations and Discogs enabled, and the repo `firestore.rules` file is published to Firebase. The live rules prevent browser clients from changing their own `users/{uid}.role`, validate recommendation-request and recommendation-response signals in `demandSignals`, permit negative weighting only for a thumbs-down response, and validate signed-in private recommendation-action saves under `users/{uid}/recommendationActions`.
- Week 5 feedback prep: the app now has shareable tester routes for the intro page, live prototype, and feedback form: `#/intro`, `#/app`, and `#/feedback`. The intro page is intentionally streamlined to the explainer video, how-to testing instructions, prototype caveats, helpful-feedback guidance, and buttons to open the app and form in separate browser tabs. The embedded explainer video lives at `src/assets/vinyl-concierge-explainer.mp4`. The feedback form is designed for non-technical music/record buyers, asks optional Mom Test-style prior-experience and usability questions, emphasizes app clarity/usability over exact recommendation quality, and can post JSON responses to an n8n webhook for Google Sheets when `VITE_N8N_FEEDBACK_WEBHOOK_URL` is configured.
- Customer feedback prep: a draft/reference tester form lives at `docs/customer-feedback-questionnaire.md`. The customer questionnaire now keeps limited-catalog context in the feedback page rather than the app intake page; exact favorite-artist matches may not appear yet, but the tester prompt asks people to judge clarity, ease of use, and understandability.
- Module 4 Firebase evidence: `docs/class-context/firebase-evidence/firebase-data-snapshot-2026-06-18.png` is a redacted live Firestore data screenshot showing `albums`, `config`, `demandSignals`, and masked `users`; regenerate the HTML/SVG/JSON source files with `npm run firebase:evidence`.
- Firebase Auth state: Google sign-in is the visible customer sign-in path, and the authorized domains include `localhost`, `vinyl-concierge.firebaseapp.com`, `vinyl-concierge.web.app`, and `msuzann3.github.io`.
- Firebase browser API key state: GitHub secret scanning alert `#1` was reviewed on 2026-06-18; the key is the Firebase web client config key, now restricted in Google Cloud Console to HTTP referrers for GitHub Pages, Firebase Hosting, `localhost`, and `127.0.0.1`, while retaining the Firebase-related API allowlist.
- Latest catalog/UI polish: the header uses the production Curate brandmark asset; the genre selector includes Classic Rock and Country; the recommendation catalog includes Dolly Parton and a country-rock bridge record; Owner Insights includes Country and Americana browser profiles; and the right-side bulletin board shows Curate Community store information. The confusing synthetic `Live Display Bins` panel has been removed from the customer view, allowing the questionnaire and recommendation results to use a wider 8/4 page layout. Recommendation cards use non-playback Staff Pick indicators plus prototype-only heart-based Save Interest, thumbs-up, and thumbs-down controls with visible on-screen response states. Signed-in prototype result actions save under the customer's private Firestore profile path.
- Feedback-integration state on 2026-06-24: tester suggestions are implemented in the customer experience. The questionnaire and recommendation results use larger readable type, recommendation cards allow longer album titles and artist names to wrap, and responsive shelf spacing gives the selected-record animation safe clearance. The questionnaire starts with no mood or listening-habit defaults, requires only an artist or a genre rather than both, and keeps mood, listening habit, and the custom note optional. Recommendation fallback ordering is based on each customer's query instead of repeatedly filling from the first five catalog records. Customer-facing claims and unfamiliar record-store terminology have also been simplified without removing the overall Curate personality.
- Demo-data diversity state on 2026-06-25: `Quick Demo Fill` rotates among jazz, country/classic-rock, soul/funk, and textured alternative profiles instead of repeatedly naming Big Thief, Radiohead, and Miles Davis. This reduces repeated recommendation bias and produces more balanced Owner Intelligence test signals.
- Ranking correction on 2026-06-25: specific requests such as Classic Rock no longer treat a broad catalog tag such as Rock as a direct match. Multiple selected genres now broaden the candidate pool without stacking every genre score onto crossover records, artist-derived bridge tags are used only when the customer has not supplied genres, and primary shelf-genre matches outrank records connected only through secondary tags. This prevents broadly tagged records such as Big Thief's `Dragon New Warm Mountain I Believe in You` from outranking stronger Country and Classic Rock matches when the customer did not name Big Thief.
- Second feedback pass on 2026-06-24: the header no longer links directly to the feedback form or displays a location; the AI-assisted label uses white text on red; the first two questions clearly state that either an artist or genre is sufficient; recommendation match labels and sound descriptions use plain language; track-order badges were removed; Phoebe Bridgers was removed from the recommendation catalog and seed list; Shelf Expansion album cards were replaced by a prominent Suggested Exploration Areas panel; and the sidebar now includes a dated new-release board plus the Rolling Stones' `Foreign Tongues` as a July 10 upcoming release.
- Final capstone positioning polish on 2026-07-04: the customer app now shows a concise Prototype Notice explaining that recommendations use a demo catalog rather than live store inventory, and the Owner Intelligence Dashboard now includes a Commercial Roadmap plus synthetic strategic owner signals to distinguish the validated prototype from a future SaaS product with inventory, POS, ecommerce, checkout, purchase analytics, and forecasting integrations.
- Module 6 localization note: the `/mx` Mexico-localization work was temporary assignment evidence only and is archived under ignored `Local Archive/`; it is not part of the final prototype unless explicitly restored.
- Final business report draft: generated on 2026-07-07 as editable `MLentz_Final_Project_Business_Report_Draft_1.docx` in the Google Drive `Assignments/Final Assignments/` folder, with a local copy under `output/docx/`.
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

## Week 5 Tester Links

Use these hash routes on the local preview or GitHub Pages build:

- Tester intro page: `#/intro`
- Customer prototype: `#/app`
- Feedback form: `#/feedback`

For GitHub Pages, the shareable links will be:

- `https://msuzann3.github.io/capstone-vinyl-concierge/#/intro`
- `https://msuzann3.github.io/capstone-vinyl-concierge/#/app`
- `https://msuzann3.github.io/capstone-vinyl-concierge/#/feedback`

### Professor Connected-Workflow Test

1. Open the customer prototype and sign in with Google.
2. Complete the questionnaire and generate recommendations.
3. Optionally choose Save Interest, thumbs up, or thumbs down on one or more records.
4. Select `View This Session in Owner Intelligence`.
5. Confirm the owner screen shows the same five records, carries over the customer responses, and displays `Saved to Firestore`.
6. Use the Customer / Owner switch to move between both sides. The professor does not need an owner role for the same-session walkthrough; owner role is required only for the protected all-customer aggregate.

Feedback responses are wired to n8n through the GitHub repository secret `N8N_FEEDBACK_WEBHOOK_URL`, verified present on 2026-06-21. The GitHub Pages workflow passes that secret through as `VITE_N8N_FEEDBACK_WEBHOOK_URL` at build time. If the webhook is removed or unavailable, the feedback page shows a setup error and offers a JSON download fallback.

Webhook setup checklist:

1. In n8n, create a `Webhook` trigger that accepts `POST` requests.
2. Copy the production webhook URL, not the temporary test URL.
3. In GitHub, add a repository secret named `N8N_FEEDBACK_WEBHOOK_URL` with that production URL.
4. Re-run the GitHub Pages deployment, or push a new commit to trigger it.
5. In n8n, map the incoming JSON fields to the Google Sheets append-row step.

If the secret exists and the form still fails, check the browser console and n8n execution log for a CORS/preflight error or a non-2xx webhook response.

## Next Steps

- Replace the default synthetic inventory with real Curate Records & Books inventory data when available.
- Continue polishing Assignment 2 screenshots around the customer recommendation flow, Collection Insights, and the Owner Insights dashboard.
- For strong Assignment 2 screenshots, use test profiles that emphasize indie/alternative songwriting, jazz/fusion listening, and soul/classic-rock dinner-party listening.
- Decide later whether the final Capstone MVP should use Discogs, a database, or another external data source; the current Assignment 2 dashboard intentionally stays local and synthetic.
- Keep the final report centered on the customer-facing recommendation flow, signed-in session persistence, de-identified Firestore demand signals, and Owner Intelligence review workflow.
- The customer-to-owner recommendation feedback loop is now connected through Firestore. For final evidence, use a signed-in customer session plus heart/thumb responses to demonstrate the album-level live sourcing watchlist, while stating clearly that purchase validation and live inventory/POS connections remain future work.
- Firestore rules were republished from the local repo on 2026-06-21 after the prototype hardening pass. Public catalog/config reads, signed-in customer session writes, signed-in validated demand-signal creates, protected customer profile updates, and signed-in private recommendation-action creates are now covered by the live rules.
- Use `docs/class-context/firebase-evidence/firebase-data-snapshot-2026-06-18.png` as the Module 4 Firebase data screenshot. It was generated from live Firestore data and masks user IDs, emails, names, and profile image URLs.
- Use the manual GitHub Action `Seed Firestore Catalog` to populate the Firestore `albums` collection from GitHub secrets instead of Michelle's local machine.
- Optional local fallback: create local-only `.env` with `DISCOGS_TOKEN=...` and local-only `serviceAccount.json`, then run `npm run seed:albums`; neither local file should be committed.
- `config/system` is already set to `{ recommendationsEnabled: true, discogsEnabled: true }` for the Module 4 kill switch/config proof point.
- Sign in once as Michelle, then manually change Michelle's `users/{uid}.role` from `customer` to `owner` in Firebase so the owner dashboard can read aggregate demand.
- Use `schema_diagram.html` for the Module 4 ER/schema screenshot.
- Continue replacing remaining inline SVG logo approximations with production logo image assets where it improves clarity and layout; the header already uses the production PNG brandmark.
- Decide after the course whether the older customer-side Owner Insights panel should remain visible, be folded into the main Owner Intelligence Dashboard, or move behind authenticated server-side access.
- Collect at least three real tester responses, synthesize recurring patterns, classify them into incorporate-now / long-term / ignore, and revise the prototype based on the chosen incorporate-now change.
- Continue reviewing new tester responses for recurring patterns and revise the published feedback improvements only when additional evidence supports a change.
- Review the generated final business report DOCX and upload the final edited `.docx` version to Canvas by the final assignment deadline.
