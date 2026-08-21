import { jsonLdString } from "@/lib/schema";

/**
 * Emits a JSON-LD block. Server component — the script is in the HTML the
 * crawler receives, not injected on the client.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
