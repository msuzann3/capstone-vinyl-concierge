# MS Capstone Class Context

Canonical Google Drive folder:
https://drive.google.com/drive/folders/10307xAn-ocGKV5ZuchRrzJV6ZMIKQnTG

## Current Course Position

- Current point in the course: Week 3 / Module 3.
- Use `capstone-combined.pdf` as the best all-up reference for assignment requirements across the course.
- Use Michelle's submitted `.docx` files in each weekly module folder as the best reference for what has already been said, decided, and submitted.
- For now, prioritize Modules 1-3. Modules 4-7 and final deliverables are future-facing requirements, not current implementation scope unless Michelle asks to plan ahead.

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

## Working Guidance

- Keep the prototype aligned with the Week 3 state unless Michelle explicitly asks to jump ahead.
- Treat synthetic data as acceptable and intentional for current assignments.
- Avoid implying real POS, purchase-history, customer-account, Discogs, or live inventory integration exists until implemented.
- When writing assignment language, preserve Michelle's natural voice and prior wording wherever possible.
- When building product features, prefer changes that strengthen the customer-to-owner feedback loop or owner decision workflow.
