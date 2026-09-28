import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Kambaz Courses DB",
      "§6.4.1 · CRUD courses in Mongo",
    ],
  },
  {
    id: "purpose",
    title: "URLs stay; the source changes",
    kind: "content",
    bullets: [
      "Chapter 5 routes still own `/api/courses` — arrays become documents",
      "Account Context and Zustand cache what the routes return",
      "Confirm each verb in Compass before you move on",
    ],
  },
  {
    id: "schema",
    title: "Course schema keeps string ids",
    kind: "demo",
    bullets: [
      "`_id` stays `String` — enrollments and modules already store those ids",
      "`CourseModel` is the name enrollments will `ref` in §6.4.3.1",
    ],
    code: `import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
  credits: Number,
  description: String,
},
{ collection: "courses" });
export default courseSchema;`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/schema.js",
    codeHighlightLines: [3, 9],
  },
  {
    id: "model",
    title: "CourseModel from the schema",
    kind: "demo",
    bullets: [
      "Same pattern as `UserModel` — one compiled model per process",
    ],
    code: `import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("CourseModel", schema);
export default model;`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/model.js",
    codeAddedLines: [3],
  },
  {
    id: "find",
    title: "find() replaces Database.courses",
    kind: "demo",
    bullets: [
      "Comment out the array return so you do not keep two sources of truth",
      "Enrolled-user helper can still filter against in-memory enrollments for now",
    ],
    code: `import model from "./model.js";

function findAllCourses() {
  // return Database.courses;
  return model.find();
}

async function findCoursesForEnrolledUser(userId) {
  const { enrollments } = db;
  const courses = await model.find();
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === course._id,
    ),
  );
  return enrolledCourses;
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/dao.js",
    codeAddedLines: [5, [8, 18]],
  },
  {
    id: "async-routes",
    title: "Await every course lookup",
    kind: "demo",
    bullets: [
      "`userId === \"current\"` still reads the session — 401 if anonymous",
      "Only the lookup behind it is now a promise",
    ],
    code: `const findAllCourses = async (req, res) => {
  const courses = await dao.findAllCourses();
  res.send(courses);
};

const findCoursesForEnrolledUser = async (req, res) => {
  let { userId } = req.params;
  if (userId === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = await dao.findCoursesForEnrolledUser(userId);
  res.json(courses);
};`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/routes.js",
    codeHighlightLines: [1, 2, 6, 16],
  },
  {
    id: "create",
    title: "createCourse assigns a uuid",
    kind: "demo",
    bullets: [
      "Spread, `_id: uuidv4()`, `model.create`",
      "Route still enrolls the current user — that write becomes Mongo in §6.4.3.4",
    ],
    code: `function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}

const createCourse = async (req, res) => {
  const newCourse = await dao.createCourse(req.body);
  const currentUser = req.session["currentUser"];
  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
  res.json(newCourse);
};
app.post("/api/courses", createCourse);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/dao.js",
    codeAddedLines: [[6, 12]],
  },
  {
    id: "delete-update",
    title: "deleteOne and updateOne $set",
    kind: "demo",
    bullets: [
      "Dashboard Delete — refresh Compass; the document is gone",
      "Edit a name, save, reopen in Compass before you refresh the browser again",
    ],
    code: `function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}
function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/dao.js",
    codeAddedLines: [[1, 6]],
    embed: "kambaz-styled-dashboard",
  },
  {
    id: "recap",
    title: "Courses DB recap",
    kind: "content",
    bullets: [
      "`CourseModel` + `collection: \"courses\"`",
      "`find`, `create` + uuid, `deleteOne`, `updateOne` + `$set`",
      "Routes are `async`. Dashboard buttons write documents",
    ],
  },
  {
    id: "next-up",
    title: "Next: modules are 1:N",
    kind: "title",
    bullets: [
      "A course has many modules — foreign key, id array, or embed",
      "§6.4.2: keep a `modules` collection with `course`",
    ],
  },
];
