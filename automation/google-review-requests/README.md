# Google review requests (automatic)

A Google Sheet that emails each finished client a short thank-you with a one-tap
"Leave a Google review" button, sends **one** reminder a week later, then stops.
Free, runs in Egnatia's own Google account, no server.

- Review link (Egnatia Construction Inc., 126 41st St, Brooklyn):
  `https://search.google.com/local/writereview?placeid=ChIJBVgIVRlFwokRzoaH2eIn7Dk`
- Emails go out in English or Spanish per client.
- Clients with a phone number also get a **"📱 Text <name>"** link in the sheet: tap it
  on a phone to open a pre-written text (sent from your own number, free).
- A printable QR card for handover day is in `../review-card/`.

## One-time setup (about 10 minutes)

1. Sign in to the Google account that should send the emails (ideally the one for
   info@egnatiaconstruction.com).
2. Go to **sheets.new**, then **File → Import → Upload** `review-requests-template.csv`
   → *Replace current sheet*. Rename the tab to **Review requests**.
3. **Extensions → Apps Script.** Delete what's there, paste all of `Code.gs`, and click 💾 Save.
4. Back in the sheet, reload the page. A **⭐ Reviews** menu appears.
5. **⭐ Reviews → Set up / repair the sheet.** Google asks for permission the first time
   (to send email as you and edit this sheet). Approve it.
6. **⭐ Reviews → Send me a test email.** Check your inbox for the English and Spanish versions.
7. **⭐ Reviews → Turn on daily automation.** It now runs every morning around 10am.
8. Delete the EXAMPLE row.

## Live demo (Instant mode)

To show a client the email arriving in real time:

1. Do the setup above in **your own** Google account (steps 1–6).
2. **⭐ Reviews → Instant mode ON.** Approve the permission prompt if Google asks.
3. On the call, type a new row: your name, **your email**, EN or ES, a project, then
   **Completed on last** (⌘ + ; types today's date). The email lands in your inbox
   within about 10–30 seconds and Status turns to *Requested*.
4. Afterwards: **⭐ Reviews → Instant mode OFF**, and delete the demo row.

Instant mode skips the 2-day wait, so keep it off for real clients.

## Day to day

When a project is finished, add a row: **Client name, Email, Phone, Language (EN/ES),
Project** (e.g. "brownstone renovation"; for Spanish, include the article: "la remodelación de su cocina"), **Completed on**. That's it:

| When | What happens | Status becomes |
|---|---|---|
| 2 days after *Completed on* | Thank-you email with review button | Requested |
| 7 days after that | One friendly reminder | Reminded |
| After that | Nothing more, ever | |

Set **Status** yourself to:
- **Reviewed**: once they've posted (stops the reminder).
- **Do not contact**: if they'd rather not hear from you.

Change timing, phone or reply-to address at the top of `Code.gs` (`CONFIG`).
Gmail allows about 100 automated emails a day (1,500 on Google Workspace), far more than needed.

## Rules this follows (please keep it that way)

- **Ask every client the same way.** Don't only ask happy ones ("review gating"). Google
  prohibits it and the FTC's 2024 rule on consumer reviews (16 CFR Part 465) bans review
  suppression.
- **No incentives** (discounts, gifts, raffles) for reviews.
- **Never write reviews** for clients or post from staff/family accounts.
- Reply to reviews (good and bad) from the Google Business Profile. The `gbp-agent`
  skill can draft replies for approval.
