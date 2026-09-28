import type { LectureSlide } from "../types";

export const CH6_CHECK_UNDERSTANDING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Check Your Understanding",
      "§6-check · a self-check before Kambaz DB",
    ],
  },
  {
    id: "purpose",
    title: "Pause and test Mongo APIs",
    kind: "content",
    bullets: [
      "The practice quiz draws **10 items** from this chapter",
      "It is a self-check, not part of the course grade",
      "Misses link back to the subsection you should reread",
      "Each new attempt draws a different 10",
    ],
  },
  {
    id: "topics",
    title: "What the quiz samples",
    kind: "content",
    bullets: [
      "Local `mongod`, Compass, `kambaz` collections",
      "`DATABASE_CONNECTION_STRING`, schemas, models, DAOs",
      "`async` routes, predicates, `$set`, Atlas `/kambaz?`",
    ],
  },
  {
    id: "lab-checklist",
    title: "Lab 6 before you quiz",
    kind: "content",
    bullets: [
      "Connection status, todos CRUD, then the Users screen",
      "Sign in as `iron_man`, open Profile, then ADMIN Users as `nick_fury`",
      "Atlas cluster can wait until after the quiz — §6.4 is Kambaz collections",
    ],
  },
  {
    id: "where",
    title: "Open the practice quiz",
    kind: "content",
    bullets: [
      "Book: `/book/ch6#sec-6-check` — the Check Your Understanding card",
      "Or `/book/practice` and pick the Chapter 6 lab bank",
      "Then come back here and move Kambaz onto Mongo",
    ],
  },
  {
    id: "recap",
    title: "Chapter 6 so far",
    kind: "content",
    bullets: [
      "Local Mongo, Mongoose connect, User schema and DAO",
      "Async account routes, ADMIN Users, filter and CRUD",
      "Is Atlas already connected? Then add courses, modules, and enrollments",
    ],
  },
  {
    id: "next-up",
    title: "Next: persist Kambaz courses",
    kind: "title",
    bullets: [
      "Same URLs as Chapter 5. Only the source of documents changes",
      "§6.4.1: course schema, `model.find`, then create / delete / update",
    ],
  },
];
