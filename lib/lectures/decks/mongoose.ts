import type { LectureSlide } from "../types";

export const MONGOOSE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Mongoose",
      "§6.2 · connect, env, schema, DAO",
    ],
  },
  {
    id: "purpose",
    title: "Compass is human; Mongoose is Node",
    kind: "content",
    bullets: [
      "Applications need `find`, `create`, `updateOne`, and `deleteOne`",
      "Work on branch `a6` in both `webdev-client` and `webdev-server`",
      "Set the connection URI in `webdev-server` and the server uses Mongoose",
    ],
  },
  {
    id: "install",
    title: "npm install mongoose",
    kind: "demo",
    bullets: [
      "From the Node project root — not the Next.js app",
      "Schemas and models once, then CRUD on those models",
    ],
    code: `cd webdev-server
npm install mongoose`,
    codeLanguage: "bash",
  },
  {
    id: "connect",
    title: "Connect before any route runs",
    kind: "demo",
    bullets: [
      "The URL is the **connection string** — localhost, port 27017, `/kambaz`",
      "Place `connect` near the top of `index.js`",
      "If `mongod` is down, Mongoose retries and then fails",
    ],
    code: `import express from "express";
import mongoose from "mongoose";
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);
const app = express();`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeAddedLines: [2, [3, 4]],
  },
  {
    id: "env",
    title: "Put the URI in .env",
    kind: "demo",
    bullets: [
      "Node `.env` — not the Next.js `.env.local`",
      "Same key later holds the Atlas `mongodb+srv://` string",
      "Alongside the session keys from Chapter 5",
    ],
    code: `SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    codeAddedLines: [5],
    embed: "lab6-status",
  },
  {
    id: "read-env",
    title: "Read process.env, then connect",
    kind: "demo",
    bullets: [
      "`dotenv/config` loads `.env` before other modules read keys",
      "Fallback keeps you on localhost if the line is missing",
    ],
    code: `import "dotenv/config";
import mongoose from "mongoose";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeAddedLines: [1, [4, 6]],
  },
  {
    id: "schema",
    title: "A schema validates writes",
    kind: "demo",
    bullets: [
      "`_id` is `String` so Chapter 3 ids still match enrollments",
      "`username` required + unique. `role` is an enum, default `USER`",
      "`{ collection: \"users\" }` — do not let Mongoose invent a name",
    ],
    code: `import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  _id: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  email: String,
  lastName: String,
  dob: Date,
  role: {
    type: String,
    enum: ["STUDENT", "FACULTY", "ADMIN", "USER", "TA"],
    default: "USER",
  },
  loginId: String,
  section: String,
  lastActivity: Date,
  totalActivity: String,
},
{ collection: "users" });
export default userSchema;`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/schema.js",
    codeHighlightLines: [3, [4, 5], [10, 15], 20],
  },
  {
    id: "model",
    title: "One compiled UserModel",
    kind: "demo",
    bullets: [
      "`\"UserModel\"` is the name other schemas `ref` — enrollments later",
      "You do not instantiate it. Import and call `model.find()`",
    ],
    code: `import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema);
export default model;`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/model.js",
    codeAddedLines: [3],
  },
  {
    id: "dao",
    title: "DAO wraps generic model verbs",
    kind: "demo",
    bullets: [
      "Same function names as Chapter 5 — now they return promises",
      "`createUser` assigns `uuidv4()` so enrollments stay string ids",
      "`updateUser` uses `$set` so omitted fields stay as they were",
    ],
    code: `import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
export default function UsersDao() {
  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findById(userId);
  const findUserByUsername = (username) =>
    model.findOne({ username: username });
  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });
  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });
  const deleteUser = (userId) => model.deleteOne({ _id: userId });
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  return {
    createUser, findAllUsers, findUserById,
    findUserByUsername, findUserByCredentials, updateUser, deleteUser,
  };
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/dao.js",
    codeHighlightLines: [4, [10, 11], [13, 16]],
    embed: "lab6-todos",
  },
  {
    id: "recap",
    title: "Mongoose recap",
    kind: "content",
    bullets: [
      "`npm install mongoose`, then `mongoose.connect` from env",
      "Schema describes `users`. Model exposes CRUD",
      "DAO names stay `findUserByCredentials` — routes `await` them next",
    ],
  },
  {
    id: "next-up",
    title: "Next: async account APIs",
    kind: "title",
    bullets: [
      "Tag routes `async` and expose find-all on `/api/users`",
      "§6.2.6.1–6.2.6.2: Sign in still works, then an ADMIN Users screen",
    ],
  },
];
