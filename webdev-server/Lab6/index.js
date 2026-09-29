import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { isMongoEnabled, mongoConnectionString } from "../Kambaz/Database/mongo.js";
import { lab6Status } from "./status.js";

const memory = [
  {
    _id: "1",
    title: "Learn MongoDB",
    completed: false,
    description: "Install Compass and create the kambaz database",
  },
  {
    _id: "2",
    title: "Write a Mongoose schema",
    completed: true,
    description: "Describe the users collection",
  },
];

export default function Lab6(app) {
  const findTodos = async () => {
    if (isMongoEnabled()) return model.find();
    return memory;
  };

  app.get("/lab6/status", (req, res) => {
    res.json(
      lab6Status({
        connectionString: mongoConnectionString(),
        connected: isMongoEnabled(),
      }),
    );
  });

  app.get("/lab6/todos", async (req, res) => {
    const { completed } = req.query;
    let todos = await findTodos();
    if (completed === "true" || completed === "false") {
      const flag = completed === "true";
      todos = todos.filter((t) => Boolean(t.completed) === flag);
    }
    res.json(todos);
  });

  app.get("/lab6/todos/:id", async (req, res) => {
    const todo = isMongoEnabled()
      ? await model.findById(req.params.id)
      : memory.find((t) => t._id === req.params.id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.json(todo);
  });

  app.post("/lab6/todos", async (req, res) => {
    const todo = {
      title: req.body?.title ?? "New todo",
      completed: Boolean(req.body?.completed),
      description: req.body?.description ?? "",
      _id: uuidv4(),
    };
    if (isMongoEnabled()) {
      res.status(201).json(await model.create(todo));
      return;
    }
    memory.push(todo);
    res.status(201).json(todo);
  });

  app.put("/lab6/todos/:id", async (req, res) => {
    if (isMongoEnabled()) {
      await model.updateOne({ _id: req.params.id }, { $set: req.body });
      res.json(await model.findById(req.params.id));
      return;
    }
    const index = memory.findIndex((t) => t._id === req.params.id);
    if (index < 0) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    memory[index] = { ...memory[index], ...req.body };
    res.json(memory[index]);
  });

  app.delete("/lab6/todos/:id", async (req, res) => {
    if (isMongoEnabled()) {
      res.json(await model.deleteOne({ _id: req.params.id }));
      return;
    }
    const index = memory.findIndex((t) => t._id === req.params.id);
    if (index >= 0) memory.splice(index, 1);
    res.json({ deletedCount: index >= 0 ? 1 : 0 });
  });
}
