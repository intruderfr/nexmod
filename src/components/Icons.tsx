import type { SVGProps } from "react";

/**
 * Inline SVG icon set. Kept local rather than pulling an icon library so the
 * bundle stays small and every glyph renders with currentColor in both themes.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={20}
      height={20}
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconMenu = (p: IconProps) => (
  <Base {...p}><path d="M3 6h18M3 12h18M3 18h18" /></Base>
);

export const IconClose = (p: IconProps) => (
  <Base {...p}><path d="M18 6 6 18M6 6l12 12" /></Base>
);

export const IconChevronRight = (p: IconProps) => (
  <Base {...p}><path d="m9 18 6-6-6-6" /></Base>
);

export const IconChevronDown = (p: IconProps) => (
  <Base {...p}><path d="m6 9 6 6 6-6" /></Base>
);

export const IconArrowRight = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
);

export const IconCart = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h2.2l2.4 12.4a1.8 1.8 0 0 0 1.8 1.4h8.6a1.8 1.8 0 0 0 1.8-1.4L21 7H5" />
  </Base>
);

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M21.5 16.9v2.6a1.8 1.8 0 0 1-2 1.8 17.7 17.7 0 0 1-7.7-2.7 17.4 17.4 0 0 1-5.4-5.4A17.7 17.7 0 0 1 3.7 5.4a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.6c.1 1 .3 1.9.7 2.8a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.9.4 1.8.6 2.8.7a1.8 1.8 0 0 1 1.6 1.8Z" />
  </Base>
);

export const IconWhatsApp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={20} height={20} {...p}>
    <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.4l1.7.6c.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.3Z" />
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
  </svg>
);

export const IconMapPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="2.8" />
  </Base>
);

export const IconClock = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 1.9" /></Base>
);

export const IconStar = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={20} height={20} {...p}>
    <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <Base {...p}><path d="m20 6-11 11-5-5" /></Base>
);

export const IconShield = (p: IconProps) => (
  <Base {...p}><path d="M12 22s8-3.6 8-10V5.5L12 2.5 4 5.5V12c0 6.4 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></Base>
);

export const IconTruck = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 17V5H2v12h2" /><path d="M14 9h4l4 4v4h-2" />
    <circle cx="7" cy="17.5" r="2" /><circle cx="17.5" cy="17.5" r="2" />
    <path d="M9 17.5h6.5" />
  </Base>
);

export const IconTool = (p: IconProps) => (
  <Base {...p}><path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8 8a2.8 2.8 0 0 1-4-4l8-8a4 4 0 0 0-1.3-1.3Z" /></Base>
);

export const IconSearch = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></Base>
);

export const IconFilter = (p: IconProps) => (
  <Base {...p}><path d="M3 5h18M6 12h12M10 19h4" /></Base>
);

export const IconPlus = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);

export const IconMinus = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14" /></Base>
);

export const IconTrash = (p: IconProps) => (
  <Base {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></Base>
);

export const IconSun = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);

export const IconMoon = (p: IconProps) => (
  <Base {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></Base>
);

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Base>
);

export const IconUser = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Base>
);

export const IconHeart = (p: IconProps) => (
  <Base {...p}>
    <path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1l8.4 8.4 8.4-8.4a5 5 0 0 0 0-7.1Z" />
  </Base>
);

export const IconHeartFilled = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={20} height={20} {...p}>
    <path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1l8.4 8.4 8.4-8.4a5 5 0 0 0 0-7.1Z" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <Base {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></Base>
);

export const IconInstagram = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
  </Base>
);

export const IconFacebook = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={20} height={20} {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
  </svg>
);

export const IconTikTok = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={20} height={20} {...p}>
    <path d="M16.6 5.8a4.8 4.8 0 0 1-1.2-3.1h-3v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V10a5.8 5.8 0 1 0 4.9 5.7V9.2a7.7 7.7 0 0 0 4.5 1.4V7.6a4.8 4.8 0 0 1-3.3-1.8Z" />
  </svg>
);

/* Category and service glyphs -------------------------------------------- */

export const IconCarbon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth={1.1} />
  </Base>
);

export const IconLip = (p: IconProps) => (
  <Base {...p}><path d="M2 14c3-4 6.5-6 10-6s7 2 10 6" /><path d="M2 18c3-3 6.5-4.5 10-4.5S19 15 22 18" /></Base>
);

export const IconSpoiler = (p: IconProps) => (
  <Base {...p}><path d="M3 9h18M6 9v4M18 9v4" /><path d="M4 15h16a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4Z" /></Base>
);

export const IconTyre = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.6" /><path d="M12 3v3.4M12 17.6V21M3 12h3.4M17.6 12H21" /></Base>
);

export const IconLight = (p: IconProps) => (
  <Base {...p}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 1 3.6 10.8c-.4.3-.6.8-.6 1.2H9c0-.4-.2-.9-.6-1.2A6 6 0 0 1 12 3Z" /></Base>
);

export const IconAudio = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </Base>
);

export const IconCamera = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8h3l2-3h8l2 3h3v11H3z" />
    <circle cx="12" cy="13" r="3.6" />
  </Base>
);

export const IconInterior = (p: IconProps) => (
  <Base {...p}><path d="M6 20v-8a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v8" /><path d="M4 20h16M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Base>
);

export const IconEssentials = (p: IconProps) => (
  <Base {...p}><path d="M4 19 15 8" /><path d="M13 4h7v7" /><path d="M20 4 9 15" /><circle cx="5" cy="19" r="1.6" /></Base>
);

export const IconBodyKit = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 14.5h18M5 14.5V12l2.2-4.2A2 2 0 0 1 9 6.7h6a2 2 0 0 1 1.8 1.1L19 12v2.5" />
    <path d="M2 18h4M18 18h4" strokeWidth={1.3} />
    <circle cx="7.5" cy="16.5" r="1.6" />
    <circle cx="16.5" cy="16.5" r="1.6" />
  </Base>
);

export const IconTint = (p: IconProps) => (
  <Base {...p}><path d="M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3Z" /><path d="M12 8v9" strokeWidth={1.1} /></Base>
);

export const IconDecal = (p: IconProps) => (
  <Base {...p}><path d="M4 20 20 4" /><path d="M4 14 14 4" /><rect x="3" y="3" width="18" height="18" rx="2" /></Base>
);

export const IconDeaden = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 9v6M11 8v8M15 10v4M19 9v6" strokeWidth={1.4} />
  </Base>
);

export const IconDetail = (p: IconProps) => (
  <Base {...p}><path d="M12 3c-3 4-5 6.6-5 9a5 5 0 0 0 10 0c0-2.4-2-5-5-9Z" /><path d="M9.5 13.5a2.6 2.6 0 0 0 2.5 2.5" strokeWidth={1.2} /></Base>
);

/** Icon lookup by the string key used in categories/services data. */
export const iconMap: Record<string, (p: IconProps) => React.ReactElement> = {
  carbon: IconCarbon,
  lip: IconLip,
  spoiler: IconSpoiler,
  tyre: IconTyre,
  light: IconLight,
  audio: IconAudio,
  camera: IconCamera,
  interior: IconInterior,
  essentials: IconEssentials,
  tint: IconTint,
  bodykit: IconBodyKit,
  decal: IconDecal,
  deaden: IconDeaden,
  detail: IconDetail,
};

export function CategoryIcon({ name, ...props }: IconProps & { name: string }) {
  const Cmp = iconMap[name] ?? IconTool;
  return <Cmp {...props} />;
}
