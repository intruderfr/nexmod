import { ogContentType, ogImage, ogSize } from "@/components/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod — Premium Car Accessories, Dehiwala, Sri Lanka";

export default function Image() {
  return ogImage({
    eyebrow: "Dehiwala, Colombo",
    title: "Premium car accessories, properly fitted.",
    footnote: "Official EZ Lip USA agent for Sri Lanka",
  });
}
