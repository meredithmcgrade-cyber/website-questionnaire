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

## Deploy on Vercel

1. Import this repo as a Vercel project. The framework is set to Next.js in `vercel.json`.
2. Under Storage, create a Blob store with private access and connect it to the project.
3. Under Settings, then Environment Variables, add `TEAM_PASSWORD`.
4. Redeploy so the storage and password take effect.

## How the tier is recommended

The rules live in `lib/tier.js`. The tier comes from creative output and from whether the site works like software. Site size never changes the tier and shows up as a scoping flag instead.
