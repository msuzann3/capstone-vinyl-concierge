# Firebase Build Pack — The Vinyl Concierge

This pack wires your live Firebase backend into the repo and closes the customer-to-owner loop. Everything here is meant to be applied in your `Documents/_AI-Workspace/Codex/Capstone` repo through Codex.

Your project is already set up in the Firebase console: project `vinyl-concierge`, Firestore (production mode), Google + Email/Password sign-in, and a registered web app.

## Files in this pack

- `src/firebase.ts` — Firebase init with your real config (this config is public-safe, fine to commit).
- `src/auth.ts` — Google + email sign-in, and the first-login `users/{uid}` profile with `role: "customer"`.
- `src/sessions.ts` — **the loop.** Saves a private session AND writes de-identified `demandSignals`.
- `src/ownerSignals.ts` — owner side reads aggregated demand (no customer identities).
- `firestore.rules` — security rules (customers see only their own data; only the owner reads demand).
- `scripts/seedAlbums.mjs` — one-time local script to fill `albums` from Discogs (token stays on your Mac).
- `.env.example` — template for your local secrets.

## Order of operations

1. **Publish the security rules.** Copy `firestore.rules` into Firebase console > Firestore > Rules > Publish. (Until you do, the app can't read or write anything, by design.)
2. **Add the `src/` files to the repo** and install the SDK: `npm install firebase`.
3. **Wire auth into the UI.** Add a sign-in button that calls `signInWithGoogle()` from `src/auth.ts`, and use `watchAuth()` to track the current user.
4. **Bootstrap yourself as the owner (one time).** Sign in once so your `users/{uid}` doc is created, then in Firebase console > Firestore, open your user document and change `role` from `customer` to `owner`. This is the only way the owner role is granted; nobody can self-assign it.
5. **Seed the catalog from Discogs.** Locally: `npm i firebase-admin dotenv`, create `.env` (with your `DISCOGS_TOKEN`) and `serviceAccount.json`, then `node scripts/seedAlbums.mjs`. This fills the `albums` collection. Re-run it anytime to add titles (edit the `SEED` list).
6. **Close the loop.** In `App.tsx`, right after the recommender returns results, call `saveSessionAndSignals(input, recommendations, coverageScore)` from `src/sessions.ts`.
7. **Light up the owner side.** In `OwnerIntelligenceDashboard.tsx`, replace the synthetic top-genres/top-artists data with `getDemandSummary()` from `src/ownerSignals.ts`.
8. **Add the config doc.** In Firestore, create `config/system` with `{ recommendationsEnabled: true, discogsEnabled: true }`. Have the app check `recommendationsEnabled` before running recommendations (your kill switch).
9. **Gitignore secrets.** Add `.env` and `serviceAccount.json` to `.gitignore`. Never commit them.

## Prompt to paste into Codex

> I've added a `Firebase Build Pack/` folder with `src/firebase.ts`, `src/auth.ts`, `src/sessions.ts`, `src/ownerSignals.ts`, `firestore.rules`, and `scripts/seedAlbums.mjs`. Please integrate them into this Vite + React + TypeScript app:
>
> 1. Move the `src/*.ts` files into the app's `src/` and run `npm install firebase`.
> 2. Add a sign-in control to the header that calls `signInWithGoogle()` and shows the signed-in user; use `watchAuth()` for state. Email/password is a fallback.
> 3. In `App.tsx`, after the recommender produces results, call `saveSessionAndSignals(input, recommendations, collectionCoverageScore)`. Map my existing recommendation objects to `{ albumId, title, artist, type, matchScore }`.
> 4. Change the recommender so the catalog is read from the Firestore `albums` collection (cache-first) instead of the in-repo synthetic list; keep the synthetic list as a fallback if `albums` is empty.
> 5. In `OwnerIntelligenceDashboard.tsx`, source top genres and top artists from `getDemandSummary()` instead of the synthetic data, and show the returned `sampleSize`.
> 6. Before running recommendations, read `config/system.recommendationsEnabled`; if false, show staff picks only (the kill switch).
> 7. Add `.env` and `serviceAccount.json` to `.gitignore`. Do not commit the Discogs token or the service account key.
> Keep all current UI, branding, and the customer/owner switch intact. This is additive.

## What stays secret vs. public

- **Public, fine to commit:** the Firebase web config in `src/firebase.ts` (it only identifies the project; security comes from the rules + auth).
- **Secret, never commit, local only:** your Discogs token (`.env`) and the Firebase service account key (`serviceAccount.json`). Both are used only by the seed script on your Mac, so the deployed GitHub Pages app never carries them.

## Why this is the loop your professor wants

A customer fills the form, the app saves their session privately and writes de-identified demand signals, and the owner dashboard reads the aggregate. What customers ask for now moves the owner's numbers, without ever exposing any individual's history. That's the customer-to-owner feedback loop, built for real and built responsibly.
