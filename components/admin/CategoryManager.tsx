"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction, moveCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import type { Category } from "@/lib/types";
import { ArrowDown, ArrowUp, Pencil, Plus, Sparkle, Tag, Trash } from "../icons";
import { ConfirmDialog } from "./ConfirmDialog";
import { ImageManager } from "./ImageManager";
import { Switch } from "./Switch";
import { useToast } from "./Toast";

interface Draft {
  name: string;
  blurb: string;
  image: string;
  visible: boolean;
  parentId: number | null;
}

function CategoryEditor({
  category,
  roots,
  hasChildren = false,
  defaultParent = null,
  onDone,
}: {
  category: Category | null;
  /** categorias principais (onde uma sub pode ficar) */
  roots: Category[];
  hasChildren?: boolean;
  defaultParent?: number | null;
  onDone: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [draft, setDraft] = useState<Draft>({
    name: category?.name ?? "",
    blurb: category?.blurb ?? "",
    image: category?.image ?? "",
    visible: category?.visible ?? true,
    parentId: category ? category.parentId : defaultParent,
  });
  const isSub = draft.parentId != null;
  const key = category?.id ?? `new-${defaultParent ?? "root"}`;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const res = await saveCategoryAction(category?.id ?? null, draft);
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast(res.error, "error");
        return;
      }
      toast(res.message ?? "Salvo.");
      router.refresh();
      onDone();
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!pending && !uploading) save();
      }}
      className="flex flex-col gap-4 rounded-2xl border border-vinho/25 bg-white p-4 sm:p-5"
      noValidate
    >
      <div className={`grid gap-4 ${isSub ? "" : "sm:grid-cols-[1fr_13rem]"}`}>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor={`c-name-${key}`} className="adm-label">
              Nome <span className="text-danger">*</span>
            </label>
            <input
              id={`c-name-${key}`}
              className="adm-input"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder={isSub ? "Ex.: Boca" : "Ex.: Cabelos"}
              aria-invalid={!!errors.name || undefined}
              maxLength={60}
              autoFocus
            />
            {errors.name && <p className="adm-error">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor={`c-parent-${key}`} className="adm-label">
              Onde fica
            </label>
            <select
              id={`c-parent-${key}`}
              className="adm-input"
              value={draft.parentId ?? ""}
              onChange={(e) => setDraft({ ...draft, parentId: e.target.value ? Number(e.target.value) : null })}
              disabled={hasChildren}
              aria-invalid={!!errors.parentId || undefined}
            >
              <option value="">Categoria principal (aparece no menu)</option>
              {roots
                .filter((r) => r.id !== category?.id)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    Subcategoria de {r.name}
                  </option>
                ))}
            </select>
            {errors.parentId ? (
              <p className="adm-error">{errors.parentId}</p>
            ) : (
              <p className="adm-help">
                {hasChildren
                  ? "Tem subcategorias dentro, então continua como principal."
                  : isSub
                    ? "Aparece embaixo da principal no menu e nos filtros da loja."
                    : "Vira um quadro na home, um filtro do catálogo e uma coluna do menu."}
              </p>
            )}
          </div>
          {!isSub && (
            <div>
              <label htmlFor={`c-blurb-${key}`} className="adm-label">
                Frase da categoria
              </label>
              <input
                id={`c-blurb-${key}`}
                className="adm-input"
                value={draft.blurb}
                onChange={(e) => setDraft({ ...draft, blurb: e.target.value })}
                placeholder="Ex.: Tratamento e finalização pros fios."
                aria-invalid={!!errors.blurb || undefined}
                maxLength={140}
              />
              {errors.blurb ? <p className="adm-error">{errors.blurb}</p> : <p className="adm-help">Aparece no quadro da categoria, na home.</p>}
            </div>
          )}
          <Switch
            checked={draft.visible}
            onChange={(v) => setDraft({ ...draft, visible: v })}
            label="Aparecer na loja"
            description={
              isSub
                ? "Oculta, a subcategoria e os produtos dela somem da loja."
                : "Oculta, a categoria, as subcategorias e os produtos delas somem da loja."
            }
          />
        </div>
        {!isSub && (
          <div>
            <span className="adm-label">Foto da categoria</span>
            <ImageManager
              single
              images={draft.image ? [{ url: draft.image, cutout: false, width: null, height: null }] : []}
              onChange={(imgs) => setDraft({ ...draft, image: imgs[0]?.url ?? "" })}
              onBusyChange={setUploading}
              error={errors.image}
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2.5">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onDone} disabled={pending}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending || uploading}>
          {pending ? "Salvando..." : category ? "Salvar" : isSub ? "Criar subcategoria" : "Criar categoria"}
        </button>
      </div>
    </form>
  );
}

