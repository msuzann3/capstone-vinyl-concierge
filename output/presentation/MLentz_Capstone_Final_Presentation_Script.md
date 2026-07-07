# The Vinyl Concierge - Final Recorded Presentation Script

Target length: about 8:30 to 9:30, leaving a little room under the 10-minute limit.

Tone: concise product pitch for a job-interview, startup, or internal stakeholder-review setting. Lead with the business problem and product value, then use the demo as proof.

## Recording Setup

- Open the slide deck.
- Open the prototype in a browser: https://capstone.curatevinyl.com/
- If using the direct GitHub Pages URL, use: https://msuzann3.github.io/capstone-vinyl-concierge/#/app
- In Zoom, share the full screen so the switch from slides to browser feels smooth.
- Suggested demo path: start on `#/app`, use Quick Demo Fill, generate recommendations, optionally click Save Interest or thumbs-up on one record if signed in, then choose `View This Session in Owner Intelligence`.

## Slide 1 - Opening

Hi, my name is Michelle Lentz, and I am pitching The Vinyl Concierge.

It is an AI-powered recommendation and owner-intelligence platform for independent record stores. The pitch is simple: customers get warmer, more useful music discovery, and store owners get earlier visibility into what customers are asking for before that demand is obvious in sales.

The product is not just a themed recommendation engine. The business value is the loop: customer discovery becomes privacy-protected owner insight.

## Slide 2 - Problem

Independent record stores work in a category where taste, trust, and timing matter. Customers often know a mood, an artist, or a listening context, but they may not know what record to buy next.

Owners have the opposite side of the same problem. They need to decide what to stock, restock, feature, or special order before clear demand is visible. They already use expertise and intuition, but those signals can be incomplete.

So the product asks a practical question: can the same interaction that helps a customer discover records also create useful, anonymized demand signals for the owner?

## Slide 3 - Product Thesis

The current prototype has two connected experiences.

On the customer side, someone enters favorite artists or genres, gets five recommendations from a limited demo catalog, and can respond with saved interest, thumbs up, or thumbs down.

On the owner side, those actions become cautious sourcing signals. The dashboard reviews album, artist, and genre patterns, but it does not pretend that one recommendation request is the same as a sale.

That distinction is important for the pitch. A recommendation engine by itself is easy to copy. A store-specific feedback loop, grounded in customer behavior, inventory, purchases, and staff review, is the more defensible business opportunity.

## Slide 4 - Demo Setup

I am going to switch to the prototype now and walk through the professor path.

First I will start as a customer. I will use the quick demo fill so the flow is easy to see within the time limit, then generate a five-record recommendation stack. As I do that, notice that the prototype clearly labels its limits: it is using a demo catalog, not live store inventory.

Then I will move into Owner Intelligence from the same session. The point of this demo is not that the app can fully run a record store today. The point is that the product thesis is implemented and visible.

## Live Demo - Browser Walkthrough

Switch from slides to the browser.

1. Open the customer prototype.
2. Point out the Prototype Notice.
3. Use Quick Demo Fill.
4. Click `Curate My Vinyl Rack`.
5. Briefly point out the five recommendations, match labels, shelf note, and Suggested Exploration Areas.
6. If signed in, click Save Interest or thumbs-up on one record. If not signed in, say that the browser-only flow still demonstrates the handoff, while sign-in shows Firestore persistence.
7. Click `View This Session in Owner Intelligence`.
8. Point out the same-session handoff, the sourcing suggestions, and the low-sample warning.
9. Switch back to slides.

Suggested demo narration:

"This is the customer-facing flow. The product is intentionally clear that this is a limited demo catalog, not a complete live inventory system. The customer starts with an artist or genre, and the app returns five records with match labels and plain-language shelf notes. The important part is what happens next. The customer response is not treated as a purchase. It becomes an interest signal. When I open the same session in Owner Intelligence, the owner sees those records as cautious sourcing suggestions, with low-sample warnings and human-review language. That is the feedback loop the product is testing."

## Slide 5 - What the Prototype Proves

The prototype proves that the core workflow is coherent.

It can take a customer request, generate recommendations, preserve private session context for signed-in users, create owner-readable interest signals, and show those signals in an owner review workflow.

It also proves the product direction. The best version of this app is not trying to make the AI sound magical. It is trying to make the handoff between customer discovery and owner judgment more useful.

## Slide 6 - Key Learnings

The most important learning from feedback was that trust depends on honesty.

External testers liked the identity and the concept, but they also surfaced issues around readability, unclear input requirements, record-store terminology, and interface elements that accidentally implied working cart or audio features.

That feedback changed the product. The final version uses larger type, clearer prompts, match-confidence labels, simpler language, heart-based saved interest instead of cart language, and visible prototype notices.

AI-assisted review also helped identify risks in role access, signal validation, and owner-dashboard overconfidence. Those became Firestore rule updates, clearer labels, and more cautious dashboard language.

## Slide 7 - Risks and Responsibility

The biggest risk is overclaiming.

Recommendation activity is useful, but it is not the same as purchase intent. A limited catalog can create availability bias. Broad genre tags can produce weak matches. Owner dashboards can create automation bias if the app makes signals look stronger than they are.

The prototype addresses those risks through transparency and governance: prototype notices, match labels, private customer sessions, anonymized owner signals, Firestore validation, role protection, and human review before inventory decisions.

In a production system, I would also monitor complaint rates, repeated weak matches, unusual demand spikes, stale inventory syncs, permission errors, and repeated staff overrides.

## Slide 8 - Deployment Judgment and Close

My deployment judgment is cautious but positive, which is exactly how I would frame the ask to an internal stakeholder or early investor.

The Vinyl Concierge should not be deployed commercially in its current prototype form. Even a small pilot would need live inventory, POS or ecommerce connections, purchase validation, stronger monitoring, and store-specific rollout support.

But the product is worth moving into an integration-ready pre-pilot. My ask would be permission to connect one store's real catalog and transaction systems, test whether saved-interest behavior predicts buying behavior, and measure whether owners find the dashboard useful without replacing their judgment.

The core takeaway is this: the recommendation engine is not the whole product. The stronger business is the feedback loop between customer discovery, privacy-protected interest signals, owner review, and inventory planning.

Thank you.
