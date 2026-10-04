"use client";

import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { emptyCourse, type Course } from "@/app/api/kambaz/types";
import { useAccountContext } from "../account/AccountContext";
import * as client from "../courses/client";

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(emptyCourse);
  const { currentUser } = useAccountContext();

  async function loadCourses() {
    try {
      const data = currentUser
        ? await client.findMyCourses()
        : await client.fetchAllCourses();
      setCourses(data);
    } catch {
      setCourses([]);
    }
  }

  useEffect(() => {
    loadCourses();
    // Reload when the signed-in user changes (session-filtered vs public list).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadCourses closes over currentUser
  }, [currentUser]);

  async function addCourse() {
    try {
      if (currentUser) {
        await client.createCourse(course);
      } else {
        await client.createCoursePublic(course);
      }
      await loadCourses();
    } catch {
      /* companion server may be down */
    }
  }

  async function updateCourse() {
    await client.updateCourse(course);
    await loadCourses();
  }

  async function deleteCourse(courseId: string) {
    await client.deleteCourse(courseId);
    await loadCourses();
  }

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click"
          onClick={addCourse}
        >
          Add
        </button>
        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-course-click"
          onClick={updateCourse}
        >
          Update
        </button>
      </h5>
      <input
        className="mb-2 mt-2 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        id="wd-course-name"
      />
      <textarea
        className="mb-3 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        rows={3}
        value={course.description}
        onChange={(e) =>
          setCourse({ ...course, description: e.target.value })
        }
        id="wd-course-description"
      />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            {...c}
            onEdit={() => setCourse(c)}
            onDelete={() => deleteCourse(c._id)}
          />
        ))}
      </div>
    </div>
  );
}
