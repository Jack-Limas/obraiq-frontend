"use client";

import { createContext, useContext, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/** Tells each list item which marker to draw (an accent dot or a numbered badge). */
const ListKind = createContext<"bullet" | "number">("bullet");

function ListItem({ children }: { children?: ReactNode }) {
  const kind = useContext(ListKind);
  return (
    <li className={`relative leading-relaxed ${kind === "number" ? "pl-7 [counter-increment:ai-item]" : "pl-5"}`}>
      {kind === "number" ? (
        <span
          aria-hidden
          className="absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ai/15 font-mono-data text-[11px] font-semibold text-ai before:content-[counter(ai-item)]"
        />
      ) : (
        <span aria-hidden className="absolute left-1 top-[0.6em] h-1.5 w-1.5 rounded-full bg-ai" />
      )}
      <div className="min-w-0 [&>p]:mt-0">{children}</div>
    </li>
  );
}

const components: Components = {
  p: ({ children }) => <p className="leading-relaxed [&:not(:first-child)]:mt-2">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ListKind.Provider value="bullet">
      <ul className="mt-2 space-y-1.5 first:mt-0">{children}</ul>
    </ListKind.Provider>
  ),
  ol: ({ children }) => (
    <ListKind.Provider value="number">
      <ol className="mt-2 space-y-1.5 [counter-reset:ai-item] first:mt-0">{children}</ol>
    </ListKind.Provider>
  ),
  li: ({ children }) => <ListItem>{children}</ListItem>,
  h1: ({ children }) => <p className="mt-3 text-sm font-semibold text-ink first:mt-0">{children}</p>,
  h2: ({ children }) => <p className="mt-3 text-sm font-semibold text-ink first:mt-0">{children}</p>,
  h3: ({ children }) => <p className="mt-3 text-sm font-semibold text-ink first:mt-0">{children}</p>,
  h4: ({ children }) => <p className="mt-3 text-sm font-semibold text-ink first:mt-0">{children}</p>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
      {children}
    </a>
  ),
  code: ({ children, className }) =>
    // Fenced blocks carry a language-* class; everything else is inline code
    className ? (
      <code className="font-mono-data text-xs">{children}</code>
    ) : (
      <code className="rounded bg-surface px-1 py-0.5 font-mono-data text-[0.85em] text-ink ring-1 ring-line">{children}</code>
    ),
  pre: ({ children }) => <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-surface p-3 text-xs">{children}</pre>,
  blockquote: ({ children }) => <blockquote className="mt-2 border-l-2 border-ai/50 pl-3 text-ink-muted">{children}</blockquote>,
  hr: () => <hr className="my-3 border-line" />,
  // The prompt asks for no tables; if one still arrives it scrolls instead of breaking the layout
  table: ({ children }) => (
    <div className="mt-2 overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-surface px-2 py-1.5 font-semibold text-ink">{children}</th>,
  td: ({ children }) => <td className="border-t border-line px-2 py-1.5">{children}</td>,
};

/**
 * Markdown from the AI, rendered safely as React elements:
 * - raw HTML in the answer is dropped (`skipHtml`), never injected;
 * - react-markdown's default URL transform already neutralises javascript: links;
 * - links open in a new tab without access to this window.
 * Styling uses theme tokens only, so it reads the same in light and dark.
 */
export function AiMarkdown({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`text-sm text-ink ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
