"use client";

import { useEffect, useRef } from "react";
import type { ProductImage, ProductVariant } from "@/lib/types";
import { ArrowDown, ArrowUp, Close, Plus } from "../icons";
import { Switch } from "./Switch";

const LABELS = ["Cor", "Tom", "Fragrância", "Tamanho"];
const DEFAULT_COLOR = "#d8a7b1";

interface VariantEditorProps {
  label: string;
  variants: ProductVariant[];
  images: ProductImage[];
  errors: Record<string, string>;
  onLabelChange: (label: string) => void;
  onChange: (variants: ProductVariant[]) => void;
}

/** Opções do produto (cores, tons, fragrâncias). Na loja viram bolinhas ou etiquetas pra escolher. */
export function VariantEditor({ label, variants, images, errors, onLabelChange, onChange }: VariantEditorProps) {
  // opção nova: o cursor já vai pro nome dela
  const prevLen = useRef(variants.length);
  useEffect(() => {
    if (variants.length > prevLen.current) document.getElementById(`v-name-${variants.length - 1}`)?.focus();
    prevLen.current = variants.length;
  }, [variants.length]);

  function update(i: number, patch: Partial<ProductVariant>) {
    onChange(variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...variants];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  }

  function add() {
    const usesColor = variants.length === 0 ? /^(cor|tom)$/i.test(label || "Cor") : variants.some((v) => v.color);
    onChange([...variants, { name: "", color: usesColor ? DEFAULT_COLOR : "", image: "", inStock: true }]);
    if (!label) onLabelChange("Cor");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="v-label" className="adm-label">
          O que muda entre as opções
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="v-label"
            className="adm-input !w-40"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Cor"
            maxLength={24}
            aria-invalid={!!errors.variantLabel || undefined}
          />
          {LABELS.filter((l) => l !== label).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLabelChange(l)}
              className="rounded-full border border-espresso/15 px-3 py-1.5 text-sm text-espresso hover:border-vinho hover:text-vinho"
            >
              {l}
            </button>
          ))}
        </div>
        {errors.variantLabel && <p className="adm-error">{errors.variantLabel}</p>}
      </div>

      {variants.length > 0 && (
        <ol className="flex flex-col divide-y divide-espresso/8 rounded-xl border border-espresso/10">
          {variants.map((v, i) => {
            const nameError = errors[`variants.${i}.name`];
            const imageError = errors[`variants.${i}.image`];
            return (
              <li key={i} className="flex flex-col gap-3 p-3 sm:p-3.5">
                <div className="flex items-center gap-2.5">
                  {v.color ? (
                    <span className="relative shrink-0">
                      <input
                        type="color"
                        value={v.color}
                        onChange={(e) => update(i, { color: e.target.value })}
                        aria-label={`Cor da opção ${i + 1}`}
                        className="swatch-input h-10 w-10 cursor-pointer rounded-full"
                      />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => update(i, { color: DEFAULT_COLOR })}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-espresso/25 text-espresso/60 hover:border-vinho hover:text-vinho"
                      aria-label={`Escolher cor da opção ${i + 1}`}
                      title="Mostrar uma bolinha de cor"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                  <input
                    id={`v-name-${i}`}
                    className="adm-input min-w-0 flex-1"
                    value={v.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    placeholder={label && /fragr/i.test(label) ? "Ex.: Baunilha" : "Ex.: Pêssego"}
                    aria-label={`Nome da opção ${i + 1}`}
                    aria-invalid={!!nameError || undefined}
                    maxLength={48}
                  />
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      className="icon-btn hidden sm:inline-flex"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={`Subir opção ${i + 1}`}
                    >
                      <ArrowUp size={17} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn hidden sm:inline-flex"
                      onClick={() => move(i, 1)}
                      disabled={i === variants.length - 1}
                      aria-label={`Descer opção ${i + 1}`}
                    >
                      <ArrowDown size={17} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn hover:!text-danger"
                      onClick={() => onChange(variants.filter((_, idx) => idx !== i))}
                      aria-label={`Remover opção ${i + 1}`}
                    >
                      <Close size={17} />
                    </button>
                  </div>
                </div>
                {nameError && <p className="adm-error !mt-0">{nameError}</p>}

                <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pl-[3.125rem]">
                  {images.length > 1 ? (
                    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Foto da opção ${i + 1}`}>
                      <span className="mr-1 text-sm text-taupe-deep">Foto</span>
                      {images.map((img, k) => {
                        const on = v.image === img.url;
                        return (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => update(i, { image: on ? "" : img.url })}
                            aria-pressed={on}
                            aria-label={`Usar foto ${k + 1}`}
                            className={`h-9 w-9 overflow-hidden rounded-lg border-2 bg-champagne-soft ${
                              on ? "border-vinho" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={img.url} alt="" className="h-full w-full object-contain" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-4">
                    {v.color && (
                      <button
                        type="button"
                        onClick={() => update(i, { color: "" })}
                        className="text-sm text-taupe-deep hover:text-vinho"
                      >
                        Sem bolinha
                      </button>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-espresso">
                      <Switch
                        compact
                        checked={v.inStock}
                        onChange={(on) => update(i, { inStock: on })}
                        label={`${v.name || `Opção ${i + 1}`}: tem em estoque`}
                      />
                      Tem
                    </label>
                  </div>
                </div>
                {imageError && <p className="adm-error !mt-0 pl-[3.125rem]">{imageError}</p>}
              </li>
            );
          })}
        </ol>
      )}

      <button type="button" className="btn btn-ghost btn-sm self-start" onClick={add} disabled={variants.length >= 40}>
        <Plus size={17} />
        {variants.length ? "Adicionar opção" : `Adicionar ${(label || "cor").toLowerCase()}`}
      </button>
    </div>
  );
}
