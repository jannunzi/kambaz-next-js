import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ConnectionStatus from "@/app/labs/lab6/intermediates/6-2-1-Connection";
import Lab6Todos from "@/app/labs/lab6/intermediates/6-2-5-Todos";

export default function Programming() {
  return (
    <Section id="sec-6-2" title="6.2 Programming with a MongoDB Database">
      <p>
        In the previous section we practiced interacting with the
        MongoDB database through the Compass graphical interface. That
        is all well and good to make occasional simple manual updates
        and queries to confirm the data behaves as expected, but
        applications need to interact with the database
        programmatically with libraries such as{" "}
        <OfficialLink href="https://mongoosejs.com/">
          Mongoose
        </OfficialLink>
        . Compass is a human tool; Mongoose is the library your Node
        process uses so Sign in, Dashboard, and the Users screen can
        create, read, update, and delete documents without anyone
        clicking Insert. The following sections describe how to
        install, configure, and connect a{" "}
        <OfficialLink href="https://nodejs.org/">
          Node.js
        </OfficialLink>{" "}
        application to a MongoDB database server using the Mongoose
        library. The final part of this chapter discusses how to
        configure the application to integrate to a MongoDB database
        hosted in MongoDB&apos;s Atlas cloud service, and how to point
        a new{" "}
        <OfficialLink href="https://render.com/">
          Render
        </OfficialLink>{" "}
        deployment at that remote URI. Do all your work in a new
        GitHub branch called <code>a6</code>{" "}in both the React and
        Node.js projects — <code>webdev-client</code>{" "}and the sibling{" "}
        <code>webdev-server</code>.
      </p>

      <Section
        level={3}
        id="sec-6-2-1"
        title="6.2.1 Installing and Connecting to a MongoDB Database"
      >
        <p>
          The Mongoose library implements a set of APIs and
          abstractions for applications to interact with a MongoDB
          database. Instead of opening a raw driver connection and
          writing collection names as strings in every call, you
          declare schemas and models once and then call{" "}
          <code>find</code>, <code>create</code>,{" "}
          <code>updateOne</code>, and <code>deleteOne</code>{" "}on those
          models. To use the Mongoose library, install it from the root
          of the Node.js project as shown below.
        </p>
        <CodeBlock language="shell">{`cd webdev-server
npm install mongoose`}</CodeBlock>
        <p>
          To connect to the database server programmatically, import
          the Mongoose library and then use the{" "}
          <code>connect</code>{" "}function as shown below. The URL in
          the <code>connect</code>{" "}function is called the{" "}
          <strong>connection string</strong>{" "}and is currently
          referring to a MongoDB server instance running on the
          localhost machine — the current laptop or desktop — listening
          at port 27017 and the <code>kambaz</code>{" "}database existing
          in that server, the same instance Compass just opened. In a
          later section we will revisit the connection string and
          configure it to connect to a database server running in a
          remote machine hosted by MongoDB&apos;s Atlas cloud service.
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import express from "express";
import mongoose from "mongoose";
// load the mongoose library
// ...
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);
// connect to the kambaz database
const app = express();
// ...`}</CodeBlock>
        <p>
          Place the <code>connect</code>{" "}call near the top of{" "}
          <code>index.js</code>{" "}so the connection is established
          before any route handler tries to run a query. Wrap that
          call in <code>connectDatabase()</code>{" "}so a missing or
          bad URI doesn&apos;t crash the app. If{" "}
          <code>mongod</code>{" "}is not running, Mongoose will retry
          and then fail; start the service or the command-line process
          from <SectionLink to="6.1.1" />{" "}before you start{" "}
          <code>nodemon</code>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-2"
        title="6.2.2 Configuring Connection Strings as Environment Variables"
      >
        <p>
          Instead of hard coding the connection string in the source
          code, it is better to configure it as an environment variable
          and then reference it from the code. This will come in handy
          when the server application is deployed to a remote service
          such as Render or Heroku and the connection string can be
          configured to reference the online remote database running on
          MongoDB&apos;s Atlas cloud service. You will create that
          cluster in <SectionLink to="6.3" />; for now the local URI
          is enough, and the same variable name will later hold the{" "}
          <code>mongodb+srv://</code>{" "}string. In the{" "}
          <code>.env</code>{" "}file of the Node project — not the
          Next.js <code>.env.local</code> — declare the following
          connection string environment variable alongside the session
          keys you already set in <ChapterLink to={5} />.
        </p>
        <CodeBlock language="shell">{`SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz`}</CodeBlock>
        <p>
          Then in <code>index.js</code>, read the connection string as
          shown below. The <code>dotenv/config</code>{" "}import loads{" "}
          <code>.env</code>{" "}into <code>process.env</code>{" "}before
          any other module reads those keys. If the variable is
          missing, the fallback keeps you on localhost so a forgotten
          line does not silently point at nothing.
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import "dotenv/config";
import mongoose from "mongoose";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);`}</CodeBlock>
        <p>
          Use <code>DATABASE_CONNECTION_STRING</code>. After you add the
          line and restart <code>nodemon</code>, the status demo below
          should report a database connection when Mongo is reachable.
          In <SectionLink to="6.3.2" />{" "}you will type the same key
          into the Render Environment dashboard with an Atlas URI as
          the value, and you will not change this source file again.
        </p>
        <LiveDemo
          name="ConnectionStatus"
          file="app/labs/lab6/intermediates/6-2-1-Connection.tsx"
          mode="styled"
        >
          <ConnectionStatus />
        </LiveDemo>
        <OnYourOwn>
          Add the <code>DATABASE_CONNECTION_STRING</code>{" "}line to the
          Node <code>.env</code>{" "}(not the Next.js one) and restart{" "}
          <code>nodemon</code>. Click the status button again after
          Express is up — or keep using the book store for now.
        </OnYourOwn>
        <WithAI
          prompt={`In webdev-server/.env.example, keep DATABASE_CONNECTION_STRING and mention MONGO_CONNECTION_STRING as an alias. Do not put a real Atlas password in any committed file.`}
        >
          Ask the assistant to keep the env names straight:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-6-2-3"
        title="6.2.3 Implementing Mongoose Schemas and Models"
      >
        <p>
          As mentioned earlier, non-relational databases do not require
          specifying the structure, or schema, of the data stored in
          collections like relational databases do. That responsibility
          has been delegated to applications using non-relational
          databases. Once a Node.js application establishes a
          connection to a MongoDB database, the Mongoose API declares
          datatypes Schemas and Models to interact with collections.
          Mongoose Schemas describe the structure of the data being
          stored in the database and are used to validate the data
          being stored or modified through the Mongoose library. If a
          route tries to insert a user without a username, Mongoose
          rejects the write before it reaches the collection. The
          schema shown below describes the structure for the{" "}
          <code>users</code>{" "}collection imported earlier. Create the
          schema in a Users directory in your Node.js project.
        </p>
        <CodeBlock
          language="js"
          name="userSchema"
          file="webdev-server/Kambaz/Users/schema.js"
        >{`import mongoose from "mongoose";
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
export default userSchema;`}</CodeBlock>
        <p>
          Walk the fields one by one so the later DAO and Users screen
          make sense. <code>_id</code>{" "}is the primary key. We keep
          it a <code>String</code>{" "}so the identifiers from earlier
          JSON files still work; if we omitted it, MongoDB would assign
          ObjectIds and every enrollment that stored{" "}
          <code>&quot;123&quot;</code>{" "}would stop matching.{" "}
          <code>username</code>{" "}is a string that is required and
          unique — two signups cannot share it, which is the same rule
          the signup route already enforced in memory.{" "}
          <code>password</code>{" "}is required but not unique; several
          people may coincidentally pick the same password, and this
          course stores it in plain text only so Sign in can compare
          strings the way <ChapterLink to={5} />{" "}did.{" "}
          <code>firstName</code>, <code>lastName</code>, and{" "}
          <code>email</code>{" "}are plain strings with no extra
          configuration; they may be empty on a newly created user
          until someone edits them in People Details.{" "}
          <code>dob</code>{" "}is a <code>Date</code>{" "}so Compass and
          Mongoose agree on a calendar value rather than a free-form
          string. <code>role</code>{" "}is a string restricted by{" "}
          <code>enum</code>{" "}to <code>STUDENT</code>,{" "}
          <code>FACULTY</code>, <code>ADMIN</code>,{" "}
          <code>USER</code>, and <code>TA</code>, with a default of{" "}
          <code>USER</code>{" "}when the client does not send a role —
          that default is what keeps a forgotten field from becoming{" "}
          <code>undefined</code>{" "}in the Account Navigation check.{" "}
          <code>loginId</code>{" "}and <code>section</code>{" "}are
          strings the People table displays.{" "}
          <code>lastActivity</code>{" "}is a date and{" "}
          <code>totalActivity</code>{" "}is a string so the table can
          show a duration such as <code>10:21:32</code>{" "}without
          forcing a numeric type. The second argument,{" "}
          <code>{`{ collection: "users" }`}</code>, tells Mongoose to
          store documents in the <code>users</code>{" "}collection you
          created in Compass rather than inventing a pluralized default
          name.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-4"
        title="6.2.4 Implementing Mongoose Models"
      >
        <p>
          Mongoose models implement a low-level API to interact with
          MongoDB collections programmatically. Models provide CRUD
          (Create, Read, Update, Delete) functions such as{" "}
          <code>find()</code>, <code>create()</code>,{" "}
          <code>updateOne()</code>, <code>deleteOne()</code>, and{" "}
          <code>findById()</code>. Those names are deliberately generic
          because they can interact with any collection configured in
          the schema. In <code>Kambaz/Users/model.js</code>{" "}below,
          create a Mongoose model from the users schema. In the next
          section we will create a data access object that implements
          higher-level functions specific to the domain of Kambaz —
          <code>findUserByCredentials</code>{" "}instead of a bare{" "}
          <code>findOne</code>.
        </p>
        <CodeBlock
          language="js"
          name="UserModel"
          file="webdev-server/Kambaz/Users/model.js"
        >{`import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema);
