import { WhatsApp } from "./icons";
import { waProduct } from "@/lib/site";
import type { Product } from "@/lib/products";

const categoryLabel: Record<Product["category"], string> = {
  maquiagem: "Maquiagem",
  skincare: "Skincare",
  perfumaria: "Perfumaria",
  acessorios: "Acessórios",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-espresso/8 bg-cream shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-square overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(78% 70% at 50% 42%, var(--color-champagne-soft) 0%, var(--color-cream) 72%)",
          }}
        />
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-offwhite/90 px-2.5 py-1 text-[0.66rem] font-medium text-espresso shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-vinho" />
          Pronta-entrega
        </span>
        <img
          src={product.image}
          alt={product.brand ? `${product.name}, ${product.brand}` : product.name}
          width={400}
          height={400}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-taupe-deep">
          {categoryLabel[product.category]}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>
        <h3 className="mt-1.5 font-display text-[1.35rem] leading-tight text-ink">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-espresso/75">
          {product.blurb}
        </p>

        <div className="mt-auto pt-5">
          <span className="mb-3 inline-block rounded-full bg-champagne-soft px-3 py-1 text-xs font-medium text-espresso/80">
            {product.detail}
          </span>
          <a
            href={waProduct(product.name, product.brand)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full py-3 text-sm"
            aria-label={`Comprar ${product.name} no WhatsApp`}
          >
            <WhatsApp size={17} />
            Comprar no WhatsApp
          </a>
          <p className="mt-2.5 text-center text-xs text-taupe-deep">
            Valores e cores combinados no WhatsApp
          </p>
        </div>
      </div>
    </article>
  );
}
