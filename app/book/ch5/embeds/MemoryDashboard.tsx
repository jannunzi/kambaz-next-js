"use client";

import { useState } from "react";
import CourseCard from "@/app/book/ch4/embeds/_styled/dashboard/CourseCard";
import coursesJson from "@/app/book/ch3/embeds/_styled/courses.json";

type Course = {
  _id: string;
  name: string;
  description: string;
  image: string;
};

const seed: Course[] = coursesJson.map((course) => ({
  _id: course._id,
  name: course.name,
  description: course.description,
  image: course.image,
}));

const emptyCourse: Course = {
  _id: "0",
  name: "New Course",
  description: "New Description",
  image: "/images/reactjs.jpg",
};

/** Book-only stand-in for the chapter 5 dashboard. No network calls. */
export default function MemoryDashboard() {
  const [courses, setCourses] = useState<Course[]>(seed);
  const [course, setCourse] = useState<Course>(emptyCourse);

  function addCourse() {
    setCourses((current) => [
      ...current,
      { ...emptyCourse, ...course, _id: `local-${current.length + 1}` },
    ]);
  }

  function updateCourse() {
    setCourses((current) =>
      current.map((item) => (item._id === course._id ? course : item)),
    );
  }

  function deleteCourse(courseId: string) {
    setCourses((current) => current.filter((item) => item._id !== courseId));
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
