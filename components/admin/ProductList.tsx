"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  duplicateProductAction,
  moveProductAction,
  setProductFlagAction,
  trashProductAction,
} from "@/app/admin/actions";
import type { Product, ProductFlag } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { ArrowDown, ArrowUp, Box, Copy, Pencil, Plus, Search, Star, Trash } from "../icons";
import { ConfirmDialog } from "./ConfirmDialog";
import { Switch } from "./Switch";
import { useToast } from "./Toast";

type Status = "todos" | "loja" | "ocultos" | "esgotados";

const STATUS: { id: Status; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "loja", label: "Na loja" },
  { id: "ocultos", label: "Ocultos" },
  { id: "esgotados", label: "Esgotados" },
];

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

interface ProductListProps {
  products: Product[];
  categories: { id: number; name: string; parentId: number | null }[];
  trashCount: number;
}

export function ProductList({ products, categories, trashCount }: ProductListProps) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<Status>("todos");
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [toTrash, setToTrash] = useState<Product | null>(null);
  const [pending, start] = useTransition();

  // principal inclui os produtos das subcategorias dela
  const inCategory = (id: number | null, selected: string) =>
    String(id) === selected || String(categories.find((c) => c.id === id)?.parentId) === selected;
  const flag = (p: Product, f: ProductFlag): boolean => overrides[`${p.id}:${f}`] ?? p[f];

  const q = normalize(query.trim());
  const filtering = !!q || !!category || status !== "todos";
  const shown = useMemo(
    () =>
      products.filter((p) => {
        if (q && !normalize(`${p.name} ${p.brand} ${p.detail}`).includes(q)) return false;
        if (category === "none" ? p.categoryId != null : category && !inCategory(p.categoryId, category)) return false;
        if (status === "loja" && !flag(p, "visible")) return false;
        if (status === "ocultos" && flag(p, "visible")) return false;
        if (status === "esgotados" && flag(p, "inStock")) return false;
        return true;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, q, category, status, overrides],
  );

  const onStore = products.filter((p) => flag(p, "visible")).length;
  const soldOut = products.filter((p) => !flag(p, "inStock")).length;

  function toggle(p: Product, f: ProductFlag, value: boolean) {
    const key = `${p.id}:${f}`;
    setOverrides((o) => ({ ...o, [key]: value }));
    start(async () => {
      const res = await setProductFlagAction(p.id, f, value);
      if (!res.ok) {
        setOverrides((o) => ({ ...o, [key]: !value }));
        toast(res.error, "error");
        return;
      }
      router.refresh();
    });
  }

  function move(p: Product, dir: -1 | 1) {
    start(async () => {
      await moveProductAction(p.id, dir);
      router.refresh();
    });
  }

  function duplicate(p: Product) {
    start(async () => {
      const res = await duplicateProductAction(p.id);
      if (!res.ok) return toast(res.error, "error");
      toast(res.message ?? "Cópia criada.");
      if (res.id) router.push(`/admin/produtos/${res.id}`);
    });
  }

  function trash() {
    const p = toTrash;
    if (!p) return;
    start(async () => {
      const res = await trashProductAction(p.id);
      setToTrash(null);
      if (!res.ok) return toast(res.error, "error");
      toast(`“${p.name}” foi pra lixeira.`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[1.75rem]">Produtos</h1>
          <p className="mt-1 text-sm text-taupe-deep">
            {products.length} {products.length === 1 ? "produto" : "produtos"} · {onStore} na loja
            {soldOut > 0 ? ` · ${soldOut} esgotado${soldOut > 1 ? "s" : ""}` : ""}
          </p>
        </div>
        <a href="/admin/produtos/novo" className="btn btn-primary btn-sm">
          <Plus size={18} />
          Novo produto
        </a>
      </div>

      {products.length > 0 && (
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Buscar produto</span>
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe-deep" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou marca"
                className="adm-input !pl-10"
              />
            </label>
            <label className="sm:w-56">
              <span className="sr-only">Filtrar por categoria</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="adm-input">
                <option value="">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {products.some((p) => p.categoryId == null) && <option value="none">Sem categoria</option>}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="radiogroup" aria-label="Filtrar por situação" className="flex flex-wrap gap-2">
              {STATUS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={status === s.id}
                  onClick={() => setStatus(s.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    status === s.id
                      ? "border-vinho bg-vinho text-champagne-soft"
                      : "border-espresso/15 bg-cream text-espresso hover:border-vinho hover:text-vinho"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <a href="/admin/lixeira" className="inline-flex items-center gap-1.5 text-sm font-medium text-taupe-deep hover:text-vinho">
              <Trash size={16} />
              Lixeira{trashCount > 0 ? ` (${trashCount})` : ""}
            </a>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="adm-card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <Box size={36} className="text-gold" />
          <h2 className="text-lg">Seu catálogo está vazio</h2>
          <p className="max-w-sm text-sm text-espresso/75">
            Cadastre o primeiro produto com foto, nome e categoria. Ele aparece na loja assim que você salvar.
          </p>
          <a href="/admin/produtos/novo" className="btn btn-primary btn-sm mt-2">
            <Plus size={18} />
            Cadastrar produto
          </a>
        </div>
      ) : shown.length === 0 ? (
        <div className="adm-card flex flex-col items-center gap-3 px-6 py-12 text-center">
          <Search size={30} className="text-taupe-deep" />
          <p className="text-sm text-espresso/80">Nenhum produto com esses filtros.</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQuery("");
              setCategory("");
              setStatus("todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-busy={pending}>
          {shown.map((p) => {
            const idx = products.indexOf(p);
            const prev = products[idx - 1];
            const next = products[idx + 1];
            const canUp = !filtering && !!prev && prev.featured === p.featured;
            const canDown = !filtering && !!next && next.featured === p.featured;
            const cover = p.images[0];
            const visible = flag(p, "visible");
            return (
              <li key={p.id} className="adm-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                <a href={`/admin/produtos/${p.id}`} className="group flex min-w-0 flex-1 items-center gap-3.5">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-champagne-soft">
                    {cover ? (
                      <img
                        src={cover.url}
                        alt=""
                        className={`absolute inset-0 h-full w-full ${cover.cutout ? "object-contain p-1" : "object-cover"} ${
                          visible ? "" : "opacity-50"
                        }`}
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-[0.7rem] text-taupe-deep">sem foto</span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-medium text-ink group-hover:text-vinho">{p.name}</span>
                      {p.featured && <Star size={15} className="shrink-0 fill-gold-soft text-gold" aria-label="Destaque" />}
                      {p.isNew && (
                        <span className="shrink-0 rounded-full bg-vinho/10 px-2 py-0.5 text-[0.7rem] font-medium text-vinho">
                          Novo
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-taupe-deep">
                      {[p.brand, p.categoryName ?? "Sem categoria"].filter(Boolean).join(" · ")}
                    </span>
                    <span className="mt-0.5 block text-sm tabular-nums text-espresso">
                      {p.priceCents != null ? formatBRL(p.priceCents) : "Sem preço (sob consulta)"}
                    </span>
                  </span>
                </a>
                {!filtering && (
                  <div className="flex flex-col sm:hidden">
                    <button
                      type="button"
                      className="icon-btn !h-9"
                      onClick={() => move(p, -1)}
                      disabled={!canUp || pending}
                      aria-label={`Subir ${p.name}`}
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn !h-9"
                      onClick={() => move(p, 1)}
                      disabled={!canDown || pending}
                      aria-label={`Descer ${p.name}`}
                    >
                      <ArrowDown size={18} />
                    </button>
                  </div>
                )}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-espresso/8 pt-3 sm:border-0 sm:pt-0">
                  <div className="flex items-center gap-3.5">
                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-espresso">
                      <Switch compact checked={visible} onChange={(v) => toggle(p, "visible", v)} label={`${p.name}: aparecer na loja`} />
                      Na loja
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-espresso">
                      <Switch compact checked={flag(p, "inStock")} onChange={(v) => toggle(p, "inStock", v)} label={`${p.name}: em estoque`} />
                      Estoque
                    </label>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="icon-btn hidden sm:inline-flex"
                      onClick={() => move(p, -1)}
                      disabled={!canUp || pending}
                      aria-label={`Subir ${p.name}`}
                      title={filtering ? "Limpe os filtros pra reordenar" : "Subir na ordem da loja"}
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn hidden sm:inline-flex"
                      onClick={() => move(p, 1)}
                      disabled={!canDown || pending}
                      aria-label={`Descer ${p.name}`}
                      title={filtering ? "Limpe os filtros pra reordenar" : "Descer na ordem da loja"}
                    >
                      <ArrowDown size={18} />
                    </button>
                    <a href={`/admin/produtos/${p.id}`} className="icon-btn hidden sm:inline-flex" aria-label={`Editar ${p.name}`} title="Editar">
                      <Pencil size={18} />
                    </a>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => duplicate(p)}
                      disabled={pending}
                      aria-label={`Duplicar ${p.name}`}
                      title="Duplicar"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn hover:!text-danger"
                      onClick={() => setToTrash(p)}
                      disabled={pending}
                      aria-label={`Mandar ${p.name} pra lixeira`}
                      title="Mandar pra lixeira"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!filtering && products.length > 1 && (
        <p className="mt-4 text-center text-xs text-taupe-deep">
          A ordem aqui é a mesma da loja. Destaques ficam sempre no topo. Use as setas pra reorganizar.
        </p>
      )}

      <ConfirmDialog
        open={!!toTrash}
        title="Mover pra lixeira?"
        confirmLabel="Mover pra lixeira"
        busy={pending}
        onConfirm={trash}
        onCancel={() => setToTrash(null)}
      >
        “{toTrash?.name}” sai da loja na hora. Você pode restaurar pela Lixeira em até 30 dias.
      </ConfirmDialog>
    </div>
  );
}
