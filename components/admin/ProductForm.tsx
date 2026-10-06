"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  duplicateProductAction,
  saveProductAction,
  trashProductAction,
  type ActionResult,
} from "@/app/admin/actions";
import type { Product, ProductImage, ProductVariant } from "@/lib/types";
import { discountPercent } from "@/lib/format";
import { ArrowLeft, Copy, ExternalLink, Trash } from "../icons";
import { ConfirmDialog } from "./ConfirmDialog";
import { ImageManager } from "./ImageManager";
import { PriceInput } from "./PriceInput";
import { Switch } from "./Switch";
import { useToast } from "./Toast";
import { VariantEditor } from "./VariantEditor";

interface FormState {
  name: string;
  brand: string;
  categoryId: number | null;
  blurb: string;
  description: string;
  detail: string;
  priceCents: number | null;
  compareAtCents: number | null;
  visible: boolean;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  images: ProductImage[];
  variantLabel: string;
  variants: ProductVariant[];
}

interface ProductFormProps {
  product: Product | null;
  categories: { id: number; name: string; parentId: number | null }[];
}

function initialState(p: Product | null, categories: { id: number }[]): FormState {
  if (!p) {
    return {
      name: "",
      brand: "",
      categoryId: categories.length === 1 ? categories[0]!.id : null,
      blurb: "",
      description: "",
      detail: "",
      priceCents: null,
      compareAtCents: null,
      visible: true,
      inStock: true,
      featured: false,
      isNew: true,
      images: [],
      variantLabel: "Cor",
      variants: [],
    };
  }
  return {
    name: p.name,
    brand: p.brand,
    categoryId: p.categoryId,
    blurb: p.blurb,
    description: p.description,
    detail: p.detail,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    visible: p.visible,
    inStock: p.inStock,
    featured: p.featured,
    isNew: p.isNew,
    images: p.images,
    variantLabel: p.variantLabel || "Cor",
    variants: p.variants,
  };
}