export default model;`}</CodeBlock>
        <p>
          The first argument, <code>&quot;UserModel&quot;</code>, is
          the model name other schemas use in <code>ref</code> —
          enrollments will point at it in <SectionLink to="6.4.3" />{" "}
          when <code>populate(&quot;user&quot;)</code>{" "}needs to know
          which model to load. The second argument is the schema you
          just wrote. Exporting the model lets the DAO import a single
          object and call <code>model.find()</code>{" "}without repeating
          the collection name. You do not instantiate the model
          yourself; Mongoose keeps one compiled model per name for the
          life of the process.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-5"
        title="6.2.5 Retrieving Data from MongoDB with Mongoose"
      >
        <p>
          The Mongoose model created in the previous section provides
          low-level functions such as <code>find</code>,{" "}
          <code>create</code>, <code>updateOne</code>, and{" "}
          <code>deleteOne</code>{" "}that are deliberately vague since
          they need to be able to operate on any collection. It is good
          practice to wrap these low-level generic functions within
          higher-level functions that are specific to the use cases of
          the specific project. For instance, instead of just using the
          generic <code>find()</code>{" "}function, it would be
          preferable to use something such as{" "}
          <code>findUsers()</code>, <code>findUserById()</code>, or{" "}
          <code>findUserByUsername()</code>. A previous chapter
          implemented a data access object using arrays declared in the{" "}
          <code>Database/index.js</code>{" "}files. This chapter
          refactors the DAOs so they use an actual database.{" "}
          <ChapterLink to={5} />&apos;s DAO read arrays from that barrel file. This chapter
          keeps the same function names and reimplements them with the
          model. The following <code>Kambaz/Users/dao.js</code>{" "}
          re-implements the CRUD operations for the users collection
          written in terms of the low-level Mongoose model operations.
        </p>
        <CodeBlock
          language="js"
          name="UsersDao"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`import model from "./model.js";
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
}`}</CodeBlock>
        <p>
          <code>findAllUsers</code>{" "}is <code>model.find()</code>{" "}
          with no predicate, so it returns every document in{" "}
          <code>users</code>. <code>findUserById</code>{" "}uses{" "}
          <code>findById</code>, which is the usual way to load one
          document by primary key. <code>findUserByUsername</code>{" "}
          calls <code>findOne</code>{" "}with{" "}
          <code>{`{ username }`}</code>{" "}so signup can reject a
          duplicate. <code>findUserByCredentials</code>{" "}matches both
          username and password in one query, which is what Sign in
          needs. <code>updateUser</code>{" "}identifies the document by{" "}
          <code>_id</code>{" "}and applies <code>$set</code>{" "}so only
          the fields in the payload change; fields you omit stay as
          they were. <code>deleteUser</code>{" "}removes one document by
          primary key. <code>createUser</code>{" "}copies the incoming
          object, assigns a fresh <code>uuidv4()</code>{" "}identifier,
          and inserts it; we generate the id in the application so the
          string format stays compatible with enrollments. Each of
          these functions returns a promise. Routes in the next section
          will <code>await</code>{" "}them. Practice the same verbs on a
          small todos collection before you touch Kambaz users. Create,
          find, find by id, update, and delete — that is every CRUD
          letter:
        </p>
        <LiveDemo
          name="Lab6Todos"
          file="app/labs/lab6/intermediates/6-2-5-Todos.tsx"
          mode="styled"
        >
          <Lab6Todos />
        </LiveDemo>
        <OnYourOwn>
          Add a todo whose title includes your name, mark it complete,
          then delete it. Confirm the list updates after each click.
        </OnYourOwn>
      </Section>
    </Section>
  );
}
