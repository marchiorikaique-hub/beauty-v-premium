"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { WhatsApp, Menu, Close, ChevronDown, ArrowRight } from "./icons";
import { CartButton } from "./cart/CartButton";
import { waGeneral } from "@/lib/site";
import type { CategoryNode } from "@/lib/types";

interface HeaderProps {
  categories: CategoryNode[];
  whatsapp: string;
}

const links = [
  { label: "Catálogo", href: "/#catalogo" },
  { label: "Como comprar", href: "/#como-comprar" },
  { label: "Sobre", href: "/#sobre" },
];

const catHref = (slug: string) => `/#cat-${slug}`;

export function Header({ categories, whatsapp }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const megaRef = useRef<HTMLLIElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    const onDown = (e: PointerEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [mega]);

  // abre no hover com uma folguinha, pra não piscar ao passar o mouse
  const hoverOpen = (v: boolean) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMega(v), v ? 90 : 160);
  };

  const solid = scrolled || mega;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solid
          ? "bg-offwhite/95 shadow-[0_1px_0_rgba(75,60,53,0.08),0_18px_40px_-34px_rgba(75,60,53,0.7)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="shell flex items-center justify-between gap-4 py-3.5">
        <a href="/" aria-label="Beauty V Premium, início" className="shrink-0">
          <Logo badge={44} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {categories.length > 0 && (
              <li ref={megaRef} onMouseEnter={() => hoverOpen(true)} onMouseLeave={() => hoverOpen(false)} className="static">
                <button
                  type="button"
                  onClick={() => setMega((v) => !v)}
                  aria-expanded={mega}
                  aria-controls="menu-categorias"
                  className={`group flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 hover:text-vinho ${
                    mega ? "text-vinho" : "text-espresso"
                  }`}
                >
                  Categorias
                  <ChevronDown size={16} className={`transition-transform duration-300 ${mega ? "rotate-180" : ""}`} />
                </button>

                <div
                  id="menu-categorias"
                  hidden={!mega}
                  className="absolute inset-x-0 top-full border-t border-espresso/8 bg-offwhite shadow-[0_40px_60px_-40px_rgba(75,60,53,0.55)]"
                >
                  <div className="shell grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-8 gap-y-8 py-9">
                    {categories.map((c) => (
                      <div key={c.slug}>
                        <a
                          href={catHref(c.slug)}
                          onClick={() => setMega(false)}
                          className="font-display text-xl text-ink transition-colors hover:text-vinho"
                        >
                          {c.name}
                        </a>
                        {c.children.length > 0 && (
                          <ul className="mt-3 flex flex-col gap-2">
                            {c.children.map((s) => (
                              <li key={s.slug}>
                                <a
                                  href={catHref(s.slug)}
                                  onClick={() => setMega(false)}
                                  className="text-sm text-espresso/80 transition-colors hover:text-vinho"
                                >
                                  {s.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-espresso/8">
                    <div className="shell flex items-center justify-between py-3.5 text-sm">
                      <span className="text-taupe-deep">Pronta-entrega e novidades toda semana</span>
                      <a
                        href="/#catalogo"
                        onClick={() => setMega(false)}
                        className="inline-flex items-center gap-1.5 font-medium text-vinho hover:underline"
                      >
                        Ver o catálogo inteiro
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            )}
            {links.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative text-sm font-medium text-espresso transition-colors duration-300 hover:text-vinho"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-vinho transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={waGeneral(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost hidden px-5 py-2.5 text-sm xl:inline-flex"
          >
            <WhatsApp size={17} />
            WhatsApp
          </a>
          <CartButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-espresso/15 text-espresso transition-colors hover:border-vinho hover:text-vinho lg:hidden"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-y-auto overscroll-contain border-t border-espresso/10 bg-offwhite/98 backdrop-blur-md transition-[max-height,opacity] duration-500 ease-out lg:hidden ${
          open ? "max-h-[calc(100dvh-4.5rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Categorias" className="shell flex flex-col py-4">
          {categories.map((c) => {
            const isOpen = expanded === c.slug;
            return (
              <div key={c.slug} className="border-b border-espresso/8">
                <div className="flex items-center justify-between">
                  <a
                    href={catHref(c.slug)}
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 font-display text-xl text-ink transition-colors hover:text-vinho"
                  >
                    {c.name}
                  </a>
                  {c.children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : c.slug)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Fechar" : "Ver"} subcategorias de ${c.name}`}
                      className="grid h-11 w-11 place-items-center rounded-full text-espresso hover:text-vinho"
                    >
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {isOpen && (
                  <ul className="flex flex-col gap-1 pb-3 pl-4">
                    {c.children.map((s) => (
                      <li key={s.slug}>
                        <a
                          href={catHref(s.slug)}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-[0.98rem] text-espresso/85 hover:text-vinho"
                        >
                          {s.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-espresso hover:text-vinho"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={waGeneral(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4 w-full"
          >
            <WhatsApp size={18} />
            Chamar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
