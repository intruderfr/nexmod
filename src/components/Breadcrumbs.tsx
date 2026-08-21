import { LocaleLink as Link } from "@/i18n/client";
import { breadcrumbSchema } from "@/lib/schema";
import { IconChevronRight } from "./Icons";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Breadcrumb trail. Renders the visible nav and the matching BreadcrumbList
 * JSON-LD from the same source, so the two can never drift apart.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const full: Crumb[] = [{ name: "Home", path: "/" }, ...trail];

  return (
    <>
      <JsonLd data={breadcrumbSchema(full)} />
      <nav aria-label="Breadcrumb" className="scroll-x">
        <ol className="flex items-center gap-1.5 text-[13px] whitespace-nowrap py-1">
          {full.map((crumb, i) => {
            const last = i === full.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && (
                  <IconChevronRight
                    width={13}
                    height={13}
                    className="text-[var(--fg-subtle)] shrink-0"
                  />
                )}
                {last ? (
                  <span className="text-[var(--fg-muted)] truncate max-w-[16rem]" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
