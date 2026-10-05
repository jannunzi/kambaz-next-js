"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";
import CourseCard from "./CourseCard";

const COURSES_API = `${httpServer()}/api/courses`;

type Course = {
  _id: string;
  name: string;
  description: string;
  image: string;
};

const emptyCourse: Course = {
  _id: "0",
  name: "New Course",
  description: "New Description",
  image: "/images/reactjs.jpg",
};

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(emptyCourse);

  async function loadCourses() {
    try {
      const { data } = await axios.get(COURSES_API);
      setCourses(data);
    } catch {
      setCourses([]);
    }
  }

  useEffect(() => {
    // The published list lives on Express, so the first paint requests it.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load replaces the empty list
    void loadCourses();
  }, []);

  async function addCourse() {
    try {
      await axios.post(COURSES_API, course);
      await loadCourses();
    } catch {
      /* companion server may be down */
    }
  }

  async function updateCourse() {
    await axios.put(`${COURSES_API}/${course._id}`, course);
    await loadCourses();
  }

  async function deleteCourse(courseId: string) {
    await axios.delete(`${COURSES_API}/${courseId}`);
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
