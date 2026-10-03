import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Lab6Users from "@/app/labs/lab6/intermediates/6-2-6-Users";

export default function Apis() {
  return (
    <Section
      level={3}
      id="sec-6-2-6"
      title="6.2.6 Implementing APIs to Interact with MongoDB from a React Client Application"
    >
      <p>
        DAOs implement an interface between an application and the
        low-level database access, providing a high-level API to the
        rest of the application and hiding the details and
        idiosyncrasies of using a particular database vendor. Likewise
        routes implement an interface between the HTTP network world
        and the JavaScript functional programming world by converting
        a stream of bits from a network connection request into a set
        of objects, maps, and function event handlers that participate
        in the client/server architecture of a multi-tiered
        application. The browser never imports Mongoose; it posts to{" "}
        <code>/api/users/signin</code>{" "}and receives JSON. The
        following sections demonstrate implementing the most common
        CRUD (Create, Read, Update, and Delete) database operations
        including retrieving all documents, retrieving documents by
        predicate, retrieving documents by primary key, deleting a
        document, updating a document, and creating a new document.
        Each operation is implemented three times: once in the DAO,
        once as an Express route, and once as an{" "}
        <OfficialLink href="https://axios-http.com/">
          axios
        </OfficialLink>{" "}
        client function the React screens already import from{" "}
        <code>app/(kambaz)/account/client.ts</code>.
      </p>

      <Section
        level={3}
        id="sec-6-2-6-1"
        title="6.2.6.1 Refactoring Account Routes"
      >
        <p>
          Previous chapters implemented account routes such as signin
          and signup shown below. Since the DAO implementations used
          data structures imported from the local file system, the
          operations were <strong>synchronous</strong>. A{" "}
          <code>find</code>{" "}against an in-memory array returned a
          user before the next line ran, so the handler could assign{" "}
          <code>req.session[&quot;currentUser&quot;]</code>{" "}
          immediately. Now that the DAO is interacting with a
          database, the operations are asynchronous: Mongoose sends a
          query over the network — even to localhost — and the answer
          arrives later as a promise. The route handlers must be
          tagged with the <code>async</code>{" "}/{" "}
          <code>await</code>{" "}keywords as shown below so Express
          does not send a response before the database has answered.
          Confirm Signin, Signup, and Profile screens work as before.
          Following the examples below for the signin and signup
          functions, add the <code>async</code>{" "}keyword to all other
          router functions and add the <code>await</code>{" "}keyword to
          all calls to DAO functions, including profile, signout, and
          the course routes you wrote in{" "}
          <ChapterLink to={5} />.
        </p>
        <CodeBlock
          language="js"
          name="UserRoutes"
          file="webdev-server/Kambaz/Users/routes.js"
        >{`const signin = async (req, res) => {
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
};`}</CodeBlock>
        <p>
          Signin still reads <code>username</code>{" "}and{" "}
          <code>password</code>{" "}from the request body, but now it{" "}
          <code>await</code>s <code>findUserByCredentials</code>. If
          a matching document exists, the handler stores that document
          on the session and returns it as JSON so the React Sign in
          screen can call <code>setCurrentUser</code>{" "}on{" "}
          <OfficialLink href="https://react.dev/learn/passing-data-deeply-with-context">
            Account Context
          </OfficialLink>{" "}
          from <ChapterLink to={4} />. If no document matches, the
          handler responds 401 with the same message you already
          display. Signup first <code>await</code>s{" "}
          <code>findUserByUsername</code>; if that query returns a
          document, the username is taken and the handler returns 400
          without inserting anything. Otherwise it{" "}
          <code>await</code>s <code>createUser</code>, stores the new
          document on the session, and returns it. The React screens
          do not change their axios URLs; they only continue to work
          if every DAO call is awaited. After you tag the remaining
          handlers, sign in as <code>iron_man</code>{" "}/{" "}
          <code>stark123</code>, open Profile, and confirm the name
          still comes from the server. Then sign out and sign up a
          throwaway username to confirm the duplicate-username branch
          still rejects a second attempt.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-2"
        title="6.2.6.2 Retrieving All Documents from MongoDB with Mongoose"
      >
        <p>
          DAOs implement high-level data operations based on lower-level
          Mongoose models. The Mongoose model <code>find</code>{" "}
          function retrieves all documents from a collection when you
          pass no predicate. The higher-level{" "}
          <code>findAllUsers</code>{" "}function below uses the lower-level{" "}
          <code>find</code>{" "}function to retrieve all the users from
          the <code>users</code>{" "}collection. That is the same
          function you already returned from the DAO in{" "}
          <SectionLink to="6.2.5" />; we repeat it here because the
          route, the client, and the Users screen all depend on it.
        </p>
        <CodeBlock
          language="js"
          name="findAllUsers"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`const findAllUsers = () => model.find();`}</CodeBlock>
        <p>
          Routes implement RESTful Web APIs that user interface
          clients can use to interact with server functionality. The
          route implemented below uses the{" "}
          <code>findAllUsers</code>{" "}function implemented by the DAO
          to retrieve all the users from the database. The route
          responds with the collection of users retrieved from the
          database. Confirm the route works by navigating to{" "}
          <code>http://localhost:4000/api/users</code>{" "}with the
          browser. You should see a JSON array whose length matches
          the document count Compass shows for{" "}
          <code>kambaz.users</code>. If the array is empty, import the
          JSON files from <SectionLink to="6.1.4" />{" "}again and
          refresh.
        </p>
        <CodeBlock
          language="js"
          name="findAllUsers route"
          file="webdev-server/Kambaz/Users/routes.js"
        >{`const findAllUsers = async (req, res) => {
  const users = await dao.findAllUsers();
  res.json(users);
};
app.get("/api/users", findAllUsers);`}</CodeBlock>
        <p>
          Meanwhile in the React user interface application, in{" "}
          <code>app/(kambaz)/account/client.ts</code>, implement the{" "}
          <code>findAllUsers</code>{" "}function shown below to send a
          GET request to the server and await the server&apos;s
          response containing an array of users in the{" "}
          <code>data</code>{" "}property. Use the axios instance that
          sends credentials so a later admin-only check can read the
          session cookie. The{" "}
          <code>USERS_API</code>{" "}constant already prefixes{" "}
          <code>httpServer()</code>{" "}or{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}so the same function
          works on localhost and on{" "}
          <OfficialLink href="https://vercel.com/">
            Vercel
          </OfficialLink>{" "}
          once you point the public env var at the new Render origin.
        </p>
        <CodeBlock
          language="ts"
          name="findAllUsers"
          file="app/(kambaz)/account/client.ts"
        >{`export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};`}</CodeBlock>
        <p>
          To display the array of users from the database, refactor
          the People Table component to accept an optional{" "}
          <code>users</code>{" "}parameter instead of retrieving the
          users from the local file system. Convert the People Table
          from a page into a component as shown below. Remove any
          filters that joined enrollments in the browser, since data
          access rules are best handled at the server. The table
          should render whatever array the parent passes; the Users
          screen will pass every user, and the course People page in{" "}
          <SectionLink to="6.4.3.5" />{" "}will pass only the students
          enrolled in that course. Style the table with Tailwind
          utility classes: a full-width collapsed
          table with a light line under the header row and striped odd rows (<code>w-full border-collapse</code>, <code>border-b border-neutral-300</code>, <code>odd:bg-neutral-50</code>).
        </p>
        <CodeBlock
          language="tsx"
          name="PeopleTable"
          file="app/(kambaz)/courses/[cid]/people/Table.tsx"
        >{`"use client";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details";

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers: () => void;
}) {
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline text-3xl text-neutral-500" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{user.loginId}</td>
              <td className="wd-section p-2">{user.section}</td>
              <td className="wd-role p-2">{user.role}</td>
              <td className="wd-last-activity p-2">{user.lastActivity}</td>
              <td className="wd-total-activity p-2">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`}</CodeBlock>
        <p>
          Create a new Users screen that fetches the users from the
          database and displays them with the People Table component
          as shown below. The screen is a Client Component because it
          keeps the array in <code>useState</code>{" "}and loads it in{" "}
          <code>useEffect</code>{" "}when the page mounts.{" "}
          <code>fetchUsers</code>{" "}calls the client, stores the
          array, and is later passed into the table so People Details
          can refresh the list after a create, update, or delete.
        </p>
        <CodeBlock
          language="tsx"
          name="Users"
          file="app/(kambaz)/account/users/page.tsx"
        >{`"use client";
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
}`}</CodeBlock>
        <p>
          Add a Users link to the Account Navigation sidebar that
          navigates to the Users screen only if the logged-in user has
          an <code>ADMIN</code>{" "}role. The signed-in user lives in
          Account Context from <ChapterLink to={4} />, not in a Redux
          slice, so read <code>currentUser</code>{" "}from{" "}
          <code>useAccountContext()</code>. Render the link with the
          same Tailwind pattern the other Account links already use:
          semibold black when the path ends with{" "}
          <code>users</code>, otherwise the red accent. To test, use
          Compass to update the role of an existing user or create a
          new user with an <code>ADMIN</code>{" "}role, sign in as that
          ADMIN user, and navigate to the Users screen. The sample
          users include <code>nick_fury</code>{" "}/ <code>fury123</code>{" "}as
          an administrator. Confirm that all users are displayed.
        </p>
        <CodeBlock
          language="tsx"
          name="AccountNavigation"
          file="app/(kambaz)/account/Navigation.tsx"
        >{`"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountNavigation() {
  const { currentUser } = useAccountContext();
  const pathname = usePathname() ?? "";
  return (
    <div id="wd-account-navigation">
      {/* existing Signin / Signup / Profile links */}
      {currentUser && currentUser.role === "ADMIN" && (
        <>
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
          <br />
        </>
      )}
    </div>
  );
}`}</CodeBlock>
        <p>
          Logged in as an ADMIN, navigate to the new Users screen and
          confirm it displays all the users. A faculty or student
          session should not show the link at all. If you see an empty
          table, open the Network tab and confirm{" "}
          <code>GET /api/users</code>{" "}returns 200 and a non-empty
          array; a 401 usually means the session cookie was not sent,
          which is why the client uses{" "}
          <code>axiosWithCredentials</code>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-3"
        title="6.2.6.3 Retrieving Documents by Predicate from MongoDB with Mongoose"
      >
        <p>
          Listing every user is useful for an administrator, but the
          moment the collection grows you will want to ask for a
          subset. Mongoose&apos;s <code>find</code>{" "}accepts a JSON
          object used to pattern-match documents in the collection.
          That object is a predicate: only documents that satisfy it
          are returned. In the User DAO, implement{" "}
          <code>findUsersByRole</code>{" "}that filters the users
          collection by the <code>role</code>{" "}property as shown
          below. The <code>{`{ role: role }`}</code>{" "}object means
          that documents will be filtered by their{" "}
          <code>role</code>{" "}property that matches the value{" "}
          <code>role</code>. Because the property name and the
          variable name are the same, you can write the shorthand{" "}
          <code>{`{ role }`}</code>{" "}and Mongoose will still compare
          the field to that string.
        </p>
        <CodeBlock
          language="js"
          name="predicates"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`const findUsersByRole = (role) => model.find({ role });
const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ],
  });
};`}</CodeBlock>
        <p>
          <code>findUsersByPartialName</code>{" "}goes a step further.
          Instead of an exact string match, it builds a regular
          expression from the text the administrator typed and asks
          MongoDB to match that pattern against either{" "}
          <code>firstName</code>{" "}or <code>lastName</code>. The{" "}
          <code>&quot;i&quot;</code>{" "}flag makes the match
          case-insensitive, so <code>thor</code>{" "}finds Thor. The{" "}
          <code>$or</code>{" "}operator means a document matches if
          either field matches; without it you would only search one
          column. Remember to export both functions from the object
          the DAO returns so the routes can call them.
        </p>
        <p>
          In the User routes, refactor the{" "}
          <code>findAllUsers</code>{" "}function so that it parses the{" "}
          <code>role</code>{" "}from the query string, and then uses
          the DAO to retrieve users with that particular role. If the
          query string has no <code>role</code>, fall through to the
          unfiltered list. A little later you will parse{" "}
          <code>name</code>{" "}the same way. Keeping both filters on
          one <code>GET /api/users</code>{" "}route avoids inventing a
          new URL for every search; the client encodes the predicate
          as <code>?role=FACULTY</code>{" "}or{" "}
          <code>?name=thor</code>.
        </p>
        <CodeBlock
          language="js"
          name="findAllUsers query"
          file="webdev-server/Kambaz/Users/routes.js"
        >{`const findAllUsers = async (req, res) => {
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
};`}</CodeBlock>
        <p>
          In the React user interface application, add{" "}
          <code>findUsersByRole</code>{" "}in the client so that it
          encodes the role in the query string of the URL as shown
          below. Then add <code>findUsersByPartialName</code>{" "}which
          encodes a name the same way. The server can use that name to
          filter users by their first and last name.
        </p>
        <CodeBlock
          language="ts"
          name="findUsersByRole"
          file="app/(kambaz)/account/client.ts"
        >{`export const findUsersByRole = async (role: string) => {
  const response = await axios.get(\`\${USERS_API}?role=\${role}\`);
  return response.data;
};
export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(\`\${USERS_API}?name=\${name}\`);
  return response.data;
};`}</CodeBlock>
        <p>
          In the Users screen, add a dropdown that invokes a{" "}
          <code>filterUsersByRole</code>{" "}event handler function with
          the selected role. The function updates a{" "}
          <code>role</code>{" "}state variable and requests from the
          server the list of users filtered by their role. If the
          administrator picks All Roles, the handler clears the filter
          and calls <code>fetchUsers</code>{" "}again. Confirm that
          selecting various roles actually filters the users by their
          role. Style the select with Tailwind — a bordered control
          about a quarter of the width (
          <code>w-1/4 rounded border</code>
          ).
        </p>
        <CodeBlock
          language="tsx"
          name="Users role filter"
          file="app/(kambaz)/account/users/page.tsx"
        >{`const [role, setRole] = useState("");
const filterUsersByRole = async (role: string) => {
  setRole(role);
  if (role) {
    const users = await client.findUsersByRole(role);
    setUsers(users);
  } else {
    fetchUsers();
  }
};
// in the JSX:
<select
  value={role}
  onChange={(e) => filterUsersByRole(e.target.value)}
  className="wd-select-role mb-2 w-1/4 rounded border border-neutral-300 px-2 py-1"
>
  <option value="">All Roles</option>
  <option value="STUDENT">Students</option>
  <option value="TA">Assistants</option>
  <option value="FACULTY">Faculty</option>
  <option value="ADMIN">Administrators</option>
</select>`}</CodeBlock>
        <p>
          Now practice filtering users by their first or last name.
          Create a new <code>name</code>{" "}state variable and a
          corresponding input field used to invoke{" "}
          <code>findUsersByPartialName</code>{" "}and update the{" "}
          <code>users</code>{" "}state variable with a subset of users
          that match the name. Confirm that typing a name in the input
          field actually filters the users by their first or last
          name. Note that the current implementation does not consider
          a combination of filtering by role and by name. Feel free to
          explore how you would go about filtering by both — for
          example by sending both query parameters and having the
          route apply <code>$and</code>{" "}on the server — but the
          required exercise is the two independent filters.
        </p>
        <CodeBlock
          language="tsx"
          name="Users name filter"
          file="app/(kambaz)/account/users/page.tsx"
        >{`const [name, setName] = useState("");
const filterUsersByName = async (name: string) => {
  setName(name);
  if (name) {
    const users = await client.findUsersByPartialName(name);
    setUsers(users);
  } else {
    fetchUsers();
  }
};
// in the JSX:
<input
  className="wd-filter-by-name me-2 mb-2 w-1/4 rounded border border-neutral-300 px-2 py-1"
  placeholder="Search people"
  value={name}
  onChange={(e) => filterUsersByName(e.target.value)}
/>`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-4"
        title="6.2.6.4 Retrieving Documents by Primary Key from MongoDB with Mongoose"
      >
        <p>
          A common database operation is to retrieve documents by
          their primary key. Listing and filtering give you arrays;
          clicking a name should load one document so you can read
          every field, edit it, or delete it. The DAO function below
          retrieves a user document by its primary key.{" "}
          <code>findById</code>{" "}is a convenience for{" "}
          <code>{`findOne({ _id: userId })`}</code>{" "}and is the usual
          Mongoose spelling when the identifier is the document&apos;s{" "}
          <code>_id</code>.
        </p>
        <CodeBlock
          language="js"
          name="findUserById"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`const findUserById = (userId) => model.findById(userId);
// route:
const findUserById = async (req, res) => {
  const user = await dao.findUserById(req.params.userId);
  res.json(user);
};
app.get("/api/users/:userId", findUserById);`}</CodeBlock>
        <p>
          Make the <code>findUserById</code>{" "}DAO function available
          as a RESTful Web API as shown above. The route reads{" "}
          <code>userId</code>{" "}from the path, awaits the DAO, and
          responds with that one document. Confirm it in the browser
          by opening{" "}
          <code>http://localhost:4000/api/users/</code>{" "}followed by
          an <code>_id</code>{" "}you copy from Compass. The user
          interface can then interact with the server using the{" "}
          <code>findUserById</code>{" "}client function shown below,
          which appends the id to <code>USERS_API</code>.
        </p>
        <CodeBlock
          language="ts"
          name="findUserById client"
          file="app/(kambaz)/account/client.ts"
        >{`export const findUserById = async (id: string) => {
  const response = await axios.get(\`\${USERS_API}/\${id}\`);
  return response.data;
};`}</CodeBlock>
        <p>
          In a new People Details component, use the client&apos;s{" "}
          <code>findUserById</code>{" "}function to retrieve the user
          when a faculty member clicks on the user&apos;s name. Parse
          a <code>uid</code>{" "}parameter and use it to retrieve the
          user by their ID when the component loads. If the{" "}
          <code>uid</code>{" "}does not exist, return{" "}
          <code>null</code>{" "}so that the component does not render
          on the screen. In <code>useEffect</code>, add{" "}
          <code>uid</code>{" "}as a dependency so that the component
          re-renders if you click on another user while the component
          is still displaying. The panel is a fixed column on the
          right: Tailwind <code>fixed top-0 end-0 bottom-0</code>{" "}
          with a white background and a shadow.
        </p>
        <CodeBlock
          language="tsx"
          name="PeopleDetails"
          file="app/(kambaz)/courses/[cid]/people/Details.tsx"
        >{`"use client";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../account/client";

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {
  const [user, setUser] = useState<any>({});
  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
  };
  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);
  if (!uid) return null;
  return (
    <div className="wd-people-details fixed top-0 end-0 bottom-0 z-20 w-full max-w-sm bg-white p-4 shadow">
      <button type="button" onClick={onClose} className="wd-close-details absolute end-2 top-2">
        <IoCloseSharp className="text-3xl" />
      </button>
      <div className="mt-2 text-center">
        <FaUserCircle className="me-2 text-4xl text-neutral-500" />
      </div>
      <hr />
      <div className="wd-name text-lg text-red-700">
        {user.firstName} {user.lastName}
      </div>
      <b>Roles:</b> <span className="wd-roles">{user.role}</span>
      <br />
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span>
      <br />
      <b>Section:</b> <span className="wd-section">{user.section}</span>
      <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span>
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a close button rendered as an X at the top right that
          hides the component by calling <code>onClose</code>, which
          the table uses to clear <code>showDetails</code>{" "}and
          navigate attention back to the Users screen. From the Users
          page, pass <code>fetchUsers</code>{" "}to People Table so
          that we can update the users if we create, update, or
          delete users from the People Details dialog. In the table,
          keep <code>showDetails</code>{" "}and{" "}
          <code>showUserId</code>{" "}in state. Clicking a name sets
          both; closing the panel sets <code>showDetails</code>{" "}to
          false and calls <code>fetchUsers</code>{" "}so the list
          reflects any edit that happened while the panel was open.
          Confirm that clicking on the name of a user displays the
          user&apos;s details. Also confirm that closing People
          Details hides the component.
        </p>
        <CodeBlock
          language="tsx"
          name="PeopleTable click"
          file="app/(kambaz)/courses/[cid]/people/Table.tsx"
        >{`const [showDetails, setShowDetails] = useState(false);
const [showUserId, setShowUserId] = useState<string | null>(null);
// render PeopleDetails when showDetails is true
{showDetails && (
  <PeopleDetails
    uid={showUserId}
    onClose={() => {
      setShowDetails(false);
      fetchUsers();
    }}
  />
)}
// on the name cell:
onClick={() => {
  setShowDetails(true);
  setShowUserId(user._id);
}}`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-5"
        title="6.2.6.5 Deleting a Document in MongoDB with Mongoose"
      >
        <p>
          To delete user documents from the users MongoDB collection,
          implement the <code>deleteUser</code>{" "}operation as shown
          below. The DAO function removes a single user document from
          the database based on its primary key.{" "}
          <code>findByIdAndDelete</code>{" "}is the Mongoose helper that
          both locates and removes the document;{" "}
          <code>deleteOne({`{ _id: userId }` })</code>{" "}is an
          equivalent spelling if you prefer to stay consistent with
          the other one-argument filters.
        </p>
        <CodeBlock
          language="js"
          name="deleteUser"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`const deleteUser = (userId) => model.findByIdAndDelete(userId);
app.delete("/api/users/:userId", async (req, res) => {
  const status = await dao.deleteUser(req.params.userId);
  res.json(status);
});`}</CodeBlock>
        <p>
          The route below makes the <code>deleteUser</code>{" "}
          operation available as a RESTful Web API for integration
          with the user interface, which encodes the id of the user
          to remove as a path parameter. In the React Web app,
          implement a client function that integrates with that
          route.
        </p>
        <CodeBlock
          language="ts"
          name="deleteUser client"
          file="app/(kambaz)/account/client.ts"
        >{`export const deleteUser = async (userId: string) => {
  const response = await axios.delete(\`\${USERS_API}/\${userId}\`);
  return response.data;
};`}</CodeBlock>
        <p>
          In the People Details component add buttons Cancel and
          Delete as shown below. The Delete button invokes a new{" "}
          <code>deleteUser</code>{" "}event handler function with{" "}
          <code>uid</code>, the ID of the user to delete. Pass a
          reference to <code>fetchUsers</code>{" "}as a parameter so
          People Details can notify People Table that a user has been
          removed and that the list of users must be updated. Use the
          client&apos;s <code>deleteUser</code>{" "}to remove the user,
          and then call <code>onClose</code>{" "}to hide the details
          component. The Cancel button just hides the details without
          removing any documents. Style Delete as a red Tailwind
          button and Cancel as a neutral one, floating to the end of
          the panel. Confirm that clicking the Cancel and Delete
          buttons actually work: Cancel leaves Compass unchanged;
          Delete removes the document and the table row disappears
          after the list refreshes.
        </p>
        <CodeBlock
          language="tsx"
          name="PeopleDetails delete"
          file="app/(kambaz)/courses/[cid]/people/Details.tsx"
        >{`const deleteUser = async (uid: string) => {
  await client.deleteUser(uid);
  onClose();
};
// in the JSX, after the activity fields:
<button
  type="button"
  onClick={() => deleteUser(uid)}
  className="wd-delete float-end rounded bg-red-600 px-3 py-1 text-sm text-white"
>
  Delete
</button>
<button
  type="button"
  onClick={onClose}
  className="wd-cancel float-end me-2 rounded bg-neutral-200 px-3 py-1 text-sm"
>
  Cancel
</button>`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-6"
        title="6.2.6.6 Updating a Document in MongoDB with Mongoose"
      >
        <p>
          The Mongoose update function updates documents in MongoDB
          databases. In the User DAO, implement{" "}
          <code>updateUser</code>{" "}as shown below to update a single
          document by first identifying it by its primary key, and
          then updating the matching fields in the{" "}
          <code>user</code>{" "}parameter. The <code>$set</code>{" "}
          operator is important: without it, Mongoose would replace
          the entire document with the payload and you would lose
          fields the editor did not send. With <code>$set</code>,
          only the keys present in <code>user</code>{" "}change.
        </p>
        <CodeBlock
          language="js"
          name="updateUser"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });`}</CodeBlock>
        <p>
          In the User routes, make the DAO function available as a
          RESTful Web API as shown below. Map a route that accepts a
          user&apos;s primary key as a path parameter, passes the ID
          and request body to the DAO function, and responds with the
          status. There is one extra responsibility that did not exist
          when the data lived in a file: the signed-in session may be
          a copy of the same document. If an administrator edits their
          own name, or if a user edits Profile and you later reuse
          this route, the session still holds the old{" "}
          <code>firstName</code>. After the database write, compare{" "}
          <code>req.session[&quot;currentUser&quot;]._id</code>{" "}to
          the path <code>userId</code>. If they match, merge the
          updates into the session object so the next Profile request
          and the Account Navigation role check see the new values.
          The React client still holds its own copy in Account
          Context; Profile and Sign in already call{" "}
          <code>setCurrentUser</code>{" "}with the response when the
          signed-in person is the one being saved.
        </p>
        <CodeBlock
          language="js"
          name="updateUser route"
          file="webdev-server/Kambaz/Users/routes.js"
        >{`const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userUpdates = req.body;
  await dao.updateUser(userId, userUpdates);
  const currentUser = req.session["currentUser"];
  if (currentUser && currentUser._id === userId) {
    req.session["currentUser"] = { ...currentUser, ...userUpdates };
  }
  res.json(currentUser);
};
app.put("/api/users/:userId", updateUser);`}</CodeBlock>
        <p>
          In the React client application, the client function{" "}
          <code>updateUser</code>{" "}sends user updates to the server
          to be saved to the database. Use the credentials instance
          because this write should run in a signed-in session.
        </p>
        <CodeBlock
          language="ts"
          name="updateUser client"
          file="app/(kambaz)/account/client.ts"
        >{`export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    \`\${USERS_API}/\${user._id}\`,
    user,
  );
  return response.data;
};`}</CodeBlock>
        <p>
          In the People Details component, add a{" "}
          <code>name</code>{" "}state variable to edit the first and
          last name of the user. Also add an{" "}
          <code>editing</code>{" "}state variable to toggle the input
          field that edits the name. Create a new{" "}
          <code>saveUser</code>{" "}function that splits the{" "}
          <code>name</code>{" "}state variable into{" "}
          <code>firstName</code>{" "}and <code>lastName</code>{" "}and
          sends an updated version of the user to the server. Also
          update the local <code>user</code>{" "}state variable, turn
          off editing, and close the dialog so People Table can
          refetch. Add pencil and check icons to turn editing on and
          off. Hide each icon based on the{" "}
          <code>editing</code>{" "}boolean state variable. Clicking the
          name of the user also turns editing on. If editing is on,
          hide the user&apos;s name and instead display an input field
          that shows the current user&apos;s{" "}
          <code>firstName</code>{" "}and <code>lastName</code>{" "}and
          edits the <code>name</code>{" "}state variable. Pressing the
          Enter key saves the updated user&apos;s details. Confirm
          users can be edited: change a last name, press Enter, reopen
          the row, and confirm Compass shows the new value.
        </p>
        <CodeBlock
          language="tsx"
          name="PeopleDetails edit"
          file="app/(kambaz)/courses/[cid]/people/Details.tsx"
        >{`const [name, setName] = useState("");
const [editing, setEditing] = useState(false);
const saveUser = async () => {
  const [firstName, lastName] = name.split(" ");
  const updatedUser = { ...user, firstName, lastName };
  await client.updateUser(updatedUser);
  setUser(updatedUser);
  setEditing(false);
  onClose();
};
// pencil when !editing, check when editing
// name text when !editing; input when editing
// input onKeyDown: if Enter, saveUser()`}</CodeBlock>
        <OnYourOwn>
          In People Details, add fields to edit email (type{" "}
          <code>email</code>) and role (the same dropdown as the
          filter). Persist them with <code>updateUser</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/people/Details.tsx, keep any extra field I added. Add sample controls to edit user.email (type=email) and user.role (select STUDENT/TA/FACULTY/ADMIN) and include them in saveUser. Do not rename my personal fields.`}
        >
          Ask the assistant to add email and role after your own extra
          field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-7"
        title="6.2.6.7 Creating New Documents in MongoDB with Mongoose"
      >
        <p>
          In the User DAO, implement the <code>createUser</code>{" "}
          function as shown below to insert a new user object into the{" "}
          <code>users</code>{" "}collection. Spread the incoming object,
          assign a fresh <code>uuidv4()</code>{" "}identifier, and call{" "}
          <code>model.create</code>. Make sure the incoming user
          object does not keep a leftover <code>_id</code>{" "}property
          since it can interfere with the database insert operation —
          a client that accidentally posts an empty string or a
          copied id would collide with an existing document. Strip
          that property if present, then assign the new uuid.
        </p>
        <CodeBlock
          language="js"
          name="createUser"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};`}</CodeBlock>
        <p>
          In the User routes, make the DAO operation available as a
          RESTful Web API for the user interface to interact with. The
          new user is posted to the route in the request&apos;s body.
          The DAO <code>createUser</code>{" "}function inserts the new
          user into the database and returns the newly inserted user
          which is sent back to the user interface in the response so
          the screen can append it without an extra GET.
        </p>
        <CodeBlock
          language="js"
          name="createUser route"
          file="webdev-server/Kambaz/Users/routes.js"
        >{`const createUser = async (req, res) => {
  const user = await dao.createUser(req.body);
  res.json(user);
};
app.post("/api/users", createUser);`}</CodeBlock>
        <p>
          In the React client application, implement a{" "}
          <code>createUser</code>{" "}client function to interact with
          the route created above. Post the new user object to the
          server as shown below.
        </p>
        <CodeBlock
          language="ts"
          name="createUser client"
          file="app/(kambaz)/account/client.ts"
        >{`export const createUser = async (user: any) => {
  const response = await axios.post(\`\${USERS_API}\`, user);
  return response.data;
};`}</CodeBlock>
        <p>
          In the Users screen, implement a new{" "}
          <code>createUser</code>{" "}event handler that sends a new
          user object to be inserted in the database. Use default
          values for the fields as shown and confirm that clicking the
          new + Users button actually creates the new user. The
          username includes <code>Date.now()</code>{" "}so two clicks
          in a row do not violate the unique username constraint.
          Optionally implement editing those fields in the People
          Details component so the administrator can replace{" "}
          <code>New User</code>{" "}with a real name after the insert.
        </p>
        <CodeBlock
          language="tsx"
          name="Users"
          file="app/(kambaz)/account/users/page.tsx"
        >{`const createUser = async () => {
  const user = await client.createUser({
    firstName: "New",
    lastName: \`User \${users.length + 1}\`,
    username: \`newuser\${Date.now()}\`,
    password: "password123",
    email: \`email\${users.length + 1}@neu.edu\`,
    section: "S101",
    role: "STUDENT",
  });
  setUsers([...users, user]);
};`}</CodeBlock>
        <p>
          The demo below is that Users screen. Find all, filter by
          role and name, open details, update, delete, and create.
          Work through each verb once so the same sequence feels
          familiar when you point the sibling server at Mongo and
          click the Account Users link.
        </p>
        <LiveDemo
          name="Lab6Users"
          file="app/labs/lab6/intermediates/6-2-6-Users.tsx"
          mode="styled"
        >
          <Lab6Users />
        </LiveDemo>
        <OnYourOwn>
          Create a user, filter by STUDENT, search part of the last
          name, edit the name, then delete the user you created.
        </OnYourOwn>
      </Section>
    </Section>
  );
}