type Editing = number | "new" | { newChildOf: number } | null;

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [pending, start] = useTransition();

  const roots = categories.filter((c) => c.parentId == null);
  const childrenOf = (id: number) => categories.filter((c) => c.parentId === id);
  const blocker = (c: Category) => {
    const subs = childrenOf(c.id).length;
    if (subs > 0) return `“${c.name}” tem ${subs} subcategoria(s). Exclua ou mova as subcategorias antes.`;
    if (c.productCount > 0)
      return `“${c.name}” tem ${c.productCount} produto(s). Troque a categoria deles (ou mande pra lixeira) antes de excluir.`;
    return null;
  };

  function toggleVisible(c: Category, visible: boolean) {
    start(async () => {
      const res = await saveCategoryAction(c.id, {
        name: c.name,
        blurb: c.blurb,
        image: c.image,
        visible,
        parentId: c.parentId,
      });
      if (!res.ok) return toast(res.error, "error");
      router.refresh();
    });
  }

  function move(c: Category, dir: -1 | 1) {
    start(async () => {
      await moveCategoryAction(c.id, dir);
      router.refresh();
    });
  }

  function remove() {
    const c = toDelete;
    if (!c) return;
    start(async () => {
      const res = await deleteCategoryAction(c.id);
      setToDelete(null);
      if (!res.ok) return toast(res.error, "error");
      toast(`Categoria “${c.name}” excluída.`);
      router.refresh();
    });
  }

  function renderRow(c: Category, siblings: number, index: number, sub = false) {
    const total = sub ? c.productCount : c.productCount + childrenOf(c.id).reduce((n, k) => n + k.productCount, 0);
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          {!sub && (
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              {c.image ? (
                <img src={c.image} alt="" className={`h-full w-full object-cover ${c.visible ? "" : "opacity-50"}`} />
              ) : (
                <span
                  className="grid h-full w-full place-items-center"
                  style={{ background: "radial-gradient(90% 80% at 50% 30%, var(--color-rosa) 0%, var(--color-vinho) 80%)" }}
                >
                  <Sparkle size={20} className="text-champagne/60" />
                </span>
              )}
            </span>
          )}
          <span className="min-w-0">
            <span className={`block truncate text-ink ${sub ? "" : "font-medium"}`}>{c.name}</span>
            {!sub && c.blurb && <span className="mt-0.5 block truncate text-sm text-taupe-deep">{c.blurb}</span>}
            <span className="mt-0.5 block text-sm text-espresso">
              {total} {total === 1 ? "produto" : "produtos"}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-espresso/8 pt-3 sm:border-0 sm:pt-0">
          <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-espresso">
            <Switch compact checked={c.visible} onChange={(v) => toggleVisible(c, v)} label={`${c.name}: aparecer na loja`} />
            Na loja
          </label>
          <div className="flex items-center">
            <button
              type="button"
              className="icon-btn"
              onClick={() => move(c, -1)}
              disabled={index === 0 || pending}
              aria-label={`Subir ${c.name}`}
              title="Subir"
            >
              <ArrowUp size={18} />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => move(c, 1)}
              disabled={index === siblings - 1 || pending}
              aria-label={`Descer ${c.name}`}
              title="Descer"
            >
              <ArrowDown size={18} />
            </button>
            <button type="button" className="icon-btn" onClick={() => setEditing(c.id)} aria-label={`Editar ${c.name}`} title="Editar">
              <Pencil size={18} />
            </button>
            <button
              type="button"
              className="icon-btn hover:!text-danger"
              onClick={() => setToDelete(c)}
              disabled={pending}
              aria-label={`Excluir ${c.name}`}
              title="Excluir"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const blocked = toDelete ? blocker(toDelete) : null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[1.75rem]">Categorias</h1>
          <p className="mt-1 text-sm text-taupe-deep">
            As principais viram o menu, os quadros da home e os filtros. As subcategorias ficam dentro delas.
          </p>
        </div>
        {editing !== "new" && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing("new")}>
            <Plus size={18} />
            Nova categoria
          </button>
        )}
      </div>

      {editing === "new" && (
        <div className="mb-4">
          <CategoryEditor category={null} roots={roots} onDone={() => setEditing(null)} />
        </div>
      )}

      {categories.length === 0 && editing !== "new" ? (
        <div className="adm-card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <Tag size={34} className="text-gold" />
          <h2 className="text-lg">Nenhuma categoria ainda</h2>
          <p className="max-w-sm text-sm text-espresso/75">Crie categorias como Maquiagem ou Skincare pra organizar os produtos.</p>
          <button type="button" className="btn btn-primary btn-sm mt-2" onClick={() => setEditing("new")}>
            <Plus size={18} />
            Criar categoria
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-busy={pending}>
          {roots.map((c, i) => {
            const subs = childrenOf(c.id);
            const addingHere = typeof editing === "object" && editing?.newChildOf === c.id;
            return (
              <li key={c.id} className="adm-card p-3 sm:p-3.5">
                {editing === c.id ? (
                  <CategoryEditor category={c} roots={roots} hasChildren={subs.length > 0} onDone={() => setEditing(null)} />
                ) : (
                  renderRow(c, roots.length, i)
                )}

                <div className="mt-3 border-l-2 border-champagne pl-3 sm:ml-[2.1rem] sm:pl-4">
                  {subs.length > 0 && (
                    <ul className="flex flex-col divide-y divide-espresso/8" aria-label={`Subcategorias de ${c.name}`}>
                      {subs.map((s, j) => (
                        <li key={s.id} className="py-2.5">
                          {editing === s.id ? (
                            <CategoryEditor category={s} roots={roots} onDone={() => setEditing(null)} />
                          ) : (
                            renderRow(s, subs.length, j, true)
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {addingHere ? (
                    <div className="py-2.5">
                      <CategoryEditor category={null} roots={roots} defaultParent={c.id} onDone={() => setEditing(null)} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing({ newChildOf: c.id })}
                      className="mt-1 inline-flex items-center gap-1.5 rounded-lg py-1.5 text-sm font-medium text-vinho hover:underline"
                    >
                      <Plus size={16} />
                      Subcategoria em {c.name}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title={blocked ? "Ainda tem coisa aqui dentro" : `Excluir “${toDelete?.name}”?`}
        confirmLabel={blocked ? "Entendi" : "Excluir categoria"}
        tone={blocked ? "primary" : "danger"}
        busy={pending}
        onConfirm={() => (blocked ? setToDelete(null) : remove())}
        onCancel={() => setToDelete(null)}
      >
        {blocked ?? "Essa ação não pode ser desfeita. Os produtos não são apagados."}
      </ConfirmDialog>
    </div>
  );
}
