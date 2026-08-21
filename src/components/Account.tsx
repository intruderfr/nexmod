"use client";

import { useRef, useState } from "react";
import { getProduct } from "@/data/products";
import { productImage } from "@/data/imagery";
import { allFitments } from "@/data/products";
import { lkr, site, waLink } from "@/data/site";
import { LocaleLink as Link } from "@/i18n/client";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { formatDateShort } from "@/lib/content";
import {
  IconArrowRight,
  IconCart,
  IconCheck,
  IconClock,
  IconClose,
  IconPlus,
  IconShield,
  IconTool,
  IconTrash,
  IconWhatsApp,
} from "./Icons";
import { Photo } from "./Photo";

type Tab = "garage" | "builds" | "wishlist" | "history" | "details";

const TABS: { id: Tab; label: string }[] = [
  { id: "garage", label: "My garage" },
  { id: "builds", label: "Saved builds" },
  { id: "wishlist", label: "Wishlist" },
  { id: "history", label: "Activity" },
  { id: "details", label: "Details" },
];

/**
 * The customer's local profile.
 *
 * Everything lives in this browser. That is stated plainly at the top rather
 * than buried, because a page headed "My Nexmod" that looks like an account
 * and silently loses everything when someone clears their cookies would be a
 * genuinely unpleasant surprise.
 *
 * Export and import exist so the profile can be moved between devices
 * deliberately, which is the honest version of "sync".
 */
