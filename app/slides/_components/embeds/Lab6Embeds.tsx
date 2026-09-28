"use client";

import type { ReactNode } from "react";
import ConnectionStatus from "@/app/labs/lab6/intermediates/6-2-1-Connection";
import Lab6Todos from "@/app/labs/lab6/intermediates/6-2-5-Todos";
import Lab6Users from "@/app/labs/lab6/intermediates/6-2-6-Users";
import LectureDemoFrame from "./LectureDemoFrame";

function Lab6Demo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab6">
      <div className="font-sans text-base [&_h2]:mt-0 [&_h3]:mt-0 [&_h4]:mt-0 [&_h5]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function Lab6StatusEmbed() {
  return (
    <Lab6Demo label="6-2-1-Connection.tsx">
      <ConnectionStatus />
    </Lab6Demo>
  );
}

export function Lab6TodosEmbed() {
  return (
    <Lab6Demo label="6-2-5-Todos.tsx">
      <Lab6Todos />
    </Lab6Demo>
  );
}

export function Lab6UsersEmbed() {
  return (
    <Lab6Demo label="6-2-6-Users.tsx">
      <Lab6Users />
    </Lab6Demo>
  );
}
