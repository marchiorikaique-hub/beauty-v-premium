"use client";

import { useCart } from "./CartProvider";
import { Bag } from "../icons";

export function CartButton() {
  const { count, ready, setOpen } = useCart();
  const label = count === 0 ? "Abrir carrinho, vazio" : `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-espresso/15 text-espresso transition-colors hover:border-vinho hover:text-vinho"
    >
      <Bag size={21} />
      {ready && count > 0 && (
        <span
          key={count}
          className="cart-badge absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-vinho px-1 text-[0.68rem] font-semibold tabular-nums text-champagne-soft ring-2 ring-offwhite"
        >
          {count}
        </span>
      )}
    </button>
  );
}
