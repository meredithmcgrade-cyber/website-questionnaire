# Website questionnaire

Client-facing scoping questionnaire for Signal Theory website projects. Built with Next.js.

- `/` the questionnaire clients fill out
- `/team` password-protected list of responses for Black Team
- `/summary/[id]` shareable summary with client notes and a tier recommendation

## Where things live

- `lib/questions.js` the questions, answer options and which ones are required
- `lib/tier.js` the tier recommendation rules and scoping flags
- `lib/store.js` storage (private Vercel Blob in production, local `.data` folder in development)

## Environment variables

- `BLOB_READ_WRITE_TOKEN` added automatically when a Vercel Blob store is connected
- `TEAM_PASSWORD` the password for `/team`

## Run locally

    npm install
    TEAM_PASSWORD=choose-one npm run dev
