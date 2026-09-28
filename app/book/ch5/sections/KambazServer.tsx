import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";

export default function KambazServer() {
  return (
    <Section
      id="sec-5-4"
      title="5.4 Implementing the Kambaz Node.js HTTP Server"
    >
      <p>
        Kambaz is currently implemented entirely as a React
        application. Although various CRUD operations have been
        implemented to create, read, update, and delete courses and
        modules, these changes are not permanent and are lost when the
        browser is refreshed. To make the changes permanent, it is
        necessary to integrate the React user interface with a server
        that can access resources such as the file system, operating
        system, network, and database. In this section, server routes
        will be implemented to integrate the user interface with the
        server. In the next chapter, changes will be stored permanently
        in a MongoDB non-relational database.
      </p>
      <p>
        The URLs we register here —{" "}
        <code>/api/users/signin</code>,{" "}
        <code>/api/courses</code>,{" "}
        <code>/api/courses/:courseId/modules</code> — stay the same in{" "}
        <ChapterLink to={6} />. This chapter keeps the collections in
        process memory so you can see the HTTP contract without a
        database. The live{" "}
        <code>webdev-server/Kambaz</code>{" "}DAOs already contain later
        Mongo branches; ignore those until the next chapter and follow
        the in-memory listings below.
      </p>

      <Section
        level={3}
        id="sec-5-4-1"
        title="5.4.1 Migrating the Database to the Server"
      >
        <p>
          Previous chapters declared a Database component to
          consolidate all data files into a single access point.
          Ideally, the data should reside on the server side or within
          a dedicated database. In this chapter we are going to move
          the data to the server, with a transition to a database in
          the subsequent chapter. Begin by creating a folder named{" "}
          <code>Kambaz</code>{" "}at the root of the Node.js project.
          Inside the Kambaz folder, create a Database directory and
          copy all JSON files from the React project — the same arrays
          you exported in{" "}
          <SectionLink to="3.9.2" />. Then change the file extensions
          of the JSON files to JavaScript, for example, rename{" "}
          <code>users.json</code>{" "}to{" "}
          <code>users.js</code>{" "}and{" "}
          <code>courses.json</code>{" "}to{" "}
          <code>courses.js</code>. At the top of each newly converted
          JavaScript file, include an{" "}
          <code>export default</code>{" "}statement, as shown below.
        </p>
        <CodeBlock
          language="js"
          name="courses"
          file="webdev-server/Kambaz/Database/courses.js"
        >{`export default [
  { _id: "RS101", name: "Rocket Propulsion", number: "RS4550",
    startDate: "2023-01-10", endDate: "2023-05-15",
    department: "D123", credits: 4, description: "..." },
  // … remaining courses from Chapter 3
];`}</CodeBlock>
        <p>
          Do the same for all the JSON files and update the import
          statements in a barrel file that re-exports them as one
          object. Use the same data files from previous chapters. Feel
          free to modify the data in the files to customize the content
          or meet requirements in this chapter. Ignore unnecessary data
          files.
        </p>
        <CodeBlock
          language="js"
          name="database"
          file="webdev-server/Kambaz/Database/index.js"
        >{`import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import enrollments from "./enrollments.js";
export default { courses, modules, assignments, users, enrollments };`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-5-4-2"
        title="5.4.2 Integrating the Account Screens with the Server with RESTful Web APIs"
      >
        <p>
          The Data Access Object (DAO) design pattern organizes data
          access by grouping it based on data types or collections. The
          following <code>Kambaz/Users/dao.js</code>{" "}file implements
          various CRUD operations for handling the users array in the
          Database. Later sections in the chapter will create
          additional DAOs for each of the data arrays: courses,
          modules, and so on.
        </p>
        <CodeBlock
          language="js"
          name="Users DAO"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  let { users } = db;
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
  };
  const findAllUsers = () => users;
  const findUserById = (userId) => users.find((user) => user._id === userId);
  const findUserByUsername = (username) =>
    users.find((user) => user.username === username);
  const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);
  const updateUser = (userId, user) =>
    (users = users.map((u) => (u._id === userId ? user : u)));
  const deleteUser = (userId) =>
    (users = users.filter((u) => u._id !== userId));
  return {
    createUser, findAllUsers, findUserById, findUserByUsername,
    findUserByCredentials, updateUser, deleteUser,
  };
}`}</CodeBlock>
        <p>
          Like in the React project, install the{" "}
          <OfficialLink href="https://www.npmjs.com/package/uuid">
            uuid
          </OfficialLink>{" "}
          library in the Node.js project as shown below to generate
          unique identifiers when creating new instances of courses,
          modules, and other object instances.
        </p>
        <CodeBlock language="shell">{`npm install uuid`}</CodeBlock>
        <p>
          Routes post{" "}
          <code>/api/users/signin</code>,{" "}
          <code>/signup</code>,{" "}
          <code>/profile</code>,{" "}
          and{" "}
          <code>/signout</code>. The React client posts credentials
          with axios and then stores the returned user. Call{" "}
          <code>setCurrentUser</code>{" "}from{" "}
          <code>useAccountContext()</code>{" "}— the{" "}
          <code>AccountContext</code>{" "}from{" "}
          <ChapterLink to={4} />.
        </p>

        <Section
          level={3}
          id="sec-5-4-2-1"
          title="5.4.2.1 Integrating the React Sign In Screen with a RESTful Web API"
        >
          <p>
            DAOs provide an interface between an application and
            low-level database access, offering a high-level API to the
            rest of the application while abstracting the details and
            idiosyncrasies of using a particular database vendor.
            Similarly, routes create an interface between the HTTP
            network layer and the JavaScript object and function layer
            by transforming a stream of bits from a network connection
            request into a set of objects, maps, and function event
            handlers that are part of the client/server architecture in
            a multi-tiered application.
          </p>
          <p>
            The Node.js server uses routes to integrate with the user
            interface and implements DAOs to communicate with the
            Database. The server functions between these two layers,
            which is why it is often called the middle tier in a
            multi-tiered application. The following routes expose the
            database operations through a RESTful API, and the
            implementation of each function will be covered in the
            following sections. This chapter uses the Database
            component implemented in{" "}
            <code>Kambaz/Database/index.js</code>. Later chapters will
            refactor this by using an actual database.
          </p>
          <CodeBlock
            language="js"
            name="UserRoutes"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`import UsersDao from "./dao.js";
