"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { IconArrowRight, IconCheck, IconClose, IconStar } from "@/components/Icons";
import { GitHubGate } from "@/components/admin/GitHubGate";
import { articles } from "@/data/articles";
import { careTiers } from "@/data/care";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { lkr } from "@/data/site";
import { isPublished } from "@/lib/content";
import {
  ACTIONS_URL,
  OVERRIDES_PATH,
  REPO,
  clearToken,
  getFile,
  putFile,
  readToken,
  verifyToken,
  type CommitResult,
  type GitHubUser,
} from "@/lib/github";

/**
 * The admin panel.
 *
 * Reads and writes src/data/overrides.json straight through the GitHub API,
 * from the browser, with no server anywhere. Saving makes a real commit on the
 * default branch, which triggers the deploy workflow, which rebuilds the site.
 *
 * That means it works from the published site on any device the owner is
 * signed in on — a phone at the counter included — rather than only on a
 * machine with the repository checked out.
 *
 * The panel edits numbers and dates, not the catalogue. Body copy, specs and
 * photographs stay in the repository, where a change goes through review.
 */

type Section = "products" | "services" | "articles" | "care";

type Draft = Record<Section, Record<string, Record<string, unknown>>>;

const EMPTY: Draft = { products: {}, services: {}, articles: {}, care: {} };

const SECTIONS: { id: Section; label: string; count: number }[] = [
  { id: "products", label: "Products", count: products.length },
  { id: "services", label: "Services", count: services.length },
  { id: "articles", label: "Articles", count: articles.length },
  { id: "care", label: "Care plans", count: careTiers.length },
];

