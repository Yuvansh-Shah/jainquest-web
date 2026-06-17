# JainQuest — Handoff

A complete map of the project: what it is, how it's built, where things live, how to deploy and change them, and the constraints to respect.

---

## 1. What this is

**JainQuest** is a Duolingo-style gamified learning app for Jain wisdom, aimed at teenagers and beginners. There are **two front-ends sharing one Firebase backend** so a learner's progress follows them across surfaces:

| Front-end | Path | Stack | Status |
|---|---|---|---|
| Web app | `jainquest-web/` | Next.js 16 + React 19 + TS, deployed | **Live** at `https://jainquest-4297e.web.app` |
| Mobile app | `project/` | Flutter + Dart | Going to Play Store as the mobile target |

Both talk to the same Firebase project **`jainquest-4297e`**, same Firestore schema, same gamification math. Any schema / XP / hearts / streak / spaced-repetition change MUST be mirrored in both clients or they'll corrupt each other's data.

There is also a **third deployable** — a small Cloudflare Worker that proxies the in-app AI Guru, so the NVIDIA API key never leaks into the browser.

```
jainapp/
├── project/                    Flutter mobile app (Dart)
├── jainquest-web/              Next.js web app (TypeScript)
│   ├── src/                    web app source
│   ├── guru-proxy/             Cloudflare Worker (AI Guru backend)
│   ├── out/                    static export build output (gitignored)
│   ├── firebase.json           hosting + firestore config
│   ├── firestore.rules         security rules
│   └── handoff.md              this file
└── (no top-level workspace config — each side is independent)
```

---

## 2. The web app (`jainquest-web/`)

### 2.1 Tech stack

- **Next.js 16.2.6 App Router**, React 19, TypeScript (strict)
- **Tailwind CSS v4** (`@theme inline` tokens, CSS custom props)
- **Firebase JS SDK v12** — Auth (email/password + Google) and Firestore (with persistent IndexedDB cache — see §2.5)
- **Aesthetic**: dark-first, Fraunces (display) + IBM Plex Sans (body), terracotta-gold accent (`#df9b5f` / `#d48943`), Aurora WebGL background. Light mode adds `html.light`. **Do not "fix" the dark default** — it's the chosen look.
- **React Bits components** ported to TS: `Aurora`, `MagicCard`+`SpotlightLayer` (hover cursor effects), `DecryptedText`, `ScrollStack` (smooth scroll via Lenis)
- **AI**: NVIDIA-hosted Llama via the Cloudflare Worker proxy (§3)
- **Note**: `jainquest-web/AGENTS.md` warns that Next 16 has breaking changes. The bundled docs at `node_modules/next/dist/docs/` are stubs — when adding non-trivial Next features, read them first.

### 2.2 The MUST-KEEP constraint: fully static export

`next.config.ts` sets **`output: 'export'`**. The whole app builds to a static `out/` directory and is served as plain HTML/JS by Firebase Hosting on the free Spark plan. **No server, no SSR, no Cloud Function.**

Adding any of these silently breaks the deploy:

- Server Components that call dynamic server functions (`cookies()`, `headers()`, etc.)
- Route Handlers that read `Request`
- `middleware.ts`
- `rewrites` / `headers` in `next.config.ts`
- `next/image` without `unoptimized: true`
- Dynamic routes without `generateStaticParams()`

The one dynamic route `/lesson/[lessonId]` stays static via a server shell:

- `app/lesson/[lessonId]/page.tsx` — server component, exports `generateStaticParams()` over `allLessons` + `export const dynamicParams = false`. Renders `<LessonClient />`.
- `app/lesson/[lessonId]/lesson-client.tsx` — the actual `'use client'` lesson runner.

**New dynamic routes need the same pattern.**

### 2.3 Source layout

