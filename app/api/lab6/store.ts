import usersJson from "@/app/(kambaz)/database/users.json";

export type Lab6Todo = {
  _id: string;
  title: string;
  completed: boolean;
  description: string;
};

export type Lab6User = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
};

const globalStore = globalThis as typeof globalThis & {
  __lab6Todos?: Lab6Todo[];
  __lab6Users?: Lab6User[];
};

function seedTodos(): Lab6Todo[] {
  return [
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
}

function seedUsers(): Lab6User[] {
  return usersJson.map((user) => ({ ...user }));
}

export function lab6Todos(): Lab6Todo[] {
  if (!globalStore.__lab6Todos) globalStore.__lab6Todos = seedTodos();
  return globalStore.__lab6Todos;
}

export function lab6Users(): Lab6User[] {
  if (!globalStore.__lab6Users) globalStore.__lab6Users = seedUsers();
  return globalStore.__lab6Users;
}

export function mongoStatus() {
  const uri =
    process.env.DATABASE_CONNECTION_STRING ||
    process.env.MONGO_CONNECTION_STRING ||
    "";
  return {
    mongo: Boolean(uri),
    store: uri ? "env-configured" : "memory",
    note: uri
      ? "Connection string is set. Express DAOs use Mongoose when mongod/Atlas is reachable."
      : "DATABASE_CONNECTION_STRING is not set",
  };
}
