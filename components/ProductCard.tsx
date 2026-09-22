import { asset } from "@/lib/assets";
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
    <article className="product-card group" data-category={product.category}>
      <a href={waProduct(product.name, product.brand)} target="_blank" rel="noopener noreferrer"
        aria-label={`Ver ${product.name} no WhatsApp`} className="product-image">

        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-offwhite/90 px-2.5 py-1 text-[0.66rem] font-medium text-espresso shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-vinho" />
          Pronta-entrega
        </span>
        <img
          src={asset(product.image)}
          alt={product.brand ? `${product.name}, ${product.brand}` : product.name}
          width={400}
          height={400}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      </a>

      <div className="product-info">
        <p className="text-xs font-medium text-espresso/80">
          {categoryLabel[product.category]}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>
        <h3 className="product-title">
          {product.name}
        </h3>
        <p className="product-description">
          {product.blurb}
        </p>

        <div className="mt-auto pt-4">
          <span className="mb-3 inline-block rounded-full bg-champagne-soft px-3 py-1 text-xs font-medium text-espresso/80">
            {product.detail}
          </span>
          <a
            href={waProduct(product.name, product.brand)}
            target="_blank"
            rel="noopener noreferrer"
            className="product-buy"
            aria-label={`Comprar ${product.name} no WhatsApp`}
          >
            <WhatsApp size={17} />
            Quero esse
          </a>
          <p className="mt-2.5 text-xs text-espresso/80">
            Valores e cores no WhatsApp
          </p>
        </div>
      </div>
    </article>
  );
}
