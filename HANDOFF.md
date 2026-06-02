# Developer Hand-off & Code Guide

This document has been configured as a complete translation blueprint and architectural brief for **ChatGPT Codex** or any developer inheriting **The Vinyl Concierge** application.

---

## 1. Product Requirements Document (PRD)

### 1.1. Executive Summary & Vision
"The Vinyl Concierge" is an AI-powered music curator and inventory-optimization system designed for **Curate Records & Books**. The system acts as a digital front-desk clerk—plain, warm, highly knowledgeable, and deeply opinionated. It is designed to move beyond cold, modern collaborative-filtering algorithms by conducting vintage-inspired questionnaires that translate abstract moods, late-night environments, and sonic preferences into a hand-curated stack of interactive vinyl records.

Simultaneously, the platform incorporates a **Staff Ledger** (Owner Insights Dashboard) providing strategic inventory recommendations, merchandising cue tips, and analytical visualization of customer metrics to support independent record store owners in maintaining high-value stock.

### 1.2. Product Objectives
* **Tactile Digital Experience:** Bridge the gap between physical record browsing and digital recommendation using physical canvas metaphors, rotating vinyl spin states, and high-contrast sleeve typography.
* **Atmospheric Discovery:** Capture environmental listening habits (e.g., "headphones after midnight with a glass of wine") over superficial track lists.
* **Enterprise-Grade AI Middleware:** Provide a robust, server-hosted Gemini AI agent engine acting as the expert "shop clerk" with clear guidelines to avoid marketing buzzwords or corporate jargon.
* **B2B Planning Controls:** Give curators and store owners clear insights into trending local genres and stocking deficits using localized inventory parsing.

### 1.3. Visual Identity & Brand System (Curate Records & Books Guidelines)
* **Core Color Palette:**
  * **Vinyl Black:** `#1D1D1B` (Deep, warm charcoal, used for primary dark layouts and outer grooves)
  * **Curate Red:** `#DB1D1B` (Bold crimson, utilized for accents, active indicators, and soundwaves)
  * **Sleeve Mustard:** `#E5A93B` (Warm retro yellow/amber, framing physical sleeve elements and typography borders)
  * **Bone Cream:** `#F4EFE3` (Low-contrast off-white, providing an eye-safe, editorial background)
* **Typography Philosophy:**
  * **Display Headings:** *Space Grotesk* or *Inter* (applied to uppercase titles, tight letter spacing, modern Swiss/Modern styling).
  * **Body Copy:** Functional sans-serif, maximizing scannability.
  * **Editorial Context:** Warm, italicized serif notes describing the "clerk's manifesto."
  * **Technical Data:** monospace (*JetBrains Mono*) for status pills, barcode formats, rating numbers, and release codes.
* **The Brandmark Logo:**
  * A circular vinyl record base embellished with top and bottom Curate Red ambient acoustic soundwaves.
  * Centered custom hand-drawn "CURATE" logotype in bone cream.
  * Interactive rotating versions used throughout the loading screen layouts.

---

## 2. Codebase Architecture

The application is structured as a full-stack Node.js app utilizing a high-performance React front-end (Vite) and an Express.js middleware server acting as a Gemini client gateway.

```
├── .env.example              # Template for server-side environment parameters
├── server.ts                 # Node.js Express server + Gemini AI router
├── package.json              # Dependency tree, build scripts, and commands
├── PRD.md                    # Core product specs
├── HANDOFF.md                # This document
└── src/
    ├── App.tsx               # Primary interface orchestrator
    ├── types.ts              # Global TypeScript interfaces and enums
    ├── index.css             # Tailwind style imports & theme directives
    ├── main.tsx              # React mounting root
    └── components/
        ├── BrandLogo.tsx     # High-fidelity SVG vectors matching official branding
        ├── QuestionnaireForm.tsx # Atmospheric quiz & search preset controller
        ├── VinylDisc.tsx     # Tactile rotating record components
        └── OwnerInsightsView.tsx # Staff Ledger & supply-chain optimizer
```

---

## 3. Core Component Analysis

### 3.1. Front-end Orchestrator (`src/App.tsx`)
Sets up main layouts using standard grid spacing, managing transitions between questionnaire inputs, loaded vinyl stacks, and the manager passcode access states.
* **Refill Filter Handlers:** Prompts secondary triggers or allows easy feedback edits.
* **Default Store Display:** Stored as `DEFAULT_STORE_DISPLAY` for seamless local fallback when no recommendations have been populated yet.

### 3.2. Vector Assets Engine (`src/components/BrandLogo.tsx`)
Houses high-fidelity inline SVG components rendering exact brand visuals without dependencies on external image hosters:
1. `Brandmark`: Full circular vinyl badge with red soundwaves and custom hand-lettered logotype.
2. `WordmarkRed`: Red hand-drawn linear typography matching the headliner badge.
3. `CircleLockupWithTagline`: Circular mark wrapped by curved "RECORDS AND BOOKS" mono-spaced text tracks.

### 3.3. Atmospheric Questionnaire (`src/components/QuestionnaireForm.tsx`)
A custom questionnaire designed to query specific, mood-based atmospheric parameters.
* **Default Preset:** Pre-wired to load the exact high-value test customer query requested:
  * **Artists:** Phoebe Bridgers, Radiohead, Miles Davis
  * **Genres:** Indie Folk, Jazz, Alternative
  * **Mood:** Late-night reflective
  * **Listening Habits:** Headphones after midnight with a glass of wine and low lighting.
  * **Additional Thoughts:** Intimate, warm, slightly haunted, beautiful.

### 3.4. Express AI Clerk Interface (`server.ts`)
Manages production routing pipelines. Express handles static routing in production and injects the client middleware during dev. It translates customer inputs to structured JSON schema queries returned straight from Gemini via `@google/genai`:
* **Clerk Voice Guidelines:** Strict system instructions forcing the AI model to write like an experienced indie record shop owner, ignoring hyper-market words ("iconic", "disruptive", "curated space") in favor of tactile reissue details, pressing weight, and cultural history.

---

## 4. Run & Build Commands

Ensure credentials match your target configuration variables.

### 4.1. Setup `.env`
Specify the Google GenAI API key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4.2. Developer Mode
Runs the local dev server instantly using `tsx` on Port `3000`.
```bash
npm run dev
```

### 4.3. Production Build
Bundles the frontend elements dynamically using Vite and compiles `server.ts` into a fast-running, single bundle at `dist/server.cjs` via `esbuild`.
```bash
npm run build
```

### 4.4. Start Host
Launches raw compiled production environments.
```bash
npm run start
```