export function Account() {
  const {
    ready,
    profile,
    setProfile,
    vehicles,
    activeVehicleId,
    addVehicle,
    removeVehicle,
    setActiveVehicle,
    wishlist,
    toggleWishlist,
    builds,
    removeBuild,
    history,
    clearHistory,
    exportProfile,
    importProfile,
    resetAll,
  } = usePrefs();

  const { add, setOpen } = useCart();
  const [tab, setTab] = useState<Tab>("garage");
  const [importState, setImportState] = useState<"idle" | "ok" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!ready) {
    return <div className="h-96 rounded-xl bg-[var(--bg-inset)] animate-pulse" />;
  }

  const wishlistProducts = wishlist
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-8">
      {/* Storage notice — stated up front, not in a footnote */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
        <IconShield width={17} height={17} className="shrink-0 mt-0.5 text-[var(--accent)]" />
        <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
          <strong className="text-[var(--fg)]">This lives in your browser, not on our servers.</strong>{" "}
          There is no login and nothing syncs — clearing your browser data clears this. Use{" "}
          <strong className="text-[var(--fg)]">Export</strong> under Details to move it to another
          device.
        </p>
      </div>

      {/* Tabs */}
      <div className="scroll-x border-b border-[var(--border)]">
        <div className="flex gap-1 min-w-max" role="tablist" aria-label="Profile sections">
          {TABS.map((t) => {
            const count =
              t.id === "garage"
                ? vehicles.length
                : t.id === "builds"
                  ? builds.length
                  : t.id === "wishlist"
                    ? wishlist.length
                    : t.id === "history"
                      ? history.length
                      : 0;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 py-3 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "text-[var(--accent)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {t.label}
                {count > 0 && (
                  <span className="ml-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-subtle)]">
                    {count}
                  </span>
                )}
                {tab === t.id && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-[var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------ GARAGE */}
      {tab === "garage" && (
        <section>
          {vehicles.length === 0 ? (
            <Empty
              title="No vehicles saved"
              body="Add your car and the catalogue will show what fits it, the Build Studio will pre-fill, and booking gets faster."
            />
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {vehicles.map((v) => {
                const active = v.id === activeVehicleId;
                return (
                  <li
                    key={v.id}
                    className={`surface p-5 ${active ? "border-[var(--accent)]" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] font-bold text-[16px] truncate">
                          {v.model}
                        </p>
                        {(v.year || v.colour) && (
                          <p className="text-[12.5px] text-[var(--fg-subtle)] mt-0.5">
                            {[v.year, v.colour].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVehicle(v.id)}
                        aria-label={`Remove ${v.model}`}
                        className="shrink-0 grid place-items-center w-8 h-8 rounded text-[var(--fg-subtle)] hover:text-[var(--accent)]"
                      >
                        <IconTrash width={14} height={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveVehicle(active ? null : v.id)}
                      className={`btn btn-sm w-full ${active ? "btn-primary" : "btn-outline"}`}
                    >
                      {active ? (
                        <>
                          <IconCheck width={13} height={13} />
                          Active
                        </>
                      ) : (
                        "Set as active"
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <AddVehicleForm onAdd={addVehicle} disabled={vehicles.length >= 6} />
        </section>
      )}

      {/* ------------------------------------------------------------ BUILDS */}
      {tab === "builds" && (
        <section>
          {builds.length === 0 ? (
            <Empty
              title="No saved builds"
              body="Configure a build in the Build Studio and save it here to come back to, compare, or send us later."
              action={{ href: "/build", label: "Open Build Studio" }}
            />
          ) : (
            <ul className="space-y-4">
              {builds.map((build) => {
                const items = build.items
                  .map((i) => ({ item: i, product: getProduct(i.slug) }))
                  .filter((x): x is typeof x & { product: NonNullable<typeof x.product> } =>
                    Boolean(x.product),
                  );
                const total = items.reduce(
                  (sum, x) =>
                    sum +
                    (x.product.variants?.find((v) => v.id === x.item.variantId)?.price ??
                      x.product.price) +
                    (x.item.withInstallation ? (x.product.installation?.fee ?? 0) : 0),
                  0,
                );

                return (
                  <li key={build.id} className="surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] font-bold text-[16px]">
                          {build.name}
                        </p>
                        <p className="text-[12.5px] text-[var(--fg-subtle)] mt-0.5">
                          {[build.vehicle, build.colour].filter(Boolean).join(" · ") ||
                            "No vehicle set"}{" "}
                          · saved {formatDateShort(build.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="figure text-lg font-bold">{lkr(total)}</span>
                        <button
                          type="button"
                          onClick={() => removeBuild(build.id)}
                          aria-label={`Delete ${build.name}`}
                          className="grid place-items-center w-8 h-8 rounded text-[var(--fg-subtle)] hover:text-[var(--accent)]"
                        >
                          <IconTrash width={14} height={14} />
                        </button>
                      </div>
                    </div>

                    <ul className="space-y-1.5 mb-4">
                      {items.map(({ item, product }) => (
                        <li
                          key={item.slug}
                          className="flex items-baseline justify-between gap-3 text-[13px]"
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            className="truncate hover:text-[var(--accent)] transition-colors"
                          >
                            {product.name}
                            {item.withInstallation && (
                              <span className="text-[var(--fg-subtle)]"> · fitted</span>
                            )}
                          </Link>
                          <span className="figure shrink-0 text-[var(--fg-subtle)]">
                            {lkr(product.price)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          for (const { item, product } of items) {
                            add({
                              slug: product.slug,
                              name: product.name,
                              variantId: item.variantId,
                              variantLabel: product.variants?.find((v) => v.id === item.variantId)
                                ?.label,
                              unitPrice:
                                product.variants?.find((v) => v.id === item.variantId)?.price ??
                                product.price,
                              qty: 1,
                              withInstallation: item.withInstallation,
                              installationFee: product.installation?.fee ?? 0,
                              category: product.category,
                            });
                          }
                          setOpen(true);
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        <IconCart width={14} height={14} />
                        Add to cart
                      </button>
                      <a
                        href={waLink(
                          [
                            `Hi Nexmod, this is my saved build "${build.name}":`,
                            "",
                            ...items.map((x) => `• ${x.product.name}`),
                            "",
                            `Total: ${lkr(total)}`,
                          ].join("\n"),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-whatsapp"
                      >
                        <IconWhatsApp width={14} height={14} />
                        Send to us
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ---------------------------------------------------------- WISHLIST */}
      {tab === "wishlist" && (
        <section>
          {wishlistProducts.length === 0 ? (
            <Empty
              title="Nothing saved yet"
              body="Tap the heart on any product to keep it here for later."
              action={{ href: "/products", label: "Browse products" }}
            />
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistProducts.map((product) => {
                const photo = productImage(product.slug, product.category);
                return (
                  <li key={product.slug} className="surface overflow-hidden group">
                    <Link href={`/products/${product.slug}`} className="block overflow-hidden">
                      {photo && <Photo image={photo} ratio="wide" zoom sizes="20rem" />}
                    </Link>
                    <div className="p-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block font-semibold text-[14.5px] leading-snug mb-1.5 hover:text-[var(--accent)] transition-colors"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center justify-between gap-3">
                        <span className="figure font-bold">{lkr(product.price)}</span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              add({
                                slug: product.slug,
                                name: product.name,
                                variantId: product.variants?.[0]?.id,
                                variantLabel: product.variants?.[0]?.label,
                                unitPrice: product.variants?.[0]?.price ?? product.price,
                                qty: 1,
                                withInstallation: Boolean(product.installation?.available),
                                installationFee: product.installation?.fee ?? 0,
                                category: product.category,
                              });
                              setOpen(true);
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            <IconCart width={13} height={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.slug)}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="btn btn-sm btn-ghost"
                          >
                            <IconClose width={13} height={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ----------------------------------------------------------- HISTORY */}
      {tab === "history" && (
        <section>
          {history.length === 0 ? (
            <Empty
              title="Nothing here yet"
              body="Orders you place, bookings you request and builds you send are recorded here — on this device only, so you have your own record."
            />
          ) : (
            <>
              <ul className="space-y-2 mb-6">
                {history.map((entry) => (
                  <li key={entry.id} className="surface p-4 flex items-start gap-3.5">
                    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
                      {entry.kind === "order" ? (
                        <IconCart width={16} height={16} />
                      ) : entry.kind === "booking" ? (
                        <IconClock width={16} height={16} />
                      ) : (
                        <IconTool width={16} height={16} />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium leading-snug">{entry.summary}</p>
                      <p className="text-[12px] text-[var(--fg-subtle)] mt-0.5">
                        {formatDateShort(entry.at)}
                        {entry.reference && ` · ${entry.reference}`}
                      </p>
                    </div>
                    {entry.total != null && (
                      <span className="figure shrink-0 text-[13.5px] font-semibold">
                        {lkr(entry.total)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={clearHistory} className="btn btn-sm btn-ghost">
                Clear activity
              </button>
            </>
          )}
        </section>
      )}

      {/* ----------------------------------------------------------- DETAILS */}
      {tab === "details" && (
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="surface p-6">
            <h2 className="text-subheading mb-1.5">Your details</h2>
            <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed mb-5">
              Optional. Saved here only, and used to pre-fill checkout and booking forms so you do
              not retype them.
            </p>

            <div className="space-y-4">
              {(
                [
                  { key: "name", label: "Name", placeholder: "e.g. Aslam Ahamed", type: "text" },
                  { key: "phone", label: "Phone / WhatsApp", placeholder: "07X XXX XXXX", type: "tel" },
                  { key: "email", label: "Email", placeholder: "you@example.com", type: "email" },
                  { key: "city", label: "City", placeholder: "e.g. Dehiwala", type: "text" },
                ] as const
              ).map((field) => (
                <div key={field.key}>
                  <label htmlFor={`p-${field.key}`} className="label">
                    {field.label}
                  </label>
                  <input
                    id={`p-${field.key}`}
                    type={field.type}
                    value={profile[field.key] ?? ""}
                    onChange={(e) => setProfile({ [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="field"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface p-6">
              <h2 className="text-subheading mb-1.5">Move to another device</h2>
              <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed mb-5">
                Download everything as a file, then import it on your phone or another browser.
                This is the honest version of syncing — nothing goes to a server.
              </p>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportProfile} className="btn btn-sm btn-outline">
                  Export profile
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="btn btn-sm btn-outline"
                >
                  Import profile
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const ok = await importProfile(file);
                    setImportState(ok ? "ok" : "error");
                    window.setTimeout(() => setImportState("idle"), 3000);
                    e.target.value = "";
                  }}
                />
              </div>

              {importState === "ok" && (
                <p className="mt-3 text-[13px] font-medium text-[var(--ok)]">Profile imported.</p>
              )}
              {importState === "error" && (
                <p className="mt-3 text-[13px] font-medium text-[var(--accent)]">
                  That file could not be read. It should be a Nexmod profile export.
                </p>
              )}
            </div>

            <div className="surface p-6">
              <h2 className="text-subheading mb-1.5">Clear everything</h2>
              <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed mb-5">
                Removes your vehicles, builds, wishlist, activity and details from this browser.
                This cannot be undone — export first if you might want it back.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear your whole profile from this browser?")) resetAll();
                }}
                className="btn btn-sm btn-outline"
              >
                Clear profile
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="surface p-10 md:p-14 text-center max-w-lg mx-auto">
      <span className="grid place-items-center w-12 h-12 mx-auto rounded-full bg-[var(--bg-inset)] text-[var(--fg-subtle)] mb-4">
        <IconTool width={22} height={22} />
      </span>
      <h2 className="text-subheading mb-2">{title}</h2>
      <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-6">{body}</p>
      {action && (
        <Link href={action.href} className="btn btn-primary">
          {action.label}
          <IconArrowRight width={15} height={15} />
        </Link>
      )}
    </div>
  );
}

function AddVehicleForm({
  onAdd,
  disabled,
}: {
  onAdd: (v: { model: string; year?: string; colour?: string }) => void;
  disabled: boolean;
}) {
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [colour, setColour] = useState("");

  if (disabled) {
    return (
      <p className="text-[13px] text-[var(--fg-subtle)]">
        Six vehicles is the limit. Remove one to add another.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!model.trim()) return;
        onAdd({
          model: model.trim(),
          year: year.trim() || undefined,
          colour: colour.trim() || undefined,
        });
        setModel("");
        setYear("");
        setColour("");
      }}
      className="surface p-5"
    >
      <h2 className="text-subheading mb-4">Add a vehicle</h2>
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <div className="sm:col-span-1">
          <label htmlFor="av-model" className="label">
            Model
          </label>
          <input
            id="av-model"
            list="account-models"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Honda Vezel"
            className="field"
          />
          <datalist id="account-models">
            {allFitments().map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="av-year" className="label">
            Year
          </label>
          <input
            id="av-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2016"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="av-colour" className="label">
            Colour
          </label>
          <input
            id="av-colour"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            placeholder="Pearl White"
            className="field"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-sm btn-primary">
        <IconPlus width={14} height={14} />
        Save vehicle
      </button>
      <p className="text-[11.5px] text-[var(--fg-subtle)] mt-3">
        Stored on this device only. We never ask for a registration number.
      </p>
    </form>
  );
}

void site;
