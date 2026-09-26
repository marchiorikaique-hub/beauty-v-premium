import { WhatsApp } from "./icons";
import { ProductImageView } from "./ProductImageView";
import { waProduct } from "@/lib/site";
import { discountPercent, formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  whatsapp: string;
  siteUrl: string;
}

export function ProductCard({ product: p, whatsapp, siteUrl }: ProductCardProps) {
  const href = `/produto/${p.slug}`;
  const off = discountPercent(p.priceCents, p.compareAtCents);
  const cover = p.images[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-espresso/8 bg-cream shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
      <a href={href} className="flex flex-1 flex-col focus-visible:outline-offset-[-3px]">
        <div className="relative aspect-square overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "radial-gradient(78% 70% at 50% 42%, var(--color-champagne-soft) 0%, var(--color-cream) 72%)",
            }}
          />
          {cover && (
            <ProductImageView
              image={cover}
              alt={p.brand ? `${p.name}, ${p.brand}` : p.name}
              className={`transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${
                p.inStock ? "" : "opacity-75 grayscale-[35%]"
              }`}
            />
          )}
          <span
            className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-medium shadow-sm backdrop-blur ${
              p.inStock ? "bg-offwhite/90 text-espresso" : "bg-espresso/85 text-champagne-soft"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${p.inStock ? "bg-vinho" : "bg-champagne"}`} />
            {p.inStock ? "Pronta-entrega" : "Esgotado"}
          </span>
          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
            {p.isNew && (
              <span className="rounded-full bg-vinho px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-champagne-soft shadow-sm">
                Novo
              </span>
            )}
            {off && (
              <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[0.66rem] font-semibold text-ink shadow-sm">
                -{off}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pt-5">
          <p className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-taupe-deep">
            {p.categoryName ?? "Beauty V"}
            {p.brand ? ` · ${p.brand}` : ""}
          </p>
          <h3 className="mt-1.5 font-display text-[1.35rem] leading-tight text-ink transition-colors group-hover:text-vinho">
            {p.name}
          </h3>
          {p.blurb && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-espresso/75">{p.blurb}</p>}

          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
            {p.priceCents != null ? (
              <p className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-ink">{formatBRL(p.priceCents)}</span>
                {p.compareAtCents != null && off && (
                  <span className="text-sm text-taupe-deep line-through">{formatBRL(p.compareAtCents)}</span>
                )}
              </p>
            ) : (
              <p className="text-sm font-medium text-espresso/70">Valor sob consulta</p>
            )}
            {p.detail && (
              <span className="rounded-full bg-champagne-soft px-3 py-1 text-xs font-medium text-espresso/80">
                {p.detail}
              </span>
            )}
          </div>
        </div>
      </a>

      <div className="px-5 pb-5 pt-4">
        <a
          href={waProduct(whatsapp, { name: p.name, brand: p.brand, url: `${siteUrl}${href}`, inStock: p.inStock })}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn w-full py-3 text-sm ${p.inStock ? "btn-primary" : "btn-ghost"}`}
          aria-label={p.inStock ? `Comprar ${p.name} no WhatsApp` : `Pedir aviso quando ${p.name} chegar`}
        >
          <WhatsApp size={17} />
          {p.inStock ? "Comprar no WhatsApp" : "Avise-me quando chegar"}
        </a>
        {p.priceCents == null && p.inStock && (
          <p className="mt-2.5 text-center text-xs text-taupe-deep">Valores e cores combinados no WhatsApp</p>
        )}
      </div>
    </article>
  );
}
