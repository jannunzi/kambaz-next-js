import axios from "axios";

/**
 * Lab 6 LiveDemos use same-origin Next.js routes that implement the
 * Express /lab6 and /api/users contracts with an in-memory store so the
 * book builds without mongod. Point NEXT_PUBLIC_USE_EXPRESS_LAB6=1 to
 * hit the sibling server instead.
 */
export function lab6Origin(): string {
  if (process.env.NEXT_PUBLIC_USE_EXPRESS_LAB6 === "1") {
    const raw =
      process.env.NEXT_PUBLIC_HTTP_SERVER ?? "http://localhost:4000";
    return raw.replace(/\/$/, "");
  }
  return "";
}

function todosUrl() {
  return process.env.NEXT_PUBLIC_USE_EXPRESS_LAB6 === "1"
    ? `${lab6Origin()}/lab6/todos`
    : "/api/lab6/todos";
}

function usersUrl() {
  return process.env.NEXT_PUBLIC_USE_EXPRESS_LAB6 === "1"
    ? `${lab6Origin()}/api/users`
    : "/api/lab6/users";
}

function statusUrl() {
  return process.env.NEXT_PUBLIC_USE_EXPRESS_LAB6 === "1"
    ? `${lab6Origin()}/lab6/status`
    : "/api/lab6/status";
}

export const fetchLab6Status = async () => {
  const { data } = await axios.get(statusUrl());
  return data as { mongo: boolean; database: string; note: string };
};

export const fetchTodos = async (completed?: boolean) => {
  const url =
    completed === undefined
      ? todosUrl()
      : `${todosUrl()}?completed=${completed}`;
  const { data } = await axios.get(url);
  return data;
};

export const fetchTodoById = async (id: string) => {
  const { data } = await axios.get(`${todosUrl()}/${id}`);
  return data;
};

export const createTodo = async (todo: {
  title: string;
  completed?: boolean;
  description?: string;
}) => {
  const { data } = await axios.post(todosUrl(), todo);
  return data;
};

export const updateTodo = async (
  id: string,
  todo: { title?: string; completed?: boolean; description?: string },
) => {
  const { data } = await axios.put(`${todosUrl()}/${id}`, todo);
  return data;
};

export const deleteTodo = async (id: string) => {
  const { data } = await axios.delete(`${todosUrl()}/${id}`);
  return data;
};

export const findAllUsers = async () => {
  const { data } = await axios.get(usersUrl());
  return data;
};

export const findUsersByRole = async (role: string) => {
  const { data } = await axios.get(`${usersUrl()}?role=${role}`);
  return data;
};

export const findUsersByPartialName = async (name: string) => {
  const { data } = await axios.get(`${usersUrl()}?name=${encodeURIComponent(name)}`);
  return data;
};

export const findUserById = async (id: string) => {
  const { data } = await axios.get(`${usersUrl()}/${id}`);
  return data;
};

export const createUser = async (user: Record<string, string>) => {
  const { data } = await axios.post(usersUrl(), user);
  return data;
};

export const updateUser = async (user: { _id: string } & Record<string, string>) => {
  const { data } = await axios.put(`${usersUrl()}/${user._id}`, user);
  return data;
};

export const deleteUser = async (userId: string) => {
  const { data } = await axios.delete(`${usersUrl()}/${userId}`);
  return data;
};
