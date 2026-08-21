import { ogContentType, ogImage, ogSize } from "@/components/og";
import { getService, services } from "@/data/services";
import { lkr } from "@/data/site";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod service";

export function generateStaticParams() {
  // One locale only: OG art carries no language, and metadata points
  // every locale at the /en image.
  return services.map((s) => ({ locale: "en", slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const service = getService(slug);

  return ogImage({
    eyebrow: "Workshop service",
    title: service?.name ?? "Nexmod services",
    footnote: service?.fromPrice
      ? `From ${lkr(service.fromPrice)} · ${service.duration}`
      : "Dehiwala, Colombo",
  });
}
