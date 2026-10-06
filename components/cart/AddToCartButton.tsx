"use client";

import { useCart } from "./CartProvider";
import { BagHeart } from "../icons";

interface AddToCartButtonProps {
  productId: number;
  variant?: string;
  className?: string;
  label?: string;
  /** antes de adicionar (ex.: pedir pra escolher a cor); false cancela */
  beforeAdd?: () => boolean;
}

export function AddToCartButton({ productId, variant = "", className = "", label = "Adicionar ao carrinho", beforeAdd }: AddToCartButtonProps) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        if (beforeAdd && !beforeAdd()) return;
        add(productId, variant);
      }}
      className={`btn btn-primary ${className}`}
    >
      <BagHeart size={18} />
      {label}
    </button>
  );
}
