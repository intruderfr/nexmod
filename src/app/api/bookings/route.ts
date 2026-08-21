import { NextResponse } from "next/server";

/**
 * Booking request endpoint.
 *
 * INTEGRATION SEAM — this currently validates the payload and logs it, then
 * returns success. It does not yet deliver the booking anywhere.
 *
 * To make it live, add ONE of the following inside the marked block:
 *   • Email    — Resend / SendGrid / Nodemailer to the workshop inbox
 *   • Sheets   — Google Sheets API append, if the team prefers a spreadsheet
 *   • CRM      — HubSpot / Zoho contact + deal creation
 *   • WhatsApp — WhatsApp Business Cloud API template message
 *
 * Until then, the form's WhatsApp button is the reliable delivery path, and it
 * is presented to the customer as an equal option rather than a fallback.
 */

interface BookingPayload {
  name: string;
  phone: string;
  email?: string;
  vehicle: string;
  service: string;
  date: string;
  time?: string;
  notes?: string;
}

/** Sri Lankan mobile numbers, with or without country code. */
const PHONE_RE = /^(?:\+?94|0)?7\d{8}$/;

function validate(body: Partial<BookingPayload>): string | null {
  if (!body.name?.trim() || body.name.trim().length < 2) return "A name is required.";
  if (!body.phone?.trim()) return "A phone number is required.";
  if (!PHONE_RE.test(body.phone.replace(/[\s-]/g, ""))) {
    return "That does not look like a Sri Lankan mobile number.";
  }
  if (!body.vehicle?.trim()) return "Please tell us the vehicle.";
  if (!body.service?.trim()) return "Please choose a service.";
  if (!body.date?.trim()) return "Please choose a date.";

  const date = new Date(`${body.date}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "That date is not valid.";
  if (date.getDay() === 5) return "We are closed on Fridays.";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "That date has already passed.";

  return null;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: Partial<BookingPayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const problem = validate(body);
  if (problem) {
    return NextResponse.json({ error: problem }, { status: 422 });
  }

  const booking = {
    ...body,
    receivedAt: new Date().toISOString(),
    reference: `NX-${Date.now().toString(36).toUpperCase()}`,
  };

  /* ---------------------------------------------------------------------
   * DELIVERY GOES HERE. See the note at the top of this file.
   * Example (Resend):
   *   await resend.emails.send({
   *     from: "bookings@nexmod.lk",
   *     to: "hello@nexmod.lk",
   *     subject: `Booking ${booking.reference} — ${booking.vehicle}`,
   *     text: JSON.stringify(booking, null, 2),
   *   });
   * ------------------------------------------------------------------- */

  console.info("[nexmod] booking request", booking);

  return NextResponse.json({ ok: true, reference: booking.reference }, { status: 200 });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
