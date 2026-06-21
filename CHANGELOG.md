# Changelog

All notable project changes should be recorded here so Michelle can move between Macs without losing context.

## 2026-06-21

- Reframed the customer results CTAs from nonfunctional commerce language to prototype-only `Save Interest`, thumbs-up, and thumbs-down controls with visible on-screen response states.
- Added match-confidence labels to recommendation cards so testers can distinguish exact artist hits, adjacent fits, and loose limited-catalog suggestions.
- Added a results-page prototype note clarifying that recommendations are matched against a limited 200-ish title test catalog.
- Renamed the customer-facing `Collection Insights` UI to `Shelf Expansion Ideas` and changed `Coverage score` language to `Starting point` so the prototype does not imply it has verified the customer's real collection.
- Relabeled the owner dashboard as an `Owner Demo`, changed demand wording to interest-signal wording, and marked low-stock alerts, request cards, and buy plans as demo/prototype data until real inventory, purchase history, and backend workflows are connected.
- Removed the app intake-page prototype note so testers land directly on the customer questionnaire.
- Initially added tester-facing Add to Cart, thumbs-up, and thumbs-down buttons to each recommendation card as CTA/feedback affordances; these were later reframed as prototype-only interest/feedback controls with visible response states.
- Made the feedback form's limited-catalog/usability reminder more prominent and easier to read.
- Removed feedback form wording that told testers to ignore colors, and removed the questions about why recommendations appeared, one-page vs guided flow preference, and other comments.
- Updated `docs/customer-feedback-questionnaire.md` to match the simplified in-app feedback form.
- Added Week 5 tester hash routes inside the app: `#/intro` for the temporary explainer-video entry page, `#/app` for the customer prototype, and `#/feedback` for the feedback questionnaire.
- Built a non-technical tester intro page with a video placeholder, clear tester path, and buttons to try the app or open the feedback form.
- Replaced the short intro-page placeholder copy with Michelle's full Prototype Evaluation Guide text, organized into project background, what it is, current prototype status, known limitations, and feedback prompts.
- Embedded Michelle's Week 5 explainer video on the intro page from `src/assets/vinyl-concierge-explainer.mp4`, replacing the video placeholder with a native controlled MP4 player.
- Built a feedback form for Google Sheets collection through n8n, using `VITE_N8N_FEEDBACK_WEBHOOK_URL` for a public webhook POST.
- Added optional GitHub Pages build wiring for repository secret `N8N_FEEDBACK_WEBHOOK_URL`, passed through as `VITE_N8N_FEEDBACK_WEBHOOK_URL`.
- Expanded the feedback questions to cover prior recommendation-engine experience, past likes/frustrations, prototype usability, UI clarity without color questions, results-page clarity, and step-by-step vs one-page preference.
- Renamed the final open-ended feedback form prompt to `Other comments?` with a blank free-text response field.
- Improved customer questionnaire header readability by changing the `Quick Demo Fill` button to white text, and removed the `Curate Brand Active` badge from the top-right header.
- Updated the intro page so `Try the app` and `Open feedback form` open in new tabs, and simplified the feedback form by removing visible n8n/copy/download controls while adding a reminder to evaluate the app itself rather than the intro page.
- Simplified the intro page to only the explainer video, how-to testing instructions, prototype caveats, helpful-feedback guidance, and buttons for the app and feedback form.
- Reframed the intro caveats and feedback questions so testers focus on app usability and clarity rather than judging the exact prototype recommendations from the small test catalog.
- Added Michelle's limited-database reminder under the feedback form heading so testers know the feedback is about ease of use, not recommendation accuracy.
- Verified `npm run lint`, `npm run build:pages`, local preview routes, desktop feedback-form rendering, intro-to-app navigation, disabled send state without a webhook, and mobile intro/feedback rendering.
- Confirmed the GitHub repository does not yet have the `N8N_FEEDBACK_WEBHOOK_URL` secret, which explains why the deployed feedback form cannot submit to n8n yet.
- Changed the feedback form so a missing webhook shows a clear setup error after submit instead of silently disabling the send button.

