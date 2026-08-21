import { ogContentType, ogImage, ogSize } from "@/components/og";
import { getService, services } from "@/data/services";
import { lkr } from "@/data/site";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod service";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
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
