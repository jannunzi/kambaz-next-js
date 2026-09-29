import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { once } from "node:events";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const serverRoot = fileURLToPath(new URL(".", import.meta.url));
const SEED_NAME = "From Mongo";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listen(server, port = 0) {
  server.listen(port, "127.0.0.1");
  return once(server, "listening").then(() => server.address().port);
}

function freePort() {
  const server = net.createServer();
  return listen(server).then(
    (port) =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve(port)));
      }),
  );
}

function startDelayProxy(targetPort, delayMs) {
  const server = net.createServer((client) => {
    const upstream = net.connect(targetPort, "127.0.0.1");
    const fail = () => {
      client.destroy();
      upstream.destroy();
    };
    client.on("error", fail);
    upstream.on("error", fail);
    setTimeout(() => {
      if (client.destroyed || upstream.destroyed) return;
      client.pipe(upstream);
      upstream.pipe(client);
    }, delayMs);
  });
  return listen(server).then((port) => ({ server, port }));
}

function startWebdev(port, env) {
  const childEnv = { ...process.env, PORT: String(port) };
  for (const key of [
    "DATABASE_CONNECTION_STRING",
    "MONGO_CONNECTION_STRING",
    "MONGO_SERVER_SELECTION_TIMEOUT_MS",
  ]) {
    delete childEnv[key];
  }
  Object.assign(childEnv, env);
  const child = spawn(process.execPath, ["index.js"], {
    cwd: serverRoot,
    env: childEnv,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  child.stdout.on("data", (chunk) => {
    log += chunk;
  });
  child.stderr.on("data", (chunk) => {
    log += chunk;
  });
  return { child, log: () => log };
}

async function stopChild(child) {
  if (!child || child.exitCode != null || child.signalCode) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    delay(1500).then(() => child.kill("SIGKILL")),
  ]);
}

async function requestWhenUp(url, options = {}, budgetMs = 8000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < budgetMs) {
    try {
      return await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
    } catch (err) {
      lastError = err;
      if (err?.name === "TimeoutError" || err?.name === "AbortError") throw err;
      await delay(40);
    }
  }
  throw lastError ?? new Error(`server did not accept ${url}`);
}

describe("Express listen vs Mongo handshake", { timeout: 60_000 }, () => {
  it("waits out a slow handshake and reads and writes Mongo", async () => {
    const mongod = await MongoMemoryServer.create();
    const direct = mongod.getUri("kambaz");
    const targetPort = Number(new URL(direct).port);
    let proxy;
    let child;
    const seed = mongoose.createConnection(direct);
    try {
      await seed.asPromise();
      await seed.collection("courses").insertOne({
        _id: "DELAY1",
        name: SEED_NAME,
        number: "DL1",
        credits: 3,
        description: "seeded behind the delaying proxy",
      });
      await seed.close();

      proxy = await startDelayProxy(targetPort, 3000);
      const port = await freePort();
      const started = Date.now();
      const web = startWebdev(port, {
        DATABASE_CONNECTION_STRING: `mongodb://127.0.0.1:${proxy.port}/kambaz`,
      });
      child = web.child;
      const origin = `http://127.0.0.1:${port}`;
      const statusPromise = requestWhenUp(`${origin}/lab6/status`);
      const coursesPromise = requestWhenUp(`${origin}/api/courses`);
      const signupPromise = requestWhenUp(`${origin}/api/users/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: "delay_user",
          password: "secret",
          firstName: "Delay",
          lastName: "User",
          email: "delay@example.com",
          role: "STUDENT",
        }),
      });

      const statusRes = await statusPromise;
      const statusMs = Date.now() - started;
      const status = await statusRes.json();
      assert.ok(statusMs < 2000, `status took ${statusMs}ms\n${web.log()}`);
      assert.equal(statusRes.status, 200);
      assert.deepEqual(status, { mongo: false, database: "configured" });

      const coursesRes = await coursesPromise;
      const courses = await coursesRes.json();
      assert.equal(coursesRes.status, 200, JSON.stringify(courses));
      assert.ok(Array.isArray(courses));
      assert.ok(courses.some((course) => course.name === SEED_NAME));
      assert.equal(
        courses.some((course) => course.name === "Rocket Propulsion"),
        false,
      );

      const signupRes = await signupPromise;
      const signup = await signupRes.json();
      assert.equal(signupRes.status, 200, JSON.stringify(signup));
      assert.equal(signup.username, "delay_user");

      const check = mongoose.createConnection(direct);
      await check.asPromise();
      const stored = await check.collection("users").findOne({ username: "delay_user" });
      await check.close();
      assert.ok(stored, "signup did not reach Mongo");
      assert.equal(stored.password, "secret");

      const after = await (await fetch(`${origin}/lab6/status`)).json();
      assert.deepEqual(after, { mongo: true, database: "configured" });
    } finally {
      await stopChild(child);
      if (proxy) proxy.server.close();
      await mongoose.disconnect().catch(() => {});
      await mongod.stop();
    }
  });

  it("listens immediately and answers 503 when Mongo is unreachable", async () => {
    const port = await freePort();
    const started = Date.now();
    const { child, log } = startWebdev(port, {
      DATABASE_CONNECTION_STRING: "mongodb://127.0.0.1:1/x",
      MONGO_SERVER_SELECTION_TIMEOUT_MS: "1500",
    });
    const origin = `http://127.0.0.1:${port}`;
    try {
      const statusPromise = requestWhenUp(`${origin}/lab6/status`);
      const coursesPromise = requestWhenUp(`${origin}/api/courses`);
      const signupPromise = requestWhenUp(`${origin}/api/users/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "lost", password: "secret" }),
      });

      const statusRes = await statusPromise;
      const statusMs = Date.now() - started;
      const status = await statusRes.json();
      assert.ok(statusMs < 2000, `status took ${statusMs}ms\n${log()}`);
      assert.deepEqual(status, { mongo: false, database: "configured" });

      const coursesRes = await coursesPromise;
      const courses = await coursesRes.json();
      assert.equal(coursesRes.status, 503, JSON.stringify(courses));
      assert.deepEqual(courses, { error: "Database unavailable" });

      const signupRes = await signupPromise;
      const signup = await signupRes.json();
      assert.equal(signupRes.status, 503, JSON.stringify(signup));
      assert.deepEqual(signup, { error: "Database unavailable" });
    } finally {
      await stopChild(child);
    }
  });

  it("uses in-memory arrays when no connection string is set", async () => {
    const port = await freePort();
    const { child, log } = startWebdev(port, {});
    const origin = `http://127.0.0.1:${port}`;
    try {
      const statusRes = await requestWhenUp(`${origin}/lab6/status`);
      const status = await statusRes.json();
      assert.equal(status.mongo, false, log());
      assert.equal(status.database, "not configured");
      assert.equal(status.note, "DATABASE_CONNECTION_STRING is not set.");

      const coursesRes = await requestWhenUp(`${origin}/api/courses`);
      const courses = await coursesRes.json();
      assert.equal(coursesRes.status, 200);
      assert.ok(courses.some((course) => course.name === "Rocket Propulsion"));

      const signupRes = await requestWhenUp(`${origin}/api/users/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: "memory_user",
          password: "secret",
        }),
      });
      const signup = await signupRes.json();
      assert.equal(signupRes.status, 200, JSON.stringify(signup));
      assert.equal(signup.username, "memory_user");

      const usersRes = await requestWhenUp(`${origin}/api/users`);
      const users = await usersRes.json();
      assert.ok(users.some((user) => user.username === "memory_user"));
    } finally {
      await stopChild(child);
    }
  });
});
