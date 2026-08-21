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
 * Browser-local preferences: the customer's saved vehicles, their compare
 * list, and what they have recently looked at.
 *
 * One provider rather than three, because all three persist the same way and
 * splitting them would mean three localStorage reads, three hydration guards
 * and three providers wrapping every page.
 *
 * Nothing here leaves the device. There is no account system and no server to
 * sync to — which is also why it is honest to call it a garage rather than a
 * profile.
 */

export interface Vehicle {
  id: string;
  /** Free text, e.g. "Honda Vezel Z". Matched against product fitment. */
  model: string;
  year?: string;
  colour?: string;
  /** Colour code from the door jamb plate, if they know it. */
  colourCode?: string;
  nickname?: string;
}

interface PrefsState {
  vehicles: Vehicle[];
  /** Which saved vehicle is currently steering fitment filters. */
  activeVehicleId: string | null;
  /** Product slugs queued for side-by-side comparison. */
  compare: string[];
  /** Product slugs, most recent first. */
  recent: string[];
  ready: boolean;
}

type Action =
  | { type: "hydrate"; state: Partial<PrefsState> }
  | { type: "addVehicle"; vehicle: Omit<Vehicle, "id"> }
  | { type: "removeVehicle"; id: string }
  | { type: "setActiveVehicle"; id: string | null }
  | { type: "toggleCompare"; slug: string }
  | { type: "clearCompare" }
  | { type: "addRecent"; slug: string };

const STORAGE_KEY = "nexmod.prefs.v1";

/** Four is the most that fits a comparison table without horizontal scroll. */
export const COMPARE_LIMIT = 4;
const RECENT_LIMIT = 12;
const VEHICLE_LIMIT = 6;

const initial: PrefsState = {
  vehicles: [],
  activeVehicleId: null,
  compare: [],
  recent: [],
  ready: false,
};

function reducer(state: PrefsState, action: Action): PrefsState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.state, ready: true };

    case "addVehicle": {
      if (state.vehicles.length >= VEHICLE_LIMIT) return state;
      const vehicle: Vehicle = {
        ...action.vehicle,
        // Not crypto.randomUUID — that is unavailable on http:// origins in
        // some browsers, and this only needs to be unique within one device.
        id: `v${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
      };
      return {
        ...state,
        vehicles: [...state.vehicles, vehicle],
        activeVehicleId: state.activeVehicleId ?? vehicle.id,
      };
    }

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

    case "addRecent":
      return {
        ...state,
        recent: [action.slug, ...state.recent.filter((s) => s !== action.slug)].slice(
          0,
          RECENT_LIMIT,
        ),
      };

    default:
      return state;
  }
}

interface PrefsValue extends PrefsState {
  activeVehicle: Vehicle | null;
  compareFull: boolean;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  removeVehicle: (id: string) => void;
  setActiveVehicle: (id: string | null) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  isComparing: (slug: string) => boolean;
  addRecent: (slug: string) => void;
}

const PrefsContext = createContext<PrefsValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      dispatch({
        type: "hydrate",
        state: {
          vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
          activeVehicleId: parsed.activeVehicleId ?? null,
          compare: Array.isArray(parsed.compare) ? parsed.compare : [],
          recent: Array.isArray(parsed.recent) ? parsed.recent : [],
        },
      });
    } catch {
      dispatch({ type: "hydrate", state: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          vehicles: state.vehicles,
          activeVehicleId: state.activeVehicleId,
          compare: state.compare,
          recent: state.recent,
        }),
      );
    } catch {
      // Storage full or blocked — everything still works for this session.
    }
  }, [state]);

  const activeVehicle = useMemo(
    () => state.vehicles.find((v) => v.id === state.activeVehicleId) ?? null,
    [state.vehicles, state.activeVehicleId],
  );

  const isComparing = useCallback((slug: string) => state.compare.includes(slug), [state.compare]);

  const value = useMemo<PrefsValue>(
    () => ({
      ...state,
      activeVehicle,
      compareFull: state.compare.length >= COMPARE_LIMIT,
      addVehicle: (vehicle) => dispatch({ type: "addVehicle", vehicle }),
      removeVehicle: (id) => dispatch({ type: "removeVehicle", id }),
      setActiveVehicle: (id) => dispatch({ type: "setActiveVehicle", id }),
      toggleCompare: (slug) => dispatch({ type: "toggleCompare", slug }),
      clearCompare: () => dispatch({ type: "clearCompare" }),
      isComparing,
      addRecent: (slug) => dispatch({ type: "addRecent", slug }),
    }),
    [state, activeVehicle, isComparing],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
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
