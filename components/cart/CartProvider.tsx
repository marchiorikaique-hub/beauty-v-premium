"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MAX_QTY, cartTotals, lineKey, resolveCart, type CartLine, type CartProduct, type CartRow } from "@/lib/cart";

const STORAGE_KEY = "bv-cart-v1";

interface Added {
  id: number;
  name: string;
  variant: string;
}

interface CartContextValue {
  rows: CartRow[];
  count: number;
  cents: number;
  unpriced: number;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (productId: number, variant?: string) => void;
  setQty: (row: Pick<CartLine, "productId" | "variant">, qty: number) => void;
  remove: (row: Pick<CartLine, "productId" | "variant">) => void;
  clear: () => void;
  added: Added | null;
  whatsapp: string;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is CartLine =>
          !!l && typeof l === "object" && Number.isInteger(l.productId) && typeof l.variant === "string" && Number.isFinite(l.qty),
      )
      .slice(0, 60);
  } catch {
    return [];
  }
}

export function CartProvider({
  catalog,
  whatsapp,
  children,
}: {
  catalog: CartProduct[];
  whatsapp: string;
  children: React.ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<Added | null>(null);
  const seq = useRef(0);

  const byId = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);
  const rows = useMemo(() => resolveCart(lines, byId), [lines, byId]);
  const totals = useMemo(() => cartTotals(rows), [rows]);

  useEffect(() => {
    setLines(readStored());
    setReady(true);
    // outra aba mexeu no carrinho
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLines(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      // grava só o que ainda existe na loja
      const clean = rows.map(({ productId, variant, qty }) => ({ productId, variant, qty }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch {
      /* navegador sem armazenamento: carrinho vale só nessa visita */
    }
  }, [rows, ready]);

  const add = useCallback(
    (productId: number, variant = "") => {
      const product = byId.get(productId);
      if (!product) return;
      setLines((cur) => {
        const k = lineKey({ productId, variant });
        const hit = cur.find((l) => lineKey(l) === k);
        if (hit) return cur.map((l) => (l === hit ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l));
        return [...cur, { productId, variant, qty: 1 }];
      });
      setAdded({ id: ++seq.current, name: product.name, variant });
    },
    [byId],
  );

  const setQty = useCallback((row: Pick<CartLine, "productId" | "variant">, qty: number) => {
    const k = lineKey(row);
    setLines((cur) =>
      qty <= 0
        ? cur.filter((l) => lineKey(l) !== k)
        : cur.map((l) => (lineKey(l) === k ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((row: Pick<CartLine, "productId" | "variant">) => {
    const k = lineKey(row);
    setLines((cur) => cur.filter((l) => lineKey(l) !== k));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(null), 3800);
    return () => window.clearTimeout(t);
  }, [added]);

  const value: CartContextValue = {
    rows,
    ...totals,
    ready,
    open,
    setOpen,
    add,
    setQty,
    remove,
    clear,
    added,
    whatsapp,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fora do CartProvider");
  return ctx;
}
