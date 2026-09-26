"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { WhatsApp, Sparkle } from "./icons";
import { waCategory, waGeneral } from "@/lib/site";
import type { Product } from "@/lib/types";

interface CatalogProps {
  products: Product[];
  categories: { slug: string; name: string }[];
  whatsapp: string;
  siteUrl: string;
}

const TUDO = "tudo";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Catalog({ products, categories, whatsapp, siteUrl }: CatalogProps) {
  const [active, setActive] = useState<string>(TUDO);
  const [query, setQuery] = useState("");

  const filters = useMemo(() => [{ slug: TUDO, name: "Tudo" }, ...categories], [categories]);

  useEffect(() => {
    const applyFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (hash.startsWith("cat-")) {
        const slug = hash.slice(4);
        if (filters.some((f) => f.slug === slug)) setActive(slug);
      }
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, [filters]);

  const q = normalize(query.trim());
  const shown = products.filter(
    (p) =>
      (active === TUDO || p.categorySlug === active) &&
      (!q || normalize(`${p.name} ${p.brand} ${p.categoryName ?? ""} ${p.detail}`).includes(q)),
  );
  const activeName = filters.find((f) => f.slug === active)?.name ?? "";

  return (
    <section id="catalogo" className="scroll-mt-24 bg-offwhite py-16 sm:py-24">
      {categories.map((c) => (
        <span key={c.slug} id={`cat-${c.slug}`} aria-hidden className="block h-0 scroll-mt-28" />
      ))}

      <div className="shell">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl text-ink sm:text-5xl">Nosso catálogo</h2>
          <p className="max-w-sm text-espresso/75">
            Uma seleção com pronta-entrega. Toca em qualquer produto pra ver os detalhes ou pedir direto no
            WhatsApp.
          </p>
        </div>

        <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2.5">
            {filters.map((f) => {
              const isActive = active === f.slug;
              return (
                <button
                  key={f.slug}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    setActive(f.slug);
                    history.replaceState(null, "", f.slug === TUDO ? "#catalogo" : `#cat-${f.slug}`);
                  }}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-vinho bg-vinho text-champagne-soft shadow-[0_12px_24px_-14px_rgba(85,21,32,0.8)]"
                      : "border-espresso/15 bg-cream text-espresso hover:border-vinho hover:text-vinho"
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
          <label className="relative block w-full lg:w-72">
            <span className="sr-only">Buscar produto</span>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-taupe-deep"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou marca"
              className="w-full rounded-full border border-espresso/15 bg-cream py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-taupe-deep focus:border-vinho focus:outline-none focus-visible:outline-2 focus-visible:outline-vinho"
            />
          </label>
        </div>

        {shown.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} whatsapp={whatsapp} siteUrl={siteUrl} />
            ))}
          </div>
        ) : q ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-espresso/15 bg-champagne-soft/40 px-6 py-16 text-center">
            <Sparkle size={28} className="text-gold" />
            <h3 className="font-display text-2xl text-ink">Não achamos “{query.trim()}” por aqui</h3>
            <p className="max-w-md text-espresso/75">
              Pode ser que esteja chegando. Pergunta no WhatsApp que a gente te conta o que tem.
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setQuery("")} className="btn btn-ghost">
                Limpar busca
              </button>
              <a href={waGeneral(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <WhatsApp size={18} />
                Perguntar no WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-espresso/15 bg-champagne-soft/40 px-6 py-16 text-center">
            <Sparkle size={28} className="text-gold" />
            <h3 className="font-display text-2xl text-ink">Novidades chegando toda semana</h3>
            <p className="max-w-md text-espresso/75">
              {activeName && active !== TUDO
                ? `Os produtos de ${activeName.toLowerCase()} entram por aqui bem rápido.`
                : "Os produtos entram por aqui bem rápido."}{" "}
              Chama no WhatsApp que a gente te mostra o que acabou de chegar.
            </p>
            <a
              href={active !== TUDO ? waCategory(whatsapp, activeName) : waGeneral(whatsapp)}
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