## 2026-06-19

- Began customer feedback-week prep for three non-technical music/record buyers, with next work focused on an intro video script and a tester feedback form.
- Expanded `scripts/seedAlbums.mjs` from 111 to 211 unique Discogs seed queries by adding 100 more diverse album searches across jazz, indie/alternative, pop, R&B, hip-hop, Latin, Japanese/electronic, punk, metal, folk, and country-adjacent shelves.
- Verified the expanded seed list has 211 unique entries and passes `npm run lint`; the live Firestore catalog still needs the manual `Seed Firestore Catalog` GitHub Action or local `npm run seed:albums` run before Firebase reflects the new entries.
- Added a customer-questionnaire prototype note explaining that the test catalog is limited to about 200 random Discogs albums and may not include testers' favorite artists yet; also changed the form footer to say it is searching a 200-ish Discogs seed catalog.
- Added `docs/customer-feedback-questionnaire.md` with a short tester-ready form draft covering ease of use, recommendation relevance, trust, catalog-limit clarity, purchase/exploration interest, and open-ended improvement feedback.

## 2026-06-18

- Restricted the Firebase browser API key in Google Cloud Console to HTTP referrers for GitHub Pages, Firebase Hosting, `localhost`, and `127.0.0.1`; verified the key still has the Firebase-related 25-API allowlist and resolved GitHub secret scanning alert `#1` as an intentional Firebase client config key.
- Generated a redacted live Firestore evidence screenshot at `docs/class-context/firebase-evidence/firebase-data-snapshot-2026-06-18.png`, showing current collection counts for `albums`, `config`, `demandSignals`, and masked `users`.
- Added `scripts/generateFirebaseDataScreenshot.mjs` plus `npm run firebase:evidence` to regenerate the HTML, SVG, redacted JSON, and screenshot source files for Module 4 backend proof without exposing customer emails, names, profile photos, or full user IDs.

## 2026-06-17

