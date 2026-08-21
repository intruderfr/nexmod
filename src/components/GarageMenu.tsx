"use client";

import { useEffect, useRef, useState } from "react";
import { allFitments } from "@/data/products";
import { usePrefs } from "@/lib/prefs";
import { IconCheck, IconClose, IconPlus, IconTool } from "./Icons";

/**
 * My Garage.
 *
 * Save the cars you own; the active one filters fitment across the catalogue
 * and pre-fills the Build Studio and booking form.
 *
 * Stored in the browser only — there are no accounts here, and calling it a
 * garage rather than a profile is the honest description of what it is.
 */
export function GarageMenu() {
  const {
    vehicles,
    activeVehicle,
    activeVehicleId,
    addVehicle,
    removeVehicle,
    setActiveVehicle,
    ready,
  } = usePrefs();

  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [colour, setColour] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!model.trim()) return;
    addVehicle({ model: model.trim(), year: year.trim() || undefined, colour: colour.trim() || undefined });
    setModel("");
    setYear("");
    setColour("");
    setAdding(false);
  }

  // Fixed-size placeholder until hydrated, so the header never shifts.
  if (!ready) return <span className="w-9 h-9 shrink-0" aria-hidden="true" />;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={activeVehicle ? `Garage: ${activeVehicle.model}` : "My Garage"}
        className="relative grid place-items-center w-9 h-9 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-inset)] transition-colors"
      >
        <IconTool width={18} height={18} />
        {vehicles.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-[19rem] surface p-1 shadow-lg animate-fade-in">
          <div className="px-3 pt-2.5 pb-2">
            <p className="font-[family-name:var(--font-display)] font-bold text-[15px]">My Garage</p>
            <p className="text-[12px] text-[var(--fg-subtle)] leading-snug mt-0.5">
              Saved on this device. The active car filters what fits.
            </p>
          </div>

          {vehicles.length > 0 && (
            <ul className="p-1">
              {vehicles.map((v) => {
                const active = v.id === activeVehicleId;
                return (
                  <li key={v.id}>
                    <div
                      className={`group flex items-center gap-2 rounded-lg transition-colors ${
                        active ? "bg-[var(--accent-subtle)]" : "hover:bg-[var(--bg-inset)]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveVehicle(active ? null : v.id)}
                        className="flex-1 flex items-center gap-2.5 px-2.5 py-2 text-left min-w-0"
                      >
                        <span
                          className={`shrink-0 grid place-items-center w-4 h-4 rounded-full border-2 ${
                            active ? "border-[var(--accent)]" : "border-[var(--border-strong)]"
                          }`}
                        >
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-[13.5px] font-medium truncate ${
                              active ? "text-[var(--accent)]" : ""
                            }`}
                          >
                            {v.model}
                          </span>
                          {(v.year || v.colour) && (
                            <span className="block text-[11.5px] text-[var(--fg-subtle)] truncate">
                              {[v.year, v.colour].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeVehicle(v.id)}
                        aria-label={`Remove ${v.model}`}
                        className="shrink-0 grid place-items-center w-8 h-8 mr-1 rounded text-[var(--fg-subtle)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-[var(--accent)] transition-opacity"
                      >
                        <IconClose width={13} height={13} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {adding ? (
            <form onSubmit={submit} className="p-2.5 border-t border-[var(--border)] space-y-2">
              <div>
                <label htmlFor="g-model" className="sr-only">
                  Model
                </label>
                <input
                  id="g-model"
                  list="garage-models"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model, e.g. Honda Vezel"
                  autoFocus
                  className="field text-[13.5px] py-2"
                />
                <datalist id="garage-models">
                  {allFitments().map((f) => (
                    <option key={f} value={f} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year"
                  aria-label="Year"
                  className="field text-[13.5px] py-2"
                />
                <input
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="Colour"
                  aria-label="Colour"
                  className="field text-[13.5px] py-2"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-sm btn-primary flex-1">
                  <IconCheck width={13} height={13} />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="p-1 border-t border-[var(--border)] mt-1">
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-left text-[13.5px] font-medium text-[var(--accent)] hover:bg-[var(--bg-inset)] transition-colors"
              >
                <IconPlus width={15} height={15} />
                Add a vehicle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