```
src/
├── app/
│   ├── layout.tsx              root layout: fonts, Aurora bg, providers (Lang → App → AuthGate)
│   ├── globals.css             Tailwind v4 tokens, :focus-visible ring
│   ├── page.tsx                Home: lesson path (per-unit sections), daily goal, hearts card
│   ├── forum/page.tsx          Community: posts, likes, replies, delete own
│   ├── guru/page.tsx           Ask Guru: chat with the Worker
│   ├── leaderboard/page.tsx    Top 100 by XP (single-field index, automatic)
│   ├── lesson/[lessonId]/
│   │   ├── page.tsx            SSG server shell
│   │   └── lesson-client.tsx   Phases: warm-up → cards → explanation → quiz → complete
│   ├── practice/page.tsx       Review (8 Q from completed) + weak-spot (missed/due)
│   ├── profile/page.tsx        Avatar (click to change), stats, badges grid
│   ├── resources/page.tsx      Curated videos/websites + Reader link
│   ├── resources/read/page.tsx Fundamentals of Jainism reader (bookmarks, hearts on read)
│   └── settings/page.tsx       Theme, language, sign out
├── components/
│   ├── auth-gate.tsx           Loading → Landing → AppShell (or Login); persists "entered" in sessionStorage (§2.5)
│   ├── app-shell.tsx           Sidebar (nav + Sign out) + top bar (Streak/Hearts/XP/level) + <main>
│   ├── landing.tsx             Public landing: language switcher, decrypted hero, Jain timeline (ScrollStack)
│   ├── login.tsx               Email/Google sign-in
│   ├── profile-setup.tsx       First-time profile (name, age, avatar, language)
│   ├── avatar-picker.tsx       Curated emoji grid + "use initial" reset
│   ├── magic-card.tsx          Particles/magnetism/border-glow + SpotlightLayer
│   ├── magic-bento.css
│   ├── decrypted-text.tsx
│   ├── scroll-stack.tsx / .css
│   └── aurora.tsx / .css
├── lib/
│   ├── firebase.ts             Firebase init + persistent IndexedDB cache (§2.5)
│   ├── i18n.ts                 en/hi/gu dictionary + translate({var})
│   ├── avatars.ts              Curated avatar emojis
│   └── domain/
│       ├── models.ts           User, Progress, AttemptLog, BadgeDefinition (mirrors Dart)
│       ├── gamification.ts     XP rewards, hearts regen, level math, level titles
│       ├── lessonModels.ts     Lesson, Unit, Screen types
│       ├── lesson-flow.ts      badgeForLesson() switch, recordQuestionAttempt() (spaced rep)
│       ├── storage.ts          StorageService — all Firestore reads/writes per user
│       └── content/
│           ├── curriculum.ts   THE REGISTRY: units, allLessons, allBadges, lessonById()
│           ├── unit1.ts        Foundations (~25 lessons + master + badges)
│           ├── unit2.ts        Living the Jain Path (12 + master + badges)
│           ├── unit3.ts        The Soul's Journey (12 + master + badges)
│           ├── fundjain.ts     Fundamentals of Jainism reader parser
│           └── resources.ts    Curated videos / websites
└── state/
    ├── app-context.tsx         AppProvider: status loading/unauthed/ready, user, progress, storage
    └── language.tsx            LanguageProvider, useLang, useT (SSR-safe: starts 'en', adopts localStorage on mount)
```

### 2.4 Auth & user lifecycle

1. `layout.tsx` mounts `<LanguageProvider><AppProvider><AuthGate>{page}</AuthGate></AppProvider></LanguageProvider>`.
2. `AppProvider` subscribes to `onAuthStateChanged`. On a signed-in user it constructs a `StorageService`, calls `svc.init()` (6 Firestore `getDoc`s + 1 `getDocs` for attempts — instant from the IndexedDB cache after first run), and sets `status: 'ready'`.
3. `AuthGate`:
   - `status === 'loading'` → full-screen spinner.
   - Otherwise: if `entering` is false → `<Landing>` (with a "Continue" button — even for already-signed-in users). On click it sets `entering = true` AND writes `sessionStorage.jq_entered = '1'`.
   - `entering` is hydrated from `sessionStorage` on mount, so it persists across navigations and reloads within a tab (the static-export deploy reloads on every nav — without this, sidebar clicks bounced users back to Landing).
   - On `status === 'unauthed'` it clears the flag and resets to Landing.
   - Signed-in + entered → `<AppShell>{children}</AppShell>`. Unauthed + entered → `<Login>`.
4. If the signed-in user has no profile name, AppShell renders `<ProfileSetup>` (name + age + avatar emoji + language) and writes the profile.

### 2.5 The two performance hacks you must not delete

The deployed static site does a **full page reload on every navigation** (Next 16 + Firebase Hosting framework integration doesn't ship Workers SSR, and we're static-only anyway). Two patches keep that feeling instant rather than awful:

