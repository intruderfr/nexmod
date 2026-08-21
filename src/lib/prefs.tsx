"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

/**
 * The customer's local profile.
 *
 * There is no server and no accounts system, so this is deliberately a
 * *device* profile rather than a login: vehicles, saved builds, a wishlist,
 * recently viewed, compare, and a local record of enquiries sent.
 *
 * Calling it a profile rather than an account is the honest framing — nothing
 * here syncs, and clearing browser data clears it. Export/import exists so it
 * can be moved between devices deliberately rather than pretending it follows
 * the customer around.
 *
 * One provider rather than six, because everything persists the same way and
 * splitting it would mean six localStorage reads and six hydration guards.
 */

export interface Vehicle {
  id: string;
  model: string;
  year?: string;
  colour?: string;
  colourCode?: string;
  nickname?: string;
  /** Registration is never required and never leaves the device. */
  plate?: string;
}

export interface Profile {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
}

export interface SavedBuildItem {
  slug: string;
  variantId?: string;
  withInstallation: boolean;
}

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: string;
  vehicle?: string;
  colour?: string;
  items: SavedBuildItem[];
}

export type HistoryKind = "enquiry" | "order" | "booking" | "build";

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  at: string;
  summary: string;
  /** Total in LKR where the entry had one. */
  total?: number;
  reference?: string;
}

interface PrefsState {
  profile: Profile;
  vehicles: Vehicle[];
  activeVehicleId: string | null;
  compare: string[];
  wishlist: string[];
  recent: string[];
  builds: SavedBuild[];
  history: HistoryEntry[];
  ready: boolean;
}

type Action =
  | { type: "hydrate"; state: Partial<PrefsState> }
  | { type: "setProfile"; patch: Partial<Profile> }
  | { type: "addVehicle"; vehicle: Omit<Vehicle, "id"> }
  | { type: "updateVehicle"; id: string; patch: Partial<Vehicle> }
  | { type: "removeVehicle"; id: string }
  | { type: "setActiveVehicle"; id: string | null }
  | { type: "toggleCompare"; slug: string }
  | { type: "clearCompare" }
  | { type: "toggleWishlist"; slug: string }
  | { type: "clearWishlist" }
  | { type: "addRecent"; slug: string }
  | { type: "saveBuild"; build: Omit<SavedBuild, "id" | "createdAt"> }
  | { type: "removeBuild"; id: string }
  | { type: "logHistory"; entry: Omit<HistoryEntry, "id" | "at"> }
  | { type: "clearHistory" }
  | { type: "replaceAll"; state: Partial<PrefsState> }
  | { type: "reset" };

const STORAGE_KEY = "nexmod.prefs.v2";
const LEGACY_KEY = "nexmod.prefs.v1";

export const COMPARE_LIMIT = 4;
const RECENT_LIMIT = 12;
const VEHICLE_LIMIT = 6;
const BUILD_LIMIT = 12;
const HISTORY_LIMIT = 40;

const initial: PrefsState = {
  profile: {},
  vehicles: [],
  activeVehicleId: null,
  compare: [],
  wishlist: [],
  recent: [],
  builds: [],
  history: [],
  ready: false,
};

/** Unique within one device; crypto.randomUUID is unavailable on some origins. */
function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

function reducer(state: PrefsState, action: Action): PrefsState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.state, ready: true };

    case "replaceAll":
      return { ...initial, ...action.state, ready: true };

    case "reset":
      return { ...initial, ready: true };

    case "setProfile":
      return { ...state, profile: { ...state.profile, ...action.patch } };

    case "addVehicle": {
      if (state.vehicles.length >= VEHICLE_LIMIT) return state;
      const vehicle: Vehicle = { ...action.vehicle, id: newId("v") };
      return {
        ...state,
        vehicles: [...state.vehicles, vehicle],
        activeVehicleId: state.activeVehicleId ?? vehicle.id,
      };
    }

    case "updateVehicle":
      return {
        ...state,
        vehicles: state.vehicles.map((v) => (v.id === action.id ? { ...v, ...action.patch } : v)),
      };

    case "removeVehicle": {
      const vehicles = state.vehicles.filter((v) => v.id !== action.id);
      return {
        ...state,
        vehicles,
        activeVehicleId:
          state.activeVehicleId === action.id ? (vehicles[0]?.id ?? null) : state.activeVehicleId,
      };
    }

    case "setActiveVehicle":
      return { ...state, activeVehicleId: action.id };

    case "toggleCompare": {
      if (state.compare.includes(action.slug)) {
        return { ...state, compare: state.compare.filter((s) => s !== action.slug) };
      }
      if (state.compare.length >= COMPARE_LIMIT) return state;
      return { ...state, compare: [...state.compare, action.slug] };
    }

    case "clearCompare":
      return { ...state, compare: [] };

    case "toggleWishlist":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.slug)
          ? state.wishlist.filter((s) => s !== action.slug)
          : [action.slug, ...state.wishlist],
      };

    case "clearWishlist":
      return { ...state, wishlist: [] };

    case "addRecent":
      return {
        ...state,
        recent: [action.slug, ...state.recent.filter((s) => s !== action.slug)].slice(
          0,
          RECENT_LIMIT,
        ),
      };

    case "saveBuild": {
      const build: SavedBuild = {
        ...action.build,
        id: newId("b"),
        createdAt: new Date().toISOString(),
      };
      return { ...state, builds: [build, ...state.builds].slice(0, BUILD_LIMIT) };
    }

    case "removeBuild":
      return { ...state, builds: state.builds.filter((b) => b.id !== action.id) };

    case "logHistory": {
      const entry: HistoryEntry = {
        ...action.entry,
        id: newId("h"),
        at: new Date().toISOString(),
      };
      return { ...state, history: [entry, ...state.history].slice(0, HISTORY_LIMIT) };
    }

    case "clearHistory":
      return { ...state, history: [] };

    default:
      return state;
  }
}

