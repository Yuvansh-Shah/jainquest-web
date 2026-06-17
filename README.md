# JainQuest (web)

A gamified web app for learning Jain philosophy, in the style of a language-learning app: short lessons, quizzes, XP, streaks, and hearts.

## What it does

JainQuest teaches Jain concepts through about 50 lessons across three units. Each lesson runs as a six-step flow — warm-up, content cards, explanation, quiz, completion — and feeds a gamification system: XP and levels, five regenerating hearts, daily streaks, and per-unit badges. Beyond lessons there's spaced-repetition practice, a community forum (posts, likes, replies), an XP leaderboard, a reader for the fundamentals, and an "Ask Guru" AI chat. The interface is available in English, Hindi, and Gujarati.

It ships as a static Next.js export hosted on Firebase, and shares one Firestore backend with a companion Flutter app — the gamification logic is mirrored between the two codebases. The AI chat runs through a small Cloudflare Worker that keeps the model API key server-side so it never reaches the browser.

This is the web client. The mobile app lives in a separate repo (jainquest).

## Built with

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Firebase Auth + Firestore, Firebase Hosting
- Cloudflare Workers (the `guru-proxy/` AI proxy)
- GSAP, Lenis, and OGL for the visual/scroll effects

## Running it

```
npm install
npm run dev        # http://localhost:3000
```

Build and deploy the static site:

```
npm run build      # outputs to out/
firebase deploy --only hosting
```

The AI proxy deploys separately from `guru-proxy/` with `npx wrangler deploy`; its model API key is a Worker secret, not stored in this repo. The Firebase web config in `src/lib/firebase.ts` is a public client config and is safe to commit — access is governed by the Firestore security rules in `firestore.rules`.

Parts of this project were built with AI coding assistance.
