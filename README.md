# Recruiter Workbench v1

A tiny one-screen MVP for turning raw candidate notes into send-ready outputs.

## What this is (right now)
This is intentionally a **small first version** so you can use it immediately and iterate from real usage:
- Jobs panel (local): add jobs, click into a job, and save job description + job notes
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
1. Add a job (company + title)
2. Click that job, add description/notes, click **Save Job Details**
3. Click **Use sample data**
4. Click **Generate**
5. Confirm all 4 output cards fill in
6. Refresh page and confirm both:
   - your job is still there
   - an item appears under **Local History**

If all 6 happen, the MVP is working as intended.

## Run locally
```bash
python3 -m http.server 4173
```
Then open http://localhost:4173

## Zero-to-first-use (beginner path)
If this is your first app, use this sequence:
1. Run locally and add one real job
2. Save a real job description + notes
3. Generate output with one real candidate
4. Send one output to a real client/candidate (after quick edits)
5. Make **one** improvement at a time

## Next step (when ready)
Swap `generateOutput()` in `app.js` with a real API call that returns structured JSON from an LLM:
- `sell_bullets: string[]`
- `client_email_subjects: string[]`
- `client_email_body: string`
- `candidate_followup: string`
- `prep_notes: string[]`

That keeps your UI stable while you upgrade generation quality.
