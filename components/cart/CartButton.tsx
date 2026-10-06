"use client";

import { useCart } from "./CartProvider";
import { BagHeart } from "../icons";

export function CartButton() {
  const { count, ready, setOpen } = useCart();
  const label = count === 0 ? "Abrir carrinho, vazio" : `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center sm:h-11 sm:w-11 justify-center rounded-full border border-gold-soft/40 text-champagne-soft transition-colors hover:border-gold-soft hover:text-gold-soft"
    >
      <BagHeart size={22} />
      {ready && count > 0 && (
        <span
          key={count}
          className="cart-badge absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-soft px-1 text-[0.68rem] font-semibold tabular-nums text-vinho-night ring-2 ring-vinho-deep"
        >
          {count}
        </span>
      )}
    </button>
  );
}