- Began Module 4 backend reality work from the Week 3 checkpoint using the local `Firebase Build Pack/` handoff.
- Installed Firebase client SDK plus local-only seed dependencies (`firebase-admin`, `dotenv`), and updated `.env.example` / `.gitignore` so Discogs and service-account secrets stay local.
- Added Firebase initialization, Auth helpers, private session saving, de-identified demand signals, owner aggregate demand reads, Firestore security rules, and a Discogs catalog seed script.
- Added `.github/workflows/seed-firestore.yml` so the Firestore album catalog can be seeded from GitHub repository secrets instead of Michelle's local machine.
- Updated `scripts/seedAlbums.mjs` to read Firebase service account credentials from `FIREBASE_SERVICE_ACCOUNT_JSON` in GitHub Actions, while keeping local `serviceAccount.json` as an optional fallback.
- Expanded the GitHub `Seed Firestore Catalog` workflow source list from 12 starter records to 111 diverse records across jazz, indie, classic rock, country, soul, hip-hop, electronic, ambient, Latin, reggae, punk, metal, and experimental shelves.
- Set Firestore `config/system` to enable recommendations and Discogs-backed catalog behavior.
- Added `firebase.json` pointing to `firestore.rules`; attempted CLI rules deployment, but the service account can write Firestore data and cannot perform the Firebase CLI service-usage permission check, so rules still need to be published in Firebase Console.
- Fixed the Firebase Auth `auth/unauthorized-domain` sign-in error by adding `msuzann3.github.io` to authorized domains; verified Google sign-in is enabled.
- Changed auth and session-save failures to show as a small account notice instead of replacing the customer questionnaire/results with the full recommendation error panel.
- Added an extra recommendation fallback guard so Firestore permission failures cannot block customer-facing recommendations; session persistence now catches its own Firestore write failures internally.
- Published the repo `firestore.rules` to Firebase via the Rules API as ruleset `projects/vinyl-concierge/rulesets/f430f4a9-7696-4c9b-bea8-b8ff8a7b6386`, resolving the default deny-all rules that caused signed-in questionnaire submissions to show `Missing or insufficient permissions`.
- Tightened recommendation ranking so live Firestore results are selected by top score instead of arbitrary Firestore document order, score multiple selected genres/styles, and infer nearby shelf tags only from exact artist matches already present in the catalog instead of using hand-coded artist bridges that would not scale for open feedback.
- Reworked live Firestore recommendation copy so seeded Discogs records no longer show internal phrases like `live Firestore catalog`, `live catalog demand`, or generic `Side A opening cut`; display genres now prefer useful styles such as Alternative Rock over broad Discogs buckets when available.
- Updated the customer questionnaire genre buttons for feedback-week clarity: replaced Dream Pop, Ambient / Drone, and Post-Rock with Pop / Top 40, Ambient, and Hip-Hop, and taught the ranker how those friendlier labels map to catalog tags.
- Changed the recommendation detail language from `CLERK NOTES & DIALOGUE` / `Aesthetic match criteria` to staff-review language, and rewrote live catalog recommendation copy so it reads like a short record-store review instead of an explanation of the matching algorithm.
- Merged hand-written local catalog reviews into matching live Firestore album records, so known titles like Radiohead's `In Rainbows` keep their warmer staff-written notes, track cues, genre, and vibe while still coming from the live seeded catalog.
- Replaced review/fit headings with the neutral `SHELF NOTE` label so both hand-written curated records and generated live-catalog notes read as human-facing shelf descriptions without implying the store has written 110 full reviews.
- Fixed artist matching so favorite-artist terms are checked against artist names only, preventing inputs like `Queen` from matching album titles such as The Smiths' `The Queen Is Dead`.
- Added an assignment-ready Firebase sign-in / registration screen behind the header Sign In button, with Google OAuth, email/password sign-in, email/password account creation, and explanatory authentication notes for Module 4 screenshots.
- Updated the customer header with a Firebase Google sign-in control; signed-in customer recommendation sessions now save privately and emit aggregate demand signals.
- Updated `src/recommender.ts` to read the Firestore `albums` collection first, check `config/system.recommendationsEnabled`, and fall back to the in-repo catalog if Firestore is empty or unavailable.
- Updated the Owner Intelligence Dashboard with a live Firestore demand panel for owner-only aggregate top genres/top artists while preserving the Week 3 synthetic demo cards.
- Added `schema_diagram.html` as the standalone Mermaid Firestore schema artifact required for the Module 4 screenshot.
- Changed `npm run dev` to build and serve a reliable local preview on port 3000; kept direct Vite as `npm run dev:vite`, kept the Express wrapper as `npm run dev:server`, and preserved production `npm run build` / `npm run start`.
- Verified `npm run lint`, `npm run build:pages`, `npm run build`, direct port response at `http://127.0.0.1:3000/`, and rendered preview behavior for the customer header and owner live-demand panel.
- Confirmed the local MacBook Pro working copy is aligned with `origin/main` at commit `4a6acda` and that GitHub Pages should already be publishing the Week 3 Owner Intelligence Dashboard.
- Re-verified the Mod 3 checkpoint with `npm run lint` and `npm run build:pages`.
- Updated `README.md` and `docs/class-context/drive-context.md` to mark the Week 3 / Module 3 checkpoint complete and make Module 4 the next starting point unless Michelle asks for Module 3 revisions.

## 2026-06-11

