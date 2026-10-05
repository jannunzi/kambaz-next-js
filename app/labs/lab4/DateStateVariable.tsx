"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{JSON.stringify(startDate)}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(new Date(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}