1. **Firestore persistent IndexedDB cache** — `src/lib/firebase.ts` uses `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })` instead of `getFirestore`. So `StorageService.init()`'s six reads resolve instantly from local cache and re-sync in the background. **Without this every screen was a multi-second spinner.** Matches the Flutter app, which already caches by default.
2. **`sessionStorage.jq_entered` flag** — in `auth-gate.tsx`. Persists the "user clicked Continue" decision across reloads so sidebar nav doesn't bounce them back to the Landing page. Cleared on sign-out and on fresh sessions.

### 2.6 Internationalisation

Three languages: **en, hi, gu**. The dictionary is in `src/lib/i18n.ts` keyed like `nav.home`, `home.lessonPath`. `translate(lang, key, vars)` does `{var}` interpolation.

- `LanguageProvider` starts at `'en'` for SSR safety, then adopts `localStorage.jq_lang` in `useEffect` on mount.
- Signed-in users' choice also writes to their profile (`preferredLanguageCode`).
- **Lesson content stays English by design** — the structured lesson seeds in `unit1/2/3.ts` are English-only. UI chrome is translated.

### 2.7 The curriculum

Single source of truth: **`src/lib/domain/content/curriculum.ts`**.

```ts
export const units: Unit[] = [unit1, unit2, unit3];
export const allLessons: Lesson[] = units.flatMap((u) => u.lessons);
export const allBadges: BadgeDefinition[] = [...unit1Badges, ...unit2Badges, ...unit3Badges];
export function lessonById(id: string): Lesson | undefined;
```

The home page, lesson runner, practice, and profile all read from this registry.

| Unit | Title | Level | Size | Topics |
|---|---|---|---|---|
| `unit1` | Foundations of Jainism | Beginner | ~25 lessons + master | AAA framework (Ahimsa, Anekantvad, Aparigraha), Jain way of life, ethics |
| `unit2` | Living the Jain Path | Intermediate | 12 + master | Three Jewels, five vows, karma in depth, Samvara/Nirjara, Syadvada, food, forgiveness, Samayika, Paryushana |
| `unit3` | The Soul's Journey | Advanced | 12 + master | Jiva/Ajiva, nine tattvas, six dravyas, eight karmas, leshya, four gatis, gunasthanas, twelve bhavanas, loka, kalachakra, moksha |

Each lesson is a `Seed` transformed by `buildGeneratedLessons()` into a six-screen flow: warm-up Q → short text cards (Core idea / Why it matters / Everyday practice) → YouTube placeholder → explanation → quiz → lesson complete. The shape is identical across units so the lesson runner is unit-agnostic.

### 2.8 Adding a Unit 4

1. Create `src/lib/domain/content/unit4.ts` mirroring `unit2.ts` / `unit3.ts` (Seed interface, seeds array, `buildGeneratedLessons()`, `masterTest`, exports `unit4` + `unit4Badges`).
2. Register in `curriculum.ts`: `import { unit4, unit4Badges }`, add to `units` and `allBadges`.
3. Wire per-lesson badges in `src/lib/domain/lesson-flow.ts` — add cases in the `badgeForLesson` switch mapping lesson IDs to badge IDs.
4. `npm run build` to verify (page count goes up by `unit4.lessons.length`).

The home page auto-renders the new unit as a third section, gated behind Unit 3's master test (cross-unit gating is a flat index across `allLessons`).

### 2.9 Gamification

`src/lib/domain/gamification.ts` (mirrored in Dart):

- **XP**: from each correct quiz answer + completion bonuses (perfect quiz, first-time completion); from Practice; from Reader page reads. Levels derived from total XP. Each level has a title.
- **Hearts**: lose 1 on wrong quiz answer; at 0 hearts you cannot **start** a new lesson (you can still Review completed ones). Hearts regen with time, faster via Practice + Resources reading.
- **Streak**: counts consecutive days with any activity. Longest streak tracked separately.
- **Badges**: defined per-unit in `unitNBadges` (data) AND triggered by `badgeForLesson(lessonId)` (logic). Both must reference the same `BADGE_*` id. Some badges are **derived** rather than triggered (e.g., `first_steps`, `week_warrior` — see `profile/page.tsx`).

---

## 3. The Ask Guru backend (`jainquest-web/guru-proxy/`)

The web app is static client-side, so any API key it held would be visible in the browser. A tiny **Cloudflare Worker** holds the NVIDIA key server-side and proxies calls.

