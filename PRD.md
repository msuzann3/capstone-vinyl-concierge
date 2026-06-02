# Product Requirements Document (PRD)

## Project Name: The Vinyl Concierge: Your AI Curator
**Client/Brand:** Curate Records & Books  
**Status:** Approved & Implemented  
**Date:** June 2026

---

## 1. Executive Summary & Vision
"The Vinyl Concierge" is an AI-powered music curator and inventory-optimization system designed for **Curate Records & Books**. The system acts as a digital front-desk clerk—plain, warm, highly knowledgeable, and deeply opinionated. It is designed to move beyond cold, modern collaborative-filtering algorithms by conducting vintage-inspired questionnaires that translate abstract moods, late-night environments, and sonic preferences into a hand-curated stack of interactive vinyl records.

Simultaneously, the platform incorporates a **Staff Ledger** (Owner Insights Dashboard) providing strategic inventory recommendations, merchandising cue tips, and analytical visualization of customer metrics to support independent record store owners in maintaining high-value stock.

---

## 2. Product Objectives
- **Tactile Digital Experience:** Bridge the gap between physical record browsing and digital recommendation using physical canvas metaphors, rotating vinyl spin states, and high-contrast sleeve typography.
- **Atmospheric Discovery:** Capture environmental listening habits (e.g., "headphones after midnight with a glass of wine") over superficial track lists.
- **Codex-Guided Recommendation Logic:** Maintain recommendation behavior in project code that can be reviewed, edited, versioned, and deployed through GitHub without a Gemini dependency.
- **B2B Planning Controls:** Give curators and store owners clear insights into trending local genres and stocking deficits using localized inventory parsing.

---

## 3. Visual Identity & Brand System
The user interface follows the official **Curate Records & Books** brand style guidelines, optimizing for a high-contrast vintage-modern look:

- **Core Color Palette:**
  - **Vinyl Black:** `#1D1D1B` (Deep, warm charcoal, used for primary dark layouts and outer grooves)
  - **Curate Red:** `#DB1D1B` (Bold crimson, utilized for accents, active indicators, and soundwaves)
  - **Sleeve Mustard:** Warm retro yellow/amber, framing physical sleeve elements and typography borders
  - **Bone Cream:** Low-contrast off-white, providing an eye-safe, editorial background
- **Typography Philosophy:**
  - **Display Headings:** Space Grotesk / Inter (Uppercase, tight tracking, modern Swiss/Modern styling)
  - **Body Copy:** Functional sans-serif, maximizing scannability
  - **Editorial Context:** Warm, italicized serif notes describing the "clerk's manifesto"
  - **Technical Data:** monospace (JetBrains Mono) for status pills, barcode formats, and release codes
- **The Brandmark Logo:**
  - A circular vinyl record base embellished with top and bottom Curate Red ambient acoustic soundwaves.
  - Centered custom hand-drawn "CURATE" logotype in bone cream. 
  - Dynamic interactive versions rotate smoothly during system loaders.

---

## 4. Key Functional Features

### 4.1. Atmospheric Interaction Questionnaire
- **User Inputs:**
  - *Favorite Artists:* Comma-separated list (e.g., Phoebe Bridgers, Radiohead, Miles Davis).
  - *Primary Genres:* Tag selectors (Indie Folk, Jazz, Alternative, Trip-Hop, etc.).
  - *Ambient Vibe/Mood:* Late-night reflective, early morning calm, Sunday afternoon reading, high-energy gatherings.
  - *Listening Habit Context:* Free-form environmental description (e.g., "low-lit room, headphones, wind down").
  - *Additional Thoughts:* Text input for abstract imagery ("intimate, warm, slightly haunted, not overly polished").
- **Dynamic Fast-Fill Preset:**
  - Single-click action simulating high-value test accounts (specifically optimized for late-night reflective profiles).

### 4.2. Interactive Recommendations Stack (Sleeve Engine)
- **Record Sleeve Panel:** Renders individual responsive record jackets with high-fidelity artist typography.
- **Tactile Spinning Vinyl Disc:** An interactive structural vinyl element slides out of the jacket or spins continuously upon hover/active play.
- **Clerk’s Review Manifesto:** Concise, deeply opinionated paragraphs emphasizing pressing attributes, reissue-house origins, and cultural significance.
- **Record Track & Barcode Details:** Accurate barcode layout, catalog codes, and release metadata rendered in mono styling.

### 4.3. Curator & Owner Analytics (Staff Ledger)
- **Security Checkpoint:** Accessible via a staff passcode layout.
- **Inventory Opportunity Reports:** Auto-analyzes underrepresented listening areas (e.g. spiritual jazz, British local folk) compared to local user queries.
- **Curator Pipeline Visualizer:** A multi-step flow map detailing future project routing (Clerk Parameters -> Catalog Matching -> Staff Shelf Notes -> Merchandising Cue rendering).

---

## 5. Technical Architecture

### 5.1. Tech Stack
- **Frontend SPA:** React 18+ powered by Vite.
- **Local Development Server:** Node.js + Express serving the Vite app in local development.
- **Styling:** Tailwind CSS configured via direct nesting.
- **Animations:** Custom layout transitions and structural canvas rotations.
- **Linter & Type Safety:** Strict TypeScript checking (`tsc --noEmit`).

### 5.2. Environmental & Security Constraints
- **Port Handling:** Bound strictly to port `3000` via Host `0.0.0.0` for ingress proxy compliance.
- **API Security:** The current GitHub Pages prototype does not require external API keys. Future hosted services should keep credentials server-side only.

---

## 6. Verification Criteria
- **Linter validation:** No TypeScript errors upon compilation.
- **Production Bundle:** Build maps fully compressed under `dist/` directory, compatible with Cloud Run server deployments.
- **Mobile Responsiveness:** Adapts beautifully from 44px minimum touch targets up to wide-angle double-panel grid monitors.
