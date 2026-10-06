import { WhatsApp } from "./icons";
import { ProductImageView } from "./ProductImageView";
import { AddToCartButton } from "./cart/AddToCartButton";
import { waProduct } from "@/lib/site";
import { discountPercent, formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  whatsapp: string;
  siteUrl: string;
}

/**
 * Card de vitrine compacto (estilo app de compra): 2 por linha no celular,
 * foto, nome, preço e um botão. Os detalhes ficam na página do produto.
 */
export function ProductCard({ product: p, whatsapp, siteUrl }: ProductCardProps) {
  const href = `/produto/${p.slug}`;
  const off = discountPercent(p.priceCents, p.compareAtCents);
  const cover = p.images[0];
  const swatches = p.variants.filter((v) => v.color);
  const ask = waProduct(whatsapp, { name: p.name, brand: p.brand, url: `${siteUrl}${href}`, inStock: p.inStock });
  const label = (p.variantLabel || "opção").toLowerCase();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-cream shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:rounded-3xl">
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
              className={`transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${
                p.inStock ? "" : "opacity-75 grayscale-[35%]"
              }`}
            />
          )}
          {!p.inStock ? (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-espresso/85 px-2 py-0.5 text-[0.6rem] font-medium text-champagne-soft sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.66rem]">
              Esgotado
            </span>
          ) : (
            <span className="absolute left-3 top-3 z-10 hidden items-center gap-1.5 rounded-full bg-offwhite/90 px-2.5 py-1 text-[0.66rem] font-medium text-espresso shadow-sm backdrop-blur sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-vinho" />
              Pronta-entrega
            </span>
          )}
          <div className="absolute right-2 top-2 z-10 flex flex-col items-end gap-1 sm:right-3 sm:top-3 sm:gap-1.5">
            {p.isNew && (
              <span className="rounded-full bg-vinho px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-champagne-soft shadow-sm sm:px-2.5 sm:py-1 sm:text-[0.66rem]">
                Novo
              </span>
            )}
            {off && (
              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.6rem] font-semibold text-ink shadow-sm sm:px-2.5 sm:py-1 sm:text-[0.66rem]">
                -{off}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-3 pt-2.5 sm:px-5 sm:pt-4">
          {p.brand && (
            <p className="truncate text-[0.6rem] font-medium uppercase tracking-[0.16em] text-taupe-deep sm:text-[0.66rem]">
              {p.brand}
            </p>
          )}
          <h3 className="mt-0.5 line-clamp-2 font-display text-[1.02rem] font-semibold leading-[1.15] text-ink transition-colors group-hover:text-vinho sm:mt-1 sm:text-[1.3rem]">
            {p.name}
          </h3>
          {p.blurb && (
            <p className="mt-1.5 hidden text-sm leading-relaxed text-espresso/75 sm:line-clamp-2">{p.blurb}</p>
          )}
          {p.variants.length > 0 && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.68rem] text-espresso/75 sm:mt-2.5 sm:text-xs">
              {swatches.length > 0 && (
                <span className="flex -space-x-1" aria-hidden>
                  {swatches.slice(0, 5).map((v) => (
                    <span
                      key={v.name}
                      className="h-3 w-3 rounded-full ring-2 ring-cream sm:h-4 sm:w-4"
                      style={{ background: v.color }}
                    />
                  ))}
                </span>
              )}
              <span className="truncate">
                {p.variants.length} {swatches.length > 0 ? (p.variants.length === 1 ? "cor" : "cores") : label}
              </span>
            </p>
          )}

          <div className="mt-auto pt-2 sm:pt-3">
            {p.priceCents != null ? (
              <p className="flex flex-wrap items-baseline gap-x-1.5">
                {p.compareAtCents != null && off && (
                  <span className="w-full text-[0.7rem] text-taupe-deep line-through sm:w-auto sm:text-sm">
                    {formatBRL(p.compareAtCents)}
                  </span>
                )}
                <span className="text-[1.05rem] font-semibold text-ink sm:text-lg">{formatBRL(p.priceCents)}</span>
              </p>
            ) : (
              <p className="text-[0.75rem] font-medium text-espresso/70 sm:text-sm">Valor sob consulta</p>
            )}
          </div>
        </div>
      </a>

      <div className="flex gap-2 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-3">
        {!p.inStock ? (
          <a
            href={ask}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-caps w-full !px-2 !py-2 !text-[0.62rem] sm:!py-3 sm:!text-[0.72rem]"
            aria-label={`Pedir aviso quando ${p.name} chegar`}
          >
            <WhatsApp size={15} />
            Avise-me
          </a>
        ) : (
          <>
            {p.variants.length > 0 ? (
              <a href={href} className="btn btn-primary btn-caps min-w-0 flex-1 !px-2 !py-2 !text-[0.62rem] sm:!py-3 sm:!text-[0.72rem]">
                Escolher {swatches.length > 0 ? "cor" : label}
              </a>
            ) : (
              <AddToCartButton
                productId={p.id}
                className="btn-caps min-w-0 flex-1 !px-2 !py-2 !text-[0.62rem] sm:!py-3 sm:!text-[0.72rem]"
                label="Comprar"
              />
            )}
            <a
              href={ask}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hidden shrink-0 px-3.5 py-3 sm:inline-flex"
              aria-label={`Perguntar sobre ${p.name} no WhatsApp`}
              title="Perguntar no WhatsApp"
            >
              <WhatsApp size={18} />
            </a>
          </>
        )}
      </div>
    </article>
  );
}
