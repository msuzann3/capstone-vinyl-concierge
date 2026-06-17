# MS Capstone Class Context

Canonical Google Drive folder:
https://drive.google.com/drive/folders/10307xAn-ocGKV5ZuchRrzJV6ZMIKQnTG

## Current Course Position

- Current point in the course: Module 4 backend/governance work has begun from the Week 3 checkpoint.
- Use `capstone-combined.pdf` as the best all-up reference for assignment requirements across the course.
- Use Michelle's submitted `.docx` files in each weekly module folder as the best reference for what has already been said, decided, and submitted.
- For now, prioritize Module 4 backend reality, authentication, database design, governance mapping, and early warning dashboard work.

## Primary Reference Files

- `capstone-combined.pdf`: combined assignment and final deliverable reference for the full term.
- `Mod 1/Module1 Assignment_MLentz.docx`: Week 1 ideation and first prototype narrative.
- `Mod 2/Mlentz_Module2 Assignment.docx`: Week 2 PRD, feature evolution, UI rationale, Owner Insights, and Collection Insights narrative.
- `Mod 3/MlLentz_Mod3 Assignment.docx`: Week 3 UI-first owner intelligence dashboard, competitiveness reflection, and stress-testing narrative.
- Curate brand PDFs and `docs/brand/BRAND_NOTES.md`: brand voice, palette, logo, and visual direction.

## Week 1 Summary

Michelle selected The Vinyl Concierge after exploring five ideas with AI support. The chosen product helps record store owners and customers discover music, with a simple version focused on personalized vinyl recommendations and lightweight owner inventory recommendations.

The submitted prototype narrative described a React frontend, Express backend, Gemini structured JSON responses, and synthetic inventory data. The intended experience is conversational and warm, like a knowledgeable independent record store employee, not a generic recommendation chatbot.

## Week 2 Summary

The PRD reframed The Vinyl Concierge as a feedback loop between customer discovery and store-owner decision-making. Customer-facing functionality includes preference intake, personalized recommendations, recommendation explanations, and Collection Insights. Owner-facing functionality includes aggregated trends, inventory opportunities, customer personas, and merchandising support.

The Week 2 implementation emphasized two added features:

- Owner Insights Dashboard: synthetic customer recommendation activity, top genres/artists, inventory alerts, personas, and trend summaries.
- Collection Insights: collection coverage score, missing album/artist opportunities, and exploration areas.

UI changes included replacing temporary logo approximations with Curate assets, swapping less relevant genre options for Classic Rock and Country, and removing playback-style controls because the prototype does not support audio playback.

## Week 3 Summary

The current Week 3 focus is the owner-facing intelligence dashboard. Michelle explored a UI-first workflow shaped around owner decisions rather than backend logic. The refined owner workflow is:

1. Identify Inventory Issues
2. Validate Demand Signals
3. Review AI Recommendations
4. Track Outcomes

The Week 3 reflection names a key product weakness: the prototype is easy to copy unless it gains store-specific data, integrations, operational workflows, or network effects. The most important future competitiveness path is connecting recommendations, customer purchases, and store inventory into a single feedback loop.

Stress testing focused on owner intelligence assumptions:

- Customer requests may not equal purchasing intent.
- Inventory data must be accurate and current.
- Historical demand may not predict future demand.
- Viral spikes or coordinated requests can mislead purchasing recommendations.

The proposed mitigation direction is stronger demand validation, including weighting purchase history more heavily than requests and flagging sudden spikes for human review. The deeper unresolved issue is that AI recommendations remain dependent on imperfect signals and human judgment.

The Google AI Studio Week 3 owner-intelligence handoff is additive. It represents business-facing pages that work alongside the existing customer-facing recommendation flow. The original export zip is kept locally in `Handoff from Google/week3-owner-intelligence/`, and the active app now contains a lean adapted Owner Intelligence Dashboard rather than replacing the existing customer side.

Current GitHub Pages checkpoint: the live prototype should include both the original customer recommendation side and the Week 3 business-facing Owner Intelligence Dashboard, reachable through the header Customer / Owner switch.

## Week 4 / Module 4 Working Notes

Module 4 asks for a real backend, authentication, a Firestore schema diagram screenshot, database risk reflection, governance responsibility mapping, two failure scenarios, and 3-5 early warning governance signals.

The Firebase backend integration has started from `Firebase Build Pack/`. Active app files now include Firebase initialization, Google/email auth helpers, private session saving under `users/{uid}/sessions`, de-identified aggregate `demandSignals`, owner-only demand summary reads, Firestore rules, a Discogs-to-Firestore seed script, a manual GitHub Action for seeding Firestore from repository secrets, and a standalone `schema_diagram.html` file for the required schema screenshot.

Important distinction for the assignment narrative: the browser app now has a real Firebase path, the `Seed Firestore Catalog` GitHub Action can populate a diverse 111-title Discogs-backed catalog, `config/system` is set, Google sign-in is enabled, `msuzann3.github.io` is authorized for Firebase Auth, and `firestore.rules` is published to Firebase as ruleset `projects/vinyl-concierge/rulesets/f430f4a9-7696-4c9b-bea8-b8ff8a7b6386`. Michelle still needs to sign in once and manually mark her user profile as `role: "owner"` if she wants the owner-only live demand panel to read aggregate demand.

## Working Guidance

- Keep the customer and owner experiences aligned with the Week 3 checkpoint while layering Module 4 backend evidence on top.
- Treat synthetic data as acceptable and intentional where it remains, but distinguish it from live Firestore auth/session/demand-signal infrastructure.
- Avoid implying real POS or purchase-history integration exists. Discogs is available through the manual GitHub seed workflow, with local seeding only as an optional fallback.
- When writing assignment language, preserve Michelle's natural voice and prior wording wherever possible.
- When building product features, prefer changes that strengthen the customer-to-owner feedback loop or owner decision workflow.
