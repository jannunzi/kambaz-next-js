import type { ReactNode } from "react";

const TOKEN =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function renderToken(token: string, key: number): ReactNode {
  if (token.startsWith("**") && token.endsWith("**")) {
    return (
      <strong key={key} className="font-semibold">
        {token.slice(2, -2)}
      </strong>
    );
  }
  if (token.startsWith("`") && token.endsWith("`")) {
    const label = token.slice(1, -1);
    // Short tokens such as md:bg-green-500 stay on one line. Longer snippets
    // may wrap so a media query or path is not clipped.
    const nowrap = label.length <= 32 ? " whitespace-nowrap" : "";
    return (
      <code key={key} className={`rounded bg-black/8 px-1.5 py-0.5 font-mono${nowrap}`}>
        {label}
      </code>
    );
  }
  const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    const [, label, href] = link;
    const external = href.startsWith("http");
    return (
      <a
        key={key}
        href={href}
        {...(external
          ? { target: "_blank", rel: "noreferrer" }
          : undefined)}
      >
        {label}
      </a>
    );
  }
  return token;
}

export default function SlideText({
  text,
  density = "spacious",
}: {
  text: string;
  density?: "dense" | "spacious";
}) {
  const parts = text.split(TOKEN);
  return (
    <span data-slide-text-density={density}>
      {parts.map((part, index) =>
        part ? renderToken(part, index) : null,
      )}
    </span>
  );
}
