# Canvas QTI fallback (Fall 2026)

**Graded quizzes Q1–Q6 are taken in Canvas** (Jose, Oct 7 2026). Students cannot start or submit them on the course website. These files fill Canvas Q1–Q6 with **real traditional questions**. Exams X1/X2 are still taken on the course website; their Canvas copies are a staff-gated backup if the site is down, taken **only with instructor/TA permission**.

**Coding items are website-only.** Canvas cannot call the local / xAI coding grader, so this exporter never includes the Q1–Q6 form/FIB or implement coding pools. A Canvas fallback quiz is 10 traditional groups (MC / TF / FIB). The website quiz is 8 traditional + 2 coding.

## Rebuild

```bash
npm run canvas:export-qti
# or: npx tsx scripts/export-canvas-fallback-qti.ts --out scripts/canvas-fallback/out
```

Writes (gitignored) `scripts/canvas-fallback/out/`:

| Path | What |
| --- | --- |
| `qti/q1.xml.qti` … `x2.xml.qti` | Full Canvas **non_cc** QTI (question groups) |
| `non_cc_assessments/gwebdev_*_fallback.xml.qti` | Same files, IMSCC folder name |
| `gwebdev_*_fallback/assessment_qti.xml` + `assessment_meta.xml` | Per-quiz Canvas CC folder |
| `assessment_meta/*.assessment_meta.xml` | Quiz settings + student instructions |
| `qti-zip/imsmanifest.xml` + `q1.xml` … | Ready to zip for **QTI .zip** import |
| `index.json` | Group/question counts |

Checked in: `sample/q1-acronyms-group.fragment.xml` (one Q1 group, same XML shape).

## Sources

| Canvas quiz | Bank |
| --- | --- |
| Q1 | Graded website **traditional** bank `lib/question-bank/q1` (16 topic groups), **sampled to 10** at export time. Website take instead draws 8 of these plus 2 coding items. |
| Q2–Q6 | Practice banks `app/book/quizzes/` (ch2 CSS … ch6 Mongo), grouped by book section, **sampled to 10** groups; pick **1** random item per group |
| X1 | 36 groups: 12 from each of Q1–Q3 source banks |
| X2 | 36 groups: 12 from each of Q4–Q6 source banks |

Shared counts live in `lib/quiz-exam/draw-counts.ts` (`QUIZ_DRAW_COUNTS`, `QUIZ_TIME_LIMIT_MINUTES`). Website `/quizzes/take` uses the same sized banks as this exporter.

Stems are the **standalone** wording (no Lab / Kambaz / `wd-*` / book-section framing).

Instructions in `assessment_meta.xml`:

- **Q1–Q6:** "This graded quiz is taken here in Canvas, not on the course website." No course-website link.
- **X1/X2:** the website take URL **and**

> If the website quiz is unavailable, ask your instructor or TA for permission to take this Canvas quiz instead.

Quizzes are emitted **unpublished** (`available=false`, `workflow_state=unpublished`), 100 points, 1 attempt, answers hidden. Q1–Q6 have a **30-minute** `time_limit`; X1/X2 have **90 minutes**.

## QTI shape (do not invent a new one)

This matches Canvas LMS `lib/cc/qti/qti_generator.rb` when `for_cc: false` (the file that lands in `non_cc_assessments/*.xml.qti`):

- `questestinterop` / QTI 1.2 ASI
- `assessment` → `section ident="root_section"`
- One child `section` per topic with `selection_ordering` → `selection_number` 1 and `points_per_item`
- Items use Canvas `question_type` metadata: `multiple_choice_question`, `true_false_question`, `short_answer_question`, `fill_in_multiple_blanks_question`

Common Cartridge `assessment_qti.xml` **cannot** express question groups (one section only). A full IMSCC must include the `non_cc_assessments` copy or Canvas will flatten groups.

## Import into Jose’s Fall 2026 course

Package **-20** already created **empty** 100-point Q1–Q6 / X1 / X2 shells with website-only descriptions. This exporter uses **new** identifiers (`gwebdev_q1_fallback`, …). Canvas will **not** overwrite those shells on import.

### Safest path (recommended)

1. Course → **Settings → Import Course Content → QTI .zip file**.
2. Zip the contents of `scripts/canvas-fallback/out/qti-zip/` (`imsmanifest.xml` + `q1.xml` … `x2.xml` at the zip root — not a parent folder).
3. Import. Canvas creates **new** Classic Quizzes (unpublished) with question groups.
4. Delete or leave unpublished the empty package-**-20** shells so the gradebook has one Q1, one Q2, …
5. Point the gradebook / assignment group at the new quizzes. Publish a quiz only when staff grant a student permission to take Canvas.

Do **not** import a full course `.imscc` over the live Fall 2026 course. That duplicates modules and assignments.

### If Shakespeare is packing IMSCC **-21** from `/workspace/canvas-fall`

Copy question XML into the **existing** quiz folders and **keep the package -20 identifiers** if the goal is an in-place update:

1. Unzip the current `-20` cartridge (or the canvas-fall working tree).
2. For each Q1–Q6 / X1 / X2 quiz GUID already in `imsmanifest.xml` / `module_meta.xml`:
   - Replace `non_cc_assessments/<old-guid>.xml.qti` with our QTI (change only the `assessment ident` / `quiz identifier` to the **old** GUID).
   - Replace `<old-guid>/assessment_meta.xml` description with our HTML (keep title, dates, points, assignment identifierrefs from -20).
   - Leave `<old-guid>/assessment_qti.xml` as a CC stub, or copy our QTI there too (Canvas prefers `non_cc_assessments` when `course_settings/canvas_export.txt` is present).
3. Re-zip root-relative and import as Common Cartridge **into a clone / sandbox first**.
4. On the live course, importing **-21** with the **same identifiers** as **-20** typically **updates** those quizzes. If identifiers differ, Canvas **adds** a second set — then delete the empties.

Re-importing QTI with *new* identifiers always **adds** quizzes. It does not merge into an empty shell. If a previous fallback import already landed, delete those extras before importing again.

## Identifiers emitted here

| Quiz | `ident` |
| --- | --- |
| Q1 | `gwebdev_q1_fallback` |
| Q2 | `gwebdev_q2_fallback` |
| Q3 | `gwebdev_q3_fallback` |
| Q4 | `gwebdev_q4_fallback` |
| Q5 | `gwebdev_q5_fallback` |
| Q6 | `gwebdev_q6_fallback` |
| X1 | `gwebdev_x1_fallback` |
| X2 | `gwebdev_x2_fallback` |
