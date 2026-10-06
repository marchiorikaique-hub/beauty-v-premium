"use client";

import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { Box, ExternalLink, Logout, Photo, Store, Tag, Trash, User } from "../icons";

const items = [
  { href: "/admin", label: "Produtos", icon: Box, match: (p: string) => p === "/admin" || p.startsWith("/admin/produtos") },
  { href: "/admin/categorias", label: "Categorias", icon: Tag, match: (p: string) => p.startsWith("/admin/categorias") },
  { href: "/admin/inicio", label: "Página inicial", short: "Início", icon: Photo, match: (p: string) => p.startsWith("/admin/inicio") },
  { href: "/admin/loja", label: "Loja", icon: Store, match: (p: string) => p.startsWith("/admin/loja") },
  { href: "/admin/lixeira", label: "Lixeira", icon: Trash, match: (p: string) => p.startsWith("/admin/lixeira"), desktopOnly: true },
  { href: "/admin/conta", label: "Minha conta", short: "Conta", icon: User, match: (p: string) => p.startsWith("/admin/conta") },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname() ?? "/admin";

  return (
    <>
      {/* computador: barra lateral */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-espresso/10 bg-panel lg:flex">
        <a href="/admin" className="flex items-center gap-3 px-6 pb-6 pt-7">
          <img src="/brand/badge.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
          <span className="leading-tight">
            <span className="block font-display text-lg text-ink">Beauty V</span>
            <span className="block text-xs font-medium uppercase tracking-[0.2em] text-taupe-deep">Painel</span>
          </span>
        </a>
        <nav aria-label="Painel" className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {items.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition-colors duration-150 ${
                      active ? "bg-cream text-vinho shadow-[0_1px_2px_rgba(44,35,32,0.08)]" : "text-espresso hover:bg-cream/60"
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-espresso/10 px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium text-espresso hover:bg-cream/60"
          >
            <ExternalLink size={20} />
            Ver a loja
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium text-espresso hover:bg-cream/60"
            >
              <Logout size={20} />
              Sair
            </button>
          </form>
          <p className="truncate px-3 pt-2 text-xs text-taupe-deep" title={email}>
            {email}
          </p>
        </div>
      </aside>

      {/* celular: barra de cima */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-espresso/10 bg-offwhite/95 px-4 py-2.5 backdrop-blur lg:hidden">
        <a href="/admin" className="flex items-center gap-2.5">
          <img src="/brand/badge.webp" alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-full" />
          <span className="text-[0.95rem] font-semibold text-ink">Painel Beauty V</span>
        </a>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-vinho hover:bg-panel"
        >
          Ver loja
          <ExternalLink size={16} />
        </a>
      </header>

      {/* celular: abas de baixo */}
      <nav
        aria-label="Painel"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-espresso/10 bg-offwhite/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {items
            .filter((i) => !i.desktopOnly)
            .map(({ href, label, short, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex flex-col items-center gap-1 py-2.5 text-[0.72rem] font-medium ${
                      active ? "text-vinho" : "text-espresso/70"
                    }`}
                  >
                    <Icon size={22} />
                    {short ?? label}
                  </a>
                </li>
              );
            })}
        </ul>
      </nav>
    </>
  );
}
