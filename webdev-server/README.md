# webdev-server

Sibling **Node.js / Express** HTTP server for Chapters 5–6.

This is its **own project** — not Next.js app source. In this interactive-book
repo the folder sits at the **root next to** `app/`, `package.json`, and the
rest of `webdev-client` so Lab 5 LiveDemos can call `http://localhost:4000`.
That is a convenience copy. For the assignment, treat it as a **separate Git
repository**:

```bash
cd webdev-server
git init
# push to a public GitHub repo named webdev-server (branch a6)
```

Do **not** nest this server inside `app/` or submit it only as files inside
the Next.js tree.

## Run locally (required for Lab 5–6 / book LiveDemos)

Render is **not** required locally. Two terminals:

```bash
# terminal 1 — Next.js (repo root)
npm run dev

# terminal 2 — this folder
cd webdev-server
npm install
npm run dev          # nodemon index.js
# or: npm start      # node index.js
```

Listens on **port 4000**. In the Next.js app set
`NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000` (the book helper defaults to
that origin if the var is omitted).

Shortcut from the Next.js root in this monorepo only: `npm run server:dev`.

## Check

- http://localhost:4000 — Welcome to Full Stack Development!
- http://localhost:4000/hello — Life is good!
- http://localhost:4000/lab5/welcome — Welcome to Lab 5
- http://localhost:4000/lab6/status — `{ mongo, database }`, plus `note` when the string is unset
- http://localhost:4000/lab6/todos — Lab 6 todos (Mongoose or memory)
- http://localhost:4000/api/courses — JSON course list
- http://localhost:4000/api/users — users collection

## MongoDB (Chapter 6)

Set `DATABASE_CONNECTION_STRING` (PDF name) or `MONGO_CONNECTION_STRING` to a
local `mongodb://127.0.0.1:27017/kambaz` or Atlas `mongodb+srv://…/kambaz?…`
URI. If the variable is unset, DAOs use the in-memory copies of the
Chapter 5 JSON files. If it is set, DAOs use MongoDB and wait for the
connection. When the host never accepts a connection, the first data
request answers 503 after about 30 seconds (the driver's server selection
timeout) and does not fall back to memory. For about 10 seconds after
that failure, further data requests answer 503 immediately.
`/lab6/status` stays `mongo: false` and does not reconnect on its own.
The next data request after that cooldown starts one new connection
attempt; data requests that overlap share it. Once Mongo is reachable
you do not need to restart this process. Set
`MONGO_RETRY_COOLDOWN_MS` to change the pause. `npm start` still listens
either way.

Root `npm test` includes `mongo-listen.test.js`. Install this folder's
dependencies first:

```bash
cd webdev-server
npm install
```

```bash
# in this folder's .env
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz
```

## Later (Chapter 5.5 / 6.3)

Deploy **this** GitHub repo to Render (or Heroku). Point Vercel
`NEXT_PUBLIC_HTTP_SERVER` at that origin. On Render set
`DATABASE_CONNECTION_STRING` to the Atlas URI (database name `kambaz` in the
path).
