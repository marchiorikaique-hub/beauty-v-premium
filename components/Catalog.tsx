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
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Filter>("tudo");

  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      setQuery("");
      if (hash === "catalogo") setActive("tudo");
      if (hash.startsWith("cat-")) {
        const id = hash.slice(4) as Filter;
        if (filters.some((f) => f.id === id)) setActive(id);
      }
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, []);

  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const shown = products.filter((p) =>
    (active === "tudo" || p.category === active) &&
    normalize(`${p.name} ${p.brand} ${p.blurb}`).includes(normalize(query.trim())),
  );

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
        <div className="catalog-toolbar">
        <div role="group" aria-label="Filtrar por categoria" className="catalog-filters">
          {filters.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                aria-pressed={isActive}
                type="button"
                onClick={() => {
                  setActive(f.id);
                  history.replaceState(
                    null,
                    "",
                    f.id === "tudo" ? "#catalogo" : `#cat-${f.id}`,
                  );
                }}
                className="catalog-filter"
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <label className="catalog-search">
          Buscar no catálogo
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Produto ou marca" aria-controls="catalog-results" />
        </label>
        </div>
        <p className="catalog-count" role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
        <div id="catalog-results">
        {/* grade */}
        {shown.length > 0 ? (
          <div className="catalog-grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : query.trim() ? (
          <div className="rounded-xl bg-champagne-soft px-6 py-12 text-center">
            <h3 className="text-2xl">Nenhum produto encontrado</h3>
            <p className="mt-3">Tente outro nome ou veja todos os produtos.</p>
            <button type="button" className="btn btn-primary mt-5" onClick={() => {
              setQuery(""); setActive("tudo"); history.replaceState(null, "", "#catalogo");
            }}>Limpar busca e filtros</button>
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
      </div>
    </section>
  );
}
