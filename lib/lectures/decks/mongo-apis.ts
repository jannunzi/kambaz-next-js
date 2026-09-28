import type { LectureSlide } from "../types";

export const MONGO_APIS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Mongo APIs",
      "§6.2.6 · async routes, then find all",
    ],
  },
  {
    id: "purpose",
    title: "The browser never imports Mongoose",
    kind: "content",
    bullets: [
      "DAO hides the vendor. Routes turn HTTP into function calls",
      "React still posts to `/api/users/signin` and receives JSON",
      "Each verb is implemented three times: DAO, Express, axios client",
    ],
  },
  {
    id: "async",
    title: "Database calls are promises",
    kind: "demo",
    bullets: [
      "Chapter 5 arrays were **synchronous**. Mongo answers later",
      "Tag handlers `async` and `await` every DAO call",
      "Do the same for profile, signout, and course routes",
    ],
    code: `const signin = async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await dao.findUserByCredentials(username, password);
  if (currentUser) {
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  } else {
    res.status(401).json({ message: "Unable to login. Try again later." });
  }
};

const signup = async (req, res) => {
  const user = await dao.findUserByUsername(req.body.username);
  if (user) {
    res.status(400).json({ message: "Username already taken" });
    return;
  }
  const currentUser = await dao.createUser(req.body);
  req.session["currentUser"] = currentUser;
  res.json(currentUser);
};`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeHighlightLines: [1, 3, 13, 18],
    embed: "kambaz-styled-signin",
  },
  {
    id: "find-all-dao",
    title: "find() with no predicate",
    kind: "demo",
    bullets: [
      "Same `findAllUsers` you returned from the DAO",
      "Empty `find()` returns every document in `users`",
    ],
    code: `const findAllUsers = () => model.find();`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/dao.js",
  },
  {
    id: "find-all-route",
    title: "GET /api/users returns JSON",
    kind: "demo",
    bullets: [
      "Open `http://localhost:4000/api/users` in the browser",
      "Length should match Compass `kambaz.users`. Empty? Re-import JSON",
    ],
    code: `const findAllUsers = async (req, res) => {
  const users = await dao.findAllUsers();
  res.json(users);
};
app.get("/api/users", findAllUsers);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "find-all-client",
    title: "Client GETs with credentials",
    kind: "demo",
    bullets: [
      "`USERS_API` already prefixes `httpServer()`",
      "Credentials so a later admin-only check can read the session cookie",
    ],
    code: `export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "people-table",
    title: "PeopleTable takes a users prop",
    kind: "demo",
    bullets: [
      "Stop joining enrollments in the browser — the server filters",
      "Users screen passes every user; course People later passes a subset",
      "A full-width collapsed table with a light border and striped odd rows",
    ],
    code: `export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers: () => void;
}) {
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2">{user.firstName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeHighlightLines: [[1, 3], [12, 14]],
    embed: "kambaz-styled-people",
  },
  {
    id: "users-screen",
    title: "Users fetches on mount",
    kind: "demo",
    bullets: [
      "Client Component: `useState` plus `useEffect`",
      "`fetchUsers` is passed into the table so Details can refresh",
    ],
    code: `"use client";
import { useState, useEffect } from "react";
import PeopleTable from "../../courses/[cid]/people/Table";
import * as client from "../client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      <h3>Users</h3>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/users/page.tsx",
    codeAddedLines: [[8, 14]],
  },
  {
    id: "admin-link",
    title: "Users link is ADMIN only",
    kind: "demo",
    bullets: [
      "Read `currentUser` from `useAccountContext()` — not a Redux slice",
      "Seed `nick_fury` / `fury123` is an administrator",
      "Faculty and student sessions must not show the link",
    ],
    code: `{currentUser && currentUser.role === "ADMIN" && (
  <Link
    href="/account/users"
    className={
      pathname.endsWith("users")
        ? "font-semibold text-black"
        : "text-red-600"
    }
  >
    Users
  </Link>
)}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/Navigation.tsx",
    codeAddedLines: [[1, 12]],
  },
  {
    id: "recap",
    title: "Find-all recap",
    kind: "content",
    bullets: [
      "`async` / `await` on every DAO call — Sign in still sets the session",
      "`GET /api/users` plus `findAllUsers` on the client",
      "ADMIN Account Nav → Users → PeopleTable",
    ],
  },
  {
    id: "next-up",
    title: "Next: filter and user CRUD",
    kind: "title",
    bullets: [
      "Predicates, find by id, then delete, update, and create",
      "§6.2.6.3–6.2.6.7: `?role=` and People Details",
    ],
  },
];