### 3.1 Files
- `worker.js` — entry. Filters client messages to `user`/`assistant` only, prepends `soul.md` + a language instruction as the system message, calls NVIDIA's OpenAI-compatible endpoint, strips `<think>` blocks and `**`/headers from the reply.
- `soul.md` — the Guru's full persona AND a complete map of the app (every screen, the three units, gamification, how to give navigation answers). **Imported as plain text** via the wrangler Text rule (see `wrangler.toml`).
- `wrangler.toml` — Worker config. Public vars: `NVIDIA_MODEL`, `ALLOWED_ORIGINS`. The `NVIDIA_API_KEY` is a **secret** (not in this file).
- `package.json` — wrangler dev dep.

### 3.2 Config

| Setting | Value |
|---|---|
| Worker URL | `https://jainquest-guru.jainguru.workers.dev` |
| Cloudflare account | `yuvanshshah401@gmail.com` (wrangler is logged in on this machine) |
| Model | `meta/llama-3.1-8b-instruct` — ~2-4s replies. Picked for speed |
| Endpoint | `https://integrate.api.nvidia.com/v1/chat/completions` |
| Allowed origins | `https://jainquest-4297e.web.app`, `https://jainquest-4297e.firebaseapp.com`, `http://localhost:3000` |

**Benchmarked alternatives** (if quality slips, swap in by editing `NVIDIA_MODEL` and redeploying):

| Model | Latency | Notes |
|---|---|---|
| `meta/llama-3.1-8b-instruct` (current) | ~2s | Fast; weaker at multi-step instructions |
| `meta/llama-4-maverick-17b-128e-instruct` | ~11s | MoE, much better instruction-following |
| `meta/llama-3.3-70b-instruct` | ~30s | Too slow on free tier |
| `deepseek-ai/deepseek-v4-flash` / `-pro` | 30s+ | Reasoning models — emit hidden `<think>` blocks before answering |

### 3.3 How the web app uses it

- `app/guru/page.tsx` reads the Worker URL from Firestore **`app_config/ai.guruProxyUrl`**.
- POSTs `{ language, messages: [user/assistant turns only] }`. The Worker **drops any system message** the client sends — the persona is enforced server-side.
- If the URL is missing or the call fails, it falls back to canned offline answers (`offlineAnswer()`).

### 3.4 Deploy / maintain

From `guru-proxy/`:

```bash
# First-time only, on a new machine:
npx wrangler@latest login

# Set / rotate the NVIDIA key. The command is interactive: press Enter,
# WAIT for "Enter a secret value:", THEN paste the key. (You can also set
# it from the Cloudflare dashboard → Workers → jainquest-guru → Settings →
# Variables and Secrets — easier and less error-prone.)
npx wrangler secret put NVIDIA_API_KEY

# Deploy worker + soul.md (the Text rule bundles soul.md automatically):
npx wrangler deploy
```

**To change the Guru's persona/behaviour:** edit `soul.md` and `npx wrangler deploy`. No web app rebuild needed — the soul is server-side.

**To change the model:** edit `NVIDIA_MODEL` in `wrangler.toml` and redeploy.

**The wrangler Text rule** (in `wrangler.toml`) is what lets `import SOUL from './soul.md'` work in `worker.js`:
```toml
[[rules]]
type = "Text"
globs = ["**/*.md"]
fallthrough = true
```
Without `fallthrough = true` the default Text rules (for `.txt`/`.html`/`.sql`) silently break.

---

## 4. The Firebase backend

**Project ID**: `jainquest-4297e` · **CLI logged in as**: `yuvanshshah401@gmail.com` · `.firebaserc` pins the project so deploys can't target the wrong one.

### 4.1 Firestore schema (shared by Flutter + web)

```
users/{uid}                       # User profile (name, age, avatarEmoji, language, XP, hearts, streak, etc.)
  /progress/state                 # { completedLessons[], lessonProgress{}, earnedBadges[] }
  /notifications/prefs            # opt-in/out flags
  /settings/theme                 # 'dark' | 'light'
  /settings/reading               # { bookmarks: number[] } per book
  /attempts/{attemptId}           # spaced-repetition log per question

app_config/ai                     # { guruProxyUrl, geminiApiKey? (legacy, can be removed) }

forum_posts/{postId}              # { authorId, authorName, authorHandle, content, createdAt, likesCount, repliesCount, likedBy[] }
  /replies/{replyId}              # { authorId, authorName, authorHandle, content, createdAt, parentId }
```

### 4.2 Security rules (`firestore.rules`)

Already deployed (2026-05-18). Highlights:

