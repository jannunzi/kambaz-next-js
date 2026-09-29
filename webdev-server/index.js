import "dotenv/config";
// Before models, so the handshake hook is on every schema.
import { connectDatabase, databaseErrorHandler } from "./Kambaz/Database/mongo.js";
import cors from "cors";
import express from "express";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import Lab6 from "./Lab6/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
]
  .flatMap((value) => (value ?? "").split(","))
  .map((origin) => origin.trim())
  .filter((origin, index, list) => Boolean(origin) && list.indexOf(origin) === index);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin ${origin}`));
    },
    credentials: true,
  }),
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET ?? "super secret session phrase",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV === "production") {
  app.set("trust proxy", 1);
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
Lab5(app);
Lab6(app);
Hello(app);
app.use(databaseErrorHandler);

await connectDatabase();

app.listen(port, () => {
  console.log(`webdev-server listening on http://localhost:${port}`);
});