- Updated the README path notes so the MacBook Pro working copy is `/Users/michelle/Documents/_AI-Workspace/Codex/Capstone`, the MacBook Air copy is `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone`, and both represent the same iCloud-synced project.
- Added `docs/class-context/drive-context.md` with the Google Drive folder reference, Week 3 course status, and summaries of the Module 1-3 submitted `.docx` files plus the combined capstone assignment PDF.
- Imported the Week 3 Google AI Studio owner-intelligence handoff as an additive business-facing side of the prototype, preserving the original zip locally under ignored `Handoff from Google/week3-owner-intelligence/`.
- Added a Customer / Owner switch in the app header so the existing customer recommendation experience and new business-facing Owner Intelligence Dashboard can coexist.
- Added `src/components/OwnerIntelligenceDashboard.tsx`, `src/ownerIntelligenceData.ts`, and `src/ownerIntelligenceTypes.ts` for the local synthetic owner workflow: identify inventory issues, validate demand signals, review AI recommendations, and track outcomes.
- Limited Tailwind v4 source detection to active source files in `src/index.css` so ignored Google handoff zip archives do not stall local or Pages builds.
- Rebuilt local `esbuild` wrapper files with `npm rebuild esbuild` after the Mac restart left the package wrapper missing; verified `npm run lint`, `npm run build`, and `npm run build:pages`.

## 2026-06-03

- Added a Country and Americana browser persona to `src/syntheticOwnerInsights.ts`, increasing the Owner Insights synthetic sample from 101 to 113 sessions.
- Added Country inventory depth, Country trend language, Dolly Parton artist-detail language, and a visible Country ranking path in the Owner Insights dashboard while retaining the existing Classic Rock owner profile.
- Made the Owner Insights sync log display the generated synthetic session count dynamically so the dashboard copy stays aligned with the source data.
- Removed duplicate Curate Community title text from the store information card and removed the repeated bottom Record Club line, leaving only Shop Hours in the lower strip.
- Simplified the footer to a single copyright line: `© 2026 Curate Records & Books, USA`.
- Added Dolly Parton's `Jolene` to the synthetic recommendation catalog as a Country anchor.
- Added The Flying Burrito Brothers' `The Gilded Palace of Sin` as a Country Rock discovery bridge that can serve both Country and Classic Rock recommendation requests.
- Replaced the visible genre selector option `Electronic` with `Country` so the form offers broader customer coverage.
- Added `country` matching tags to existing Americana, alt-country, and country-rock catalog records so Country requests return a full aligned recommendation stack.
- Verified targeted sample profiles: Country now returns Dolly Parton, Wilco, Gillian Welch, The Flying Burrito Brothers, and Jimmy Buffett; Classic Rock now returns The Beatles, Fleetwood Mac, The Flying Burrito Brothers, Jimmy Buffett, and Steely Dan.
- Verified the catalog update with `npm run lint` and `npm run build:pages`.
- Completed the initial UI and content polish pass only; no Collection Insights functionality, APIs, databases, authentication, Discogs integration, or audio playback were added or changed.
- Replaced the visible genre selector option `Trip-Hop` with `Classic Rock`; the existing recommendation catalog already contains Classic Rock entries, so `src/recommender.ts` was left unchanged.
- Corrected the header brand text from `Curate Records_& Books` to `Curate Records & Books`.
- Improved the upper-left header logo visibility by using the existing production Curate brandmark PNG from `docs/brand/Logos/01_brandmark_color.png` on an opaque Bone Cream logo plate.
- Replaced the Concierge Manifesto bulletin card with a Curate Community store information card featuring Record Club timing, the Women Who Changed Rock theme, 23 new arrivals, Indie Folk as the most requested genre, and shop hours.
- Removed playback-style recommendation UI cues from the recommendation cards and selected-record detail area; recommendation cards now use one non-clickable `Staff Pick` indicator, and track cues render as passive Side A shelf notes instead of clickable controls.
- Verified with `npm run lint`, `npm run build:pages`, and local browser review; the current local preview is available at `http://127.0.0.1:3000/` while that dev server is running.

## 2026-06-02