- **`users/{uid}`**: signed-in users can READ any user doc (the leaderboard query needs it). Only the owner can WRITE. Subcollections (`progress`, `attempts`, `settings`, `notifications`) are owner-only for read+write.
- **`app_config/*`**: signed-in read; client writes denied (set from the Firebase console).
- **`forum_posts/{postId}`**: signed-in read. Create requires `authorId == request.auth.uid` with clean social counters. Delete = author only. Update = author OR any signed-in user changing **only** `likedBy`/`likesCount`/`repliesCount` (the like-toggle and reply-count transactions).
- **`/replies/{id}`**: signed-in read; create as author; delete as author; update forbidden.
- Catch-all default-deny at the bottom.

**Privacy tradeoff documented in the file**: the leaderboard exposes whatever's in user docs to any signed-in user. Hardening would require a separate public-profile mirror, which has to be coordinated with the Flutter app.

### 4.3 Cross-client parity (IMPORTANT)

The Flutter app and the web app read/write the **same Firestore documents**. Any change to:

- the schema (field names/types)
- gamification math (XP rewards, hearts regen, streak rules, spaced-rep intervals)

MUST be mirrored in:

- `project/lib/...` (Dart)
- `jainquest-web/src/lib/domain/...` (TS)

Treat the Dart code as source of truth when reconciling. Adding *additive* things (new badge IDs, new lesson IDs) is safe — the other client just ignores unknown ones.

### 4.4 Web Firebase config

`src/lib/firebase.ts` has the `jainquest-4297e` web config hardcoded with `process.env.NEXT_PUBLIC_FIREBASE_*` overrides. **Web API keys are not secrets** — access is governed by Firestore rules. No `.env.local` needed. The values exactly match `project/lib/firebase_options.dart`'s `web` config.

---

## 5. The Flutter mobile app (`project/`)

