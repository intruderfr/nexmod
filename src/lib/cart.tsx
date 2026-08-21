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
import { lkr, site, waLink } from "@/data/site";

/**
 * Cart state.
 *
 * Persisted to localStorage so a cart survives a refresh. Deliberately has no
 * server dependency — orders are placed either through the checkout form
 * (POSTed to /api/orders) or handed off to WhatsApp as a formatted message,
 * which is how Nexmod already takes most of its orders.
 */

export interface CartLine {
  /** Composite key: product slug + variant id. */
  key: string;
  slug: string;
  name: string;
  variantId?: string;
  variantLabel?: string;
  unitPrice: number;
  qty: number;
  /** Fitting at the Dehiwala workshop rather than delivery. */
  withInstallation: boolean;
  installationFee: number;
  category: string;
}

interface CartState {
  lines: CartLine[];
  /** Drawer open state lives here so any component can open it. */
  open: boolean;
  /** Set once the persisted cart has been read, to avoid a hydration flash. */
  ready: boolean;
}

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: Omit<CartLine, "key">; }
  | { type: "remove"; key: string }
  | { type: "setQty"; key: string; qty: number }
  | { type: "toggleInstall"; key: string }
  | { type: "clear" }
  | { type: "setOpen"; open: boolean };

const STORAGE_KEY = "nexmod.cart.v1";

function lineKey(slug: string, variantId?: string): string {
  return variantId ? `${slug}::${variantId}` : slug;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines, ready: true };

    case "add": {
      const key = lineKey(action.line.slug, action.line.variantId);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          ...state,
          open: true,
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, qty: Math.min(l.qty + action.line.qty, 99) } : l,
          ),
        };
      }
      return { ...state, open: true, lines: [...state.lines, { ...action.line, key }] };
    }

    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };

    case "setQty": {
      if (action.qty < 1) {
        return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, qty: Math.min(action.qty, 99) } : l,
        ),
      };
    }

    case "toggleInstall":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, withInstallation: !l.withInstallation } : l,
        ),
      };

    case "clear":
      return { ...state, lines: [] };

    case "setOpen":
      return { ...state, open: action.open };

    default:
      return state;
  }
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  installationTotal: number;
  deliveryFee: number;
  /** True when everything in the cart is being fitted at the workshop. */
  allInstalled: boolean;
  total: number;
  qualifiesForFreeDelivery: boolean;
  amountToFreeDelivery: number;
}

interface CartContextValue {
  lines: CartLine[];
  open: boolean;
  ready: boolean;
  totals: CartTotals;
  add: (line: Omit<CartLine, "key">) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  toggleInstall: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  /** Formatted WhatsApp order message with a prefilled deep link. */
  whatsappOrderLink: () => string;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Flat delivery fee when nothing qualifies for free shipping. PLACEHOLDER. */
const DELIVERY_FEE = 650;

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], open: false, ready: false });

  // Read the persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const lines: CartLine[] = raw ? JSON.parse(raw) : [];
      dispatch({ type: "hydrate", lines: Array.isArray(lines) ? lines : [] });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    }
  }, []);

  // Persist on every change, but only after hydration so we never clobber
  // a stored cart with the empty initial state.
  useEffect(() => {
    if (!state.ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage full or blocked — the cart still works for this session.
    }
  }, [state.lines, state.ready]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = state.open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.open]);

  const totals = useMemo<CartTotals>(() => {
    const itemCount = state.lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = state.lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
    const installationTotal = state.lines.reduce(
      (n, l) => n + (l.withInstallation ? l.installationFee * l.qty : 0),
      0,
    );
    const allInstalled = state.lines.length > 0 && state.lines.every((l) => l.withInstallation);

    const qualifiesForFreeDelivery = subtotal >= site.delivery.freeThreshold;
    // Workshop fitting means nothing ships.
    const deliveryFee =
      state.lines.length === 0 || allInstalled || qualifiesForFreeDelivery ? 0 : DELIVERY_FEE;

    return {
      itemCount,
      subtotal,
      installationTotal,
      deliveryFee,
      allInstalled,
      total: subtotal + installationTotal + deliveryFee,
      qualifiesForFreeDelivery,
      amountToFreeDelivery: Math.max(0, site.delivery.freeThreshold - subtotal),
    };
  }, [state.lines]);

  const whatsappOrderLink = useCallback(() => {
    if (state.lines.length === 0) {
      return waLink("Hi Nexmod, I'd like to place an order.");
    }

    const lines = state.lines.map((l) => {
      const variant = l.variantLabel ? ` (${l.variantLabel})` : "";
      const install = l.withInstallation ? " + fitting" : "";
      const lineTotal = (l.unitPrice + (l.withInstallation ? l.installationFee : 0)) * l.qty;
      return `• ${l.name}${variant}${install} x${l.qty} — ${lkr(lineTotal)}`;
    });

    const message = [
      "Hi Nexmod, I'd like to order the following:",
      "",
      ...lines,
      "",
      `Subtotal: ${lkr(totals.subtotal)}`,
      totals.installationTotal > 0 ? `Fitting: ${lkr(totals.installationTotal)}` : null,
      totals.deliveryFee > 0 ? `Delivery: ${lkr(totals.deliveryFee)}` : null,
      `Total: ${lkr(totals.total)}`,
      "",
      totals.allInstalled
        ? "I'd like to book fitting at the Dehiwala workshop."
        : "Please confirm availability and delivery.",
    ]
      .filter(Boolean)
      .join("\n");

    return waLink(message);
  }, [state.lines, totals]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      open: state.open,
      ready: state.ready,
      totals,
      add: (line) => dispatch({ type: "add", line }),
      remove: (key) => dispatch({ type: "remove", key }),
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      toggleInstall: (key) => dispatch({ type: "toggleInstall", key }),
      clear: () => dispatch({ type: "clear" }),
      setOpen: (open) => dispatch({ type: "setOpen", open }),
      whatsappOrderLink,
    }),
    [state.lines, state.open, state.ready, totals, whatsappOrderLink],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
