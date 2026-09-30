import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { isMongoConfigured } from "../Database/mongo.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    if (isMongoConfigured()) return model.find({ course: courseId });
    return db.assignments.filter((a) => a.course === courseId);
  }

  async function findAssignmentById(assignmentId) {
    if (isMongoConfigured()) return model.findById(assignmentId);
    return db.assignments.find((a) => a._id === assignmentId);
  }

  async function createAssignment(assignment) {
    const created = { ...assignment, _id: assignment?._id ?? uuidv4() };
    if (isMongoConfigured()) return model.create(created);
    db.assignments = [...db.assignments, created];
    return created;
  }

  async function updateAssignment(assignmentId, updates) {
    if (isMongoConfigured()) {
      await model.updateOne({ _id: assignmentId }, { $set: updates });
      return model.findById(assignmentId);
    }
    db.assignments = db.assignments.map((a) =>
      a._id === assignmentId ? { ...a, ...updates } : a,
    );
    return db.assignments.find((a) => a._id === assignmentId);
  }

  async function deleteAssignment(assignmentId) {
    if (isMongoConfigured()) return model.deleteOne({ _id: assignmentId });
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
    return { deletedCount: 1 };
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