- Flutter + Dart, Riverpod (StateNotifier), Firebase Auth/Firestore, **Gemini AI** for its in-app Guru (separate from the web's Cloudflare Worker proxy)
- Same Firebase project, same Firestore schema, same gamification — so progress syncs
- Going to **Play Store** as the mobile target (Android first)
- The Flutter web build *was* deployed to Firebase Hosting in the past — that's been replaced by the Next.js web app (single Hosting site, last deploy wins)
- README in `project/` is stale; cross-check against the actual code

### Already-applied bug fixes
- `forum_service.dart`: regex escape `r'\\s+'` → `r'\s+'`
- `leaderboard_screen.dart`: query capped to 100 users
- `profile_screen.dart`: badges derived from progress (not just `earnedBadges`)
- `quiz_screen.dart`: re-entrancy guard against double-advance
- `storage_service.dart`: single `_loadAll()` with `Future.wait` of 6 reads + batched defaults

### Known build gotcha
Local Android builds need the **Android Studio JBR (JDK 21)** — `project/android/gradle.properties` points to `C:\Program Files\Android\Android Studio\jbr`. There's also a pre-existing Gradle wrapper version mismatch (`FlutterPlugin.kt: Unresolved reference: filePermissions`) that needs the Gradle wrapper updated.

---

## 6. Deployment

### 6.1 Web app

```bash
cd jainquest-web
npm run build                       # produces ./out/
firebase deploy --only hosting      # uploads out/ to Firebase Hosting
```

Live URL: **`https://jainquest-4297e.web.app`** (also `jainquest-4297e.firebaseapp.com`).

`firebase.json` is plain static hosting:
```json
{ "hosting": { "public": "out", "cleanUrls": true, "trailingSlash": false, "ignore": [...] },
  "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" } }
```

To deploy rules: `firebase deploy --only firestore:rules`.

### 6.2 Cloudflare Worker (Guru)

```bash
cd jainquest-web/guru-proxy
npx wrangler deploy
```

### 6.3 Post-deploy config (Firebase Console)

| Doc | Field | Value |
|---|---|---|
| `app_config/ai` | `guruProxyUrl` (string) | `https://jainquest-guru.jainguru.workers.dev` |

Also: **Auth → Settings → Authorized domains** — add any custom domain so Google sign-in works there.

### 6.4 Flutter

Going to Play Store — build with Android Studio's JBR. Pick up the Gradle wrapper version mismatch from Flutter docs.

---

## 7. Constraints & gotchas

### 7.1 OneDrive + Windows file locks
The project lives in OneDrive, which intermittently locks `out/__next._full.txt` during sync and breaks `npm run build` with `EBUSY`. Workarounds: **pause OneDrive sync** (right-click tray icon) before building, or move the project out of OneDrive entirely. `out/` and `.next/` are build artefacts and probably shouldn't be in OneDrive.

### 7.2 Static export means full-reload-per-navigation
Documented in §2.5. Don't try to "fix" it without moving off Firebase Hosting (free Spark) to Vercel or upgrading to Blaze with Firebase frameworks SSR. The Firestore cache + sessionStorage flag make it perfectly usable.

### 7.3 Don't put AI keys in the web app
Any key in client-side code or in client-readable Firestore is **stealable**. The Cloudflare Worker exists precisely to keep `NVIDIA_API_KEY` server-side. If you add another AI integration, do the same.

### 7.4 The Guru's 8B model occasionally drifts
Llama 3.1 8B is fast but its instruction-following is the weakest of the benchmarked models. The current `soul.md` has explicit rules to fix the known drift cases (inventing lesson titles, telling users to "open the app" when they're already in it, stating fake hearts counts, stalling on schedule requests). If quality slips further, escalate to `meta/llama-4-maverick-17b-128e-instruct` — one line in `wrangler.toml` + `wrangler deploy`.

### 7.5 Lesson content is English-only
Even when the UI is set to Hindi/Gujarati, the lesson text in `unit*.ts` stays English. This was an intentional scope decision. Translating it is a real authoring project, not a one-line change.

---

## 8. Common change recipes

### "Change the Guru's persona / behaviour"
Edit `guru-proxy/soul.md` → `cd guru-proxy && npx wrangler deploy`. **No web rebuild.**

### "Add a new lesson unit"
See §2.8. New file + 2 edits + build to verify.

### "Add a new sidebar screen"
1. Create `src/app/<name>/page.tsx` (a `'use client'` component, since the app is static-export — no server data fetching).
2. Add a `nav.<name>` key to `src/lib/i18n.ts` (en/hi/gu).
3. Append `{ href: '/<name>', key: 'nav.<name>' }` to the `NAV` array in `src/components/app-shell.tsx`.
4. `npm run build` — confirms the route generates as `○ (Static)`.

### "Change Firestore schema"
Mirror the change in **both** `jainquest-web/src/lib/domain/` (TS) AND `project/lib/...` (Dart). Update `firestore.rules` if access changes. Redeploy rules.

### "Rotate the NVIDIA key"
Cloudflare dashboard → Workers → `jainquest-guru` → Settings → Variables and Secrets → edit `NVIDIA_API_KEY` (toggle type to **Secret**) → Save. (Or `cd guru-proxy && npx wrangler secret put NVIDIA_API_KEY` — interactive: press Enter, **wait** for the prompt, then paste.)

### "Try a different AI model"
1. Get the exact model id from `curl -s "https://integrate.api.nvidia.com/v1/models" -H "Authorization: Bearer $KEY" | grep id`.
2. Edit `NVIDIA_MODEL` in `guru-proxy/wrangler.toml`.
3. `npx wrangler deploy`. Test by curling the Worker URL.

---

## 9. Future work / nice-to-haves

- **Avatar image upload** (vs emoji) — needs Firebase Storage (the data model already has `avatarUrl`).
- **More content** — Unit 4+, more reader books, more curated resources.
- **Streaming Guru replies** (word-by-word feel) — Worker streams from NVIDIA, client reads an SSE-ish stream. Real UX win even with a slower model.
- **Move the project out of OneDrive** to kill the EBUSY build issue once and for all.
- **Push notifications** for streak reminders (web push + FCM on mobile).
- **Improve forum moderation** beyond "delete own posts" — report, admin role.
- **Migrate hosting to Vercel** if you ever want true SPA navigation. Then you can drop the `output: 'export'` constraint and use Server Components freely.

---

## 10. Useful URLs / IDs at a glance

| Thing | Value |
|---|---|
| Firebase project | `jainquest-4297e` |
| Live web app | `https://jainquest-4297e.web.app` |
| Cloudflare Worker (Guru) | `https://jainquest-guru.jainguru.workers.dev` |
| Cloudflare account | `yuvanshshah401@gmail.com` |
| Cloudflare subdomain | `jainguru.workers.dev` |
| Current Guru model | `meta/llama-3.1-8b-instruct` |
| NVIDIA model catalog | `https://build.nvidia.com` |
| Firebase console | `https://console.firebase.google.com/project/jainquest-4297e` |
| Cloudflare dashboard | `https://dash.cloudflare.com` |