export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const signup = (req, res) => { };
  const signin = (req, res) => { };
  const signout = (req, res) => { };
  const profile = (req, res) => { };
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}`}</CodeBlock>
          <p>
            Import and configure the routes in{" "}
            <code>index.js</code>{" "}and pass a reference to the
            database to each of the route modules. Work after CORS,
            session, and{" "}
            <code>express.json()</code>{" "}are configured —{" "}
            <SectionLink to="5.4.3.1" />{" "}fills those in.
          </p>
          <CodeBlock
            language="js"
            name="index"
            file="webdev-server/index.js"
          >{`import express from "express";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
const app = express();
UserRoutes(app, db);
app.listen(process.env.PORT || 4000);`}</CodeBlock>
          <p>
            Routes implement RESTful Web APIs that clients can use to
            integrate with server functionality. The signin route
            extracts properties{" "}
            <code>username</code>{" "}and{" "}
            <code>password</code>{" "}from the request&apos;s body and
            passes them to the{" "}
            <code>findUserByCredentials</code>{" "}function implemented
            by the DAO. The resulting user is stored in a server
            variable <code>currentUser</code>{" "}to remember the logged
            in user —{" "}
            <SectionLink to="5.4.3" />{" "}moves that value into the
            session so more than one browser can be signed in. The user
            is then sent to the client in the response. Later sections
            will add error handling in case the user is not found in
            the database.
          </p>
          <CodeBlock
            language="js"
            name="signin route"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`const signin = (req, res) => {
  const { username, password } = req.body;
  currentUser = dao.findUserByCredentials(username, password);
  res.json(currentUser);
};
app.post("/api/users/signin", signin);`}</CodeBlock>
          <p>
            In the React user interface, under{" "}
            <code>app/(kambaz)/account</code>, implement the client
            shown below to integrate with the user routes implemented
            in the server. The client function{" "}
            <code>signin</code>{" "}posts a credentials object containing
            the username and password expected by the server. If the
            credentials are found, the response should contain the
            logged in user. Use{" "}
            <code>httpServer()</code>{" "}so the same helper from Lab 5
            points at localhost or Render.
          </p>
          <CodeBlock
            language="ts"
            name="account client"
            file="app/(kambaz)/account/client.ts"
          >{`import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";

