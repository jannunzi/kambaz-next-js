import type { Holiday } from "./types";

/**
 * University holidays that may close campus. Fall 2026 sections still
 * follow the chapter sequence that week. Attendance is not required on a
 * holiday meeting day; a lecture recording is posted instead.
 */
export const holidays: Holiday[] = [
  {
    start: "2026-09-07",
    end: "2026-09-07",
    label: "Labor Day",
  },
  {
    start: "2026-10-12",
    end: "2026-10-12",
    label: "Indigenous Peoples’ Day",
  },
  {
    start: "2026-11-11",
    end: "2026-11-11",
    label: "Veterans Day",
  },
  {
    start: "2026-11-25",
    end: "2026-11-29",
    label: "Fall break",
  },
];

export const thanksgivingBlackout = holidays[holidays.length - 1];

/**
 * Jose, 2026-09-16 — Piazza Post 17 (CS 4550; Khoury Startup Trek absence).
 * Location path (Post 17 / Giuseppe): Canvas course → Zoom Meetings →
 * Recordings, not Piazza Resources.
 * Jose, 2026-09-21 — Piazza Post 36 (Zhanyi, CS5610-02): Cloud Recordings,
 * after each lecture finishes processing. An empty list before or during
 * the class day is expected. Shared across all sections. Do not invent a
 * hosting URL.
 */
export const lectureRecordingNote =
  "All lectures are recorded and available to enrolled students. They appear in your Canvas course under Zoom Meetings → Cloud Recordings after each lecture finishes processing — not under Piazza Resources. An empty list before or during the class day is expected. Missing a lecture for a legitimate reason is fine — use the recording. Recordings are not a general replacement for attending live lectures.";

export const holidayMeetingNote =
  "University holidays — including Labor Day, Indigenous Peoples’ Day, Veterans Day, and fall break (November 25–29; classes resume November 30) — do not skip a lecture week. Fall break sits in Chapter 6 week 1 (week of Nov 23); Veterans Day sits in Chapter 5 week 1 (week of Nov 9). If a holiday falls on your meeting day, you are not required to attend. A recording of the lecture will be posted, and you are responsible for that content.";
