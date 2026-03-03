# Recruiter Workbench v1

A tiny one-screen MVP for turning raw candidate notes into send-ready outputs.

## What this is (right now)
This is intentionally a **small first version** so you can use it immediately and iterate from real usage:
- Candidate notes + optional resume input
- Company/role/comp/work-model context fields
- Generate 4 outputs:
  - Candidate sell bullets
  - Client email (subject + body)
  - Candidate follow-up
  - Interview prep bullets
- Copy buttons for each output card
- Local history (last 10 runs) via `localStorage`

## How to know if it works
Use this success check:
1. Click **Use sample data**
2. Click **Generate**
3. Confirm all 4 output cards fill in
4. Click a **Copy** button and paste into a note/email draft
5. Refresh page and confirm an item appears under **Local History**

If all 5 happen, the MVP is working as intended.

## Run locally
```bash
python3 -m http.server 4173
```
Then open http://localhost:4173

## Zero-to-first-use (beginner path)
If this is your first app, use this sequence:
1. Run locally and generate output with sample data
2. Replace sample notes with one real candidate from your day
3. Send one output to a real client/candidate (after quick edits)
4. Write down what felt off (tone? length? missing info?)
5. Make **one** improvement at a time

## Next step (when ready)
Swap `generateOutput()` in `app.js` with a real API call that returns structured JSON from an LLM:
- `sell_bullets: string[]`
- `client_email_subjects: string[]`
- `client_email_body: string`
- `candidate_followup: string`
- `prep_notes: string[]`

That keeps your UI stable while you upgrade generation quality.
