"use client";

import { useRef, useState } from "react";
import { prepareImage, uploadImage } from "@/lib/client-image";
import type { ProductImage } from "@/lib/types";
import { ArrowLeft, ArrowRight, Close, Photo, Star } from "../icons";
import { useToast } from "./Toast";

interface Pending {
  key: number;
  preview: string;
  progress: number;
}

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  max?: number;
  error?: string;
  /** Uma foto só (categoria): substitui em vez de acumular. */
  single?: boolean;
  onBusyChange?: (busy: boolean) => void;
}

export function ImageManager({ images, onChange, max = 8, error, single = false, onBusyChange }: ImageManagerProps) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const seq = useRef(0);
  const latest = useRef(images);
  latest.current = images;

  const limit = single ? 1 : max;
  const room = limit - images.length - pending.length;

  async function addFiles(fileList: FileList | File[]) {
    let files = Array.from(fileList).filter((f) => f.size > 0);
    if (single) files = files.slice(0, 1);
    else if (files.length > room) {
      toast(`Cabem mais ${Math.max(0, room)} foto(s) nesse produto (máximo ${max}).`, "error");
      files = files.slice(0, Math.max(0, room));
    }
    if (files.length === 0) return;
    onBusyChange?.(true);

    await Promise.all(
      files.map(async (file) => {
        const key = ++seq.current;
        const preview = URL.createObjectURL(file);
        setPending((l) => [...l, { key, preview, progress: 0 }]);
        try {
          const prepared = await prepareImage(file);
          const uploaded = await uploadImage(prepared, (progress) =>
            setPending((l) => l.map((p) => (p.key === key ? { ...p, progress } : p))),
          );
          const nextList = single ? [uploaded] : [...latest.current, uploaded];
          latest.current = nextList;
          onChange(nextList);
        } catch (err) {
          toast(err instanceof Error ? err.message : "Falha ao enviar a foto.", "error");
        } finally {
          URL.revokeObjectURL(preview);
          setPending((l) => l.filter((p) => p.key !== key));
        }
      }),
    );
    onBusyChange?.(false);
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  }

  function makeCover(i: number) {
    if (i === 0) return;
    const next = [...images];
    const [img] = next.splice(i, 1);
    onChange([img!, ...next]);
  }

  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`grid gap-3 rounded-2xl ${single ? "grid-cols-1 sm:max-w-[14rem]" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"} ${
          dragOver ? "outline-2 outline-offset-4 outline-dashed outline-vinho" : ""
        }`}
      >
        {images.map((img, i) => (
          <figure
            key={`${img.url}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-espresso/10 bg-champagne-soft"
          >
            <img
              src={img.url}
              alt={single ? "Imagem da categoria" : `Foto ${i + 1}`}
              className={`absolute inset-0 h-full w-full ${img.cutout ? "object-contain p-3" : "object-cover"}`}
            />
            {!single && i === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-vinho px-2 py-0.5 text-[0.7rem] font-medium text-champagne-soft">
                Capa
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink/70 to-transparent p-1.5 pt-6">
              {!single ? (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Mover foto ${i + 1} para a esquerda`}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-ink disabled:opacity-40"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label={`Mover foto ${i + 1} para a direita`}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-ink disabled:opacity-40"
                  >
                    <ArrowRight size={16} />
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(i)}
                      aria-label={`Usar foto ${i + 1} como capa`}
                      title="Usar como capa"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-ink"
                    >
                      <Star size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remover foto ${i + 1}`}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-danger"
              >
                <Close size={16} />
              </button>
            </div>
          </figure>
        ))}

        {pending.map((p) => (
          <div key={p.key} className="relative aspect-square overflow-hidden rounded-xl border border-espresso/10 bg-panel">
            <img src={p.preview} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="absolute inset-x-3 bottom-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-vinho transition-[width] duration-200" style={{ width: `${Math.max(6, p.progress)}%` }} />
              </div>
              <p className="mt-1.5 text-center text-xs font-medium text-ink">
                {p.progress < 100 ? `Enviando ${p.progress}%` : "Finalizando..."}
              </p>
            </div>
          </div>
        ))}

        {(single ? images.length + pending.length === 0 : room > 0) && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 text-center transition-colors ${
              error ? "border-danger text-danger" : "border-espresso/20 text-espresso hover:border-vinho hover:text-vinho"
            }`}
          >
            <Photo size={28} />
            <span className="text-sm font-medium">{single ? "Escolher imagem" : "Adicionar fotos"}</span>
            <span className="hidden text-xs text-taupe-deep sm:block">ou arraste pra cá</span>
          </button>
        )}
        {single && images.length > 0 && pending.length === 0 && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="btn btn-ghost btn-sm justify-self-start"
          >
            Trocar imagem
          </button>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={!single}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="adm-error">{error}</p>}
    </div>
  );
}
