import { ogContentType, ogImage, ogSize } from "@/components/og";
import { articles } from "@/data/articles";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod article";

export function generateStaticParams() {
  // One locale only: OG art carries no language, and metadata points
  // every locale at the /en image.
  return articles.map((a) => ({ locale: "en", slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  // Uses the raw article, not the published-only lookup, so the card is
  // correct the instant a scheduled post goes live.
  const article = articles.find((a) => a.slug === slug);

  return ogImage({
    eyebrow: article?.category ?? "Guide",
    title: article?.title ?? "Nexmod Articles",
    footnote: article ? `${article.readingMinutes} min read · nexmod.lk` : "nexmod.lk",
  });
}
