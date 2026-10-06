"use client";

import { createContext, useContext, useRef, useState } from "react";
import { useCart } from "./cart/CartProvider";
import { BagHeart, WhatsApp } from "./icons";
import { formatBRL } from "@/lib/format";
import { waProduct } from "@/lib/site";
import type { ProductVariant } from "@/lib/types";

interface BuyProduct {
  id: number;
  name: string;
  brand: string;
  priceCents: number | null;
  inStock: boolean;
  variantLabel: string;
  variants: ProductVariant[];
}

interface Selection {
  product: BuyProduct;
  variant: ProductVariant | null;
  select: (v: ProductVariant) => void;
  missing: boolean;
  requireChoice: () => boolean;
  pickerRef: React.RefObject<HTMLDivElement | null>;
}

const SelectionContext = createContext<Selection | null>(null);

/** Opção escolhida, compartilhada entre a galeria, as bolinhas e os botões de compra. */
export function useProductSelection() {
  return useContext(SelectionContext);
}

export function ProductSelection({ product, children }: { product: BuyProduct; children: React.ReactNode }) {
  // já começa na primeira opção que tem em estoque
  const [variant, setVariant] = useState<ProductVariant | null>(
    () => product.variants.find((v) => v.inStock) ?? product.variants[0] ?? null,
  );
  const [missing, setMissing] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const requireChoice = () => {
    if (product.variants.length === 0 || variant) return true;
    setMissing(true);
    pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    pickerRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    return false;
  };

  return (
    <SelectionContext.Provider
      value={{
        product,
        variant,
        select: (v) => {
          setVariant(v);
          setMissing(false);
        },
        missing,
        requireChoice,
        pickerRef,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function VariantPicker() {
  const sel = useProductSelection();
  if (!sel || sel.product.variants.length === 0) return null;
  const { product, variant, select, missing, pickerRef } = sel;
  const label = product.variantLabel || "Opção";
  const withColor = product.variants.some((v) => v.color);

  return (
    <div ref={pickerRef} className="mt-7">
      <p className="text-sm text-espresso" id="variant-label">
        {label}: <span className="font-semibold text-ink">{variant?.name ?? "escolha uma"}</span>
        {variant && !variant.inStock && <span className="ml-2 text-taupe-deep">(esgotada)</span>}
      </p>
      <div
        role="radiogroup"
        aria-labelledby="variant-label"
        className={`mt-3 flex flex-wrap ${withColor ? "gap-2.5" : "gap-2"}`}
      >
        {product.variants.map((v) => {
          const on = variant?.name === v.name;
          return v.color ? (
            <button
              key={v.name}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${v.name}${v.inStock ? "" : ", esgotada"}`}
              title={v.name}
              onClick={() => select(v)}
              className={`relative h-10 w-10 rounded-full transition-[box-shadow,transform] duration-200 hover:scale-105 ${
                on
                  ? "shadow-[0_0_0_2px_var(--color-offwhite),0_0_0_3.5px_var(--color-ink)]"
                  : "shadow-[0_0_0_1px_rgba(75,60,53,0.18)]"
              }`}
              style={{ background: v.color }}
            >
              {!v.inStock && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent calc(50% - 1px), rgba(248,245,242,0.95) calc(50% - 1px), rgba(248,245,242,0.95) calc(50% + 1px), transparent calc(50% + 1px))",
                  }}
                />
              )}
            </button>
          ) : (
            <button
              key={v.name}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => select(v)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                on
                  ? "border-ink bg-ink text-champagne-soft"
                  : "border-espresso/20 text-espresso hover:border-vinho hover:text-vinho"
              } ${v.inStock ? "" : "line-through decoration-1 opacity-60"}`}
            >
              {v.name}
            </button>
          );
        })}
      </div>
      {missing && <p className="mt-2 text-sm font-medium text-vinho">Escolha {label.toLowerCase()} pra continuar.</p>}
    </div>
  );
}

function useBuy(whatsapp: string, url: string) {
  const sel = useProductSelection();
  const cart = useCart();
  if (!sel) return null;
  const { product, variant } = sel;
  const available = product.inStock && (variant ? variant.inStock : true);
  const wa = waProduct(whatsapp, {
    name: product.name,
    brand: product.brand,
    url,
    inStock: available,
    variant: variant?.name,
    variantLabel: product.variantLabel,
  });
  const add = () => {
    if (!sel.requireChoice()) return;
    cart.add(product.id, variant?.name ?? "");
  };
  return { sel, available, wa, add };
}

export function BuyButtons({ whatsapp, url, children }: { whatsapp: string; url: string; children?: React.ReactNode }) {
  const buy = useBuy(whatsapp, url);
  if (!buy) return null;
  return (
    <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
      {buy.available ? (
        <>
          <button type="button" onClick={buy.add} className="btn btn-primary btn-caps px-8 py-4">
            <BagHeart size={20} />
            Adicionar ao carrinho
          </button>
          <a href={buy.wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-6 py-4 text-base">
            <WhatsApp size={20} />
            Comprar no WhatsApp
          </a>
        </>
      ) : (
        <a href={buy.wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-7 py-4 text-base">
          <WhatsApp size={20} />
          Avise-me quando chegar
        </a>
      )}
      {children}
    </div>
  );
}

export function MobileBuyBar({ whatsapp, url }: { whatsapp: string; url: string }) {
  const buy = useBuy(whatsapp, url);
  if (!buy) return null;
  const { product, variant } = buy.sel;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-espresso/10 bg-offwhite/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-20px_rgba(75,60,53,0.6)] backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{product.name}</p>
          <p className="truncate text-sm text-espresso/75">
            {product.priceCents != null ? formatBRL(product.priceCents) : "Valor sob consulta"}
            {variant ? ` · ${variant.name}` : ""}
          </p>
        </div>
        {buy.available ? (
          <>
            <a
              href={buy.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost shrink-0 bg-cream px-3.5 py-3"
              aria-label="Comprar no WhatsApp"
            >
              <WhatsApp size={18} />
            </a>
            <button type="button" onClick={buy.add} className="btn btn-primary btn-caps shrink-0 px-5 py-3">
              <BagHeart size={18} />
              Comprar
            </button>
          </>
        ) : (
          <a href={buy.wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost shrink-0 bg-cream px-5 py-3 text-sm">
            <WhatsApp size={18} />
            Avise-me
          </a>
        )}
      </div>
    </div>
  );
}
