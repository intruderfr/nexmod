import Link from "next/link";
import { IconArrowRight } from "./Icons";

/**
 * Section header. One component so the rhythm — eyebrow, rule, title, lede,
 * optional action — is identical everywhere and never drifts page to page.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  action,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  action?: { href: string; label: string };
  align?: "start" | "center";
}) {
  const centered = align === "center";

  return (
    <header
      className={`mb-12 ${centered ? "text-center max-w-2xl mx-auto" : ""}`}
      data-reveal
    >
      <div
        className={`flex flex-wrap items-end gap-x-8 gap-y-5 ${
          centered ? "justify-center" : "justify-between"
        }`}
      >
        <div className={centered ? "" : "max-w-2xl"}>
          <p className={`eyebrow mb-5 ${centered ? "justify-center" : ""}`}>{eyebrow}</p>
          <h2 className="text-[clamp(1.875rem,3.8vw,3rem)]">{title}</h2>
          {lede && (
            <p className="text-[var(--fg-muted)] text-lg leading-relaxed mt-4">{lede}</p>
          )}
        </div>

        {action && (
          <Link
            href={action.href}
            className="group inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-semibold shrink-0 pb-1 border-b border-[var(--border-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            {action.label}
            <IconArrowRight
              width={15}
              height={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
