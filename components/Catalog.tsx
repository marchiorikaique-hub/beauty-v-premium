"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { WhatsApp, Sparkle } from "./icons";
import { products, categories, type CategoryId } from "@/lib/products";
import { waCategory } from "@/lib/site";

type Filter = "tudo" | CategoryId;

const filters: { id: Filter; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  ...categories.map((c) => ({ id: c.id as Filter, label: c.label })),
];

export function Catalog() {
  const [active, setActive] = useState<Filter>("tudo");

  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("cat-")) {
        const id = hash.slice(4) as Filter;
        if (filters.some((f) => f.id === id)) setActive(id);
      }
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, []);

  const shown =
    active === "tudo" ? products : products.filter((p) => p.category === active);

  return (
    <section id="catalogo" className="scroll-mt-24 bg-offwhite py-16 sm:py-24">
      {/* âncoras de categoria pra nav/tiles */}
      {categories.map((c) => (
        <span
          key={c.id}
          id={`cat-${c.id}`}
          aria-hidden
          className="block h-0 scroll-mt-28"
        />
      ))}

      <div className="shell">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Nosso catálogo
          </h2>
          <p className="max-w-sm text-espresso/75">
            Uma seleção com pronta-entrega. Toca em qualquer produto pra pedir
            direto no WhatsApp.
          </p>
        </div>

        {/* filtros */}
        <div
          role="tablist"
          aria-label="Filtrar por categoria"
          className="mb-9 flex flex-wrap gap-2.5"
        >
          {filters.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => {
                  setActive(f.id);
                  history.replaceState(
                    null,
                    "",
                    f.id === "tudo" ? "#catalogo" : `#cat-${f.id}`,
                  );
                }}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "border-vinho bg-vinho text-champagne-soft shadow-[0_12px_24px_-14px_rgba(85,21,32,0.8)]"
                    : "border-espresso/15 bg-cream text-espresso hover:border-vinho hover:text-vinho"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* grade */}
        {shown.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-espresso/15 bg-champagne-soft/40 px-6 py-16 text-center">
            <Sparkle size={28} className="text-gold" />
            <h3 className="font-display text-2xl text-ink">
              Novidades chegando toda semana
            </h3>
            <p className="max-w-md text-espresso/75">
              Os acessórios e mimos entram por aqui bem rápido. Chama no WhatsApp
              que a gente te mostra o que acabou de chegar.
            </p>
            <a
              href={waCategory("acessórios")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-1"
            >
              <WhatsApp size={18} />
              Ver novidades no WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
