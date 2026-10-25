import { Fragment, type ReactNode } from "react";

/** **bold** inside a line; everything else is plain text (no HTML is ever injected). */
function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/**
 * Minimal markdown for assistant replies: paragraphs, "-"/"*" and "1." lists, "#"–"###"
 * headings and **bold**. Built as React elements, not HTML strings.
 */
export function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="flex flex-col gap-1 ps-5 list-disc">
              {lines.map((line, i) => (
                <li key={i}>{inline(line.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
          return (
            <ol key={index} className="flex flex-col gap-1 ps-5 list-decimal">
              {lines.map((line, i) => (
                <li key={i}>{inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        const heading = /^(#{1,3})\s+(.*)$/.exec(block);
        if (heading && lines.length === 1) {
          return (
            <p key={index} className="font-semibold text-h3">
              {inline(heading[2])}
            </p>
          );
        }
        return (
          <p key={index}>
            {lines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