const axiosWithCredentials = axios.create({ withCredentials: true });
const USERS_API = \`\${httpServer()}/api/users\`;

export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signin\`, credentials);
  return response.data;
};`}</CodeBlock>
          <p>
            Implement a Sign in screen users can use to authenticate
            with the application. The component declares a state
            variable <code>credentials</code>{" "}to edit the username
            and password. Clicking the Sign in button posts the
            credentials to the server using the{" "}
            <code>client.signin</code>{" "}function. When the server
            responds successfully, the currently logged in user is
            stored with{" "}
            <code>setCurrentUser</code>{" "}from{" "}
            <code>AccountContext</code>{" "}and you navigate to the
            Profile screen implemented in a later section. Account
            state is Context: call <code>setCurrentUser(user)</code>,
            not a Redux dispatch.
          </p>
          <CodeBlock
            language="tsx"
            name="Signin"
            file="app/(kambaz)/account/signin/page.tsx"
          >{`const { setCurrentUser } = useAccountContext();
const signin = async () => {
  const user = await client.signin(credentials);
  if (!user) return;
  setCurrentUser(user);
  router.push("/dashboard");
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-2-2"
          title="5.4.2.2 Integrating the React Sign Up Screen with a RESTful Web API"
        >
          <p>
            The DAO implements functions{" "}
            <code>createUser</code>{" "}and{" "}
            <code>findUserByUsername</code>. The{" "}
            <code>createUser</code>{" "}DAO function accepts a user
            object from the user interface and then inserts the user
            into the Database. The{" "}
            <code>findUserByUsername</code>{" "}accepts a username from
            the user interface and finds the user with the matching
            username. Those two functions implement the sign up
            operation for users to sign up to the application.
          </p>
          <p>
            The signup route expects a user object with at least the
            properties <code>username</code>{" "}and{" "}
            <code>password</code>. The DAO&apos;s{" "}
            <code>findUserByUsername</code>{" "}is called to check if a
            user with that username already exists. If such a user is
            found a 400 error status is returned along with an error
            message for display in the user interface. If the username
            is not already taken the user is inserted into the database
            and stored as the current user. The response includes the
            newly created user. The signup route is mapped to the{" "}
            <code>/api/users/signup</code>{" "}path.
          </p>
          <CodeBlock
            language="js"
            name="signup route"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`const signup = (req, res) => {
  const user = dao.findUserByUsername(req.body.username);
  if (user) {
    res.status(400).json({ message: "Username already in use" });
    return;
  }
  currentUser = dao.createUser(req.body);
  res.json(currentUser);
};
app.post("/api/users/signup", signup);`}</CodeBlock>
          <p>
            Meanwhile in the React user interface, implement a signup
            client that posts the new user to the Web API as shown
            below. If not already done so, implement a Sign up screen
            component that users can use to type their username and
            password, and post the credentials to the server for
            signing up. If the sign up is successful, store the user
            with <code>setCurrentUser</code>{" "}and navigate to the
            Profile screen. In the Sign in screen, create a Link to
            navigate to the Sign up screen. Confirm that you can sign
            up with a new username and password. Confirm it navigates
            to profile and shows the new user.
          </p>
          <CodeBlock
            language="ts"
            name="signup client"
            file="app/(kambaz)/account/client.ts"
          >{`export const signup = async (user: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signup\`, user);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Signup"
            file="app/(kambaz)/account/signup/page.tsx"
          >{`const { setCurrentUser } = useAccountContext();
const signup = async () => {
  const current = await client.signup(user);
  setCurrentUser(current);
  router.push("/account/profile");
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-2-3"
          title="5.4.2.3 Integrating the React Profile Screen with a RESTful Web API"
        >
          <p>
            In the User&apos;s DAO, implement{" "}
            <code>updateUser</code>{" "}to update a single document by
            first identifying it by its primary key, and then updating
            the matching fields in the user parameter. In the
            User&apos;s routes, make the DAO function available as a
            RESTful Web API. Map a route that accepts a user&apos;s
            primary key as a path parameter, passes the ID and request
            body to the DAO function, and responds with the updated
            user so the client can refresh Context.
          </p>
          <CodeBlock
            language="js"
            name="updateUser route"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`const updateUser = (req, res) => {
  const userId = req.params.userId;
  const userUpdates = req.body;
  dao.updateUser(userId, userUpdates);
  currentUser = dao.findUserById(userId);
  res.json(currentUser);
};
app.put("/api/users/:userId", updateUser);`}</CodeBlock>
          <p>
            In the React client application, add client function{" "}
            <code>updateUser</code>{" "}to send user updates to the
            server to be saved. In the Profile screen implement the{" "}
            <code>updateProfile</code>{" "}event handler to update the
            profile on the server and then{" "}
            <code>setCurrentUser</code>{" "}with the response. Add an
            Update button that invokes the new handler. Confirm that
            the profile changed by logging out and then logging back
            in.
          </p>
          <CodeBlock
            language="ts"
            name="updateUser client"
            file="app/(kambaz)/account/client.ts"
          >{`export const updateUser = async (user: { _id: string }) => {
  const response = await axiosWithCredentials.put(\`\${USERS_API}/\${user._id}\`, user);
  return response.data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-2-4"
          title="5.4.2.4 Retrieving the Profile from the Server"
        >
          <p>
            When a successful sign in occurs, the account information
            is stored in a server variable called{" "}
            <code>currentUser</code>. The variable retains the
            signed-in user information as long as the server is
            running. The Sign in screen copies that user from the
            server into{" "}
            <code>AccountContext</code>{" "}and then navigates to the
            Profile screen. If the browser reloads, the Context state
            is cleared and the user appears logged out. To address
            this, the browser must check whether someone is already
            logged in on the server and, if so, update the copy in
            Context. Create a route on the server to provide access to{" "}
            <code>currentUser</code>{" "}as shown below.
          </p>
          <CodeBlock
            language="js"
            name="profile route"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`const profile = (req, res) => {
  res.json(currentUser);
};
app.post("/api/users/profile", profile);`}</CodeBlock>
          <p>
            Then in the React Web app, implement a function to retrieve
            the account information from that server route. Create a
            Session-style fetch that runs when Kambaz first loads —
            call <code>client.profile()</code>, then{" "}
            <code>setCurrentUser</code>{" "}from{" "}
            <code>AccountContext</code>. Kambaz is already wrapped
            with{" "}
            <code>AccountProvider</code>{" "}in{" "}
            <code>app/(kambaz)/layout.tsx</code>. You can fetch the
            profile from a small client component under that provider,
            or from Profile itself on mount. Confirm that it works by
            signing in, and then from the Profile screen, reload the
            browser. Make sure the user information still renders
            correctly once sessions are configured in{" "}
            <SectionLink to="5.4.3" />.
          </p>
          <CodeBlock
            language="ts"
            name="profile client"
            file="app/(kambaz)/account/client.ts"
          >{`export const profile = async () => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/profile\`);
  return response.data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-2-5"
          title="5.4.2.5 Integrating Signout with a RESTful Web API"
        >
          <p>
            Implement a route for users to sign out that resets the{" "}
            <code>currentUser</code>{" "}to{" "}
            <code>null</code>{" "}on the server. In the React user
            interface, add a client function that can post to the
            signout route. In the Profile screen refactor the signout
            function to invoke the signout client function, clear
            Context with{" "}
            <code>setCurrentUser(null)</code>, and then navigate to
            the Sign in screen. Confirm that you can sign out and
            navigate to the Sign in screen.
          </p>
          <CodeBlock
            language="js"
            name="signout route"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`const signout = (req, res) => {
  currentUser = null;
  res.sendStatus(200);
};
app.post("/api/users/signout", signout);`}</CodeBlock>
          <CodeBlock
            language="ts"
            name="signout client"
            file="app/(kambaz)/account/client.ts"
          >{`export const signout = async () => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signout\`);
  return response.data;
};`}</CodeBlock>
          <OnYourOwn>
            Sign in as <code>iron_man</code>{" "}/{" "}
            <code>stark123</code>, open Profile, and confirm the name
            came from Express — not only local JSON.
          </OnYourOwn>
          <WithAI
            prompt={`Do not invent a new user. List the Users DAO functions and the four /api/users auth routes (signin, signup, profile, signout) as a short checklist matching Chapter 5.`}
          >
            Ask the assistant for the auth checklist — you still wire
            Sign in:
          </WithAI>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-4-3"
        title="5.4.3 Supporting Multiple User Sessions"
      >
        <p>
          The user authentication implemented so far is simple but
          supports only one signed-in user at a time. Web applications
          typically support multiple users signed in simultaneously.
          This section describes how to add session handling to the
          Node.js server to allow multiple users to be signed in at the
          same time.
        </p>

        <Section
          level={3}
          id="sec-5-4-3-1"
          title="5.4.3.1 Installing and Configuring Server Sessions"
        >
          <p>
            First, it is necessary to narrow down who is allowed to
            authenticate. Configure CORS to support cookies and
            restrict network access to come only from the React
            application. Install{" "}
            <OfficialLink href="https://www.npmjs.com/package/express-session">
              express-session
            </OfficialLink>{" "}
            and{" "}
            <OfficialLink href="https://www.npmjs.com/package/dotenv">
              dotenv
            </OfficialLink>{" "}
            to maintain application sessions and read configurations
            from environment variables on the server.
          </p>
          <CodeBlock language="shell">{`npm install express-session
npm install dotenv`}</CodeBlock>
          <p>
            In a new <code>.env</code>{" "}file at the root of the Node
            project, declare the following environment variables. Do
            not commit that file —{" "}
            <SectionLink to="5.5.1" />{" "}already listed it in{" "}
            <code>.gitignore</code>.
          </p>
          <CodeBlock language="shell">{`SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase`}</CodeBlock>
          <p>
            In <code>index.js</code>, import the dotenv library to
            determine whether the application is running in the
            development environment, and configure the session as
            shown below. Make sure to configure sessions{" "}
            <em>after</em>{" "}configuring cors and{" "}
            <em>before</em>{" "}
            <code>express.json()</code>{" "}and the routes. In
            production set <code>proxy</code>,{" "}
            <code>sameSite: &quot;none&quot;</code>, and{" "}
            <code>secure</code>{" "}cookies so the Vercel origin can
            send credentials to Render. The following configuration has
            been tested on Google Chrome and Apple Safari.
          </p>
          <CodeBlock
            language="js"
            name="session"
            file="webdev-server/index.js"
          >{`import "dotenv/config";
import session from "express-session";
const app = express();
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());`}</CodeBlock>
          <p>
            Store{" "}
            <code>req.session.currentUser</code>{" "}on signin and
            signup instead of a module-level variable. The signup route
            retrieves the username from the request body. If a user
            with that username already exists, an error is returned.
            Otherwise, create the new user and store it in the
            session&apos;s{" "}
            <code>currentUser</code>{" "}property to remember that this
            new user is now the currently logged-in user. An existing
            user can identify themselves by providing credentials. The
            signin route looks up the user by their credentials, stores
            it in the session, and responds with the user if they
            exist; otherwise it responds with a 401. If a user has
            already signed in, the current user can be retrieved from
            the session by using the profile route; if there is no
            current user, return 401. Users can be signed out by
            destroying the session. If a user updates their profile,
            then the session must be kept in synch.
          </p>
          <CodeBlock
            language="js"
            name="session auth"
            file="webdev-server/Kambaz/Users/routes.js"
          >{`const signin = (req, res) => {
  const { username, password } = req.body;
  const currentUser = dao.findUserByCredentials(username, password);
  if (currentUser) {
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  } else {
    res.status(401).json({ message: "Unable to login. Try again later." });
  }
};
const profile = (req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  res.json(currentUser);
};
const signout = (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-3-2"
          title="5.4.3.2 Configuring Axios to Support Server Sessions"
        >
          <p>
            By default axios does not support cookies. To configure
            axios to include cookies in requests, use{" "}
            <code>axios.create()</code>{" "}to create an instance of the
            library that includes cookies for credentials as shown
            below. Then replace all occurrences of the axios library
            used for account and enrolled-course calls with this new
            version <code>axiosWithCredentials</code>.
          </p>
          <CodeBlock
            language="ts"
            name="axiosWithCredentials"
            file="app/(kambaz)/account/client.ts"
          >{`import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signin\`, credentials);
  return response.data;
};
export const profile = async () => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/profile\`);
  return response.data;
};`}</CodeBlock>
          <p>
            Every signed-in request — profile, signout, update user,
            and later{" "}
            <code>/api/users/current/courses</code> — must use that
            instance, or the session cookie never leaves the browser
            and Express will treat you as anonymous.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-4-5"
        title="5.4.5 Creating a RESTful Web API for Courses"
      >
        <p>
          Previous chapters implemented CRUD operations to create,
          read, update and delete courses in the Kambaz Dashboard.
          These changes were transient and were lost when users
          refreshed the browser. This section demonstrates implementing
          a RESTful Web API to integrate the Dashboard and Courses
          screen with the server. The API will migrate the CRUD
          operations from the user interface to the server where they
          belong.
        </p>
        <p>
          <ChapterLink to={4} />{" "}kept the course list in a Zustand{" "}
          <code>useCoursesStore</code>. Once
          Express owns the data, Dashboard fetches on load with axios
          and keeps the result in component state — the Zustand seed
          from Chapter 4 is no longer the source of truth. The signed-in
          user still lives in{" "}
          <code>AccountContext</code>.
        </p>

        <Section
          level={3}
          id="sec-5-4-5-1"
          title="5.4.5.1 Retrieving Courses"
        >
          <p>
            Now that the Database has been moved to the server, it must
            be made available to the React client application through a
            Web API. The exercises below make the courses accessible at{" "}
            <code>http://localhost:4000/api/courses</code>{" "}for the
            React user interface to integrate. First implement a DAO to
            retrieve all courses from the Database, then a route that
            uses that DAO.
          </p>
          <CodeBlock
            language="js"
            name="Courses DAO"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`import { v4 as uuidv4 } from "uuid";
export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses;
  }
  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id,
      ),
    );
  }
  return { findAllCourses, findCoursesForEnrolledUser };
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="CourseRoutes"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`import CoursesDao from "./dao.js";
export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const findAllCourses = (req, res) => {
    res.json(dao.findAllCourses());
  };
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    res.json(dao.findCoursesForEnrolledUser(userId));
  };
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}`}</CodeBlock>
          <p>
            In <code>index.js</code>{" "}import the new routes and pass a
            reference to the express module. Make sure to work AFTER
            the cors, session, and json{" "}
            <code>use</code>{" "}statements. Point your browser to{" "}
            <code>http://localhost:4000/api/courses</code>{" "}and
            confirm the server responds with an array of courses. Since
            the Dashboard displays courses a user is enrolled in,
            implement{" "}
            <code>findCoursesForEnrolledUser</code>{" "}as shown above.
            When <code>userId === &quot;current&quot;</code>{" "}the
            route reads the session and returns enrolled courses only
            — 401 if nobody is signed in.
          </p>
          <p>
            Back in the user interface, create{" "}
            <code>app/(kambaz)/courses/client.ts</code>{" "}that
            implements all the course-related communication between the
            user interface and the server. Start with{" "}
            <code>fetchAllCourses</code>, then{" "}
            <code>findMyCourses</code>{" "}that retrieves the current
            user&apos;s courses using cookies. In the Dashboard use{" "}
            <code>useEffect</code>{" "}to fetch the courses from the
            server on component load. Use the{" "}
            <code>currentUser</code>{" "}from{" "}
            <code>AccountContext</code>{" "}as a dependency so that if a
            different user logs in, the courses will be reloaded from
            the server. Remove Database references from the user
            interface since we do not need them anymore. Also
            initialize the courses state variable as empty since we
            will not have the JSON file anymore. Also remove the
            filtering of courses by enrollments since the server is
            already doing that. Restart the server and user interface
            to confirm that the Dashboard renders the courses the
            current user is enrolled in. Sign in as different users and
            confirm only the courses the user is enrolled in display.
          </p>
          <CodeBlock
            language="ts"
            name="courses client"
            file="app/(kambaz)/courses/client.ts"
          >{`import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";