- Expanded the local recommendation catalog in `src/recommender.ts` from 10 to 33 albums as a recommendation-data enhancement, not a new Assignment 2 feature.
- Added genre, mood, and listening-context tags to each recommendation catalog record and included those tags in the existing ranking haystack for better matching variety.
- Added albums across indie/alternative, jazz, classic rock, modern pop, singer-songwriter, soul/R&B, baroque pop, Gulf & Western, ambient, trip-hop, dream pop, and psychedelic folk while leaving Owner Insights Dashboard and Collection Insights UI unchanged.
- Verified the catalog expansion with `npm run lint`, `npm run build:pages`, and sample recommendation profiles for indie/alternative, jazz/fusion, and soul/classic-rock customers.
- Investigated the reported OpenAI error `The model 'gpt-image-2' does not exist`; searched active source, config, env examples, package files, built assets, and ignored files.
- Confirmed there is no `gpt-image-2` reference, OpenAI client, AI SDK configuration, image endpoint, image-generation dependency, Gemini dependency, Google AI Studio import path, or API key requirement in the active codebase.
- Added a README status note clarifying that the prototype has no active image-generation path and still runs recommendations locally.
- Added the second Assignment 2 focused feature: customer-facing Collection Insights after the recommendation results.
- Extended `src/recommender.ts` with local-only collection opportunity heuristics, coverage scoring, and suggested exploration areas; no external APIs, authentication, databases, or Discogs integration.
- Added typed Collection Insights data structures in `src/types.ts`.
- Updated `src/App.tsx` to render a polished Collection Insights section with a Collection Coverage Score, 3-5 album/artist opportunities, shelf-note language, and exploration badges while leaving the Owner Insights Dashboard unchanged.
- Verified the feature build with `npm run lint` and `npm run build:pages`; browser automation could read the local app but click actions timed out in the in-app browser connector, so final verification relied on build/type checks and source inspection.
- Clarified that the stable cross-Mac iCloud project path is `Documents/_AI-Workspace/Codex/Capstone`; `/Users/dolly/...` is only this machine's resolved local path.
- Added the first Assignment 2 focused feature: an enhanced Owner Insights Dashboard populated by 101 local synthetic customer recommendation sessions.
- Added `src/syntheticOwnerInsights.ts` to generate customer personas, requested genres/artists, listening contexts, purchase intent, and inventory opportunity metrics without Discogs, databases, authentication, or APIs.
- Updated the Owner Insights dashboard with top requested genres, top requested artists, inventory opportunity alerts, persona mix, customer trend summary cards, and local-only analytics console language.
- Verified the app with `npm run lint` and `npm run build:pages`.
- Created the GitHub-ready project README from the Google AI Studio handoff.
- Added this changelog as the ongoing cross-laptop project record.
- Prepared GitHub Pages deployment support for the static Vite front end.
- Initially prepared GitHub Pages deployment from the imported handoff; later revised the app so Pages can run recommendations without an external model endpoint.
- Created and pushed the public GitHub repository at `https://github.com/msuzann3/capstone-vinyl-concierge`.
- Enabled GitHub Pages at `https://msuzann3.github.io/capstone-vinyl-concierge/`.
- Updated the HTML page title from the Google AI Studio default to `The Vinyl Concierge`.
- Removed the external model dependency and moved recommendations to local in-repo logic for a ChatGPT Codex + GitHub workflow.
- Updated the browser app so GitHub Pages can generate recommendations without a backend or API key.
- Added Curate brand source PDFs under `docs/brand/`.
- Added `docs/brand/BRAND_NOTES.md` with the palette, type system, logo rules, and voice guardrails from the brand PDFs.
- Moved the active git repository root up to `/Users/dolly/Documents/_AI-Workspace/Codex/Capstone` for cleaner iCloud and GitHub continuity.
- Kept the original Google handoff archive wrapper locally in `Handoff from Google/` and ignored it from git.
- Added the iCloud project path as the first line of `README.md`.
- Clarified project instructions to check the GitHub `README.md` and `CHANGELOG.md` at the beginning of every session and update/push both after meaningful changes.
