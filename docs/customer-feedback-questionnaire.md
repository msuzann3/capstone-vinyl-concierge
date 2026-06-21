# Customer Feedback Questionnaire Draft

Use this for the three non-technical music/record-buyer testers after they watch the intro video and try the customer side of The Vinyl Concierge.

## Setup

- Recommended tool: the in-app `#/feedback` form, posting to an n8n webhook that appends responses to Google Sheets. Google Forms, Microsoft Forms, or Typeform remain acceptable backups.
- Estimated time: 5-8 minutes.
- Best timing: send the form link immediately after they use the prototype.
- Tester framing: this is a school prototype with a limited test catalog of about 200 random Discogs albums, so exact favorite artists may not appear yet. Feedback should focus on usability, clarity, and whether the app flow makes sense, not whether the prototype finds the perfect record.
- Shareable Pages links after deployment:
  - Intro page: `https://msuzann3.github.io/capstone-vinyl-concierge/#/intro`
  - Customer prototype: `https://msuzann3.github.io/capstone-vinyl-concierge/#/app`
  - Feedback form: `https://msuzann3.github.io/capstone-vinyl-concierge/#/feedback`

## n8n / Google Sheets Capture

The feedback form sends one JSON payload to `VITE_N8N_FEEDBACK_WEBHOOK_URL` when that environment variable is configured at build time. For GitHub Pages, add the n8n production webhook URL as repository secret `N8N_FEEDBACK_WEBHOOK_URL`; the Pages workflow passes it into the build.

Recommended n8n workflow:

1. Webhook trigger receives a `POST` request.
2. Optional Set/Edit Fields step maps nested JSON fields into flat sheet columns.
3. Google Sheets node appends a row to Michelle's Week 5 feedback sheet.
4. Respond to Webhook returns a simple success response.

If the webhook is not configured, the form shows a setup error after submit.

## Intro Text

Thank you for testing The Vinyl Concierge. This is a student prototype for a record-store recommendation tool. Since we are working with a limited database, this is not about the recommendations you received. It is about the ease of using the app. Although if the recommendations are correct, that is cool too!

## Questions

1. How would you describe yourself as a record or music buyer?
   - I buy records often
   - I buy records sometimes
   - I mostly stream music but would consider records
   - I am mainly helping as a music listener

2. How easy was it to understand what the customer side was asking you to do?
   - Very easy
   - Mostly easy
   - Somewhat confusing
   - Very confusing

3. Were any questions on the form unclear or hard to answer?
   - No
   - Yes
   - If yes, what felt unclear?

4. Once recommendations appeared, was the results page easy to understand?
   - Very clear
   - Mostly clear
   - A little confusing
   - Very confusing

5. After seeing the results, did you know what you were supposed to do next?
   - Very clear
   - Mostly clear
   - A little confusing
   - Very confusing

6. Were the shelf notes easy to understand?
   - Helpful
   - Somewhat helpful
   - Too technical
   - Too vague
   - Not useful

7. Was it clear that the catalog is limited and may not include your favorite artists yet?
   - Yes
   - Somewhat
   - No

8. What helped or hurt your confidence while using the results page?

9. What would make the app easier to use or understand?

10. If this were available on a record store website, would you use it?
    - Yes
    - Maybe
    - Probably not
    - No

11. What part of the app flow, wording, or layout should be improved?

## Current In-App Question Areas

The in-app form expands this draft into five sections:

- About you.
- Similar tools you have used.
- Using this prototype.
- Understanding the results.
- What should change.

It asks specifically about prior recommendation engines, what testers liked or disliked about those experiences, usability and scanning friction in The Vinyl Concierge, and results-page clarity. It intentionally directs testers toward usability, clarity, and ease of use rather than exact recommendation quality from the limited prototype catalog.

## Michelle's Review Notes

After all three testers respond, look for:

- Repeated confusion about the same question or label.
- Whether testers understand that this feedback round is about usability rather than exact artist matches.
- Whether the limited-catalog note worked.
- Whether the results page helps testers understand what happened and what to do next.
- Any repeated wording, layout, or flow confusion.
