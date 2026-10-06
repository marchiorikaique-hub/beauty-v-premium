"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveHomeAction } from "@/app/admin/actions";
import type { HomeContent } from "@/lib/types";
import { Close, ExternalLink, Plus, Sparkle } from "../icons";
import { ImageManager } from "./ImageManager";
import { useToast } from "./Toast";

interface HomeFormProps {
  home: HomeContent;
  products: { slug: string; name: string }[];
}

function Field({
  id,
  label,
  help,
  error,
  max,
  value,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  max: number;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <label htmlFor={id} className="adm-label">
          {label}
        </label>
        <span className={`text-xs tabular-nums ${value.length > max ? "text-danger" : "text-taupe-deep"}`} aria-hidden>
          {value.length}/{max}
        </span>
      </div>
      {children}
      {error ? <p className="adm-error">{error}</p> : help ? <p className="adm-help">{help}</p> : null}
    </div>
  );
}

export function HomeForm({ home, products }: HomeFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<HomeContent>(home);
  const [saved, setSaved] = useState<HomeContent>(home);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function set<K extends keyof HomeContent>(key: K, value: HomeContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: "" }));
  }

  function save() {
    start(async () => {
      const res = await saveHomeAction(form);
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast(res.error, "error");
        requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
        return;
      }
      setErrors({});
      setSaved(form);
      toast(res.message ?? "Salvo.");
      router.refresh();
    });
  }

  const input = (key: keyof HomeContent, max: number, placeholder: string) => ({
    id: `h-${key}`,
    className: "adm-input",
    value: String(form[key] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never),
    placeholder,
    maxLength: max + 20,
    "aria-invalid": !!errors[key] || undefined,
  });

  const pointsError = errors.storyPoints ?? Object.entries(errors).find(([k]) => k.startsWith("storyPoints."))?.[1];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-[1.75rem]">Página inicial</h1>
        <p className="mt-1 text-sm text-taupe-deep">As frases e fotos de vitrine da home. Produto à venda continua em Produtos.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending && !uploading) save();
        }}
        className="flex flex-col gap-5"
        noValidate
      >
        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="h-topo">
          <div>
            <h2 id="h-topo" className="text-lg">
              Topo da página
            </h2>
            <p className="adm-help !mt-1">É a primeira coisa que a cliente vê ao abrir o site.</p>
          </div>

          <div className="rounded-xl bg-offwhite px-5 py-5 ring-1 ring-espresso/8" aria-hidden>
            <p className="font-display text-[1.7rem] leading-[1.05] text-ink">
              {form.heroTitle || "Título"}
              {form.heroHighlight && (
                <>
                  <br />
                  <span className="italic text-vinho">{form.heroHighlight}</span>
                </>
              )}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-espresso/80">{form.heroText}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="h-heroTitle" label="Título" max={40} value={form.heroTitle} error={errors.heroTitle}>
              <input {...input("heroTitle", 40, "Beleza premium,")} />
            </Field>
            <Field
              id="h-heroHighlight"
              label="Destaque (em itálico, vinho)"
              max={40}
              value={form.heroHighlight}
              error={errors.heroHighlight}
            >
              <input {...input("heroHighlight", 40, "em pronta-entrega.")} />
            </Field>
          </div>
          <Field id="h-heroText" label="Texto de apresentação" max={260} value={form.heroText} error={errors.heroText}>
            <textarea {...input("heroText", 260, "Conte em duas frases o que a loja tem de especial.")} rows={3} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-[13rem_1fr]">
            <div>
              <span className="adm-label">Foto do quadro vinho</span>
              <ImageManager
                single
                images={form.heroImage ? [form.heroImage] : []}
                onChange={(imgs) => set("heroImage", imgs[0] ?? null)}
                onBusyChange={setUploading}
                error={errors.heroImage}
              />
            </div>
            <div className="flex flex-col gap-5">
              <p className="adm-help !mt-0 sm:pt-7">
                PNG <strong>sem fundo</strong> fica flutuando no quadro, igual hoje. Foto normal (com fundo) preenche o
                quadro inteiro. Sem foto, o quadro fica só com a cor da marca.
              </p>
              <div>
                <label htmlFor="h-heroProduct" className="adm-label">
                  Produto no cartãozinho
                </label>
                <select
                  id="h-heroProduct"
                  className="adm-input"
                  value={form.heroProductSlug}
                  onChange={(e) => set("heroProductSlug", e.target.value)}
                  aria-invalid={!!errors.heroProductSlug || undefined}
                >
                  <option value="">Sem cartãozinho</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.heroProductSlug ? (
                  <p className="adm-error">{errors.heroProductSlug}</p>
                ) : (
                  <p className="adm-help">O cartão branco no canto do quadro. Clicando, abre o produto.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="h-sobre">
          <div>
            <h2 id="h-sobre" className="text-lg">
              Sobre a loja
            </h2>
            <p className="adm-help !mt-1">A faixa vinho no meio da página, com a sua história.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="h-storyTitle" label="Título" max={60} value={form.storyTitle} error={errors.storyTitle}>
              <input {...input("storyTitle", 60, "Beleza é cuidado, e cuidado")} />
            </Field>
            <Field
              id="h-storyHighlight"
              label="Destaque (em itálico, rosa)"
              max={40}
              value={form.storyHighlight}
              error={errors.storyHighlight}
            >
              <input {...input("storyHighlight", 40, "mora no detalhe.")} />
            </Field>
          </div>
          <Field id="h-storyText1" label="Primeiro parágrafo" max={600} value={form.storyText1} error={errors.storyText1}>
            <textarea {...input("storyText1", 600, "Como a loja nasceu, o que você vende.")} rows={4} />
          </Field>
          <Field
            id="h-storyText2"
            label="Segundo parágrafo"
            max={600}
            value={form.storyText2}
            error={errors.storyText2}
            help="Opcional."
          >
            <textarea {...input("storyText2", 600, "Como é o atendimento, pagamento, entrega.")} rows={4} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-[13rem_1fr]">
            <div>
              <span className="adm-label">Foto da faixa</span>
              <ImageManager
                single
                images={form.storyImage ? [{ url: form.storyImage, cutout: false, width: null, height: null }] : []}
                onChange={(imgs) => set("storyImage", imgs[0]?.url ?? "")}
                onBusyChange={setUploading}
                error={errors.storyImage}
              />
            </div>
            <div>
              <span className="adm-label">Itens com estrelinha</span>
              <ol className="flex flex-col gap-2">
                {form.storyPoints.map((pt, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Sparkle size={14} className="shrink-0 text-gold" />
                    <input
                      className="adm-input"
                      value={pt}
                      onChange={(e) =>
                        set(
                          "storyPoints",
                          form.storyPoints.map((p, k) => (k === i ? e.target.value : p)),
                        )
                      }
                      aria-label={`Item ${i + 1}`}
                      aria-invalid={!!errors[`storyPoints.${i}`] || undefined}
                      maxLength={70}
                    />
                    <button
                      type="button"
                      className="icon-btn shrink-0 hover:!text-danger"
                      onClick={() => set("storyPoints", form.storyPoints.filter((_, k) => k !== i))}
                      aria-label={`Remover item ${i + 1}`}
                    >
                      <Close size={17} />
                    </button>
                  </li>
                ))}
              </ol>
              {pointsError && <p className="adm-error">{pointsError}</p>}
              {form.storyPoints.length < 5 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm mt-2"
                  onClick={() => set("storyPoints", [...form.storyPoints, ""])}
                >
                  <Plus size={17} />
                  Adicionar item
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="sticky bottom-20 z-30 -mx-4 flex items-center justify-between gap-3 border-t border-espresso/10 bg-offwhite/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:bottom-0 lg:mx-0 lg:rounded-2xl lg:border lg:px-5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-vinho">
            Ver a loja
            <ExternalLink size={15} />
          </a>
          <button type="submit" className="btn btn-primary btn-sm min-w-[9rem]" disabled={pending || uploading || !dirty}>
            {pending ? "Salvando..." : uploading ? "Aguarde a foto" : dirty ? "Salvar" : "Tudo salvo"}
          </button>
        </div>
      </form>
    </div>
  );
}
