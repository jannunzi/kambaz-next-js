import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Modules 1:N",
      "§6.4.2 · one course, many modules",
    ],
  },
  {
    id: "purpose",
    title: "One course owns many modules",
    kind: "content",
    bullets: [
      "UML: `1` on the course end, `*` on the modules end",
      "Parent / child, or ownership — courses have many modules",
      "Chapter 5 already stored `course` on each module JSON object",
    ],
  },
  {
    id: "shapes",
    title: "Three ways to model 1:N",
    kind: "content",
    bullets: [
      "Foreign key on the child — `module.course === course._id`",
      "Array of child ids on the parent — `course.moduleIds`",
      "Embed children in the parent — a `modules` array, no second collection",
      "Pick one per project. Do not insert the same module in two places",
    ],
  },
  {
    id: "schema",
    title: "Collection plus a course field",
    kind: "demo",
    bullets: [
      "The running server keeps modules in their own collection",
      "You can also embed modules inside the course document. This server uses a separate collection",
      "`CourseModel` is still what enrollments `ref`",
    ],
    code: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
});
export default schema;`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/schema.js",
    codeHighlightLines: [6],
  },
  {
    id: "find",
    title: "Find modules by course id",
    kind: "demo",
    bullets: [
      "Collection: `model.find({ course: courseId })`",
      "Embed would `findById` the course and return `course.modules`",
      "Same nested URL Chapter 5 already used",
    ],
    code: `function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

const findModulesForCourse = async (req, res) => {
  const { courseId } = req.params;
  const modules = await dao.findModulesForCourse(courseId);
  res.json(modules);
};
app.get("/api/courses/:courseId/modules", findModulesForCourse);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/dao.js",
    codeAddedLines: [[5, 10]],
  },
  {
    id: "create",
    title: "Create includes the course id",
    kind: "demo",
    bullets: [
      "Collection: uuid + `model.create`, including `course`",
      "Embed: `$push: { modules: newModule }` on the parent course",
    ],
    code: `function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/dao.js",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete-update",
    title: "deleteOne and updateOne $set",
    kind: "demo",
    bullets: [
      "Client keeps `DELETE /api/modules/:moduleId` — the FK is on the document",
      "Embed would `$pull` / `course.modules.id(moduleId)` and `save()` the parent",
    ],
    code: `function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}
function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/dao.js",
    codeAddedLines: [[1, 6]],
    embed: "kambaz-styled-modules",
  },
  {
    id: "recap",
    title: "Modules 1:N recap",
    kind: "content",
    bullets: [
      "`modules` collection + `course` foreign key",
      "`find({ course })`, create with uuid, `deleteOne`, `$set`",
      "Create and rename a module, then confirm Compass updates",
    ],
  },
  {
    id: "next-up",
    title: "Next: enrollments are M:N",
    kind: "title",
    bullets: [
      "A mapping collection turns many-to-many into two 1:N links",
      "§6.4.3: `ref`, `populate(\"course\")`, then enroll / unenroll",
    ],
  },
];