function Counter({ value, max }: { value: string; max: number }) {
  const n = value.length;
  return (
    <span className={`text-xs tabular-nums ${n > max ? "text-danger" : "text-taupe-deep"}`} aria-hidden>
      {n}/{max}
    </span>
  );
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const toast = useToast();
  const isNew = product == null;
  const [initial, setInitial] = useState(() => initialState(product, categories));
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const [confirmTrash, setConfirmTrash] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const summary = useRef<HTMLDivElement>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  const busy = pending || uploading;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: "" }));
  }

  function handleResult(res: ActionResult, onOk: () => void) {
    if (res.ok) {
      onOk();
      return;
    }
    setErrors(res.fields ?? {});
    toast(res.error, "error");
    requestAnimationFrame(() => {
      summary.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus({ preventScroll: true });
    });
  }

  function save() {
    start(async () => {
      const res = await saveProductAction(product?.id ?? null, form);
      handleResult(res, () => {
        setErrors({});
        setInitial(form);
        toast(res.ok && res.message ? res.message : "Salvo.");
        if (isNew) router.push("/admin");
        else router.refresh();
      });
    });
  }

  function duplicate() {
    if (!product) return;
    start(async () => {
      const res = await duplicateProductAction(product.id);
      handleResult(res, () => {
        toast(res.ok && res.message ? res.message : "Cópia criada.");
        if (res.ok && res.id) router.push(`/admin/produtos/${res.id}`);
      });
    });
  }

  function trash() {
    if (!product) return;
    start(async () => {
      const res = await trashProductAction(product.id);
      setConfirmTrash(false);
      handleResult(res, () => {
        setInitial(form);
        toast("Produto movido pra lixeira. Dá pra restaurar em até 30 dias.");
        router.push("/admin");
      });
    });
  }

  const off = discountPercent(form.priceCents, form.compareAtCents);
  const errorList = Object.entries(errors).filter(([k, v]) => v && !k.includes("."));
  // fotos removidas deixam de valer como foto de uma opção
  useEffect(() => {
    const urls = new Set(form.images.map((i) => i.url));
    if (form.variants.some((v) => v.image && !urls.has(v.image))) {
      setForm((f) => ({ ...f, variants: f.variants.map((v) => (v.image && !urls.has(v.image) ? { ...v, image: "" } : v)) }));
    }
  }, [form.images, form.variants]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => (dirty ? setConfirmLeave(true) : router.push("/admin"))}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-taupe-deep hover:text-vinho"
          >
            <ArrowLeft size={16} />
            Produtos
          </button>
          <h1 className="truncate text-2xl sm:text-[1.75rem]">{product ? product.name : "Novo produto"}</h1>
        </div>
        {product && (
          <div className="flex flex-wrap gap-2">
            {product.visible && (
              <a
                href={`/produto/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                <ExternalLink size={16} />
                Ver na loja
              </a>
            )}
            <button type="button" onClick={duplicate} disabled={busy} className="btn btn-ghost btn-sm">
              <Copy size={16} />
              Duplicar
            </button>
            <button
              type="button"
              onClick={() => setConfirmTrash(true)}
              disabled={busy}
              className="btn btn-ghost btn-sm text-danger hover:border-danger hover:text-danger"
            >
              <Trash size={16} />
              Excluir
            </button>
          </div>
        )}
      </div>

      <div ref={summary} className="scroll-mt-20">
        {errorList.length > 0 && (
          <div role="alert" className="mb-5 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
            <p className="font-medium">Faltou ajustar {errorList.length === 1 ? "um ponto" : `${errorList.length} pontos`}:</p>
            <ul className="mt-1 list-disc pl-5">
              {errorList.map(([k, v]) => (
                <li key={k}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy) save();
        }}
        className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]"
        noValidate
      >
        <div className="flex min-w-0 flex-col gap-5">
          <section className="adm-card p-5 sm:p-6" aria-labelledby="sec-fotos">
            <div className="mb-4">
              <h2 id="sec-fotos" className="text-lg">
                Fotos
              </h2>
              <p className="adm-help !mt-1">
                A primeira é a capa. Pra ficar igual às fotos da loja, envie PNG <strong>sem fundo</strong> (dá pra
                tirar o fundo grátis no remove.bg). Foto normal também funciona.
              </p>
            </div>
            <ImageManager
              images={form.images}
              onChange={(imgs) => set("images", imgs)}
              error={errors.images}
              onBusyChange={setUploading}
            />
          </section>

          <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="sec-info">
            <h2 id="sec-info" className="text-lg">
              Informações
            </h2>
            <div>
              <div className="flex items-end justify-between">
                <label htmlFor="f-name" className="adm-label">
                  Nome do produto <span className="text-danger">*</span>
                </label>
                <Counter value={form.name} max={80} />
              </div>
              <input
                id="f-name"
                className="adm-input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ex.: Gloss Snow"
                aria-invalid={!!errors.name || undefined}
                aria-describedby={errors.name ? "e-name" : undefined}
                maxLength={120}
                required
              />
              {errors.name && (
                <p id="e-name" className="adm-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="f-brand" className="adm-label">
                  Marca
                </label>
                <input
                  id="f-brand"
                  className="adm-input"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  placeholder="Ex.: Ruby Rose"
                  aria-invalid={!!errors.brand || undefined}
                  maxLength={60}
                />
                {errors.brand && <p className="adm-error">{errors.brand}</p>}
              </div>
              <div>
                <label htmlFor="f-detail" className="adm-label">
                  Tamanho ou variação
                </label>
                <input
                  id="f-detail"
                  className="adm-input"
                  value={form.detail}
                  onChange={(e) => set("detail", e.target.value)}
                  placeholder="Ex.: 200 ml · vários tons"
                  aria-invalid={!!errors.detail || undefined}
                  maxLength={80}
                />
                {errors.detail && <p className="adm-error">{errors.detail}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between">
                <label htmlFor="f-blurb" className="adm-label">
                  Descrição curta
                </label>
                <Counter value={form.blurb} max={180} />
              </div>
              <textarea
                id="f-blurb"
                className="adm-input !min-h-[5rem]"
                value={form.blurb}
                onChange={(e) => set("blurb", e.target.value)}
                placeholder="Uma ou duas frases que aparecem no card do catálogo."
                aria-invalid={!!errors.blurb || undefined}
                rows={2}
              />
              {errors.blurb ? <p className="adm-error">{errors.blurb}</p> : <p className="adm-help">Aparece no card do catálogo.</p>}
            </div>

            <div>
              <div className="flex items-end justify-between">
                <label htmlFor="f-desc" className="adm-label">
                  Descrição completa
                </label>
                <Counter value={form.description} max={2000} />
              </div>
              <textarea
                id="f-desc"
                className="adm-input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Modo de uso, cores disponíveis, fragrância, ingredientes..."
                aria-invalid={!!errors.description || undefined}
                rows={5}
              />
              {errors.description ? (
                <p className="adm-error">{errors.description}</p>
              ) : (
                <p className="adm-help">Aparece na página do produto. Opcional.</p>
              )}
            </div>
          </section>

          <section className="adm-card p-5 sm:p-6" aria-labelledby="sec-var">
            <div className="mb-4">
              <h2 id="sec-var" className="text-lg">
                Cores e opções
              </h2>
              <p className="adm-help !mt-1">
                Tem várias cores, tons ou fragrâncias? Cadastre cada uma aqui. Na loja aparecem as bolinhas pra cliente
                escolher, e a escolhida vai junto no pedido. Sem opções, é só pular.
              </p>
            </div>
            <VariantEditor
              label={form.variantLabel}
              variants={form.variants}
              images={form.images}
              errors={errors}
              onLabelChange={(v) => set("variantLabel", v)}
              onChange={(v) => {
                set("variants", v);
                setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !k.startsWith("variants"))));
              }}
            />
          </section>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-6">
          <section className="adm-card p-5 sm:p-6" aria-labelledby="sec-pub">
            <h2 id="sec-pub" className="mb-2 text-lg">
              Na loja
            </h2>
            <div className="divide-y divide-espresso/8">
              <Switch
                checked={form.visible}
                onChange={(v) => set("visible", v)}
                label="Aparecer na loja"
                description={form.visible ? "Visível pra todo mundo." : "Oculto: só você vê aqui no painel."}
              />
              <Switch
                checked={form.inStock}
                onChange={(v) => set("inStock", v)}
                label="Em estoque"
                description={form.inStock ? "Mostra “Pronta-entrega”." : "Mostra “Esgotado” e o botão “Avise-me”."}
              />
              <Switch
                checked={form.isNew}
                onChange={(v) => set("isNew", v)}
                label="Novidade"
                description="Selo “Novo” no card."
              />
              <Switch
                checked={form.featured}
                onChange={(v) => set("featured", v)}
                label="Destaque"
                description="Aparece entre os primeiros do catálogo."
              />
            </div>
          </section>

          <section className="adm-card p-5 sm:p-6" aria-labelledby="sec-cat">
            <label id="sec-cat" htmlFor="f-cat" className="adm-label !mb-2 text-lg !font-semibold">
              Categoria <span className="text-danger">*</span>
            </label>
            {categories.length === 0 ? (
              <p className="text-sm text-espresso/80">
                Você ainda não tem categorias.{" "}
                <a href="/admin/categorias" className="font-medium text-vinho underline underline-offset-2">
                  Crie uma primeiro
                </a>
                .
              </p>
            ) : (
              <select
                id="f-cat"
                className="adm-input"
                value={form.categoryId ?? ""}
                onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)}
                aria-invalid={!!errors.categoryId || undefined}
              >
                <option value="">Escolha...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryId && <p className="adm-error">{errors.categoryId}</p>}
          </section>

          <section className="adm-card flex flex-col gap-4 p-5 sm:p-6" aria-labelledby="sec-price">
            <h2 id="sec-price" className="text-lg">
              Preço
            </h2>
            <div>
              <label htmlFor="f-price" className="adm-label">
                Preço de venda
              </label>
              <PriceInput
                id="f-price"
                value={form.priceCents}
                onChange={(v) => set("priceCents", v)}
                invalid={!!errors.priceCents}
              />
              {errors.priceCents ? (
                <p className="adm-error">{errors.priceCents}</p>
              ) : (
                <p className="adm-help">Em branco, a loja mostra “Valor sob consulta”.</p>
              )}
            </div>
            <div>
              <label htmlFor="f-compare" className="adm-label">
                Preço “de” (antes da promoção)
              </label>
              <PriceInput
                id="f-compare"
                value={form.compareAtCents}
                onChange={(v) => set("compareAtCents", v)}
                invalid={!!errors.compareAtCents}
                placeholder="Opcional"
              />
              {errors.compareAtCents ? (
                <p className="adm-error">{errors.compareAtCents}</p>
              ) : off ? (
                <p className="adm-help text-success">A loja vai mostrar o preço riscado e “-{off}%”.</p>
              ) : (
                <p className="adm-help">Preencha só se estiver em promoção.</p>
              )}
            </div>
          </section>
        </div>

        <div className="sticky bottom-20 z-30 -mx-4 border-t border-espresso/10 bg-offwhite/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:bottom-0 lg:col-span-2 lg:mx-0 lg:rounded-2xl lg:border lg:px-5">
          <div className="flex items-center justify-between gap-3">
            <p className="hidden text-sm text-taupe-deep sm:block" aria-live="polite">
              {uploading ? "Enviando fotos..." : dirty ? "Alterações não salvas" : isNew ? "" : "Tudo salvo"}
            </p>
            <div className="flex flex-1 justify-end gap-2.5 sm:flex-none">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => (dirty ? setConfirmLeave(true) : router.push("/admin"))}
                disabled={pending}
              >
                {dirty ? "Descartar" : "Voltar"}
              </button>
              <button type="submit" className="btn btn-primary btn-sm min-w-[9rem]" disabled={busy || (!dirty && !isNew)}>
                {pending ? "Salvando..." : uploading ? "Aguarde as fotos" : isNew ? "Criar produto" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmTrash}
        title="Mover pra lixeira?"
        confirmLabel="Mover pra lixeira"
        busy={pending}
        onConfirm={trash}
        onCancel={() => setConfirmTrash(false)}
      >
        “{product?.name}” sai da loja na hora. Você pode restaurar pela Lixeira em até 30 dias.
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmLeave}
        title="Descartar as alterações?"
        confirmLabel="Descartar"
        onConfirm={() => {
          setConfirmLeave(false);
          setInitial(form);
          router.push("/admin");
        }}
        onCancel={() => setConfirmLeave(false)}
      >
        O que você mudou e não salvou vai ser perdido.
      </ConfirmDialog>
    </div>
  );
}
