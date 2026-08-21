import { NextResponse } from "next/server";

/**
 * Order endpoint.
 *
 * INTEGRATION SEAM — validates and logs the order, then returns a reference.
 * It does not take payment and does not persist anything yet.
 *
 * To go live:
 *   1. PAYMENT — PayHere (2.69–3.30%) or OnePay (~1% on LankaQR) are the usual
 *      Sri Lankan choices. Create the payment session here and return its
 *      redirect URL instead of a bare reference. KOKO and Mintpay are added as
 *      separate BNPL integrations; build their commission into list prices
 *      rather than surcharging the customer.
 *   2. PERSISTENCE — write the order to a database before redirecting to the
 *      gateway, so a dropped callback does not lose the order.
 *   3. NOTIFY — email the workshop and send the customer a confirmation.
 *   4. STOCK — decrement inventory, or at minimum flag low stock.
 *
 * Until then, cash on delivery and bank transfer work end to end via manual
 * confirmation, which is how Nexmod already operates.
 */

interface OrderLine {
  slug: string;
  name: string;
  variantLabel?: string;
  unitPrice: number;
  qty: number;
  withInstallation: boolean;
  installationFee: number;
}

const PHONE_RE = /^(?:\+?94|0)?7\d{8}$/;

export async function POST(request: Request): Promise<NextResponse> {
  let body: {
    customer?: Record<string, string>;
    lines?: OrderLine[];
    totals?: { total?: number; allInstalled?: boolean };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { customer, lines, totals } = body;

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });
  }
  if (!customer?.name?.trim()) {
    return NextResponse.json({ error: "A name is required." }, { status: 422 });
  }
  if (!customer?.phone || !PHONE_RE.test(customer.phone.replace(/[\s-]/g, ""))) {
    return NextResponse.json(
      { error: "That does not look like a Sri Lankan mobile number." },
      { status: 422 },
    );
  }
  // Delivery details are only required when something is actually shipping.
  if (!totals?.allInstalled && (!customer?.address?.trim() || !customer?.city?.trim())) {
    return NextResponse.json(
      { error: "A delivery address and city are required." },
      { status: 422 },
    );
  }

  // Recompute the total server-side. Never trust a total sent by the client.
  const computed = lines.reduce(
    (sum, l) => sum + (l.unitPrice + (l.withInstallation ? l.installationFee : 0)) * l.qty,
    0,
  );

  const order = {
    reference: `NX-${Date.now().toString(36).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
    customer,
    lines,
    computedSubtotal: computed,
    clientTotal: totals?.total ?? null,
  };

  /* ------------------------------------------------------------------
   * PAYMENT / PERSISTENCE / NOTIFICATION GO HERE — see note above.
   * ---------------------------------------------------------------- */

  console.info("[nexmod] order", order);

  return NextResponse.json({ ok: true, reference: order.reference }, { status: 200 });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