export function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [checking, setChecking] = useState(true);

  const [draft, setDraft] = useState<Draft>(EMPTY);
  /** The blob sha of the file we loaded, needed to write it back safely. */
  const [sha, setSha] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState<Section>("products");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "saving" }
    | { kind: "saved"; commit: CommitResult }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const [filter, setFilter] = useState("");

  /*
   * A stored token is only trusted once GitHub confirms it still works. They
   * expire, and discovering that at save time — after a screen of edits —
   * would be the worst possible moment.
   */
  useEffect(() => {
    const stored = readToken();
    if (!stored) {
      setChecking(false);
      return;
    }
    verifyToken(stored)
      .then((who) => {
        setUser(who);
        setToken(stored);
      })
      .catch(() => clearToken())
      .finally(() => setChecking(false));
  }, []);

  const load = useCallback(async (activeToken: string) => {
    try {
      const file = await getFile(activeToken, OVERRIDES_PATH);
      const data = JSON.parse(file.text || "{}");
      setDraft({
        products: data.products ?? {},
        services: data.services ?? {},
        articles: data.articles ?? {},
        care: data.care ?? {},
      });
      setSha(file.sha);
      setLoaded(true);
    } catch (error) {
      setStatus({ kind: "error", message: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  function signOut() {
    clearToken();
    setToken(null);
    setUser(null);
    setLoaded(false);
    setDraft(EMPTY);
  }

  const dirtyCount = useMemo(
    () =>
      SECTIONS.reduce((n, s) => n + Object.keys(draft[s.id]).length, 0),
    [draft],
  );

  function setField(slug: string, key: string, value: unknown) {
    setDraft((current) => {
      const entries = { ...current[section] };
      const patch = { ...(entries[slug] ?? {}) };

      // An empty box means "no override", which is different from zero.
      if (value === "" || value === undefined) delete patch[key];
      else patch[key] = value;

      if (Object.keys(patch).length === 0) delete entries[slug];
      else entries[slug] = patch;

      return { ...current, [section]: entries };
    });
    setStatus({ kind: "idle" });
  }

  function clearSlug(slug: string) {
    setDraft((current) => {
      const entries = { ...current[section] };
      delete entries[slug];
      return { ...current, [section]: entries };
    });
    setStatus({ kind: "idle" });
  }

  async function save() {
    if (!token || !sha) return;
    setStatus({ kind: "saving" });

    const payload = {
      $comment:
        "Edited from /admin, which commits through the GitHub API. Safe to hand-edit. See src/data/overrides.ts.",
      updatedAt: new Date().toISOString(),
      products: draft.products,
      services: draft.services,
      articles: draft.articles,
      care: draft.care,
    };

    const changed = SECTIONS.reduce((n, s) => n + Object.keys(draft[s.id]).length, 0);
    const message =
      changed === 0
        ? "Clear all price and publishing overrides"
        : `Update ${changed} price and publishing ${changed === 1 ? "override" : "overrides"}`;

    try {
      const commit = await putFile(
        token,
        OVERRIDES_PATH,
        `${JSON.stringify(payload, null, 2)}\n`,
        sha,
        message,
      );
      /*
       * Writing returns a new blob sha. Without picking it up, a second save in
       * the same session would be rejected as a conflict against the old one.
       */
      await load(token);
      setStatus({ kind: "saved", commit });
    } catch (error) {
      setStatus({ kind: "error", message: (error as Error).message });
    }
  }

  if (checking) {
    return <div className="h-64 rounded-xl bg-[var(--bg-inset)] animate-pulse" />;
  }

  if (!token || !user) {
    return (
      <GitHubGate
        onSignedIn={(who, freshToken) => {
          setUser(who);
          setToken(freshToken);
        }}
      />
    );
  }

  if (!loaded && status.kind !== "error") {
    return <div className="h-64 rounded-xl bg-[var(--bg-inset)] animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- bar */}
      <div className="surface p-5 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20">
        <div className="min-w-0">
          <p className="text-[13.5px] text-[var(--fg-muted)]">
            {dirtyCount === 0
              ? "No overrides set — every value below is what the source files say."
              : `${dirtyCount} ${dirtyCount === 1 ? "item has" : "items have"} an override.`}
          </p>
          {status.kind === "error" && (
            <p className="text-[13px] text-[var(--accent)] mt-1">{status.message}</p>
          )}
          {status.kind === "saved" && (
            <p className="text-[13px] text-[var(--ok)] mt-1">
              Committed. The site rebuilds in a minute or two.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12.5px] text-[var(--fg-subtle)] hidden sm:inline">
            {user.login}
          </span>
          <button type="button" onClick={signOut} className="btn btn-sm btn-ghost">
            Sign out
          </button>
          <button
            type="button"
            onClick={save}
            disabled={status.kind === "saving"}
            className="btn btn-primary"
          >
            {status.kind === "saving" ? "Committing…" : "Commit to GitHub"}
          </button>
        </div>
      </div>

      {status.kind === "saved" && (
        <div className="surface p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-[14px] mb-1">
              Committed to {REPO.owner}/{REPO.name}
            </p>
            <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">
              The deploy workflow is running now. Changes appear on the live site once it finishes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href={status.commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
            >
              View commit
            </a>
            <a
              href={ACTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
            >
              Watch the deploy
              <IconArrowRight width={14} height={14} />
            </a>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- sections */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)]">
        {SECTIONS.map((s) => {
          const overrides = Object.keys(draft[s.id]).length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`relative px-4 py-3 text-[14px] font-medium transition-colors ${
                section === s.id
                  ? "text-[var(--accent)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {s.label}
              <span className="ml-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-subtle)]">
                {s.count}
              </span>
              {overrides > 0 && (
                <span className="ml-1 badge badge-accent align-middle">{overrides}</span>
              )}
              {section === s.id && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {section !== "care" && (
        <input
          className="field max-w-sm"
          placeholder="Filter by name…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      )}

      {/* ----------------------------------------------------------- rows */}
      {section === "products" && (
        <Rows>
          {products
            .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
            .map((product) => {
              const patch = draft.products[product.slug] ?? {};
              return (
                <Row
                  key={product.slug}
                  title={product.name}
                  meta={`${product.category} · source ${lkr(product.price)}`}
                  dirty={Object.keys(patch).length > 0}
                  onClear={() => clearSlug(product.slug)}
                >
                  <Money
                    label="Price"
                    placeholder={product.price}
                    value={patch.price as number | undefined}
                    onChange={(v) => setField(product.slug, "price", v)}
                  />
                  <Money
                    label="Was (strike-through)"
                    placeholder={product.compareAt}
                    value={patch.compareAt as number | undefined}
                    onChange={(v) => setField(product.slug, "compareAt", v)}
                  />
                  <Toggle
                    label="In stock"
                    fallback={product.inStock}
                    value={patch.inStock as boolean | undefined}
                    onChange={(v) => setField(product.slug, "inStock", v)}
                  />
                  <Toggle
                    label="Featured"
                    fallback={Boolean(product.featured)}
                    value={patch.featured as boolean | undefined}
                    onChange={(v) => setField(product.slug, "featured", v)}
                  />
                </Row>
              );
            })}
        </Rows>
      )}

      {section === "services" && (
        <Rows>
          {services
            .filter((s) => s.name.toLowerCase().includes(filter.toLowerCase()))
            .map((service) => {
              const patch = draft.services[service.slug] ?? {};
              return (
                <Row
                  key={service.slug}
                  title={service.name}
                  meta={`${service.category} · source ${service.fromPrice ? lkr(service.fromPrice) : "quoted"}`}
                  dirty={Object.keys(patch).length > 0}
                  onClear={() => clearSlug(service.slug)}
                >
                  <Money
                    label="From price"
                    placeholder={service.fromPrice}
                    value={patch.fromPrice as number | undefined}
                    onChange={(v) => setField(service.slug, "fromPrice", v)}
                  />
                  <label className="block sm:col-span-2">
                    <span className="label">Price note</span>
                    <input
                      className="field"
                      placeholder={service.priceNote ?? "No note"}
                      value={(patch.priceNote as string) ?? ""}
                      onChange={(e) => setField(service.slug, "priceNote", e.target.value)}
                    />
                  </label>
                </Row>
              );
            })}
        </Rows>
      )}

      {section === "articles" && (
        <Rows>
          {articles
            .filter((a) => a.title.toLowerCase().includes(filter.toLowerCase()))
            .map((article) => {
              const patch = draft.articles[article.slug] ?? {};
              const live = isPublished(article);
              return (
                <Row
                  key={article.slug}
                  title={article.title}
                  meta={`${article.category} · ${live ? "live" : "scheduled"} · source ${article.publishedAt}`}
                  dirty={Object.keys(patch).length > 0}
                  onClear={() => clearSlug(article.slug)}
                  badge={live ? undefined : "Scheduled"}
                >
                  <label className="block">
                    <span className="label">Publish date</span>
                    <input
                      type="date"
                      className="field"
                      value={(patch.publishedAt as string) ?? article.publishedAt}
                      onChange={(e) => setField(article.slug, "publishedAt", e.target.value)}
                    />
                  </label>
                  <Toggle
                    label="Featured"
                    fallback={Boolean(article.featured)}
                    value={patch.featured as boolean | undefined}
                    onChange={(v) => setField(article.slug, "featured", v)}
                  />
                  <p className="text-[12.5px] text-[var(--fg-subtle)] leading-relaxed sm:col-span-2">
                    A future date hides the article until that morning. The deploy Action rebuilds
                    daily on a cron, so scheduling works without anyone touching the repo again.
                  </p>
                </Row>
              );
            })}
        </Rows>
      )}

      {section === "care" && (
        <Rows>
          {careTiers.map((tier) => {
            const patch = draft.care[tier.id] ?? {};
            return (
              <Row
                key={tier.id}
                title={tier.name}
                meta={`source ${lkr(tier.monthly)}/mo · ${lkr(tier.annual)}/yr · ${tier.discountPct}%`}
                dirty={Object.keys(patch).length > 0}
                onClear={() => clearSlug(tier.id)}
              >
                <Money
                  label="Monthly"
                  placeholder={tier.monthly}
                  value={patch.monthly as number | undefined}
                  onChange={(v) => setField(tier.id, "monthly", v)}
                />
                <Money
                  label="Annual"
                  placeholder={tier.annual}
                  value={patch.annual as number | undefined}
                  onChange={(v) => setField(tier.id, "annual", v)}
                />
                <Number_
                  label="Member discount %"
                  placeholder={tier.discountPct}
                  value={patch.discountPct as number | undefined}
                  onChange={(v) => setField(tier.id, "discountPct", v)}
                />
                <Number_
                  label="Warranty bonus (months)"
                  placeholder={tier.warrantyBonusMonths}
                  value={patch.warrantyBonusMonths as number | undefined}
                  onChange={(v) => setField(tier.id, "warrantyBonusMonths", v)}
                />
              </Row>
            );
          })}
        </Rows>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function Rows({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function Row({
  title,
  meta,
  dirty,
  onClear,
  badge,
  children,
}: {
  title: string;
  meta: string;
  dirty: boolean;
  onClear: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`surface p-5 ${dirty ? "border-l-2 border-l-[var(--accent)]" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[14.5px]">{title}</h3>
            {badge && <span className="badge">{badge}</span>}
            {dirty && (
              <span className="badge badge-accent">
                <IconStar width={10} height={10} />
                Overridden
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-[var(--fg-subtle)] mt-1 tabular-nums">{meta}</p>
        </div>

        {dirty && (
          <button type="button" onClick={onClear} className="btn btn-sm btn-ghost shrink-0">
            <IconClose width={13} height={13} />
            Reset to source
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
}

function Money({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: number;
  value?: number;
  onChange: (v: number | "") => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type="number"
        min={0}
        step={100}
        className="field tabular-nums"
        placeholder={placeholder != null ? String(placeholder) : "Not set"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    </label>
  );
}

function Number_({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: number;
  value?: number;
  onChange: (v: number | "") => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type="number"
        min={0}
        className="field tabular-nums"
        placeholder={placeholder != null ? String(placeholder) : "Not set"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    </label>
  );
}

/**
 * Three states, not two: inherit from the source file, force on, force off.
 * A plain checkbox cannot express "no opinion", and without that there is no
 * way to undo an override once it has been set.
 */
function Toggle({
  label,
  fallback,
  value,
  onChange,
}: {
  label: string;
  fallback: boolean;
  value?: boolean;
  onChange: (v: boolean | "") => void;
}) {
  const options: { key: string; label: string; next: boolean | "" }[] = [
    { key: "inherit", label: `Source (${fallback ? "yes" : "no"})`, next: "" },
    { key: "yes", label: "Yes", next: true },
    { key: "no", label: "No", next: false },
  ];
  const active = value === undefined ? "inherit" : value ? "yes" : "no";

  return (
    <div>
      <span className="label">{label}</span>
      <div className="inline-flex p-1 rounded-lg bg-[var(--bg-inset)] border border-[var(--border)]">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.next)}
            className={`h-7 px-2.5 rounded-md text-[12px] font-medium transition-colors ${
              active === option.key
                ? "bg-[var(--bg-raised)] text-[var(--fg)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {active === option.key && option.key !== "inherit" && (
              <IconCheck width={10} height={10} className="inline mr-1" />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
