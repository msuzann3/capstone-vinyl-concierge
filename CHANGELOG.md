# Changelog

All notable project changes should be recorded here so Michelle can move between Macs without losing context.

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
