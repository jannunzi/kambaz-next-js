import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { isMongoConfigured } from "../Database/mongo.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    if (isMongoConfigured()) {
      const enrollments = await model.find({ user: userId }).populate("course");
      return enrollments.map((enrollment) => enrollment.course);
    }
    return db.courses.filter((course) =>
      db.enrollments.some(
        (e) => e.user === userId && e.course === course._id,
      ),
    );
  }

  async function findUsersForCourse(courseId) {
    if (isMongoConfigured()) {
      const enrollments = await model
        .find({ course: courseId })
        .populate("user");
      return enrollments.map((enrollment) => enrollment.user);
    }
    return db.users.filter((user) =>
      db.enrollments.some(
        (e) => e.course === courseId && e.user === user._id,
      ),
    );
  }

  async function enrollUserInCourse(userId, courseId) {
    const enrollment = {
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
    };
    if (isMongoConfigured()) {
      return model.create(enrollment);
    }
    db.enrollments.push({ ...enrollment, _id: uuidv4() });
    return enrollment;
  }

  async function unenrollUserFromCourse(user, course) {
    if (isMongoConfigured()) return model.deleteOne({ user, course });
    db.enrollments = db.enrollments.filter(
      (e) => !(e.user === user && e.course === course),
    );
    return { deletedCount: 1 };
  }

  async function unenrollAllUsersFromCourse(courseId) {
    if (isMongoConfigured()) return model.deleteMany({ course: courseId });
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
    return { deletedCount: 1 };
  }

  function findEnrollmentsForUser(userId) {
    if (isMongoConfigured()) return model.find({ user: userId });
    return db.enrollments.filter((e) => e.user === userId);
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findEnrollmentsForUser,
  };
}
