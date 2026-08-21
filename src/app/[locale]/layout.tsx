import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Instrument_Sans,
  JetBrains_Mono,
  Noto_Sans_Sinhala,
  Noto_Sans_Tamil,
} from "next/font/google";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/data/site";
import { getDictionary } from "@/i18n";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { CartProvider } from "@/lib/cart";
import { siteGraph } from "@/lib/schema";
import "../globals.css";

/**
 * Root layout.
 *
 * This is the topmost layout in the app — there is no `app/layout.tsx` — which
 * is what allows `<html lang>` to be set per locale from the route params
 * while every page stays statically rendered.
 */

/**
 * Type system.
 *
 * Archivo carries every heading and control — an industrial grotesque that
 * holds up set tight and large. Instrument Sans runs the body copy: a warmer,
 * more neutral face that stays legible at 17px over long articles. JetBrains
 * Mono handles anything that should read as data — prices, specs, part codes.
 *
 * Noto Sans Sinhala and Tamil are loaded on every page rather than per-locale,
 * so switching language never flashes a fallback face. The Latin faces carry
 * no Indic glyphs, and the OS fallback on Windows clips ascenders badly.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const meta = localeMeta[isLocale(locale) ? locale : "en"];

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${dict.meta.tagline} | ${dict.meta.siteSuffix}`,
      template: "%s",
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.legalName,
    category: "Automotive",
    formatDetection: { telephone: true, address: true, email: true },
    alternates: {
      canonical: `${site.url}/${meta.code}`,
      // Every locale points at every other, plus x-default at the English
      // root. Google needs the set to be reciprocal to trust it.
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeMeta[l].htmlLang, `${site.url}/${l}`]),
        ),
        "x-default": `${site.url}/en`,
      },
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    openGraph: {
      type: "website",
      locale: meta.htmlLang.replace("-", "_"),
      alternateLocale: locales
        .filter((l) => l !== meta.code)
        .map((l) => localeMeta[l].htmlLang.replace("-", "_")),
      url: `${site.url}/${meta.code}`,
      siteName: site.name,
      title: `${site.name} — ${dict.meta.tagline}`,
      description: site.description,
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": "LK-1",
      "geo.placename": site.address.locality,
      "geo.position": `${site.address.latitude};${site.address.longitude}`,
      ICBM: `${site.address.latitude}, ${site.address.longitude}`,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#08090b" },
  ],
};

/**
 * Applied before first paint so a stored theme choice never flashes.
 * Kept tiny and wrapped in try/catch — if storage is blocked the page still
 * renders with the system preference.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("nexmod.theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const meta = localeMeta[locale];
  const dict = getDictionary(locale);

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      suppressHydrationWarning
      className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable} ${notoSinhala.variable} ${notoTamil.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <JsonLd data={siteGraph()} />
        <Reveal />
        <ScrollProgress />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[var(--accent)] focus:text-white focus:font-semibold"
        >
          {dict.common.skipToContent}
        </a>

        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
