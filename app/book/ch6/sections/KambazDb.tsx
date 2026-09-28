import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";

export default function KambazDb() {
  return (
    <Section
      id="sec-6-4"
      title="6.4 Integrating the Kambaz Web Application with a Database"
    >
      <p>
        The current Kambaz implementation renders various courses,
        modules, and assignments using JSON files. The files were
        wrapped into a Database data structure that first lived in the
        React application and then in the Node server. It is time for
        the data to live where it belongs. This section demonstrates
        migrating the courses and modules into corresponding
        collections in the <code>kambaz</code>{" "}MongoDB database.
        Create the{" "}
        <OfficialLink href="https://mongoosejs.com/">
          Mongoose
        </OfficialLink>{" "}
        schemas, models, and DAOs, and refactor the RESTful Web APIs
        to CRUD courses and modules in the database. The URLs stay the
        same as in <ChapterLink to={5} />; only the source of the
        documents changes. Confirm that all courses and modules CRUD
        functionality works as expected. Optionally also migrate the
        assignments into a collection and confirm that all assignment
        CRUD operations work. The signed-in user still lives in
        Account Context; course lists still live in Zustand. Neither
        client store replaces the database — they cache what the
        routes return.
      </p>

      <Section
        level={3}
        id="sec-6-4-1"
        title="6.4.1 Storing Courses in a Database"
      >
        <p>
          The current server application implements RESTful Web APIs
          to access courses stored in the <code>courses.js</code>{" "}
          file. This section replaces the source of the courses with a
          MongoDB <code>courses</code>{" "}collection. The basic
          operations on any data source are create, read, update, and
          delete, colloquially referred to as CRUD operations. The
          following sections demonstrate how to implement those CRUD
          operations for courses, one verb at a time, so you can
          confirm each change in Compass before you move on.
        </p>

        <Section
          level={3}
          id="sec-6-4-1-1"
          title="6.4.1.1 Retrieving Courses from a Database"
        >
          <p>
            To access the <code>courses</code>{" "}collection created
            earlier, create a Mongoose schema file as shown below. The
            schema file describes the constraints of the documents
            stored in a collection, such as the names of the
            properties, their data types, and the name of the
            collection where the documents will be stored.{" "}
            <code>_id</code>{" "}stays a string for the same reason the
            user schema did: enrollments and modules already store
            those identifiers as strings. <code>name</code>,{" "}
            <code>number</code>, and <code>description</code>{" "}are
            strings; <code>credits</code>{" "}is a number so you can
            sort or filter numerically later if you wish.
          </p>
          <CodeBlock
            language="js"
            name="courseSchema"
            file="webdev-server/Kambaz/Courses/schema.js"
          >{`import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
  credits: Number,
  description: String,
},
{ collection: "courses" });
export default courseSchema;`}</CodeBlock>
          <p>
            Using the Mongoose schema file, create a Mongoose model
            file as shown below. Mongoose models provide functions to
            interact with the collection such as <code>find()</code>,{" "}
            <code>create()</code>, <code>updateOne()</code>, and{" "}
            <code>deleteOne()</code>. The{" "}
            <code>CourseModel</code>{" "}name in the Mongoose model
            declares a unique name that can be used as a reference
            from other Mongoose schemas — enrollments will{" "}
            <code>ref: &quot;CourseModel&quot;</code>{" "}in{" "}
            <SectionLink to="6.4.3.1" />.
          </p>
          <CodeBlock
            language="js"
            name="CourseModel"
            file="webdev-server/Kambaz/Courses/model.js"
          >{`import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("CourseModel", schema);
export default model;`}</CodeBlock>
          <p>
            Using the Mongoose model, refactor the courses DAO file
            to interact with the courses collection. Start by
            refactoring the <code>findAllCourses()</code>{" "}and{" "}
            <code>findCoursesForEnrolledUser</code>{" "}functions to
            retrieve courses from the database instead of the
            Database file as shown below. The{" "}
            <code>model.find()</code>{" "}function returns an array
            containing all the course documents in the{" "}
            <code>courses</code>{" "}collection. We will deal with
            moving enrollments to the database later in the chapter;
            for now the enrolled-user helper can still filter the
            full course list against the in-memory enrollments array
            if Mongo is not yet connected.
          </p>
          <CodeBlock
            language="js"
            name="findAllCourses"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`import model from "./model.js";

function findAllCourses() {
  // return Database.courses;
  return model.find();
}

async function findCoursesForEnrolledUser(userId) {
  const { enrollments } = db;
  const courses = await model.find();
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === course._id,
    ),
  );
  return enrolledCourses;
}`}</CodeBlock>
          <p>
            The functions in Mongoose models all return promises,
            allowing asynchronous communication with the MongoDB
            server. In the Courses routes file, redeclare all router
            functions as asynchronous by adding the{" "}
            <code>async</code>{" "}keyword in front of the router
            functions as shown below. Also add the{" "}
            <code>await</code>{" "}keyword in front of all asynchronous
            calls of the DAO functions.{" "}
            <code>findAllCourses</code>{" "}becomes{" "}
            <code>model.find()</code>. Routes that used to return{" "}
            <code>dao.findAllCourses()</code>{" "}synchronously now{" "}
            <code>await</code>{" "}it. The{" "}
            <code>userId === &quot;current&quot;</code>{" "}branch still
            reads the session the way Chapter 5 taught; only the
            lookup behind it is now a promise.
          </p>
          <CodeBlock
            language="js"
            name="CourseRoutes find"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const findAllCourses = async (req, res) => {
  const courses = await dao.findAllCourses();
  res.send(courses);
};

const findCoursesForEnrolledUser = async (req, res) => {
  let { userId } = req.params;
  if (userId === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = await dao.findCoursesForEnrolledUser(userId);
  res.json(courses);
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-1-2"
          title="6.4.1.2 Inserting Courses into a Database"
        >
          <p>
            Refactor the DAO&apos;s <code>createCourse()</code>{" "}
            function to insert new courses into the database with the
            Mongoose model as shown below. Spread the incoming
            course, assign a <code>uuidv4()</code>{" "}identifier, and
            return <code>model.create</code>. Comment out — or delete
            — the old lines that pushed onto{" "}
            <code>Database.courses</code>{" "}so you do not keep two
            sources of truth.
          </p>
          <CodeBlock
            language="js"
            name="createCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}`}</CodeBlock>
          <p>
            Refactor the Courses routes file by adding keywords{" "}
            <code>async</code>{" "}and <code>await</code>{" "}before the
            route and DAO functions as shown below. The create route
            still enrolls the current user after insert, using the
            enrollments DAO you already have; that enroll call will
            itself become a database write in{" "}
            <SectionLink to="6.4.3.4" />. Create a new course from
            the Dashboard and confirm the new course appears in the
            database. Open Compass on the{" "}
            <code>courses</code>{" "}collection and look for the name
            you typed.
          </p>
          <CodeBlock
            language="js"
            name="createCourse route"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const createCourse = async (req, res) => {
  const newCourse = await dao.createCourse(req.body);
  const currentUser = req.session["currentUser"];
  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
  res.json(newCourse);
};
app.post("/api/courses", createCourse);`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-1-3"
          title="6.4.1.3 Deleting Courses from the Database"
        >
          <p>
            Refactor the <code>deleteCourse()</code>{" "}DAO function to
            delete courses from the database by using the courses
            model as shown below. We will deal with moving enrollments
            to the database later in the chapter. Until then, if
            Mongo is off you can still filter enrollments out of the
            in-memory copy so Dashboard does not keep a dangling
            enrollment for a course that no longer exists. When Mongo
            is on, <code>model.deleteOne</code>{" "}removes the course
            document and <SectionLink to="6.4.3.3" />{" "}will remove
            the related enrollment documents.
          </p>
          <CodeBlock
            language="js"
            name="deleteCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}`}</CodeBlock>
          <p>
            In the Courses routes file, refactor the route that
            deletes courses by adding keywords{" "}
            <code>async</code>{" "}and <code>await</code>{" "}in front of
            the route and DAO functions as shown below. From the
            Dashboard, delete a course and confirm it no longer
            appears in the database. Refresh Compass; the document
            should be gone, and a subsequent{" "}
            <code>GET /api/courses</code>{" "}should omit it.
          </p>
          <CodeBlock
            language="js"
            name="deleteCourse route"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const status = await dao.deleteCourse(courseId);
  res.send(status);
};
app.delete("/api/courses/:courseId", deleteCourse);`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-1-4"
          title="6.4.1.4 Updating Courses in the Database"
        >
          <p>
            In the Courses DAO, refactor the{" "}
            <code>updateCourse</code>{" "}function to update courses in
            the database with the <code>model.updateOne()</code>{" "}
            function as shown below. Identify the document by{" "}
            <code>_id</code>{" "}and apply <code>$set</code>{" "}with
            the fields the Dashboard editor sent — typically{" "}
            <code>name</code>{" "}and <code>description</code>. The
            old in-memory version found the course in an array and
            used <code>Object.assign</code>; the database version
            lets MongoDB do that merge.
          </p>
          <CodeBlock
            language="js"
            name="updateCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}`}</CodeBlock>
          <p>
            In the Courses routes, refactor the routing function by
            adding <code>async</code>{" "}and <code>await</code>{" "}
            keywords before the routing and DAO function calls as
            shown below. From the Dashboard, edit a course and
            confirm it updates in the database. Change a name, save,
            and reopen the document in Compass; the new name should
            already be there before you refresh the browser a second
            time.
          </p>
          <CodeBlock
            language="js"
            name="updateCourse route"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const courseUpdates = req.body;
  const status = await dao.updateCourse(courseId, courseUpdates);
  res.send(status);
};
app.put("/api/courses/:courseId", updateCourse);`}</CodeBlock>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-4-2"
        title="6.4.2 Persisting Modules in a Database as One to Many Relations with Courses"
      >
        <p>
          In Kambaz, each course contains several modules,
          establishing a <strong>one-to-many</strong>{" "}relationship.
          Currently the relationship is implemented by each module
          having a field that refers to the course they belong to.
          This section demonstrates how to use Mongoose to implement
          one-to-many relationships. In UML, one-to-many
          relationships can be illustrated as a course box connected
          to a modules box with a &quot;1&quot; on the course end and
          a &quot;*&quot; on the modules end. The{" "}
          <code>courses</code>{" "}collection is said to be on the one
          side of a one-to-many relation and the{" "}
          <code>modules</code>{" "}collection is said to be on the many
          side. The relationship describes that each course is
          related to many modules. It is often useful to think of the
          relationship as a parent-child relationship describing it
          as courses are the parents of many modules. Another way to
          think of the relationship is as an ownership relationship,
          as in courses have many modules.
        </p>
        <p>
          The easiest way to implement one-to-many relationships in
          both relational and non-relational databases is to use
          foreign keys referencing related records. Each module
          document contains a field <code>course</code>{" "}(or{" "}
          <code>courseId</code>) whose value is the{" "}
          <code>_id</code>{" "}of some course document the module
          belongs to. That is what Chapter 5 already did in JSON, and
          it is the shape this book&apos;s{" "}
          <code>modules</code>{" "}collection keeps so the existing{" "}
          <code>/api/courses/:courseId/modules</code>{" "}routes stay
          stable.
        </p>
        <p>
          In non-relational databases there are two additional
          alternatives to implement one-to-many relationships. One
          way is to include an array of foreign keys in the parent
          document that reference all the child documents. Documents
          in the <code>courses</code>{" "}collection would contain a{" "}
          <code>moduleIds</code>{" "}array that contains the values of
          primary keys of child module documents. The keys in that
          array can be used to retrieve the actual documents from the{" "}
          <code>modules</code>{" "}collection. Another alternative is
          to do away entirely with the collection on the many side
          and embed the documents in the collection on the one side.
          The <code>modules</code>{" "}collection would be removed and
          the documents would instead be embedded in the
          corresponding parent course document in a{" "}
          <code>modules</code>{" "}array. Because modules are not
          expected to be fetched outside a course, the original
          chapter embeds them on the course schema. This book also
          keeps a <code>modules</code>{" "}collection with a{" "}
          <code>course</code>{" "}field. Both shapes are valid; pick
          one per project and stick to it. The subsections below show
          the embed schema so you can read the original design, then
          implement the collection-plus-foreign-key DAO that matches
          the LiveDemo routes.
        </p>
        <ul>
          <li>
            A foreign key on the child: each module has{" "}
            <code>course</code>{" "}equal to the course{" "}
            <code>_id</code>{" "}(what Chapter 5 already did in JSON,
            and what this book&apos;s collection uses).
          </li>
          <li>
            An array of child ids on the parent.
          </li>
          <li>
            Embed the child documents in the parent — a{" "}
            <code>modules</code>{" "}array on the course. No separate
            collection.
          </li>
        </ul>

        <Section
          level={3}
          id="sec-6-4-2-1"
          title="6.4.2.1 Declaring One to Many Relationships"
        >
          <p>
            Since modules are not expected to be accessible outside
            their course, the original design embeds the module
            documents in a new <code>modules</code>{" "}property in the
            course schema. To demonstrate, create the schema file
            below that describes the data structure of module
            documents. The embed version does not need a{" "}
            <code>course</code>{" "}field because the parent document
            already is the course.
          </p>
          <CodeBlock
            language="js"
            name="moduleSchema embed"
            file="webdev-server/Kambaz/Modules/schema.js"
          >{`import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
});
export default schema;`}</CodeBlock>
          <p>
            In the courses schema, add a new{" "}
            <code>modules</code>{" "}field defined as an array of{" "}
            <code>moduleSchema</code>{" "}as shown below if you are
            following the embed design.
          </p>
          <CodeBlock
            language="js"
            name="courseSchema modules"
            file="webdev-server/Kambaz/Courses/schema.js"
          >{`import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";
const courseSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
  credits: Number,
  description: String,
  modules: [moduleSchema],
},
{ collection: "courses" });
export default courseSchema;`}</CodeBlock>
          <p>
            Note that lessons also have a one-to-many relationship
            with the modules they belong to. Although we could create
            a dedicated lessons schema file and then add it to the
            modules schema, we can alternatively declare the lessons
            schema inline within the modules schema as shown below.
            Creating a separate dedicated lesson schema would, in
            general, be a better practice, but since it is a trivial
            schema we can get away with declaring the lesson schema
            right inside the parent module schema.
          </p>
          <CodeBlock
            language="js"
            name="moduleSchema lessons"
            file="webdev-server/Kambaz/Modules/schema.js"
          >{`import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  lessons: [{ _id: String, name: String, description: String }],
});
export default schema;`}</CodeBlock>
          <p>
            The new embed schema is not compatible with the courses
            you imported earlier with Compass, because those course
            documents do not contain a nested{" "}
            <code>modules</code>{" "}array. If you adopt embed, delete
            all the documents from the courses collection and import
            a new version that embeds the lessons into their modules
            and the modules into their courses. The{" "}
            <code>findAllCourses</code>{" "}and{" "}
            <code>findCoursesForEnrolledUser</code>{" "}functions in
            the courses DAO are only used in the Dashboard page,
            which only really needs the course&apos;s name and
            description. It would be unnecessarily expensive to
            include the modules and lessons from the server if they
            are not needed in the user interface. Refactor those
            functions so that they only include the{" "}
            <code>name</code>{" "}and <code>description</code>{" "}
            properties in the response, using a projection as shown
            below. In the Dashboard, take a look at the response from
            the server and confirm that the courses only contain
            those two properties.
          </p>
          <CodeBlock
            language="js"
            name="findAllCourses projection"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function findAllCourses() {
  return model.find({}, { name: 1, description: 1 });
}`}</CodeBlock>
          <p>
            Keep modules in their own collection. Store a{" "}
            <code>course</code>{" "}string on each module instead of
            embedding the module list on the course. The model name{" "}
            <code>CourseModel</code>{" "}is still what enrollments will{" "}
            <code>ref</code>.
          </p>
          <CodeBlock
            language="js"
            name="moduleSchema"
            file="webdev-server/Kambaz/Modules/schema.js"
          >{`import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
});
export default schema;`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-2"
          title="6.4.2.2 Retrieving Modules for a Course"
        >
          <p>
            Refactor the Modules DAO so that it uses the Mongoose
            model to retrieve modules for a course from the database.
            If you embedded modules on the course, you would{" "}
            <code>findById</code>{" "}the course and return{" "}
            <code>course.modules</code>. With a separate collection,
            <code>model.find({`{ course: courseId }` })</code>{" "}
            returns every module whose foreign key matches. Both
            answers are an array the Modules screen can map.
          </p>
          <CodeBlock
            language="js"
            name="findModulesForCourse"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}`}</CodeBlock>
          <p>
            In the Modules routes, refactor the routing function by
            adding <code>async</code>{" "}and <code>await</code>{" "}
            keywords before the routing and DAO function calls as
            shown below. The URL is the same nested path Chapter 5
            already used.
          </p>
          <CodeBlock
            language="js"
            name="findModulesForCourse route"
            file="webdev-server/Kambaz/Modules/routes.js"
          >{`const findModulesForCourse = async (req, res) => {
  const { courseId } = req.params;
  const modules = await dao.findModulesForCourse(courseId);
  res.json(modules);
};
app.get("/api/courses/:courseId/modules", findModulesForCourse);`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-3"
          title="6.4.2.3 Creating Modules for a Course"
        >
          <p>
            Refactor the Modules DAO so that it uses the Mongoose
            model to insert a new module into the database. The
            collection version assigns a uuid and calls{" "}
            <code>model.create</code>, including the{" "}
            <code>course</code>{" "}id so later finds can filter. The
            embed version instead <code>updateOne</code>s the parent
            course with <code>$push: {`{ modules: newModule }`}</code>{" "}
            so the new child is appended to the array inside the
            course document. Choose one; do not do both or you will
            insert the same module in two places.
          </p>
          <CodeBlock
            language="js"
            name="createModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="createModule embed"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`async function createModule(courseId, module) {
  const newModule = { ...module, _id: uuidv4() };
  await courseModel.updateOne(
    { _id: courseId },
    { $push: { modules: newModule } },
  );
  return newModule;
}`}</CodeBlock>
          <p>
            In the Modules routes, add{" "}
            <code>async</code>{" "}/{" "}
            <code>await</code>{" "}and pass the{" "}
            <code>courseId</code>{" "}from the path. Create a module
            from the Modules screen and confirm Compass shows the new
            document in <code>modules</code>, or the new element in
            the course&apos;s <code>modules</code>{" "}array if you
            embedded.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-4"
          title="6.4.2.4 Deleting Modules"
        >
          <p>
            Refactor the Modules DAO so that it uses the Mongoose
            model to delete modules from the database. The collection
            version is a straightforward{" "}
            <code>deleteOne</code>{" "}by module id. The embed version
            must <code>$pull</code>{" "}the matching element out of the
            parent course&apos;s <code>modules</code>{" "}array, which
            means the route has to know the course id as well as the
            module id.
          </p>
          <CodeBlock
            language="js"
            name="deleteModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="deleteModule embed"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`async function deleteModule(courseId, moduleId) {
  return courseModel.updateOne(
    { _id: courseId },
    { $pull: { modules: { _id: moduleId } } },
  );
}`}</CodeBlock>
          <p>
            This book&apos;s client keeps the Chapter 5 URL{" "}
            <code>DELETE /api/modules/:moduleId</code>{" "}because the
            collection already stores the foreign key. If you embed,
            switch the client to encode the course id as shown in the
            original chapter —{" "}
            <code>/api/courses/:courseId/modules/:moduleId</code> —
            and pass <code>cid</code>{" "}from the Modules page into{" "}
            <code>onRemoveModule</code>.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-5"
          title="6.4.2.5 Updating Modules"
        >
          <p>
            Refactor the Modules DAO so that it uses the Mongoose
            model to update modules in the database. The collection
            version applies <code>$set</code>{" "}on the module
            document. The embed version loads the course, finds the
            subdocument with <code>course.modules.id(moduleId)</code>
            , assigns the new fields, and{" "}
            <code>save()</code>s the parent so Mongoose writes the
            nested array back.
          </p>
          <CodeBlock
            language="js"
            name="updateModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}`}</CodeBlock>
          <CodeBlock
            language="js"
            name="updateModule embed"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`async function updateModule(courseId, moduleId, moduleUpdates) {
  const course = await courseModel.findById(courseId);
  const module = course.modules.id(moduleId);
  Object.assign(module, moduleUpdates);
  await course.save();
  return module;
}`}</CodeBlock>
          <p>
            Dashboard and the Modules screen still talk to the same
            client functions from <ChapterLink to={5} />. After the
            DAO swap, create and rename a module and confirm Compass
            updates. The LiveDemo below is that Dashboard against the
            book store; when your sibling server is connected to
            Mongo, the same Add / Update / Delete buttons write
            documents instead of array elements.
          </p>
          <LiveDemo
            name="Dashboard"
            file="app/(kambaz)/dashboard/page.tsx"
            mode="styled"
          >
            <Dashboard />
          </LiveDemo>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-4-3"
        title="6.4.3 Persisting Enrollments in a Database as Many to Many Relations"
      >
        <p>
          In Kambaz, a user can be enrolled in several courses, and a
          course can have many enrollments. An enrollment establishes
          a relationship between a user and a course. Since there can
          be many enrollments where many users can be enrolled, or
          associated, in many courses, the enrollments relation is
          referred to as a <strong>many-to-many</strong>{" "}relation.
          Many-to-many relationships can be represented in UML as a
          users box connected to a courses box with asterisks on both
          ends, capturing the fact that many users are related to
          many courses.
        </p>
        <p>
          Implementing that diagram directly is awkward in both
          relational and document databases, because it implies that
          each record in the users collection contains several
          references to records in the courses collection and vice
          versa. Keeping those two arrays in sync is error-prone: if
          you enroll a user by pushing a course id onto the user, you
          must also push the user id onto the course, and a failed
          second write leaves the relationship half-applied. It is
          often easier to understand the implementation by using an
          intermediate collection that captures the relationship
          between each record in the original collections. A new{" "}
          <code>enrollments</code>{" "}collection refactors the
          many-to-many relationship as two one-to-many relationships.
          The new collection is often referred to as a mapping table
          or mapping collection. The original collections{" "}
          <code>users</code>{" "}and <code>courses</code>{" "}no longer
          need to know anything about each other. Instead a record
          entry in the enrollments collection captures what users are
          enrolled in what courses by declaring fields{" "}
          <code>user</code>{" "}and <code>course</code>{" "}that record
          references to the documents that are related to each other.
          The following sections describe how to implement
          many-to-many relationships using Mongoose.
        </p>

        <Section
          level={3}
          id="sec-6-4-3-1"
          title="6.4.3.1 Declaring Enrollments as a Many to Many Relationship"
        >
          <p>
            The Courses model implemented earlier declares{" "}
            <code>CourseModel</code>{" "}as the name of the model for
            course documents stored in the{" "}
            <code>courses</code>{" "}collection. This name can be used
            to establish relationships between models and
            collections. Similarly the Users model declares the name
            of the model as <code>UserModel</code>{" "}for user
            documents stored in the <code>users</code>{" "}collection.
            In a new schema file shown below, implement a many-to-many
            Enrollments relationship that relates user and course
            documents stored in the users and courses collections,
            referred to by their model names{" "}
            <code>CourseModel</code>{" "}and <code>UserModel</code>{" "}
            respectively. The <code>ref</code>{" "}option does not store
            a copy of the other document; it stores the identifier
            and tells Mongoose which model to load when you call{" "}
            <code>populate</code>.
          </p>
          <CodeBlock
            language="js"
            name="enrollmentSchema"
            file="webdev-server/Kambaz/Enrollments/schema.js"
          >{`import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
  _id: String,
  course: { type: String, ref: "CourseModel" },
  user: { type: String, ref: "UserModel" },
  grade: Number,
  letterGrade: String,
  enrollmentDate: Date,
  status: {
    type: String,
    enum: ["ENROLLED", "DROPPED", "COMPLETED"],
    default: "ENROLLED",
  },
},
{ collection: "enrollments" });
export default enrollmentSchema;`}</CodeBlock>
          <p>
            Create an Enrollments model file to CRUD enrollment
            documents in an <code>enrollments</code>{" "}collection,
            using the name <code>EnrollmentModel</code>. Then create
            an Enrollments DAO file that implements operations that
            create enrollments, delete enrollments, and filter
            enrollments by either a course or a user. The DAO creates
            enrollments with an <code>_id</code>{" "}of{" "}
            <code>userId-courseId</code>{" "}so the pair is unique and
            you can find the document again without a second query.
            The following sections describe each of the operations in
            detail.
          </p>
          <CodeBlock
            language="js"
            name="EnrollmentModel"
            file="webdev-server/Kambaz/Enrollments/model.js"
          >{`import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("EnrollmentModel", schema);
export default model;`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-2"
          title="6.4.3.2 Retrieving Courses for Enrolled Users"
        >
          <p>
            Enrollments establish a many-to-many relationship between
            users and courses. A common operation consists of finding
            which documents in one collection are related to
            documents in the other collection. For instance, given a
            particular user we would like to determine which courses
            are related to that user — which courses is a user
            enrolled in. The <code>findCoursesForUser()</code>{" "}
            function below retrieves the enrollment documents for a
            given user. Those enrollment documents contain the
            primary keys for the user and course documents being
            referenced. The <code>populate()</code>{" "}function tells
            Mongoose to use the value of the primary keys to fetch
            the actual document referenced by the key.{" "}
            <code>populate(&quot;course&quot;)</code>{" "}replaces the
            course primary key value in the enrollment document with
            the actual course document from the{" "}
            <code>courses</code>{" "}collection corresponding to the
            key&apos;s value. The{" "}
            <code>enrollments.map()</code>{" "}operation unwraps the
            enrollments array and returns a new array with just the
            course objects, which is the shape Dashboard already
            expects.
          </p>
          <CodeBlock
            language="js"
            name="findCoursesForUser"
            file="webdev-server/Kambaz/Enrollments/dao.js"
          >{`async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}`}</CodeBlock>
          <p>
            In the Courses routes, refactor route function{" "}
            <code>findCoursesForEnrolledUser</code>{" "}to retrieve
            courses for a given user using the new{" "}
            <code>findCoursesForUser</code>{" "}in the Enrollments DAO
            as shown below. Login and confirm that the Dashboard
            displays the courses for the logged-in user. Also confirm
            that creating new courses inserts new enrollments in the
            database — Compass should show a new{" "}
            <code>enrollments</code>{" "}document whose{" "}
            <code>user</code>{" "}is the session user and whose{" "}
            <code>course</code>{" "}is the course you just added.
          </p>
          <CodeBlock
            language="js"
            name="findCoursesForEnrolledUser"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const findCoursesForEnrolledUser = async (req, res) => {
  let { userId } = req.params;
  if (userId === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = await enrollmentsDao.findCoursesForUser(userId);
  res.json(courses);
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-3"
          title="6.4.3.3 Deleting Courses"
        >
          <p>
            When a course goes away, every enrollment that pointed at
            it would otherwise become a dangling reference: Dashboard
            would try to populate a course id that no longer exists.
            In the Enrollments DAO, implement a new{" "}
            <code>unenrollAllUsersFromCourse</code>{" "}function that
            removes all enrollments for a given course.{" "}
            <code>deleteMany</code>{" "}is the many-document cousin of{" "}
            <code>deleteOne</code>.
          </p>
          <CodeBlock
            language="js"
            name="unenrollAllUsersFromCourse"
            file="webdev-server/Kambaz/Enrollments/dao.js"
          >{`function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}`}</CodeBlock>
          <p>
            In the Courses DAO, remove all uses of the enrollments
            from the in-memory <code>db</code>{" "}since we are just
            going to interact with enrollments in MongoDB.{" "}
            <code>deleteCourse</code>{" "}should only delete the course
            document. In the Courses routes, unenroll all users when
            the course is deleted, then delete the course. Sign in
            and try removing a course. Confirm that the course is
            removed from the database and that all enrollments are
            removed for the course.
          </p>
          <CodeBlock
            language="js"
            name="deleteCourse with enrollments"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
  const status = await dao.deleteCourse(courseId);
  res.send(status);
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-4"
          title="6.4.3.4 Enrolling / Unenrolling (On Your Own)"
        >
          <p>
            In a prior assignment you implemented enrolling and
            unenrolling users from courses. The implementation relied
            on manipulating arrays of courses, users, and enrollments
            in a &quot;Database&quot; data structure. Now that we
            moved the data to an actual database, refactor your
            implementation to use enrollments stored in the database.
            The Enrollments DAO implements{" "}
            <code>enrollUserInCourse</code>{" "}and{" "}
            <code>unenrollUserFromCourse</code>{" "}functions as shown
            below. The <code>enrollUserInCourse</code>{" "}function
            inserts a new enrollment document in the enrollments
            collection creating a relation between a user and the
            course they are enrolled in. The{" "}
            <code>unenrollUserFromCourse</code>{" "}function deletes an
            existing enrollment document from the enrollments
            collection, removing the relation between a user and the
            course they were enrolled in.
          </p>
          <CodeBlock
            language="js"
            name="enroll DAO"
            file="webdev-server/Kambaz/Enrollments/dao.js"
          >{`function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: \`\${userId}-\${courseId}\`,
  });
}
function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}`}</CodeBlock>
          <p>
            In the Courses routes implement post and delete routes
            that create or remove an enrollment using the
            corresponding DAO functions. If the path{" "}
            <code>uid</code>{" "}is <code>&quot;current&quot;</code>,
            read the session user the same way the enrolled-courses
            route does. If you had already implemented these
            functions in a prior assignment, feel free to use those
            functions instead or refactor at your own discretion.
          </p>
          <CodeBlock
            language="js"
            name="enroll routes"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const enrollUserInCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
  res.send(status);
};
const unenrollUserFromCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
  res.send(status);
};
app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);`}</CodeBlock>
          <p>
            Wire Dashboard enroll / unenroll to those{" "}
            <code>POST</code>{" "}and <code>DELETE</code>{" "}URLs. The
            client functions encode the primary keys of the user and
            the course as part of the path. If you already had
            implemented these functions in a prior assignment, feel
            free to use those functions instead or refactor at your
            discretion.
          </p>
          <CodeBlock
            language="ts"
            name="enroll"
            file="app/(kambaz)/courses/client.ts"
          >{`export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
  );
  return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
  );
  return response.data;
};`}</CodeBlock>
          <OnYourOwn>
            Refactor the Chapter 4/5 enroll buttons so they call these
            two functions and then refetch the dashboard courses.
            Confirm users can enroll and unenroll from courses and
            that the corresponding enrollment documents are inserted
            and removed from the database.
          </OnYourOwn>
          <WithAI
            prompt={`In the Kambaz dashboard enroll/unenroll handlers, call enrollIntoCourse and unenrollFromCourse from app/(kambaz)/courses/client.ts with the current user id and course id, then refetch courses. Keep any extra UI I added.`}
          >
            Ask the assistant to swap array edits for HTTP:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-5"
          title="6.4.3.5 Retrieving Students Enrolled in a Course (On Your Own)"
        >
          <p>
            The Users screen implemented in an earlier section uses
            the People Table to display all the users in the database
            and allows admin users to create, read, update, and
            delete all users in the database. The People link in the
            Courses Navigation in the Courses page should display a
            page that lists all the users enrolled in the current
            course, not the whole <code>users</code>{" "}collection.
            Reimplement the People link so that the People Table only
            displays the users that are enrolled in a particular
            course when navigating to the People link. In the Courses
            routes use the enrollments DAO{" "}
            <code>findUsersForCourse</code>{" "}function to retrieve
            the users enrolled in a course. That function is the
            mirror of <code>findCoursesForUser</code>: find
            enrollments whose <code>course</code>{" "}matches,{" "}
            <code>populate(&quot;user&quot;)</code>, and map to the
            user documents.
          </p>
          <CodeBlock
            language="js"
            name="findUsersForCourse route"
            file="webdev-server/Kambaz/Courses/routes.js"
          >{`const findUsersForCourse = async (req, res) => {
  const { cid } = req.params;
  const users = await enrollmentsDao.findUsersForCourse(cid);
  res.json(users);
};
app.get("/api/courses/:cid/users", findUsersForCourse);`}</CodeBlock>
          <p>
            In the Courses client implement{" "}
            <code>findUsersForCourse()</code>{" "}to retrieve the users
            for a given course. Use the Courses routes and client to
            display the users enrolled in a course when navigating to
            a course&apos;s People route. The same People Table
            component from <SectionLink to="6.2.6.2" />{" "}can render
            the array; only the fetch changes.
          </p>
          <CodeBlock
            language="ts"
            name="findUsersForCourse"
            file="app/(kambaz)/courses/client.ts"
          >{`export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(\`\${COURSES_API}/\${courseId}/users\`);
  return response.data;
};`}</CodeBlock>
          <OnYourOwn>
            Point the course People page at{" "}
            <code>findUsersForCourse(cid)</code>{" "}and confirm a student
            who is not enrolled does not appear.
          </OnYourOwn>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-4-4"
        title="6.4.4 Assignments (On Your Own)"
      >
        <p>
          Implement schema, model, DAO, routes, and client files so
          that the Assignments and Assignment Editor screens display
          assignments stored in a database. Users should be able to
          display assignments in a course, create new assignments,
          update assignments, and delete existing assignments. Confirm
          that all operations are reflected in the database. An
          assignment belongs to one course and a course has many
          assignments — the same one-to-many relationship you just
          implemented for modules. You can store assignments in their
          own collection with a <code>course</code>{" "}foreign key, which
          is what this book does, or embed them on the course the way
          the original chapter embedded modules. Mirror the modules
          DAO: <code>findAssignmentsForCourse</code>,{" "}
          <code>createAssignment</code>,{" "}
          <code>updateAssignment</code>,{" "}
          <code>deleteAssignment</code>. The routes already exist from{" "}
          <ChapterLink to={5} />{" "}— make them <code>await</code>{" "}the
          model. The Assignment Editor should PUT the same fields you
          already edit in the form: title, description, points, and
          dates. After each save, open Compass and confirm the
          document changed.
        </p>
        <OnYourOwn>
          Mirror the modules DAO:{" "}
          <code>findAssignmentsForCourse</code>,{" "}
          <code>createAssignment</code>,{" "}
          <code>updateAssignment</code>,{" "}
          <code>deleteAssignment</code>. The routes already exist from{" "}
          <ChapterLink to={5} />{" "}— make them <code>await</code>{" "}the
          model.
        </OnYourOwn>
      </Section>
    </Section>
  );
}
