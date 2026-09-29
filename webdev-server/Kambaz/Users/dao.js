import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { isMongoConfigured } from "../Database/mongo.js";

export default function UsersDao(db) {
  const createUser = async (user) => {
    const { _id: _ignored, ...rest } = user ?? {};
    const newUser = { ...rest, _id: uuidv4() };
    if (isMongoConfigured()) {
      return model.create(newUser);
    }
    db.users = [...db.users, newUser];
    return newUser;
  };

  const findAllUsers = async () => {
    if (isMongoConfigured()) return model.find();
    return db.users;
  };

  const findUserById = async (userId) => {
    if (isMongoConfigured()) return model.findById(userId);
    return db.users.find((user) => user._id === userId);
  };

  const findUserByUsername = async (username) => {
    if (isMongoConfigured()) return model.findOne({ username });
    return db.users.find((user) => user.username === username);
  };

  const findUserByCredentials = async (username, password) => {
    if (isMongoConfigured()) return model.findOne({ username, password });
    return db.users.find(
      (user) => user.username === username && user.password === password,
    );
  };

  const findUsersByRole = async (role) => {
    if (isMongoConfigured()) return model.find({ role });
    return db.users.filter((user) => user.role === role);
  };

  const findUsersByPartialName = async (partialName) => {
    if (isMongoConfigured()) {
      const regex = new RegExp(partialName, "i");
      return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
      });
    }
    const q = String(partialName).toLowerCase();
    return db.users.filter(
      (user) =>
        String(user.firstName ?? "")
          .toLowerCase()
          .includes(q) ||
        String(user.lastName ?? "")
          .toLowerCase()
          .includes(q),
    );
  };

  const updateUser = async (userId, user) => {
    if (isMongoConfigured()) {
      await model.updateOne({ _id: userId }, { $set: user });
      return model.findById(userId);
    }
    db.users = db.users.map((u) => (u._id === userId ? { ...u, ...user } : u));
    return db.users.find((u) => u._id === userId);
  };

  const deleteUser = async (userId) => {
    if (isMongoConfigured()) return model.findByIdAndDelete(userId);
    db.users = db.users.filter((u) => u._id !== userId);
    return { deletedCount: 1 };
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    findUsersByRole,
    findUsersByPartialName,
    updateUser,
    deleteUser,
  };
}
