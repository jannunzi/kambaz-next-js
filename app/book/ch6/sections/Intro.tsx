import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import LocalUrl from "../../components/LocalUrl";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 6 — Integrating React with MongoDB
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          There are two main categories of databases: relational
          databases and non-relational databases. Relational databases
          such as MySQL, SQL Server, and Postgres store data in tables
          containing records of the same type. A table called{" "}
          <code>courses</code>{" "}would contain records representing all
          the courses, and a <code>users</code>{" "}table would contain
          all the users of an application. Records are represented as
          rows in the tables where each column stores data for
          attributes specific to the type of the table. The rows in the{" "}
          <code>courses</code>{" "}table might have columns such as{" "}
          <code>name</code>, <code>description</code>,{" "}
          <code>startDate</code>, <code>endDate</code>, and so on. Some
          of the columns might refer, or relate, to other records in
          other tables. The <code>instructor</code>{" "}column in the{" "}
          <code>courses</code>{" "}table might refer to a particular row
          in the <code>users</code>{" "}table, signifying that that
          particular user is the instructor of that particular course.
          Rows in one table relating to rows in another table is where
          relational databases get their name. The structured query
          language, or{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/SQL">
            SQL
          </OfficialLink>
          , is a computer language commonly used to interact with
          relational databases. The query in SQL generally means to ask
          for, or retrieve, data that matches some criteria, often
          written as a boolean expression or predicate. You might ask
          for every course whose <code>startDate</code>{" "}is after a
          given day, or every user whose <code>role</code>{" "}equals{" "}
          <code>FACULTY</code>, and the database engine evaluates that
          predicate against every row before returning the matching
          set.
        </p>
        <p>
          More recently there has been a growing interest in
          representing and storing data using alternative strategies
          which have collectively come to be referred to as
          non-relational databases, or{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/NoSQL">
            NoSQL
          </OfficialLink>{" "}
          databases. Non-relational databases such as{" "}
          <OfficialLink href="https://www.mongodb.com/">
            MongoDB
          </OfficialLink>
          , Firebase, and Couchbase store their data in{" "}
          <strong>collections</strong>{" "}containing{" "}
          <strong>documents</strong>{" "}which are roughly analogous to
          tables and records in their relational counterparts. The
          biggest difference is that the columns, or fields, in the
          rows in relational databases generally can only contain
          primitive data types — simple strings, numbers, dates, and
          booleans — whereas the fields, or properties, in
          non-relational documents can be arbitrarily complex data
          types: strings, numbers, booleans, and dates as well as
          combinations of these in complex objects containing arrays of
          objects of arrays, and so on. A single course document can
          hold a nested array of modules, and each module can hold a
          nested array of lessons, without first creating three
          separate tables and wiring them together with foreign keys.
          The other big difference is that relational databases require
          the structure, or schema, of the data to be explicitly
          described before storing any data, whereas non-relational
          databases do not require predefined schemas. Instead,
          non-relational databases delegate this responsibility to the
          applications using the database. The structure, or schema, in
          relational databases is where structured query language gets
          its name. MongoDB will happily store two documents in the
          same collection that do not share the same fields; it is
          your{" "}
          <OfficialLink href="https://nodejs.org/">
            Node.js
          </OfficialLink>{" "}
          application — later through{" "}
          <OfficialLink href="https://mongoosejs.com/">
            Mongoose
          </OfficialLink>{" "}
          schemas — that decides which shapes are valid.
        </p>
        <p>
          In the previous chapter we learned how to create an HTTP
          server with Node.js and{" "}
          <OfficialLink href="https://expressjs.com/">
            Express
          </OfficialLink>{" "}
          and integrated it with a{" "}
          <OfficialLink href="https://react.dev/">
            React
          </OfficialLink>{" "}
          Web user interface application to store the application state
          on the server. That sibling <code>webdev-server</code>{" "}
          project on port 4000 still holds courses, modules, users, and
          enrollments in JavaScript arrays seeded from the JSON files
          you first imported in{" "}
          <ChapterLink to={3} />. Restart Node and those arrays reseed
          from disk; nothing you created in the Dashboard survives a
          reboot. This chapter expands on that idea to store the data
          in MongoDB, a popular non-relational database whose documents
          are usually formatted as JSON objects, which makes it very
          convenient to integrate with JavaScript-based frameworks such
          as Node.js and React. The first section demonstrates how to
          download, install, and use a local instance of the MongoDB
          database. The next section covers how to use the Mongoose
          library to integrate and program a MongoDB database with a
          Node.js server application. Later sections describe how to
          deploy the database to{" "}
          <OfficialLink href="https://www.mongodb.com/atlas">
            MongoDB Atlas
          </OfficialLink>
          , a remote MongoDB database hosted as a cloud service, and
          how to migrate the Kambaz collections themselves so Dashboard
          and the course screens read and write documents instead of
          arrays.
        </p>
        <p>
          The following architecture is what we will be building in
          this chapter. Reading from right to left, we first create a
          MongoDB database called <code>kambaz</code>{" "}where we create
          several collections such as <code>users</code>,{" "}
          <code>courses</code>, <code>modules</code>,{" "}
          <code>assignments</code>, and <code>enrollments</code>. We
          use the Mongoose library to connect to the database
          programmatically from a Node server. A Mongoose schema
          describes the structure of the collections in the MongoDB
          database and a Mongoose model implements generic CRUD
          operations. We create higher-level functions in Data Access
          Objects (DAOs) that operate on the database, and expose those
          operations through Express routes as{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/REST">
            RESTful
          </OfficialLink>{" "}
          Web APIs. A React Web app integrates with the RESTful API
          through a client that allows the user interface to interact
          with the database. The URLs you already call from{" "}
          <ChapterLink to={5} />{" "}do not change; only the
          implementation behind <code>findAllUsers</code>{" "}and{" "}
          <code>createCourse</code>{" "}moves from an in-memory array to
          a collection. <SectionLink to="6.1" />{" "}installs a local
          instance and Compass. <SectionLink to="6.2" />{" "}connects
          with Mongoose: schemas, models, DAOs, then CRUD routes the
          React client already calls. <SectionLink to="6.3" />{" "}points
          the same connection string at Atlas and a new{" "}
          <OfficialLink href="https://render.com/">
            Render
          </OfficialLink>{" "}
          service. <SectionLink to="6.4" />{" "}migrates courses,
          modules, enrollments, and assignments.
        </p>
      </section>

      <Section id="sec-6-1" title="6.1 Working with a Local MongoDB Instance">
        <p>
          MongoDB is one of an increasingly popular family of
          non-relational databases. Data is stored in collections of
          documents usually formatted as JSON objects which makes it
          very convenient to integrate with JavaScript-based frameworks
          such as Node.js and React. You can open a document in Compass
          and recognize the same <code>_id</code>,{" "}
          <code>username</code>, and <code>role</code>{" "}fields you
          already mapped in the Kambaz Account screens. This section
          describes how to install, configure, and get started using
          MongoDB on your own machine before any Node code talks to it.
          Glance at{" "}
          <LocalUrl href="/labs/lab6" />{" "}as you go — the interactive demos
          speak the same API the Express DAOs implement once the
          connection string is set.
        </p>
      </Section>
    </>
  );
}
