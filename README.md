# webdev-client

Next.js client for CS 4550 / CS 5610 Web Development. Students build **Kambaz**, a Canvas-inspired LMS UI, in this repo. The sibling Express API is **webdev-server** (nested here as a convenience copy; assignments still treat it as its own GitHub repository).

The course homepage (`/`) redirects to `/syllabus`. Kambaz stays on its existing routes (`/account/signin`, `/dashboard`, `/courses/…`). The live book is at [https://kambaz.dev](https://kambaz.dev).

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

`npm test` needs Node.js 22 or newer (`package.json` `"engines": { "node": ">=22" }`).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the syllabus. Kambaz is at [http://localhost:3000/account/signin](http://localhost:3000/account/signin).

For Lab 5–6 LiveDemos, run the Express sibling in a second terminal:

```bash
cd webdev-server
npm install
npm run dev
```

Or from this repo root: `npm run server:dev`. Root `npm test` runs
`webdev-server/mongo-listen.test.js`, so that `npm install` is required
first.

## Book term pages

First-use technology terms in the course book (`OfficialLink`) open an in-app
page at `/book/terms/[slug]` — for example
[`/book/terms/react`](http://localhost:3000/book/terms/react) or
[`/book/terms/next-js`](http://localhost:3000/book/terms/next-js). Each page
shows the official site plus relevant YouTube explainers.

To populate videos, set **`YOUTUBE_API_KEY`** (YouTube Data API v3) in `.env`
or the Vercel project. Without the key the page still works: official link plus
a “Search on YouTube” fallback. Results are cached for 24 hours.

## Graded quizzes (Clerk + MongoDB Atlas)

Anyone may browse the book, syllabus, labs, practice, assignments, and terms —
signed in or not. **Only Canvas-roster students** can start or submit a graded
quiz at `/quizzes/take/q1`. Author review (answers shown) at `/quizzes` and
`/quizzes/q1`, and staff attempt review at `/quizzes/staff/q1/attempts`,
are **staff only** (`INSTRUCTOR_EMAILS` + `TA_EMAILS`, same as `/people`).

If Clerk or Atlas env vars are missing, those take routes show a clear
“not configured” message. The rest of the site keeps working.

### What Jose creates

1. **Clerk** (https://dashboard.clerk.com): create an application for this
   course site. Copy the publishable key and secret key. Add the production
   (and preview) origin as an allowed URL. Optional: restrict sign-up to
   `northeastern.edu` later; the roster check is the grade gate.
2. **MongoDB Atlas**: create a cluster, a database user, and a Network Access
   entry that allows Vercel (or `0.0.0.0/0` if you prefer allow-all + strong
   user password). Copy the `mongodb+srv://…` connection string. The app uses
   database `web-dev` (override with `MONGODB_DB`) and collections
   `quiz_attempts`, `quiz_access_overrides`, `quiz_grade_overrides`,
   `canvas_roster` and `assignment_submissions` (URLs plus `staffGrade`).
   `assignment_progress` is unused and is left in place.
3. **Vercel** project env (Production + Preview + Development):
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
   `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`,
   `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `MONGODB_URI`, `MONGODB_DB=web-dev`,
   `INSTRUCTOR_EMAILS=jannunzi@gmail.com`. Optional: `TA_EMAILS` (empty
   until you add TAs). For website coding items, set **`XAI_API_KEY`**
   (same name SnapTools uses). Optional: `XAI_BASE_URL`
   (default `https://api.x.ai/v1`), `XAI_MODEL` (default `grok-4-latest`).
   The local lenient grader still scores typical answers if the key is
   missing. Redeploy after saving.

Locally, copy `.env.example` to `.env.local` and fill the same keys. Do not
commit `.env.local`.

### Load / refresh the Canvas roster

Export **People** (or the gradebook) from Canvas as CSV. Keep columns
`Email` (or `SIS Login ID` if it is an email), `ID` (Canvas user id),
`Student` / `Name`, and optionally `SIS User ID` and `Section`.

```bash
npm run roster:import -- path/to/canvas-people.csv
# replace every row instead of upserting:
npm run roster:import -- --replace path/to/canvas-people.csv
```

JSON also works: `[{ "email": "jane.doe@northeastern.edu", "canvasUserId": "12345", "name": "Jane Doe" }]`.
A sample file lives at `scripts/fixtures/canvas-roster.example.csv`.

Matching is case-insensitive and treats Northeastern mailbox aliases as the
same person (`northeastern.edu`, `husky.neu.edu`, `neu.edu`), including
plus-address tags. Clerk primary, verified, remaining, and SSO/external
account emails are all considered.

While testing a single account, you can set `CANVAS_ROSTER_EMAILS` instead of
importing.

### Demo students (staff A1 testing)

Two fake `canvas_roster` rows exist so staff can Sign up / Sign in and see
the A1 GitHub + Vercel fields without using real student PII. Roster
matching is the email string only — these are **not** `@northeastern.edu`
addresses.

| Name | Email | Section |
| --- | --- | --- |
| Ada Lovelace | ada@ada.com | CS4550 CRN 11464 |
| Bob Marley | bob@bob.com | CS4550 CRN 11464 |

A1 URL submit matches these emails in memory (same path as
`CANVAS_ROSTER_EMAILS`). Staff do **not** have to seed Atlas before Ada or
Bob can see the GitHub / Vercel fields. Opening `/assignments/a1` while
signed in as either address also upserts the rows when Mongo is reachable.

They can still be written to Atlas (`canvas_roster`) so they appear on
People like imported students:

```bash
# Local or CI machine that can reach the same Atlas cluster as Vercel:
npm run roster:seed-demo
```

Or, signed in as staff on `/people`, click **Ensure demo students**.
Then create course-website accounts with those exact emails (`ada@ada.com`
/ `bob@bob.com`) and open `/assignments/a1`. JSON fixture:
`scripts/fixtures/demo-roster.json`.

If Atlas already has the old `ada.lovelace@northeastern.edu` /
`bob.marley@northeastern.edu` demo rows, run the seed (or the People
button) again — it upserts `ada@ada.com` and `bob@bob.com`. Delete the
old Northeastern demo docs in Atlas if they are still listed on People.

A signed-in visitor who is **not** on the roster sees
“Your account isn’t on the Canvas roster for this course” and **no** graded
attempt is written.

CSV upload in the UI can come later; this script is the MVP refresh path.

### Staff People (`/people`)

`/people` lists every `canvas_roster` document, grouped by Canvas section
(name, email, SIS / Canvas ids, counts). It is **not** the Kambaz lab People
demo under `/courses/[cid]/people`.

Anyone can Clerk sign in or sign up on the public site. There is **no**
separate instructor/TA registration. Staff status is **only** the env
allowlists, matched server-side against the signed-in Clerk emails:

- **`INSTRUCTOR_EMAILS`** — full instructor powers (People, author-review
  question banks, and staff attempt review). Default if unset: `jannunzi@gmail.com`.
- **`TA_EMAILS`** — TAs see the same People, author-review, and staff
  attempt views. Empty by default.

`canvas_roster` only gates **graded quizzes**. Being on the student roster
does **not** grant People or author-review access.

A signed-out visitor is asked to sign in. A signed-in user who is not staff
gets 403 and the roster / answer key is not loaded. A staff-only “People”
link appears on the question-bank index and the graded-quiz take layout.
Author-review links are hidden from student-facing surfaces.

#### Vercel: Jose (instructor)

1. Project → Settings → Environment Variables.
2. Set `INSTRUCTOR_EMAILS=jannunzi@gmail.com` for Production, Preview, and
   Development. Add another Clerk address (comma-separated) if you sign in
   with it, e.g. `j.annunziato@northeastern.edu`.
3. Add `TA_EMAILS` as an empty value (or omit it) until you have TAs.
4. Redeploy production after saving.

#### Vercel: add a TA (no invite UI)

1. The TA creates a Clerk account on the live site with the email they will
   use (Sign up on https://kambaz.dev).
2. Jose adds that **exact** email to `TA_EMAILS` on Vercel (Production;
   Preview too if they use a preview URL). Comma-separate multiple TAs.
3. Redeploy (or restart) so the new env value is live.
4. The TA refreshes `/people` and should see the roster.

Do not put student emails on either allowlist. There is no in-app invite
or email sender.

### View as student

Jose is staff (`jannunzi@gmail.com`) and is **not** on the Canvas student
roster. A second Clerk user with the same email is awkward, so this is an
**app-level view mode**, not a second Clerk session.

Signed-in staff see a sticky **Viewing as: Instructor | Student** bar on
`/people`, author review (`/quizzes`, `/quizzes/q1`), graded take
(`/quizzes/take`), and staff attempts (`/quizzes/staff`). Non-staff users never see it.

- **Instructor** (default): current staff behavior.
- **Student**: People, author review, and staff attempts behave like a
  non-staff user (403; answer keys and other students’ submissions are
  not loaded). `/quizzes/take/*` treats the actor as a
  synthetic roster match named **Demo Student**
  (`demo.student@webdev.local`). That dummy is **not** written to
  `canvas_roster`. You can submit to smoke-test the exam UI; the score is
  shown in memory with **Impersonation — attempt not saved**. No
  `quiz_attempts` document is inserted.

The mode is an httpOnly cookie (`webdev_view_mode`) set only by a server
action that checks the staff allowlist first. Reading the cookie also
requires a signed-in staff email, so a forged client cookie does nothing
for students. Switch back with the same bar on every gated surface.

Optional: set `IMPERSONATION_STUDENT_EMAIL` to override the dummy address.

### Enable graded quizzes (staff only)

Syllabus unlock/due dates are **display only**. A graded quiz does **not**
open because “now” is inside that window. Staff (`INSTRUCTOR_EMAILS` /
`TA_EMAILS`) enable or disable each quiz **per section** on `/quizzes/take`
(Enable / Disable / Off). While disabled, students see the dates and cannot
start or submit. Enable CS4550 to test with `ada@ada.com` / `bob@bob.com`,
then Disable again.

### Answers visible to students (staff only)

The class calendar still decides the **default**: answer keys stay hidden
until the scheduled review week (`answers_open` / `answers_reopen`), then
hide again. That is the current product default (Off outside those
windows). Staff can **override** it per quiz and section on
`/quizzes/take` (same panel as Enable): **Answers visible to students:
On / Off / Follow schedule**.

- **On** — students who already submitted see correct/incorrect marks and
  expected answers, even outside the calendar window.
- **Off** — those marks, solutions, and the answer key stay hidden, even
  during the review week. The attempt score still shows.
- **Follow schedule** (default / unset) — calendar windows only.

Staff attempt review at `/quizzes/staff/q1/attempts` always shows answers,
regardless of this flag. Existing `quiz_attempts` documents are not
changed.

**Schema (`web-dev.quiz_access_overrides`, unique `{ quizId, sectionId }`):**

```
{
  "quizId": "q1",
  "sectionId": "CS4550",
  "mode": "open" | "closed" | "schedule",   // take enable (existing)
  "answersVisible": "on" | "off" | "schedule", // student answer key
  "updatedBy": "jannunzi@gmail.com",
  "updatedAt": ISODate
}
```

`answersVisible` omitted or `"schedule"` follows the calendar. Take
`mode` and `answersVisible` are independent fields on the same document.

**How to try:** Sign in as staff → `/quizzes/take/q1` → for CS4550 set
**Answers visible to students: On** → submit (or reopen) as a student →
review shows marks and the key → staff sets **Off** → refresh the take
URL → score remains, marks/key are gone. Then open
`/quizzes/staff/q1/attempts` and confirm staff still sees answers.

### Staff attempt review + grade overrides

Staff (`INSTRUCTOR_EMAILS` / `TA_EMAILS`, instructor view — not **View as
student**) browse submissions at **`/quizzes/staff/q1/attempts`**. The
graded take page (`/quizzes/take/q1`) also links here for signed-in staff.

**How to try:** Sign in as staff → open `/quizzes/staff/q1/attempts` →
select `asd@asd.com` → see that student’s answers with correct / wrong /
partial marks → override a question (this student, all students who drew
it, or custom points for that student). Existing Atlas documents are
updated in place. **Do not delete** `asd@asd.com`’s Q1 attempt in
`web-dev.quiz_attempts`.

**Gate.** Same as People / author review: Clerk sign-in plus an allowlisted
email. `INSTRUCTOR_EMAILS` defaults to `jannunzi@gmail.com` when unset.
`TA_EMAILS` is empty until you add TAs. Impersonation hides the browser
and blocks writes. `MONGODB_URI` + `MONGODB_DB` (default `web-dev`) are
required to load attempts.

**Scoring.** Auto-grade is always recomputed from the stored responses (and
stored coding `scoreRatio`). Then class-wide overrides apply, then
per-student overrides win. `quiz_attempts.score` is rewritten to the
effective total. Original `answers[]` (response + auto marks) stay as
submitted.

**Schema (`web-dev`):**

`quiz_attempts.overrides` (optional, keyed by question id):

```
{
  "q1-g01-01": {
    "kind": "correct" | "wrong" | "points",
    "points": 7.5,          // used when kind === "points"
    "updatedBy": "jannunzi@gmail.com",
    "updatedAt": ISODate
  }
}
```

`quiz_grade_overrides` (new; unique `{ quizId, questionId }`):

```
{
  "quizId": "q1",
  "questionId": "q1-g01-01",
  "scope": "all_students",
  "kind": "correct" | "wrong",
  "updatedBy": "jannunzi@gmail.com",
  "updatedAt": ISODate
}
```

Custom points are per-student only. Class-wide is correct / wrong for
everyone who drew that question id.

### Exam sampling

`/quizzes/take/q1`–`q6` each draw **8 traditional items plus 2 short coding
items** (one form/FIB-style, one implement-style), 10 questions / 100 points.
The draw is seeded by Clerk user id + bank id so a refresh keeps the same
items. Correct answers are stripped from the client payload and graded on
submit.

Coding items use a **lenient local grader** (misspellings, missing slashes,
attribute order, whitespace) and, when `XAI_API_KEY` is set, xAI Grok as a
backup that can only raise the score. **Canvas QTI fallback stays
traditional-only** — Canvas cannot run that grader. X1/X2 remain 36
traditional groups.

### Answer review windows (same student URL)

After submit, students return to **the same URL** (`/quizzes/take/q1`, etc.).
Unlock is **class-wide** (wall-clock ET → stored as ISO UTC in
`lib/quiz-exam/schedule.ts`), not “one week after *your* submit”.

| Phase | What the student sees |
| --- | --- |
| Take open, no attempt | Existing exam form. CS 5610-09 is open Monday through Sunday 11:59pm ET. In-person sections take the quiz at the end of lecture that week. |
| Submitted, before answers open | Score / submitted status. Answers start **{answersOpenAt}** (Monday 00:00 ET after the due Sunday) and stay available for one week, until **{answersCloseAt}**. |
| First answer week | Full review of their drawn attempt with correct answers, until **{answersCloseAt}**. |
| After that week | Answers hidden until the one-week exam-prep reopen (`midtermAt − 7d` for Q1–Q3, `finalAt − 7d` for Q4–Q6). |
| During the take window | The key stays hidden even if a whole-class window has started. Staff can show it with `answersVisible: on`. |

The server clock decides the phase. `correctReveal` is omitted from HTML and
from the submit payload unless the phase is `answers_open` or `answers_reopen`.

Fall 2026 first answer windows open Monday 00:00 ET after the due-week
Sunday and last 7 days (main’s rule, shifted with the take week). Q6 stays
after X2:

- Q1: 2026-10-05 → 2026-10-12
- Q2: 2026-10-19 → 2026-10-26
- Q3: 2026-11-02 → 2026-11-09
- Q4: 2026-11-16 → 2026-11-23
- Q5: 2026-11-30 → 2026-12-07
- Q6: 2026-12-21 → 2026-12-28

Take windows are the class-wide website window (Monday 00:00 ET unlock →
Sunday 23:59 ET lock). That Monday–Sunday span is the CS 5610-09 online
open week (attendance is not required). In-person sections still take the
quiz at the end of their meeting that week. Q1: unlock 2026-09-28, lock
2026-10-04 23:59 ET.

**Exam dates** live in `COURSE_EXAMS` in the same module:

- `midtermAt` — Q1–Q3 answer-reopen close `2026-11-05T05:00:00.000Z` (Thu
  2026-11-05 00:00 ET). `/quizzes/take/x1` is a coming-soon stub.
- `finalAt` — syllabus **X2** week `2026-12-14T05:00:00.000Z`
  (2026-12-14 00:00 ET). `/quizzes/take/x2` is a coming-soon stub.
  University finals are 2026-12-14–20 on the syllabus.

Canvas package -20 grade shells for Q1–Q6 and X1/X2 are **100 points**
each. The website scores as a percent and exports to Canvas out of 100.

A Canvas **QTI fallback** (real questions, website URL + staff-permission
blurb) is generated with `npm run canvas:export-qti`. See
`scripts/canvas-fallback/README.md`. Students still take the website
unless staff unlock Canvas.

Per-section answer windows are PR #191. This branch only moves quiz take
weeks. If a whole-class answer or exam-prep window would open before that
quiz’s take lock, the key stays hidden unless staff set `answersVisible`
to `on`. X1 and X2 take dates are unchanged.

Staff **View as student** still does not persist an attempt. Impersonation can
exercise the form even outside the take window; answers still follow the
server phase (no leak while waiting/closed).

### Next step (not in this PR)

Instructor CSV export of `quiz_attempts` for Canvas grade import. Storing
impersonation attempts (e.g. `impersonation: true`) is deferred.

## Assignments hub

`/assignments` lists A1–A6 from the syllabus. Each `/assignments/aN` page
links to the matching book chapter (`/book/ch1` for A1, and so on).
`/assignments/a1` and `/assignments/a2` include Delivery / Lab / Kambaz
checklists with section deep links. A3–A6 are syllabus placeholders until
those rubrics are authored.

Signed-in students save GitHub and Vercel URLs on `assignment_submissions`
(keyed by Clerk user + assignment). Checklist checkmarks are not stored in
the browser or in Mongo. Run computes them for the current page. Staff Save
writes `assignment_submissions.staffGrade` for that student (the same field
the staff grader already used). Older pass/fail overrides still load. Run
never changes a saved grade. `assignment_progress` is unused.
The UI never mentions the auth vendor — the button says “Sign in with your
Canvas email.”

**A1 and A2 URL submit.** Rostered students (matched by Canvas email,
including Northeastern aliases) and staff can save a public
Vercel deployment URL on `/assignments/a1` and `/assignments/a2` (GitHub is
optional for A1. A2 Save and Run require a `…/tree/a2` GitHub URL that loads,
and the Vercel host’s first label must match `-git-a2` and end in `.vercel.app`).
Off-roster signed-in users see an explicit message instead of a blank form.
Documents live in `assignment_submissions` (user + assignment id). **Save URLs**
stores those URLs only. **Run** normalizes the deploy to its origin, fetches
Labs and the assignment’s checklist screens, then maps rubric rows to
pass/fail from `wd-*` ids. Rows the DOM cannot settle (A1’s two highlighted
On your own rows, and every A2 Kambaz styling row) stay manual: checked by
staff at grading, and students cannot tick them for points. GitHub
format/public checks run only when a GitHub URL is provided. Name checks
read Labs HTML, not just the submitted landing page. This is still not Canvas
grade export. Staff **View as student** can exercise the form; the submission
is not saved.

Canvas assignment descriptions should **not** paste the website rubric.
Point students at the live pages. Suggested student copy (HTML helpers in
`lib/assignments/canvas-copy.ts`):

- https://kambaz.dev/assignments/a1
- https://kambaz.dev/assignments/a2
- https://kambaz.dev/assignments/a3
- https://kambaz.dev/assignments/a4
- https://kambaz.dev/assignments/a5
- https://kambaz.dev/assignments/a6

The IMSCC cartridge is not in this repo (Jose’s `canvas-fall` tooling).
Updating those assignment HTML descriptions is a follow-up package.
Quiz fallback QTI for package -21 is generated here
(`scripts/canvas-fallback/`) for Shakespeare to pack from `canvas-fall`.

## Slides hub

`/slides` groups decks by book chapter and numbered book section (the same
spine as the course book). `/lectures` and `/lectures/[slug]` redirect to
`/slides`. `canvasLecture` stays on each deck as unused Canvas mapping metadata
and is not shown in the hub or deck chrome.
Each `/slides/[slug]` page is a keyboard-driven slide deck. Slugs are
unchanged — see `LECTURE_SLUGS` in `lib/lectures/types.ts`.

New decks should set `chapter`, `topicId` (from `LECTURE_TOPICS`),
`bookSectionId` (book TOC anchor such as `sec-2-3-1`), and optional
`canvasLecture` in `lib/lectures/catalog.ts`. `bookHref` is derived as
`/book/chN#${bookSectionId}`.

Catalog and slide data live in `lib/lectures/`. The React shell is
`app/slides/_components/LectureDeckShell.tsx`. Text-only slides use
`spacious` type (larger titles and bullets); slides with a `diagram` or
`embed` stay `dense`. These routes are not nested under `/book`.

Press **f** (or the Fullscreen button) for presentation mode; **Esc** exits.
Add `?fullscreen=1` to retry fullscreen after the next click (browsers require
a gesture). Slide figures are authored SVG/React in
`app/slides/_components/diagrams/`. Index thumbs are branded SVG cards in
`public/lectures/thumbs/` — see `public/lectures/README.md`. Commands and
source live in `LectureSlide.code` / `codeBlocks`, not as bullet items.

### Instructor edit mode (MVP)

Add `?edit=1` to the hub (`/slides?edit=1`) or a deck
(`/slides/installing-nodejs?edit=1`). A discreet **Edit** control does the
same. Students without the query keep the read-only experience.

**Pilot deck.** `installing-nodejs` is authored on the typed block model
(`slide.blocks`: `bullets` | `code` | `component`). Other decks stay on the
legacy shape; the shell adapts them for read-only rendering.

**Blocks.** In edit mode: select, add, remove, reorder (Up/Down). Font size
(`sm` / `md` / `lg` / `xl`) on bullets and code — `md` (and unset) keep the
pre-editor lecture rem defaults so student/presenter view stays large
enough to teach from. Frame size (`sm` / `md` / `lg`) on code and live
embeds. Component blocks pick from a registry — Ch1 book embeds plus
existing lecture embeds — never an arbitrary component string.

**Hub.** New deck creates a slug + starter blocks deck. New decks land in
**Chapter 1 → Draft decks** (overlay topic, not a book TOC section). Up/Down
reorders cards in a topic. Deck titles are editable (hub card + deck chrome).
New decks use `/lectures/thumbs/draft.svg`.

**Drafts.** Save writes JSON to `localStorage` (`webdev.slides.deck.<slug>`
and `webdev.slides.hub.v1`). Reset to authored clears that draft. After
save, the same browser sees the draft in normal mode too. There is no CMS.
**Commit to the repo / PR is a follow-up.**

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The course book deploys to [https://kambaz.dev](https://kambaz.dev). Students deploy their own `webdev-client` fork with the [Vercel Platform](https://vercel.com/new) and **webdev-server** separately (Render or Heroku), then point `NEXT_PUBLIC_HTTP_SERVER` at that origin.
