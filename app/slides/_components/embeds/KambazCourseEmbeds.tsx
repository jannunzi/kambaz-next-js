"use client";

import { useState } from "react";
import AssignmentsDemo from "@/app/book/ch1/embeds/AssignmentsDemo";
import AssignmentEditorDemo from "@/app/book/ch1/embeds/AssignmentEditorDemo";
import HomeDemo from "@/app/book/ch1/embeds/HomeDemo";
import ModulesDemo from "@/app/book/ch1/embeds/ModulesDemo";
import LectureDemoFrame from "./LectureDemoFrame";

type CourseRoute =
  | "home"
  | "modules"
  | "assignments"
  | "piazza"
  | "zoom"
  | "quizzes"
  | "grades"
  | "people";

function CoursePlaceholder({ title }: { title: string }) {
  return (
    <div>
      <h2 className="mt-0 mb-0 font-sans text-xl font-semibold">{title}</h2>
    </div>
  );
}

export function KambazCoursesEmbed() {
  const [route, setRoute] = useState<CourseRoute>("home");
  const cid = "1234";
  const path =
    route === "people"
      ? `/courses/${cid}/people/table`
      : `/courses/${cid}/${route}`;

  const links: { id: CourseRoute; label: string; hrefId: string }[] = [
    { id: "home", label: "Home", hrefId: "wd-course-home-link" },
    { id: "modules", label: "Modules", hrefId: "wd-course-modules-link" },
    { id: "piazza", label: "Piazza", hrefId: "wd-course-piazza-link" },
    { id: "zoom", label: "Zoom", hrefId: "wd-course-zoom-link" },
    { id: "assignments", label: "Assignments", hrefId: "wd-course-assignments-link" },
    { id: "quizzes", label: "Quizzes", hrefId: "wd-course-quizzes-link" },
    { id: "grades", label: "Grades", hrefId: "wd-course-grades-link" },
    { id: "people", label: "People", hrefId: "wd-course-people-link" },
  ];

  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/layout.tsx"
      url={path}
    >
      <div id="wd-courses" className="font-sans text-sm">
        <h2 className="mt-0 mb-1 text-lg font-semibold">Courses {cid}</h2>
        <hr />
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="align-top pr-4" valign="top" width="140">
                <div id="wd-courses-navigation">
                  {links.map((link) => (
                    <span key={link.id}>
                      <button
                        type="button"
                        id={link.hrefId}
                        className={`border-0 bg-transparent p-0 underline ${
                          route === link.id
                            ? "font-semibold text-neutral-900"
                            : "text-blue-700"
                        }`}
                        onClick={() => setRoute(link.id)}
                      >
                        {link.label}
                      </button>
                      <br />
                    </span>
                  ))}
                </div>
              </td>
              <td className="align-top" valign="top">
                {route === "home" ? (
                  <div id="wd-home">
                    <h2 className="mt-0 mb-0 text-lg font-semibold">Home {cid}</h2>
                  </div>
                ) : (
                  <CoursePlaceholder
                    title={`${route[0]!.toUpperCase()}${route.slice(1)}`}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazModulesEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/modules/page.tsx"
      url="/courses/1234/modules"
    >
      <div className="font-sans text-sm">
        <ModulesDemo />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazHomeEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/home/page.tsx"
      url="/courses/1234/home"
    >
      <div className="font-sans text-sm [&_h2]:mt-0">
        <HomeDemo />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazAssignmentsEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/assignments/page.tsx"
      url="/courses/1234/assignments"
    >
      <div className="font-sans text-sm [&_h2]:mt-0">
        <AssignmentsDemo />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazAssignmentEditorEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx"
      url="/courses/1234/assignments/123"
    >
      <div className="font-sans text-sm [&_label]:mr-2">
        <AssignmentEditorDemo />
      </div>
    </LectureDemoFrame>
  );
}

