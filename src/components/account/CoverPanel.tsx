"use client";

import { IconArrowRight, IconShield, IconStar } from "@/components/Icons";
import { careTiers } from "@/data/care";
import { warrantyWindow } from "@/data/warranty";
import { LocaleLink as Link } from "@/i18n/client";
import { formatDateShort } from "@/lib/content";
import { usePrefs } from "@/lib/prefs";

/**
 * The Cover tab of the profile.
 *
 * Two things that were previously only visible on their own pages: the care
 * plan this device is on, and what is still under warranty. Both belong here
 * because this is where someone looks when they want to know the state of
 * their car rather than to buy something.
 *
 * The expiring-soon block sits above the list deliberately. A warranty is only
 * useful if you remember it exists before it runs out, and a row eleven items
 * down a list does not do that job.
 */
export function CoverPanel() {
  const { warranties, membership, vehicles } = usePrefs();

  const tier = membership ? careTiers.find((t) => t.id === membership.tier) : undefined;

  const expiring = warranties
    .map((record) => ({ record, window: warrantyWindow(record.fittedOn, record.months) }))
    .filter((row) => row.window?.status === "expiring");

  return (
    <section className="space-y-8">
      {tier && membership ? <PlanCard tier={tier} startedAt={membership.startedAt} billing={membership.billing} /> : <NoPlan />}

      {expiring.length > 0 && (
        <div className="surface p-5 border-l-2 border-l-[var(--accent)]">
          <h3 className="font-semibold text-[14.5px] mb-2">
            {expiring.length === 1
              ? "One item is about to run out of cover"
              : `${expiring.length} items are about to run out of cover`}
          </h3>
          <ul className="text-[13.5px] text-[var(--fg-muted)] space-y-1">
            {expiring.map(({ record, window }) => (
              <li key={record.id} className="tabular-nums">
                {record.label} — {window!.daysLeft} days left
              </li>
            ))}
          </ul>
          <p className="text-[12.5px] text-[var(--fg-subtle)] mt-3 leading-relaxed">
            If something is not right, raise it now rather than after the term ends.
          </p>
        </div>
      )}

      {warranties.length === 0 ? (
        <div className="surface p-8 md:p-10 text-center">
          <IconShield
            width={28}
            height={28}
            className="mx-auto text-[var(--fg-faint)] mb-4"
            aria-hidden="true"
          />
          <h2 className="text-subheading mb-2">Nothing registered yet</h2>
          <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed max-w-md mx-auto mb-6">
            Register what is already on the car and you will always know what is still covered, and
            for how long.
          </p>
          <Link href="/warranty" className="btn btn-primary">
            <IconShield width={16} height={16} />
            Open the warranty centre
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {warranties.map((record) => {
              const window = warrantyWindow(record.fittedOn, record.months);
              const vehicle = vehicles.find((v) => v.id === record.vehicleId);
              const status = window?.status ?? "expired";
              const elapsed = window
                ? Math.min(1, Math.max(0, 1 - window.daysLeft / Math.max(1, record.months * 30.44)))
                : 1;

              return (
                <li key={record.id} className="surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-[14.5px]">{record.label}</h3>
                        <span className={`badge ${status === "active" ? "badge-accent" : ""}`}>
                          {status === "active"
                            ? "Covered"
                            : status === "expiring"
                              ? "Expiring soon"
                              : "Expired"}
                        </span>
                      </div>

                      <p className="text-[13px] text-[var(--fg-muted)]">
                        Fitted {formatDateShort(record.fittedOn)}
                        {vehicle &&
                          ` · ${[vehicle.year, vehicle.model].filter(Boolean).join(" ")}`}
                      </p>

                      {window && (
                        <>
                          <div
                            className="h-1 rounded-full bg-[var(--bg-inset)] mt-3.5 overflow-hidden"
                            role="img"
                            aria-label={`${Math.round(elapsed * 100)}% of the term elapsed`}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${elapsed * 100}%`,
                                background:
                                  status === "expired" ? "var(--border-strong)" : "var(--accent)",
                              }}
                            />
                          </div>
                          <p className="text-[12.5px] text-[var(--fg-subtle)] mt-2 tabular-nums">
                            {status === "expired"
                              ? `Ran out ${formatDateShort(window.expiresAt.toISOString())}`
                              : `${window.monthsLeft} months left — until ${formatDateShort(window.expiresAt.toISOString())}`}
                          </p>
                        </>
                      )}
                    </div>

                    {record.slug && (
                      <Link
                        href={`/products/${record.slug}`}
                        className="btn btn-sm btn-ghost shrink-0"
                      >
                        View product
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <Link href="/warranty" className="btn btn-outline">
            <IconShield width={16} height={16} />
            Register another, or start a claim
          </Link>
        </>
      )}
    </section>
  );
}

function NoPlan() {
  return (
    <div className="surface p-6 flex flex-wrap items-center justify-between gap-4">
      <div className="max-w-xl">
        <h2 className="text-subheading mb-1.5">No care plan on this device</h2>
        <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
          A plan takes 5–15% off parts and fitting, and adds months to the warranty on anything
          fitted while it is running.
        </p>
      </div>
      <Link href="/care" className="btn btn-outline btn-sm shrink-0">
        <IconStar width={15} height={15} />
        See the plans
      </Link>
    </div>
  );
}

function PlanCard({
  tier,
  startedAt,
  billing,
}: {
  tier: (typeof careTiers)[number];
  startedAt: string;
  billing: "monthly" | "annual";
}) {
  const started = new Date(startedAt);
  const renews = new Date(started);
  if (billing === "annual") renews.setFullYear(renews.getFullYear() + 1);
  else renews.setMonth(renews.getMonth() + 1);

  return (
    <div className="surface p-6 border-l-2 border-l-[var(--accent)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Your plan</p>
          <h2 className="text-subheading mb-1.5">{tier.name}</h2>
          <p className="text-[13.5px] text-[var(--fg-muted)]">
            {billing === "annual" ? "Billed annually" : "Billed monthly"} · next{" "}
            {formatDateShort(renews.toISOString())}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <span className="badge badge-accent">{tier.discountPct}% off parts and fitting</span>
            <span className="badge">+{tier.warrantyBonusMonths} months on anything fitted</span>
          </div>
        </div>

        <Link href="/care" className="btn btn-sm btn-ghost shrink-0">
          Manage
          <IconArrowRight width={14} height={14} />
        </Link>
      </div>
    </div>
  );
}