interface PrefsValue extends PrefsState {
  activeVehicle: Vehicle | null;
  compareFull: boolean;
  /** True once anything at all has been saved — gates the profile UI. */
  hasProfile: boolean;

  setProfile: (patch: Partial<Profile>) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  setActiveVehicle: (id: string | null) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  isComparing: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  clearWishlist: () => void;
  isWishlisted: (slug: string) => boolean;
  addRecent: (slug: string) => void;
  saveBuild: (build: Omit<SavedBuild, "id" | "createdAt">) => void;
  removeBuild: (id: string) => void;
  logHistory: (entry: Omit<HistoryEntry, "id" | "at">) => void;
  clearHistory: () => void;
  exportProfile: () => void;
  importProfile: (file: File) => Promise<boolean>;
  resetAll: () => void;
}

const PrefsContext = createContext<PrefsValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      dispatch({ type: "hydrate", state: sanitise(parsed) });
    } catch {
      dispatch({ type: "hydrate", state: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      const { ready: _ready, ...persisted } = state;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Storage full or blocked — everything still works for this session.
    }
  }, [state]);

  const activeVehicle = useMemo(
    () => state.vehicles.find((v) => v.id === state.activeVehicleId) ?? null,
    [state.vehicles, state.activeVehicleId],
  );

  const isComparing = useCallback((slug: string) => state.compare.includes(slug), [state.compare]);
  const isWishlisted = useCallback(
    (slug: string) => state.wishlist.includes(slug),
    [state.wishlist],
  );

  const exportProfile = useCallback(() => {
    const { ready: _ready, ...data } = state;
    const blob = new Blob([JSON.stringify({ nexmod: 2, ...data }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexmod-profile-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importProfile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || parsed === null) return false;
      dispatch({ type: "replaceAll", state: sanitise(parsed) });
      return true;
    } catch {
      return false;
    }
  }, []);

  const hasProfile =
    Boolean(state.profile.name || state.profile.phone) ||
    state.vehicles.length > 0 ||
    state.builds.length > 0 ||
    state.wishlist.length > 0;

  const value = useMemo<PrefsValue>(
    () => ({
      ...state,
      activeVehicle,
      compareFull: state.compare.length >= COMPARE_LIMIT,
      hasProfile,
      setProfile: (patch) => dispatch({ type: "setProfile", patch }),
      addVehicle: (vehicle) => dispatch({ type: "addVehicle", vehicle }),
      updateVehicle: (id, patch) => dispatch({ type: "updateVehicle", id, patch }),
      removeVehicle: (id) => dispatch({ type: "removeVehicle", id }),
      setActiveVehicle: (id) => dispatch({ type: "setActiveVehicle", id }),
      toggleCompare: (slug) => dispatch({ type: "toggleCompare", slug }),
      clearCompare: () => dispatch({ type: "clearCompare" }),
      isComparing,
      toggleWishlist: (slug) => dispatch({ type: "toggleWishlist", slug }),
      clearWishlist: () => dispatch({ type: "clearWishlist" }),
      isWishlisted,
      addRecent: (slug) => dispatch({ type: "addRecent", slug }),
      saveBuild: (build) => dispatch({ type: "saveBuild", build }),
      removeBuild: (id) => dispatch({ type: "removeBuild", id }),
      logHistory: (entry) => dispatch({ type: "logHistory", entry }),
      clearHistory: () => dispatch({ type: "clearHistory" }),
      exportProfile,
      importProfile,
      resetAll: () => dispatch({ type: "reset" }),
    }),
    [state, activeVehicle, isComparing, isWishlisted, hasProfile, exportProfile, importProfile],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

/** Never trust stored or imported JSON — coerce every field to its shape. */
function sanitise(raw: unknown): Partial<PrefsState> {
  const data = (raw ?? {}) as Record<string, unknown>;
  const arr = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

  return {
    profile:
      typeof data.profile === "object" && data.profile !== null
        ? (data.profile as Profile)
        : {},
    vehicles: arr<Vehicle>(data.vehicles).filter((v) => v && typeof v.model === "string"),
    activeVehicleId: typeof data.activeVehicleId === "string" ? data.activeVehicleId : null,
    compare: arr<string>(data.compare).filter((s) => typeof s === "string").slice(0, COMPARE_LIMIT),
    wishlist: arr<string>(data.wishlist).filter((s) => typeof s === "string"),
    recent: arr<string>(data.recent).filter((s) => typeof s === "string").slice(0, RECENT_LIMIT),
    builds: arr<SavedBuild>(data.builds).filter((b) => b && Array.isArray(b.items)),
    history: arr<HistoryEntry>(data.history).filter((h) => h && typeof h.summary === "string"),
  };
}

export function usePrefs(): PrefsValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside a PrefsProvider");
  return ctx;
}

/** Records a product view. Mounted on product pages. */
export function useTrackView(slug: string) {
  const { addRecent, ready } = usePrefs();
  useEffect(() => {
    if (ready) addRecent(slug);
  }, [slug, ready, addRecent]);
}
