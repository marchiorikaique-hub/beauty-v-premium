"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { destroyProductAction, restoreProductAction } from "@/app/admin/actions";
import type { Product } from "@/lib/types";
import { ArrowLeft, Restore, Trash } from "../icons";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

const DAY = 86_400_000;

function daysLeft(deletedAt: string): number {
  return Math.max(0, 30 - Math.floor((Date.now() - new Date(deletedAt).getTime()) / DAY));
}

function dateBR(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function TrashList({ products }: { products: Product[] }) {
  const router = useRouter();
  const toast = useToast();
  const [toDestroy, setToDestroy] = useState<Product | null>(null);
  const [pending, start] = useTransition();

  function restore(p: Product) {
    start(async () => {
      const res = await restoreProductAction(p.id);
      if (!res.ok) return toast(res.error, "error");
      toast(
        p.categoryId == null
          ? `“${p.name}” voltou, mas está sem categoria. Abra e escolha uma.`
          : `“${p.name}” voltou pro catálogo.`,
      );
      router.refresh();
    });
  }

  function destroy() {
    const p = toDestroy;
    if (!p) return;
    start(async () => {
      const res = await destroyProductAction(p.id);
      setToDestroy(null);
      if (!res.ok) return toast(res.error, "error");
      toast(`“${p.name}” foi excluído de vez.`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <a href="/admin" className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-taupe-deep hover:text-vinho">
        <ArrowLeft size={16} />
        Produtos
      </a>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-[1.75rem]">Lixeira</h1>
        <p className="mt-1 text-sm text-taupe-deep">
          Produtos excluídos ficam aqui por 30 dias e depois são apagados sozinhos.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="adm-card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <Trash size={34} className="text-taupe" />
          <h2 className="text-lg">A lixeira está vazia</h2>
          <p className="max-w-sm text-sm text-espresso/75">Quando você excluir um produto, ele fica aqui um tempo caso mude de ideia.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-busy={pending}>
          {products.map((p) => {
            const cover = p.images[0];
            const left = p.deletedAt ? daysLeft(p.deletedAt) : 30;
            return (
              <li key={p.id} className="adm-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-champagne-soft">
                    {cover && (
                      <img
                        src={cover.url}
                        alt=""
                        className={`absolute inset-0 h-full w-full opacity-60 grayscale ${cover.cutout ? "object-contain p-1" : "object-cover"}`}
                      />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink">{p.name}</span>
                    <span className="mt-0.5 block text-sm text-taupe-deep">
                      Excluído em {p.deletedAt ? dateBR(p.deletedAt) : "-"} ·{" "}
                      {left === 0 ? "apaga hoje" : `apaga em ${left} ${left === 1 ? "dia" : "dias"}`}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 border-t border-espresso/8 pt-3 sm:border-0 sm:pt-0">
                  <button type="button" className="btn btn-primary btn-sm flex-1 sm:flex-none" onClick={() => restore(p)} disabled={pending}>
                    <Restore size={17} />
                    Restaurar
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm flex-1 text-danger hover:border-danger hover:text-danger sm:flex-none"
                    onClick={() => setToDestroy(p)}
                    disabled={pending}
                  >
                    Excluir de vez
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDestroy}
        title="Excluir de vez?"
        confirmLabel="Excluir de vez"
        busy={pending}
        onConfirm={destroy}
        onCancel={() => setToDestroy(null)}
      >
        “{toDestroy?.name}” e as fotos dele serão apagados pra sempre. Não dá pra desfazer.
      </ConfirmDialog>
    </div>
  );
}
