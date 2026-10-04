/** ISO calendar date, `YYYY-MM-DD`, interpreted in local time (not UTC). */
export type IsoDate = string;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Instructor = {
  name: string;
  email: string;
  role: string;
};

export type CourseInfo = {
  title: string;
  credits: number;
  term: string;
  college: string;
  bookTitle: string;
  instructor: Instructor;
};

export type SectionLevel = "undergraduate" | "graduate";
export type SectionModality = "in-person" | "online";

export type CourseSection = {
  id: string;
  code: string;
  sectionNumber: string;
  crn: string;
  level: SectionLevel;
  modality: SectionModality;
  campus: string;
  firstClass: IsoDate;
  lastClass: IsoDate;
  /**
   * Meeting weekdays. All Fall 2026 sections meet once per week.
   * JavaScript `Date.getDay()`: 0 Sunday … 6 Saturday.
   */
  daysOfWeek: DayOfWeek[];
  /** Locked clock time (ET). */
  time: string;
  /** Room or online meeting description. */
  location: string;
  /** Standing Zoom join URL. Only set for online sections when posted. */
  zoomUrl?: string;
  tabLabel: string;
  notes: string[];
};

export type DeadlineKind = "assignment" | "quiz" | "exam" | "project";

export type Deadline = {
  /**
   * Shared calendar date. Quizzes use the Monday of the week after that
   * chapter’s assignment is due (Piazza Post 33) as the “Week of” label.
   * X1 uses the Monday of midterm week (2nd half of lecture). X2 uses its
   * Sunday lock date.
   */
  date?: IsoDate;
  kind: DeadlineKind;
  label: string;
};

export type SemesterDates = {
  label: string;
  firstDayOfClasses: IsoDate;
  lastDayOfClasses: IsoDate;
  /** Inclusive range for the university final-exam window, if the course uses one. */
  finalExamPeriod: { start: IsoDate; end: IsoDate };
};

export type Holiday = {
  start: IsoDate;
  end: IsoDate;
  label: string;
};

export type AcademicCalendarKind =
  | "holiday"
  | "break"
  | "term"
  | "deadline"
  | "exams";

/** Course-relevant university dates (not every Session A/B or third-of-term row). */
export type AcademicCalendarEvent = {
  date: IsoDate;
  endDate?: IsoDate;
  label: string;
  kind: AcademicCalendarKind;
  /** Registrar “no classes” day or break. */
  noClasses?: boolean;
};

export type AgendaKind = "lecture" | "orientation";

export type AgendaGroupKind = "chapter" | "exam" | "orientation" | "project";

export type AgendaRow = {
  date: IsoDate;
  kind: AgendaKind;
  lectureNumber?: number;
  topic: string;
  /** Optional student-facing link (project-week slides hub, etc.). */
  href?: string;
  /** Absolute Canvas dues that happen to fall on this calendar day. */
  deadlines: Deadline[];
  /**
   * When the meeting date falls on a university holiday. Attendance is not
   * required; a lecture recording is posted. The chapter sequence does not skip.
   */
  onlineNote?: string;
};

export type AgendaGroup = {
  id: string;
  kind: AgendaGroupKind;
  /** Chapter heading such as “Chapter 1: Building Next.js User Interfaces with HTML”. */
  heading?: string;
  chapter?: number;
  rows: AgendaRow[];
};

export type LectureTopic = {
  topic: string;
  /** Optional syllabus link, e.g. `/slides` for the project-week decks. */
  href?: string;
  /** Book chapter for weekly rows. Omitted on exam-only (X2) and project weeks. */
  chapter?: number;
  exam?: "X1" | "X2";
  /** Week of Dec 7: project grading (not Chapter 6). */
  project?: boolean;
};

export type CourseGoal = {
  heading: string;
  paragraphs: string[];
  topics: { name: string; detail: string; href?: string }[];
};

export type EvaluationItem = {
  label: string;
  weight: number;
  description: string;
};

export type GradeBand = {
  letter: string;
  minimum: number;
};

export type PolicyBlock = {
  paragraphs: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
};

export type AssignmentItem = {
  id: string;
  title: string;
  chapter: string;
  summary: string;
};

export type OfficeHourRow = {
  name: string;
  role: string;
  hours: string;
  location: string;
  contact: string;
};
