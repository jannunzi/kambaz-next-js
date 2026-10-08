import type { PolicyBlock } from "./types";

export const latePolicy: PolicyBlock = {
  paragraphs: [
    "Assignments are due at the date and time posted on Canvas and on the agenda. Submit what you have by the deadline — a partial, working deployment is worth more than a perfect repository that arrives late.",
    "Work submitted after the deadline loses 10% of the assignment’s points per 24-hour period, or fraction thereof, for up to three days. After three days the assignment is not accepted, except when Disability Access Services accommodations or a documented emergency arranged with the instructor apply.",
    "Quizzes (Q1–Q6) and exams (X1/X2) cannot be submitted late. If you have a university-approved absence or an emergency, write to the instructor before the deadline when possible.",
  ],
  bullets: [
    "On time — eligible for full credit.",
    "0–24 hours late — 10% penalty.",
    "24–48 hours late — 20% penalty.",
    "48–72 hours late — 30% penalty.",
    "More than 72 hours late — no credit, unless arranged in advance.",
  ],
};

export const regradePolicy: PolicyBlock = {
  paragraphs: [
    "You may request a regrade, or resubmit an assignment for a regrade, only for the assignment immediately before the one you are working on. Older assignments are not open for a regrade.",
    "That window opens when you receive a grade for the prior assignment, and it lasts one week from when the grade is posted.",
    "While you are working on A2, once A1 is graded you have one week to resubmit A1 for a regrade. While you are working on A4, you may only seek a regrade for A3 — not A2 or A1.",
    "Quizzes (Q1–Q6) can also be regraded within one week from when the quiz grade is posted. Quizzes cannot be retaken or resubmitted, so a quiz regrade is only a recheck of how your existing answers were graded.",
    "To request a regrade for an assignment or a quiz, make a private post to Instructors on Piazza.",
  ],
};

export const aiPolicy: PolicyBlock = {
  paragraphs: [
    "Working with an AI agent is like asking your expert professional uncle or team at Google to do the work for you. If that would not be allowed with a person or a team, it is not allowed with AI.",
    "You may ask that uncle or team to explain something and to help you work things out. You may use AI (Cursor, ChatGPT, Copilot, and similar assistants) when the book or an exercise explicitly mentions it. You may not copy code wholesale from an AI tool unless that exercise explicitly allows it.",
    "IDE autocomplete is allowed, including VS Code IntelliSense and Copilot-style inline suggestions. Turning autocomplete or inline suggestions off is an optional personal preference, not an academic integrity requirement.",
    "You are responsible for the work and are expected to take full responsibility for the code you submit. The intent is for you to acquire the experience and the criteria to create and evaluate quality code. The idea is to become that expert uncle and join amazing teams.",
    "Teaching assistants will schedule regularly random audits asking you to explain a random piece of code from your submission. The slightest suspicion that the code is not your own results in a zero for that assignment, unless the instructor or the book explicitly allowed AI for that particular purpose.",
    "Quizzes (Q1–Q6) and exams (X1/X2) are closed: do not use AI unless the handout says otherwise.",
  ],
  bullets: [
    "Allowed: using AI when the book or an exercise explicitly mentions it; asking that uncle or team to explain something and help you work things out; using IDE autocomplete, including VS Code IntelliSense and Copilot-style inline suggestions. Turning autocomplete or inline suggestions off is an optional personal preference, not an academic integrity requirement.",
    "Not allowed: having that uncle or team do the work for you; copying generated code wholesale unless the exercise explicitly allows it.",
    "Audits: TAs will schedule regularly random audits. You must explain a random piece of code from your submission. The slightest suspicion that the code is not yours is a zero for that assignment, unless the instructor or book explicitly allowed AI for that particular purpose.",
    "You take full responsibility for the code you submit. The intent is the experience and criteria to create and evaluate quality code. The idea is to become that expert uncle and join amazing teams. Closed quizzes and exams: no AI unless the handout says otherwise.",
  ],
};

export const academicIntegrity: PolicyBlock = {
  paragraphs: [
    "Northeastern expects every assignment, quiz, exam, and project in this course to meet the university Academic Integrity Policy. Instructors are required to cite that policy on the syllabus. Cheating, plagiarism, fabrication, unauthorized collaboration, and facilitating dishonesty are violations.",
    "In this course, that includes copying another student’s Kambaz or lab code (current or past semester), publishing solutions where others can turn them in, and copying AI-generated code wholesale unless an exercise explicitly allows it. You may discuss ideas with classmates; the code and write-up you turn in must be your own unless the assignment explicitly allows a team.",
    "A violation may be reported to the Office of Student Conduct and Conflict Resolution (OSCCR) and may also receive an academic penalty in the course, up to a failing grade, at the instructor’s discretion.",
  ],
  links: [
    {
      label: "Northeastern Academic Integrity Policy",
      href: "https://catalog.northeastern.edu/handbook/policies-regulations/academic-integrity/",
    },
    {
      label: "Office of Student Conduct and Conflict Resolution",
      href: "https://osccr.northeastern.edu/",
    },
  ],
};

export const classroomEnvironment: PolicyBlock = {
  paragraphs: [
    "Treat lecture, discussion, office hours, and shared repositories as professional spaces — whether the section meets in Boston or online. Critique ideas and code, not people. Harassment, slurs, and exclusionary behavior are not acceptable.",
    "Keep cameras and microphones considerate during live sessions. Do not record other students without consent. When you post questions, include the route, the error, and what you already tried — that is how we help each other efficiently.",
    "If something in the course environment is preventing you from participating, contact the instructor. You may also use university reporting channels listed under Title IX and Disability Access Services.",
  ],
};

export const titleIX: PolicyBlock = {
  paragraphs: [
    "Northeastern University is committed to providing a living, learning, and working environment free from discrimination and harassment. The university does not discriminate on the basis of race, color, religion, sex (including pregnancy and related conditions), gender identity or expression, sexual orientation, age, national origin, disability, or veteran status in its programs and activities.",
    "Sexual and gender-based harassment, sexual assault, dating or domestic violence, and stalking are prohibited. Faculty and most university employees are responsible employees: if a student discloses a possible Title IX incident, we must share it with the Office for University Equity and Compliance so the university can offer support and options. Confidential resources are listed on the OUEC site.",
  ],
  links: [
    {
      label: "Office for University Equity and Compliance / Title IX",
      href: "https://ouec.northeastern.edu/",
    },
    {
      label: "Policy on Sexual and Gender-Based Harassment and Title IX",
      href: "https://policies.northeastern.edu/",
    },
  ],
};

export const disabilities: PolicyBlock = {
  paragraphs: [
    "Northeastern is committed to an inclusive learning environment and welcomes students with disabilities into its programs. Disability Access Services (DAS) determines reasonable accommodations. If you need accommodations in this course, contact DAS as early as possible and share your Professor Notification Letter so we can put supports in place.",
    "Any student who feels they may need an accommodation based on the impact of a disability is encouraged to contact Disability Access Services to coordinate reasonable accommodations.",
  ],
  links: [
    {
      label: "Disability Access Services",
      href: "https://disabilityaccessservices.northeastern.edu/",
    },
    {
      label: "DASboston@northeastern.edu",
      href: "mailto:DASboston@northeastern.edu",
    },
  ],
};
