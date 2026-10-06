"use client";

import { useCart } from "./CartProvider";
import { Check } from "../icons";

/** Aviso rápido embaixo do cabeçalho quando algo entra no carrinho. */
export function AddedToast() {
  const { added, setOpen } = useCart();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[7.25rem] z-[60] flex justify-center px-4 sm:justify-end sm:px-6">
      {added && (
        <div
          key={added.id}
          className="toast-in pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl bg-ink py-2.5 pl-3 pr-2 text-sm text-champagne-soft shadow-[0_24px_50px_-24px_rgba(44,35,32,0.9)]"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-vinho">
            <Check size={15} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-medium">{added.name}</span>
            <span className="block truncate text-xs text-champagne/75">
              {added.variant ? `${added.variant} · ` : ""}foi pro carrinho
            </span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl px-3 py-1.5 font-medium text-gold-soft hover:bg-white/10"
          >
            Ver carrinho
          </button>
        </div>
      )}
    </div>
  );
}
