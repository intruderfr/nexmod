/**
 * Delivery zones.
 *
 * Sri Lanka's 25 administrative districts grouped into four courier zones.
 * Timings are working days from dispatch, not from order — orders are
 * confirmed by phone or WhatsApp first, which is a real step and pretending
 * otherwise would just make the estimate wrong.
 *
 * TIMINGS AND SURCHARGES ARE PLACEHOLDER, like all pricing here. Confirm
 * against the courier's actual rate card before launch.
 */

export type ZoneId = "colombo" | "western" | "mainline" | "outstation";

export interface Zone {
  id: ZoneId;
  label: string;
  /** Working days from dispatch. */
  days: string;
  /** Added to the flat delivery fee. 0 for the standard zones. */
  surcharge: number;
  note: string;
}

export const zones: Record<ZoneId, Zone> = {
  colombo: {
    id: "colombo",
    label: "Colombo metro",
    days: "1 working day",
    surcharge: 0,
    note: "Same-day collection from the workshop is also free if you are nearby.",
  },
  western: {
    id: "western",
    label: "Western Province",
    days: "1–2 working days",
    surcharge: 0,
    note: "Dispatched the same day for orders confirmed before 15:00.",
  },
  mainline: {
    id: "mainline",
    label: "Main line towns",
    days: "2–3 working days",
    surcharge: 0,
    note: "Regular courier routes, so timings here are reliable.",
  },
  outstation: {
    id: "outstation",
    label: "Outstation",
    days: "3–5 working days",
    surcharge: 450,
    note: "Bulky items — spoilers, body kits, subwoofer boxes — may take a day longer.",
  },
};

export interface District {
  name: string;
  zone: ZoneId;
}

export const districts: District[] = [
  // Western
  { name: "Colombo", zone: "colombo" },
  { name: "Dehiwala-Mount Lavinia", zone: "colombo" },
  { name: "Sri Jayawardenepura Kotte", zone: "colombo" },
  { name: "Moratuwa", zone: "colombo" },
  { name: "Gampaha", zone: "western" },
  { name: "Negombo", zone: "western" },
  { name: "Kalutara", zone: "western" },
  { name: "Panadura", zone: "western" },
  { name: "Kelaniya", zone: "western" },
  { name: "Maharagama", zone: "colombo" },
  { name: "Kaduwela", zone: "colombo" },
  { name: "Homagama", zone: "western" },

  // Main line
  { name: "Kandy", zone: "mainline" },
  { name: "Galle", zone: "mainline" },
  { name: "Matara", zone: "mainline" },
  { name: "Kurunegala", zone: "mainline" },
  { name: "Ratnapura", zone: "mainline" },
  { name: "Anuradhapura", zone: "mainline" },
  { name: "Kegalle", zone: "mainline" },
  { name: "Matale", zone: "mainline" },
  { name: "Nuwara Eliya", zone: "mainline" },
  { name: "Puttalam", zone: "mainline" },
  { name: "Chilaw", zone: "mainline" },

  // Outstation
  { name: "Jaffna", zone: "outstation" },
  { name: "Batticaloa", zone: "outstation" },
  { name: "Trincomalee", zone: "outstation" },
  { name: "Ampara", zone: "outstation" },
  { name: "Badulla", zone: "outstation" },
  { name: "Monaragala", zone: "outstation" },
  { name: "Polonnaruwa", zone: "outstation" },
  { name: "Hambantota", zone: "outstation" },
  { name: "Vavuniya", zone: "outstation" },
  { name: "Mannar", zone: "outstation" },
  { name: "Kilinochchi", zone: "outstation" },
  { name: "Mullaitivu", zone: "outstation" },
];

export function zoneForDistrict(name: string): Zone | undefined {
  const district = districts.find((d) => d.name.toLowerCase() === name.toLowerCase());
  return district ? zones[district.zone] : undefined;
}
