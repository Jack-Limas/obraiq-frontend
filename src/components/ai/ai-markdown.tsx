"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  // Lists use native markers (disc / decimal, tinted by .ai-markdown li::marker in globals.css)
  ul: ({ children }) => <ul className="mt-2 first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 first:mt-0">{children}</ol>,
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
    <div className={`ai-markdown text-sm text-ink ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
