"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { SectionTitle } from "./SectionTitle";
import { WhatsApp, Sparkle } from "./icons";
import { waCategory, waGeneral } from "@/lib/site";
import type { CategoryNode, Product } from "@/lib/types";

interface CatalogProps {
  title: string;
  text: string;
  products: Product[];
  tree: CategoryNode[];
  whatsapp: string;
  siteUrl: string;
}

const TUDO = "tudo";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Catalog({ title, text, products, tree, whatsapp, siteUrl }: CatalogProps) {
  const [active, setActive] = useState<string>(TUDO);
  const [query, setQuery] = useState("");

  const filters = useMemo(() => [{ slug: TUDO, name: "Tudo", children: [] }, ...tree], [tree]);
  const all = useMemo(() => tree.flatMap((c) => [{ slug: c.slug, name: c.name }, ...c.children]), [tree]);

  useEffect(() => {
    const applyFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (hash.startsWith("cat-")) {
        const slug = hash.slice(4);
        if (all.some((f) => f.slug === slug)) setActive(slug);
      }
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, [all]);

  const pick = (slug: string) => {
    setActive(slug);
    history.replaceState(null, "", slug === TUDO ? "#catalogo" : `#cat-${slug}`);
  };

  const activeRoot = tree.find((c) => c.slug === active || c.children.some((s) => s.slug === active)) ?? null;
  const q = normalize(query.trim());
  const shown = products.filter(
    (p) =>
      (active === TUDO || p.categorySlug === active || p.parentCategorySlug === active) &&
      (!q || normalize(`${p.name} ${p.brand} ${p.categoryName ?? ""} ${p.parentCategoryName ?? ""} ${p.detail}`).includes(q)),
  );
  const activeName = all.find((f) => f.slug === active)?.name ?? "";

  return (
    <section id="catalogo" className="scroll-mt-24 bg-offwhite pb-14 pt-10 sm:pb-24 sm:pt-20">
      {all.map((c) => (
        <span key={c.slug} id={`cat-${c.slug}`} aria-hidden className="block h-0 scroll-mt-28" />
      ))}

      <div className="shell">
        <SectionTitle title={title} text={text} />

        <div className="mb-6 flex flex-col gap-3 sm:mb-9 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filtrar por categoria"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:px-0 sm:pb-0"
          >
            {filters.map((f) => {
              const isActive = f.slug === TUDO ? active === TUDO : activeRoot?.slug === f.slug;
              return (
                <button
                  key={f.slug}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => pick(f.slug)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.1em] transition-all duration-300 sm:px-5 sm:py-2 sm:text-[0.72rem] sm:tracking-[0.12em] ${
                    isActive
                      ? "border-vinho bg-vinho text-champagne-soft shadow-[0_12px_24px_-14px_rgba(74,10,30,0.8)]"
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
              className="w-full rounded-full border border-espresso/15 bg-cream py-2 pl-11 pr-4 text-sm sm:py-2.5 text-ink placeholder:text-taupe-deep focus:border-vinho focus:outline-none focus-visible:outline-2 focus-visible:outline-vinho"
            />
          </label>
        </div>

        {activeRoot && activeRoot.children.length > 0 && (
          <div
            role="tablist"
            aria-label={`Subcategorias de ${activeRoot.name}`}
            className="no-scrollbar -mx-5 -mt-2 mb-6 flex items-center gap-1 overflow-x-auto px-5 sm:mx-0 sm:-mt-4 sm:mb-9 sm:flex-wrap sm:gap-y-2 sm:overflow-visible sm:px-0"
          >
            {[{ slug: activeRoot.slug, name: `Tudo em ${activeRoot.name}` }, ...activeRoot.children].map((s) => {
              const on = active === s.slug;
              return (
                <button
                  key={s.slug}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => pick(s.slug)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[0.8rem] transition-colors duration-200 sm:px-3.5 sm:py-1.5 sm:text-sm ${
                    on ? "bg-champagne-soft font-medium text-vinho" : "text-espresso/80 hover:text-vinho"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        )}

        {shown.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