const axiosWithCredentials = axios.create({ withCredentials: true });
const COURSES_API = \`\${httpServer()}/api/courses\`;
const USERS_API = \`\${httpServer()}/api/users\`;
export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(\`\${USERS_API}/current/courses\`);
  return data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-5-2"
          title="5.4.5.2 Creating New Courses"
        >
          <p>
            Implement a route that creates a new course and adds it to
            the Database. The new course is passed in the HTTP body
            from the client and is appended to the end of the courses
            array. The new course is given a new unique identifier and
            sent back to the client in the response. When a course is
            created, it needs to be associated with the creator. In{" "}
            <code>Kambaz/Enrollments/dao.js</code>, implement{" "}
            <code>enrollUserInCourse</code>{" "}to enroll, or associate,
            a user to a course. Creating a course posts to{" "}
            <code>/api/users/current/courses</code>{" "}and enrolls the
            current user.
          </p>
          <CodeBlock
            language="js"
            name="createCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  db.courses = [...db.courses, newCourse];
  return newCourse;
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="enrollUserInCourse"
            file="webdev-server/Kambaz/Enrollments/dao.js"
          >{`function enrollUserInCourse(userId, courseId) {
  const { enrollments } = db;
  enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="createCourse route"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const createCourse = (req, res) => {
  const currentUser = req.session["currentUser"];
  const newCourse = dao.createCourse(req.body);
  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
  res.json(newCourse);
};
app.post("/api/users/current/courses", createCourse);`}</CodeBlock>
          <p>
            In the course client, add a{" "}
            <code>createCourse</code>{" "}function that posts a new
            course to the server and returns the brand new course. In
            the Dashboard, add an{" "}
            <code>onAddCourse</code>{" "}event handler that posts the
            new course and then reloads the list. Refactor the Add
            button to use that handler. Confirm that creating a new
            course updates the user interface with the added course.
          </p>
          <CodeBlock
            language="ts"
            name="createCourse client"
            file="app/(kambaz)/courses/client.ts"
          >{`export const createCourse = async (course: unknown) => {
  const { data } = await axiosWithCredentials.post(
    \`\${USERS_API}/current/courses\`,
    course,
  );
  return data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-5-3"
          title="5.4.5.3 Deleting a Course"
        >
          <p>
            Implement a route that removes a course and all enrollments
            associated with the course. First implement a{" "}
            <code>deleteCourse</code>{" "}DAO function that filters the
            course by its ID and then filters out all enrollments by
            the course&apos;s ID. In the Course&apos;s routes,
            implement a delete route that parses the course&apos;s ID
            from the URL. Remember to group callback functions at the
            top and the route declarations at the bottom.
          </p>
          <CodeBlock
            language="js"
            name="deleteCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function deleteCourse(courseId) {
  const { courses, enrollments } = db;
  db.courses = courses.filter((course) => course._id !== courseId);
  db.enrollments = enrollments.filter((enrollment) => enrollment.course !== courseId);
}`}</CodeBlock>
          <p>
            In the course client, add a{" "}
            <code>deleteCourse</code>{" "}function that deletes an
            existing course from the server. In the Dashboard,
            implement <code>onDeleteCourse</code>{" "}to use the client
            and then drop that course from local state. Reimplement the
            Delete button to use the new handler. Confirm clicking
            Delete actually removes the course from the Dashboard.
          </p>
          <CodeBlock
            language="ts"
            name="deleteCourse client"
            file="app/(kambaz)/courses/client.ts"
          >{`export const deleteCourse = async (courseId: string) => {
  const { data } = await axios.delete(\`\${COURSES_API}/\${courseId}\`);
  return data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-5-4"
          title="5.4.5.4 Updating a Course"
        >
          <p>
            In the Course&apos;s DAO, implement{" "}
            <code>updateCourse</code>{" "}to update a course in the
            Database. First look up the course by its ID and then apply
            the updates to the course. In the Course&apos;s routes,
            implement a PUT route that parses the id of the course as a
            path parameter and uses the{" "}
            <code>updateCourse</code>{" "}DAO function to update the
            corresponding course with the updates in the HTTP request
            body.
          </p>
          <CodeBlock
            language="js"
            name="updateCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function updateCourse(courseId, courseUpdates) {
  const { courses } = db;
  const course = courses.find((course) => course._id === courseId);
  Object.assign(course, courseUpdates);
  return course;
}`}</CodeBlock>
          <p>
            In the course client, add an{" "}
            <code>updateCourse</code>{" "}function that PUTs an existing
            course. In the Dashboard, implement{" "}
            <code>onUpdateCourse</code>{" "}so that it uses the client
            and then swaps the old corresponding course with the new
            version in state. Refactor the Update button so that it
            uses the new handler. Confirm that clicking Update actually
            updates the course in the Dashboard. Fetch on load and
            after Add / Update / Delete so the list stays aligned with
            Express.
          </p>
          <CodeBlock
            language="ts"
            name="updateCourse client"
            file="app/(kambaz)/courses/client.ts"
          >{`export const updateCourse = async (course: { _id: string }) => {
  const { data } = await axios.put(\`\${COURSES_API}/\${course._id}\`, course);
  return data;
};`}</CodeBlock>
          <LiveDemo
            name="Dashboard"
            file="app/(kambaz)/dashboard/page.tsx"
            mode="styled"
          >
            <Dashboard />
          </LiveDemo>
          <OnYourOwn>
            Sign in, Add a course, refresh, and confirm it is still
            listed while Express is running.
          </OnYourOwn>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-4-6"
        title="5.4.6 Creating a RESTful Web API for Modules"
      >
        <p>
          Now let us do the same thing we did for the courses, but for
          the modules. We will need routes that deal with the modules
          similar to the operations we implemented for the courses. We
          will need to implement all the basic CRUD operations: create
          modules, read/retrieve modules, update modules and delete
          modules. The main difference will be that modules exist
          within the context of a particular course. Each course has a
          different set of modules, so the routes will need to take
          into account the course ID for which the modules we are
          operating on. Nested in the UI, flat on the server:{" "}
          <code>GET/POST /api/courses/:courseId/modules</code>,{" "}
          <code>PUT/DELETE /api/modules/:moduleId</code>.
        </p>
        <p>
          The Modules screen fetches into component state with the
          same client functions. Chapter 4&apos;s Zustand module store
          is no longer the source of truth once Express is wired.
        </p>

        <Section
          level={3}
          id="sec-5-4-6-1"
          title="5.4.6.1 Retrieving a Course's Modules"
        >
          <p>
            Create a DAO for the Modules to implement module data
            access from the Database. Start by implementing{" "}
            <code>findModulesForCourse</code>{" "}to retrieve a
            course&apos;s modules by its ID. Create a new routes file
            for the Module with a route to retrieve the modules for a
            course by its ID encoded in the path. Parse the course ID
            from the path and then use the module&apos;s DAO. In{" "}
            <code>index.js</code>, import the new route file and pass
            it a reference to the app and db.
          </p>
          <CodeBlock
            language="js"
            name="Modules DAO"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`export default function ModulesDao(db) {
  function findModulesForCourse(courseId) {
    const { modules } = db;
    return modules.filter((module) => module.course === courseId);
  }
  return { findModulesForCourse };
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="ModuleRoutes"
            file="webdev-server/Kambaz/Modules/routes.js"
          >{`import ModulesDao from "./dao.js";
export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);
  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findModulesForCourse(courseId));
  };
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
}`}</CodeBlock>
          <p>
            In the courses client, create{" "}
            <code>findModulesForCourse</code>{" "}to integrate the user
            interface with the server. In the Modules component, using
            a <code>useEffect</code>, invoke that client function and
            store the modules from the server. Remove the filter since
            modules are already filtered on the server. Confirm that
            navigating to a course populates the corresponding
            modules.
          </p>
          <CodeBlock
            language="ts"
            name="findModulesForCourse"
            file="app/(kambaz)/courses/client.ts"
          >{`export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(\`\${COURSES_API}/\${courseId}/modules\`);
  return response.data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-6-2"
          title="5.4.6.2 Creating Modules for a Course"
        >
          <p>
            To create a new module in the Database, implement{" "}
            <code>createModule</code>{" "}in the Module&apos;s DAO. The
            function accepts the new module as a parameter, sets its
            primary key, and then appends the new module to the
            Database&apos;s module array. In the Module&apos;s routes,
            implement a POST Web API. Parse the course&apos;s ID from
            the path and the new module from the request&apos;s body.
            Set the new module&apos;s{" "}
            <code>course</code>{" "}property to the course&apos;s ID so
            that the module knows what course it belongs to. Respond
            with the new module.
          </p>
          <CodeBlock
            language="js"
            name="createModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  db.modules = [...db.modules, newModule];
  return newModule;
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="createModuleForCourse"
            file="webdev-server/Kambaz/Modules/routes.js"
          >{`const createModuleForCourse = (req, res) => {
  const { courseId } = req.params;
  const module = { ...req.body, course: courseId };
  const newModule = dao.createModule(module);
  res.json(newModule);
};
app.post("/api/courses/:courseId/modules", createModuleForCourse);`}</CodeBlock>
          <p>
            In the user interface, implement a{" "}
            <code>createModuleForCourse</code>{" "}client function that
            posts new modules to the server. Encode the course&apos;s
            ID in the URL so the server knows what course the module
            belongs to. In the Modules screen, implement an{" "}
            <code>onCreateModuleForCourse</code>{" "}event handler that
            uses that client and then appends the created module to
            state. Update ModulesControls so Add uses the new handler.
            Confirm that new modules are created for the current
            course.
          </p>
          <CodeBlock
            language="ts"
            name="createModuleForCourse client"
            file="app/(kambaz)/courses/client.ts"
          >{`export const createModuleForCourse = async (courseId: string, module: unknown) => {
  const response = await axios.post(\`\${COURSES_API}/\${courseId}/modules\`, module);
  return response.data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-6-3"
          title="5.4.6.3 Deleting a Module"
        >
          <p>
            In the Modules DAO, implement{" "}
            <code>deleteModule</code>{" "}to remove a module from the
            Database by its ID. In the Modules router file, implement a
            route that handles an HTTP DELETE to remove a module by its
            ID. Parse the module&apos;s ID from the path and use the
            DAO. In the courses client, implement{" "}
            <code>deleteModule</code>: pass it the ID of the module to
            be removed, encode it in a URL, and send it as an HTTP
            DELETE to the server.
          </p>
          <CodeBlock
            language="js"
            name="deleteModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function deleteModule(moduleId) {
  const { modules } = db;
  db.modules = modules.filter((module) => module._id !== moduleId);
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="deleteModule route"
            file="webdev-server/Kambaz/Modules/routes.js"
          >{`const deleteModule = (req, res) => {
  const { moduleId } = req.params;
  dao.deleteModule(moduleId);
  res.sendStatus(200);
};
app.delete("/api/modules/:moduleId", deleteModule);`}</CodeBlock>
          <p>
            In the Modules screen, implement{" "}
            <code>onRemoveModule</code>{" "}to remove the module from
            the server and then filter it from state. In
            ModuleControlButtons, update the delete attribute to use
            the new handler. Confirm that clicking the trashcan of a
            module removes it. Refresh the screen to make sure that the
            module is permanently deleted while Express is running.
          </p>
          <CodeBlock
            language="ts"
            name="deleteModule client"
            file="app/(kambaz)/courses/client.ts"
          >{`export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(\`\${MODULES_API}/\${moduleId}\`);
  return response.data;
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-4-6-4"
          title="5.4.6.4 Update Module"
        >
          <p>
            In the Module&apos;s DAO, implement{" "}
            <code>updateModule</code>{" "}to update a module in the
            Database by its ID. First look up the module by its ID and
            then apply the updates. In the Module&apos;s routes file,
            implement an HTTP PUT request handler that parses the ID of
            the module from the URL and the module updates from the
            HTTP request body. In the client, encode the ID of the
            module in a URL and send the module updates in the body of
            an HTTP PUT. In the Modules screen, implement{" "}
            <code>onUpdateModule</code>. In the{" "}
            <code>onKeyDown</code>{" "}event handler, invoke that save
            when the user presses Enter. Confirm that updating the
            module in the user interface actually modifies the module
            on the server. Refresh the screen to make sure that the
            module has been modified.
          </p>
          <CodeBlock
            language="js"
            name="updateModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function updateModule(moduleId, moduleUpdates) {
  const { modules } = db;
  const module = modules.find((module) => module._id === moduleId);
  Object.assign(module, moduleUpdates);
  return module;
}`}</CodeBlock>
          <CodeBlock
            language="ts"
            name="updateModule client"
            file="app/(kambaz)/courses/client.ts"
          >{`export const updateModule = async (module: { _id: string }) => {
  const { data } = await axios.put(\`\${MODULES_API}/\${module._id}\`, module);
  return data;
};`}</CodeBlock>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-4-7"
        title="5.4.7 Assignments and Assignments Editor (On Your Own)"
      >
        <p>
          In your Node.js server application, implement routes for
          creating, retrieving, updating, and deleting assignments. In
          the React Web application, create an assignment client file
          that uses axios to send POST, GET, PUT, and DELETE HTTP
          requests to integrate the React application with the server
          application. In the React user interface, refactor the
          Assignments and Assignment Editor screens implemented in
          earlier chapters to use the new client file to CRUD
          assignments. New assignments, updates to assignments, and
          deleted assignments should persist if the screens are
          refreshed as long as the server is running.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-4-8"
        title="5.4.8 Enrollments (On Your Own)"
      >
        <p>
          In your Node.js server application, implement routes to
          support the Enrollments screen. Users should be able to
          enroll and unenroll from courses. In the React application,
          implement an enrollments client that uses axios to integrate
          with the routes in the server. Enrollments should persist as
          long as the server is running. The live courses client
          already exposes{" "}
          <code>enrollIntoCourse</code>{" "}and{" "}
          <code>unenrollFromCourse</code>{" "}against{" "}
          <code>/api/users/:uid/courses/:cid</code>{" "}if you want a
          starting URL shape.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-4-9"
        title="5.4.9 People Table (Optional)"
      >
        <p>
          In your Node.js server application, implement routes to
          support the People screen. Users should be able to see all
          users enrolled in the course. Faculty should be able to
          create, update, and delete users. In the React application,
          implement a users client that uses axios to integrate with
          the routes in the server. User changes should persist as long
          as the server is running.
        </p>
      </Section>
    </Section>
  );
}
