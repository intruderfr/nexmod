"use client";

import { useMemo, useState } from "react";
import { services } from "@/data/services";
import { site, waLink } from "@/data/site";
import { IconCheck, IconWhatsApp } from "./Icons";

/**
 * Booking request form.
 *
 * Submits to /api/bookings, which currently logs the request and returns
 * success — the real integration seam for email or a CRM. Because Nexmod runs
 * on WhatsApp today, the form also produces a prefilled WhatsApp message so a
 * customer can send the identical details instantly and get a same-day reply.
 */

const CLOSED_WEEKDAY = 5; // Friday — the workshop is closed.

const timeSlots = [
  "10:00 – 11:00",
  "11:00 – 12:00",
  "12:00 – 13:00",
  "13:00 – 14:00",
  "14:00 – 15:00",
  "15:00 – 16:00",
  "16:00 – 17:00",
  "17:00 – 18:00",
];

type Status = "idle" | "sending" | "sent" | "error";

/**
 * On the GitHub Pages static export there is no server to POST to, so the
 * form skips the request entirely and hands off to WhatsApp — which is how
 * Nexmod takes most bookings anyway.
 */
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";


export function BookingForm({ preselect }: { preselect?: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    service: preselect ?? "",
    date: "",
    time: "",
    notes: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Earliest bookable day is tomorrow; latest is 90 days out.
  const { minDate, maxDate } = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const max = new Date();
    max.setDate(max.getDate() + 90);
    return { minDate: t.toISOString().slice(0, 10), maxDate: max.toISOString().slice(0, 10) };
  }, []);

  const isFriday = form.date
    ? new Date(`${form.date}T00:00:00`).getDay() === CLOSED_WEEKDAY
    : false;

  const selectedService = services.find((s) => s.slug === form.service);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hi Nexmod, I'd like to book a fitting.",
      "",
      form.name && `Name: ${form.name}`,
      form.vehicle && `Vehicle: ${form.vehicle}`,
      selectedService && `Service: ${selectedService.name}`,
      form.date && `Preferred date: ${form.date}`,
      form.time && `Preferred time: ${form.time}`,
      form.notes && `Notes: ${form.notes}`,
    ].filter(Boolean);
    return waLink(lines.join("\n"));
  }, [form, selectedService]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isFriday) {
      setError("We are closed on Fridays — please pick another day.");
      return;
    }

    // No backend on the static build — send them to WhatsApp instead.
    if (IS_STATIC) {
      window.open(whatsappMessage, "_blank", "noopener,noreferrer");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setError(
        "We could not send that. Please use the WhatsApp button below — it will reach us straight away.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="surface p-8 text-center">
        <span className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] mb-5">
          <IconCheck width={26} height={26} />
        </span>
        <h2 className="text-2xl mb-2.5">Booking request received</h2>
        <p className="text-[var(--fg-muted)] leading-relaxed max-w-md mx-auto mb-6">
          Thanks {form.name.split(" ")[0] || "for that"} — we will confirm your slot by phone or
          WhatsApp, usually within a few hours during opening times.
        </p>
        <p className="text-[13px] text-[var(--fg-subtle)] mb-6">
          Want it confirmed faster? Send the same details on WhatsApp.
        </p>
        <a
          href={whatsappMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
        >
          <IconWhatsApp width={17} height={17} />
          Confirm on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface p-6 md:p-7 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="label">
            Your name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="field"
            placeholder="e.g. Aslam Ahamed"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone / WhatsApp <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="field"
            placeholder="07X XXX XXXX"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="label">
            Email <span className="text-[var(--fg-subtle)] font-normal">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="field"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="vehicle" className="label">
            Vehicle <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="vehicle"
            required
            value={form.vehicle}
            onChange={(e) => update("vehicle", e.target.value)}
            className="field"
            placeholder="e.g. Honda Vezel 2016"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="label">
          Service <span className="text-[var(--accent)]">*</span>
        </label>
        <select
          id="service"
          required
          value={form.service}
          onChange={(e) => update("service", e.target.value)}
          className="field"
        >
          <option value="">Choose a service…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
          <option value="other">Something else / not sure</option>
        </select>
        {selectedService && (
          <p className="text-[12.5px] text-[var(--fg-subtle)] mt-2 leading-relaxed">
            {selectedService.duration}
            {selectedService.priceNote ? ` · ${selectedService.priceNote}` : ""}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="label">
            Preferred date <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="date"
            required
            type="date"
            min={minDate}
            max={maxDate}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="field"
            aria-describedby={isFriday ? "date-error" : undefined}
          />
          {isFriday && (
            <p id="date-error" className="text-[12.5px] text-[var(--accent)] mt-1.5 font-medium">
              We are closed on Fridays. Please pick another day.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="time" className="label">
            Preferred time
          </label>
          <select
            id="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            className="field"
          >
            <option value="">Any time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="label">
          Anything else? <span className="text-[var(--fg-subtle)] font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="field resize-y"
          placeholder="Tell us what you have in mind, or anything specific about the car."
        />
      </div>

      {error && (
        <p role="alert" className="text-[13.5px] text-[var(--accent)] font-medium">
          {error}
        </p>
      )}

      <div className="space-y-2.5 pt-1">
        <button
          type="submit"
          disabled={status === "sending" || isFriday}
          className="btn btn-primary btn-lg w-full"
        >
          {status === "sending"
            ? "Sending…"
            : IS_STATIC
              ? "Send booking on WhatsApp"
              : "Request this slot"}
        </button>
        <a
          href={whatsappMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp w-full"
        >
          <IconWhatsApp width={17} height={17} />
          Or send it on WhatsApp
        </a>
      </div>

      <p className="text-[11.5px] text-[var(--fg-subtle)] leading-relaxed text-center">
        This is a request, not a confirmed booking — we will come back to you to confirm the slot.
        Open Mon–Thu &amp; Sat 10:00–19:00, Sun 10:30–19:00. Call {site.contact.phoneDisplay} for
        anything urgent.
      </p>
    </form>
  );
}
