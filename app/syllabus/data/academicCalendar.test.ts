import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  academicCalendarDateLabel,
  academicCalendarDayLabel,
  academicCalendarEvents,
  academicCalendarIntro,
  academicCalendarSource,
} from "./academicCalendar.ts";
import { holidayMeetingNote, holidays, lectureRecordingNote } from "./holidays.ts";
import { isoWeekday, weekdayName } from "./dates.ts";
import { semester } from "./course.ts";

const BY_DATE = Object.fromEntries(
  academicCalendarEvents.map((event) => [event.date, event]),
);

describe("Fall 2026 academic calendar", () => {
  it("lists the course-relevant registrar dates in order", () => {
    assert.deepEqual(
      academicCalendarEvents.map((event) => event.date),
      [
        "2026-09-07",
        "2026-09-09",
        "2026-09-22",
        "2026-10-12",
        "2026-11-11",
        "2026-11-25",
        "2026-11-30",
        "2026-12-13",
        "2026-12-14",
        "2026-12-20",
      ],
    );
    for (let i = 1; i < academicCalendarEvents.length; i += 1) {
      assert.ok(
        academicCalendarEvents[i]!.date >= academicCalendarEvents[i - 1]!.date,
        "events must stay in calendar order",
      );
    }
  });

  it("matches official no-class holidays and fall break", () => {
    assert.equal(BY_DATE["2026-09-07"]?.kind, "holiday");
    assert.equal(BY_DATE["2026-09-07"]?.noClasses, true);
    assert.match(BY_DATE["2026-09-07"]?.label ?? "", /Labor Day/);
    assert.equal(weekdayName(isoWeekday("2026-09-07")), "Monday");

    assert.equal(BY_DATE["2026-10-12"]?.kind, "holiday");
    assert.equal(BY_DATE["2026-10-12"]?.noClasses, true);
    assert.match(BY_DATE["2026-10-12"]?.label ?? "", /Indigenous Peoples/);
    assert.equal(weekdayName(isoWeekday("2026-10-12")), "Monday");

    assert.equal(BY_DATE["2026-11-11"]?.kind, "holiday");
    assert.equal(BY_DATE["2026-11-11"]?.noClasses, true);
    assert.match(BY_DATE["2026-11-11"]?.label ?? "", /Veterans Day/);
    assert.equal(weekdayName(isoWeekday("2026-11-11")), "Wednesday");

    const fallBreak = BY_DATE["2026-11-25"];
    assert.equal(fallBreak?.kind, "break");
    assert.equal(fallBreak?.noClasses, true);
    assert.equal(fallBreak?.endDate, "2026-11-29");
    assert.match(fallBreak?.label ?? "", /Fall break/);
    assert.equal(BY_DATE["2026-11-30"]?.label, "Fall classes resume");
  });

  it("includes term start, add/drop, last class day, and the final exam window", () => {
    assert.equal(BY_DATE["2026-09-09"]?.date, semester.firstDayOfClasses);
    assert.match(BY_DATE["2026-09-09"]?.label ?? "", /First day of full-semester/);
    assert.match(BY_DATE["2026-09-22"]?.label ?? "", /add\/drop/);
    assert.equal(BY_DATE["2026-12-13"]?.date, semester.lastDayOfClasses);
    assert.match(BY_DATE["2026-12-13"]?.label ?? "", /Last day of full-semester/);
    assert.equal(BY_DATE["2026-12-14"]?.date, semester.finalExamPeriod.start);
    assert.equal(BY_DATE["2026-12-20"]?.date, semester.finalExamPeriod.end);
    assert.match(BY_DATE["2026-12-14"]?.label ?? "", /final exam period/);
    assert.match(BY_DATE["2026-12-20"]?.label ?? "", /final exam period/);
  });

  it("stays student-facing: no faculty grade deadline or Session A/B minutiae", () => {
    const labels = academicCalendarEvents.map((event) => event.label).join(" ");
    assert.doesNotMatch(labels, /faculty grade/i);
    assert.doesNotMatch(labels, /Session A/);
    assert.doesNotMatch(labels, /Session B/);
    assert.doesNotMatch(labels, /I Am Here/);
    assert.doesNotMatch(labels, /initial-third|middle-third|final-third/);
    assert.match(academicCalendarIntro, /Session A\/B/);
    assert.match(academicCalendarSource.href, /registrar\.northeastern\.edu/);
    assert.equal(
      academicCalendarDateLabel(BY_DATE["2026-11-11"]!),
      "November 11, 2026",
    );
    assert.equal(academicCalendarDayLabel(BY_DATE["2026-11-11"]!), "Wednesday");
    assert.equal(
      academicCalendarDateLabel(BY_DATE["2026-11-25"]!),
      "November 25, 2026 – November 29, 2026",
    );
    assert.equal(academicCalendarDayLabel(BY_DATE["2026-11-25"]!), "Wednesday–Sunday");
  });

  it("keeps agenda holiday ranges aligned with the registrar break", () => {
    const fallBreak = holidays.find((holiday) => holiday.label === "Fall break");
    assert.equal(fallBreak?.start, "2026-11-25");
    assert.equal(fallBreak?.end, "2026-11-29");
    assert.match(holidayMeetingNote, /November 25–29/);
    assert.match(holidayMeetingNote, /November 30/);
    assert.match(holidayMeetingNote, /not required to attend/);
    assert.match(holidayMeetingNote, /recording of the lecture will be posted/);
    assert.match(holidayMeetingNote, /responsible for that content/);
    assert.match(holidayMeetingNote, /do not skip a lecture week/);
    assert.doesNotMatch(holidayMeetingNote, /meets online/);
    assert.doesNotMatch(holidayMeetingNote, /stays on track/);
  });
});

describe("lecture recording policy", () => {
  it("allows a legitimate absence via the recording, not as a class replacement", () => {
    assert.match(lectureRecordingNote, /All lectures are recorded/);
    assert.match(lectureRecordingNote, /available to enrolled students/);
    assert.match(lectureRecordingNote, /legitimate reason/);
    assert.match(lectureRecordingNote, /not a general replacement/);
    assert.match(lectureRecordingNote, /live lectures/);
    assert.match(lectureRecordingNote, /Canvas course/);
    assert.match(lectureRecordingNote, /Zoom Meetings → Cloud Recordings/);
    assert.match(lectureRecordingNote, /after each lecture finishes processing/);
    assert.match(
      lectureRecordingNote,
      /empty list before or during the class day is expected/,
    );
    assert.match(lectureRecordingNote, /not under Piazza Resources/);
    assert.doesNotMatch(lectureRecordingNote, /https?:\/\//);
    assert.doesNotMatch(lectureRecordingNote, /Panopto/i);
  });
});
