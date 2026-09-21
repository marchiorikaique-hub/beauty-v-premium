"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { WhatsApp, Menu, Close } from "./icons";
import { waGeneral } from "@/lib/site";

const nav = [
  { label: "Maquiagem", href: "#cat-maquiagem" },
  { label: "Skincare", href: "#cat-skincare" },
  { label: "Perfumaria", href: "#cat-perfumaria" },
  { label: "Acessórios", href: "#cat-acessorios" },
  { label: "Sobre", href: "#sobre" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-offwhite/85 shadow-[0_1px_0_rgba(75,60,53,0.08),0_18px_40px_-34px_rgba(75,60,53,0.7)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="shell flex items-center justify-between py-3.5">
        <a href="#top" aria-label="Beauty V Premium, início" className="shrink-0">
          <Logo badge={44} />
        </a>

        <nav aria-label="Categorias" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
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
            href={waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex"
          >
            <WhatsApp size={17} />
            Chamar no WhatsApp
          </a>
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

      {/* menu mobile */}
      <div
        className={`overflow-hidden border-t border-espresso/10 bg-offwhite/95 backdrop-blur-md transition-[max-height,opacity] duration-500 ease-out lg:hidden ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Categorias" className="shell flex flex-col gap-1 py-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-espresso/8 py-3 font-display text-xl text-ink transition-colors hover:text-vinho"
            >
              {item.label}
            </a>
          ))}
          <a
            href={waGeneral}
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
