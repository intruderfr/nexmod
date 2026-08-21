import type { ArticleBlock } from "@/data/types";

/**
 * Renders the article body from structured blocks.
 *
 * Content is stored as data rather than MDX so it stays fully typed, is
 * trivially searchable, and can be reused (excerpts, feeds, OG cards) without
 * parsing markup.
 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-nex">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} id={slugify(block.text)}>
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3 key={i} id={slugify(block.text)}>
                {block.text}
              </h3>
            );

          case "p":
            return <p key={i}>{block.text}</p>;

          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="not-prose my-8 pl-5 border-l-[3px] border-[var(--accent)]"
              >
                <p className="text-lg md:text-xl font-medium leading-relaxed text-[var(--fg)]">
                  {block.text}
                </p>
                {block.cite && (
                  <cite className="block mt-2 text-[13px] not-italic text-[var(--fg-subtle)]">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            );

          case "callout":
            return (
              <aside
                key={i}
                className="not-prose my-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--accent-subtle)]"
              >
                <p className="flex items-center gap-2 font-semibold text-[15px] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[var(--accent)]" />
                  {block.title}
                </p>
                <p className="text-[14.5px] leading-relaxed text-[var(--fg-muted)]">{block.text}</p>
              </aside>
            );

          case "table":
            return (
              <div key={i} className="not-prose my-8 scroll-x rounded-xl border border-[var(--border)]">
                <table className="w-full text-left border-collapse min-w-[34rem]">
                  <thead>
                    <tr className="bg-[var(--bg-inset)]">
                      {block.head.map((h, j) => (
                        <th
                          key={j}
                          scope="col"
                          className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-b border-[var(--border)] last:border-0">
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={`px-4 py-3 text-[14px] leading-snug align-top ${
                              k === 0 ? "font-medium text-[var(--fg)]" : "text-[var(--fg-muted)]"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extracts h2 headings for the on-page table of contents. */
export function tableOfContents(blocks: ArticleBlock[]): { id: string; text: string }[] {
  return blocks
    .filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: slugify(b.text), text: b.text }));
}
