import type { LectureSlide } from "../types";

export const MONGO_USERS_CRUD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · User CRUD",
      "§6.2.6.3–6.2.6.7 · filter, id, mutate",
    ],
  },
  {
    id: "predicates",
    title: "find() accepts a predicate",
    kind: "demo",
    bullets: [
      "`{ role }` is shorthand for `{ role: role }`",
      "`$or` + `$regex` with flag `i` — `thor` finds Thor",
      "Export both so the route can call them",
    ],
    code: `const findUsersByRole = (role) => model.find({ role });
const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ],
  });
};`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/dao.js",
    codeAddedLines: [[1, 11]],
  },
  {
    id: "query-route",
    title: "One GET, two query filters",
    kind: "demo",
    bullets: [
      "Parse `role` and `name` from `req.query`",
      "Client encodes `?role=FACULTY` or `?name=thor`",
      "Independent filters are required — combining them is extra",
    ],
    code: `const findAllUsers = async (req, res) => {
  const { role, name } = req.query;
  if (role) {
    const users = await dao.findUsersByRole(role);
    res.json(users);
    return;
  }
  if (name) {
    const users = await dao.findUsersByPartialName(name);
    res.json(users);
    return;
  }
  const users = await dao.findAllUsers();
  res.json(users);
};`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeAddedLines: [[2, 12]],
  },
  {
    id: "filter-ui",
    title: "Role select and name input",
    kind: "demo",
    bullets: [
      "All Roles clears the filter and calls `fetchUsers` again",
      "Style the select with Tailwind: a bordered control about a quarter of the width",
    ],
    code: `export const findUsersByRole = async (role: string) => {
  const response = await axios.get(\`\${USERS_API}?role=\${role}\`);
  return response.data;
};
export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(\`\${USERS_API}?name=\${name}\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 8]],
  },
  {
    id: "by-id",
    title: "findById loads one document",
    kind: "demo",
    bullets: [
      "Convenience for `findOne({ _id: userId })`",
      "Confirm in the browser: `/api/users/` plus an `_id` from Compass",
    ],
    code: `const findUserById = (userId) => model.findById(userId);
const findUserById = async (req, res) => {
  const user = await dao.findUserById(req.params.userId);
  res.json(user);
};
app.get("/api/users/:userId", findUserById);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/dao.js",
    codeAddedLines: [[2, 6]],
  },
  {
    id: "details",
    title: "People Details on a name click",
    kind: "demo",
    bullets: [
      "Parse `uid`. If missing, return `null` so the panel does not render",
      "`useEffect` depends on `uid` so a second click reloads",
      "The panel is a fixed column on the right: `fixed top-0 end-0 bottom-0`, a white background, and a shadow",
    ],
    code: `export const findUserById = async (id: string) => {
  const response = await axios.get(\`\${USERS_API}/\${id}\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete",
    title: "DELETE by primary key",
    kind: "demo",
    bullets: [
      "`findByIdAndDelete` or `deleteOne({ _id })` — same result",
      "Details: red Delete, then `onClose`. Cancel leaves Compass unchanged",
    ],
    code: `const deleteUser = (userId) => model.findByIdAndDelete(userId);
app.delete("/api/users/:userId", async (req, res) => {
  const status = await dao.deleteUser(req.params.userId);
  res.json(status);
});`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/dao.js",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "update",
    title: "$set, then refresh the session",
    kind: "demo",
    bullets: [
      "Without `$set`, Mongoose replaces the whole document",
      "If the path id matches `currentUser`, merge into `req.session`",
    ],
    code: `const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userUpdates = req.body;
  await dao.updateUser(userId, userUpdates);
  const currentUser = req.session["currentUser"];
  if (currentUser && currentUser._id === userId) {
    req.session["currentUser"] = { ...currentUser, ...userUpdates };
  }
  res.json(currentUser);
};
app.put("/api/users/:userId", updateUser);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeHighlightLines: [2, [8, 10]],
  },
  {
    id: "create",
    title: "POST assigns a fresh uuid",
    kind: "demo",
    bullets: [
      "Strip a leftover `_id` — an empty string would collide",
      "`Date.now()` in the username so two clicks stay unique",
    ],
    code: `const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};
const createUser = async (req, res) => {
  const user = await dao.createUser(req.body);
  res.json(user);
};
app.post("/api/users", createUser);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeAddedLines: [[5, 9]],
    embed: "lab6-users",
  },
  {
    id: "recap",
    title: "User CRUD recap",
    kind: "content",
    bullets: [
      "`find({ role })` and `$regex` on first or last name",
      "`findById`, `findByIdAndDelete`, `updateOne` + `$set`, `create`",
      "Users screen: filter, open Details, edit, delete, then + User",
    ],
  },
  {
    id: "next-up",
    title: "Next: host the database",
    kind: "title",
    bullets: [
      "127.0.0.1 is empty on Render — Atlas is the public cluster",
      "§6.3: free Kambaz cluster, Compass, then a new Render service",
    ],
  },
];
