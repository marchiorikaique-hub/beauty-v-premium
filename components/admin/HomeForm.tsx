"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveHomeAction } from "@/app/admin/actions";
import type { HeroSlide, HomeContent } from "@/lib/types";
import { ArrowDown, ArrowUp, Close, ExternalLink, Plus, Sparkle, Trash } from "../icons";
import { ImageManager } from "./ImageManager";
import { useToast } from "./Toast";

interface HomeFormProps {
  home: HomeContent;
  /** destinos possíveis do botão de cada slide */
  links: { value: string; label: string }[];
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

const NEW_SLIDE: HeroSlide = {
  kicker: "",
  title: "",
  script: "",
  text: "",
  image: null,
  cta: "Comprar agora",
  link: "#catalogo",
};

export function HomeForm({ home, links }: HomeFormProps) {
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

  function setSlide(i: number, patch: Partial<HeroSlide>) {
    setForm((f) => ({ ...f, heroSlides: f.heroSlides.map((s, k) => (k === i ? { ...s, ...patch } : s)) }));
  }

  function moveSlide(i: number, dir: -1 | 1) {
    const next = [...form.heroSlides];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    set("heroSlides", next);
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
  const linkKnown = (v: string) => links.some((l) => l.value === v);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-[1.75rem]">Página inicial</h1>
        <p className="mt-1 text-sm text-taupe-deep">
          Os slides do topo, as frases do meio e a faixa Sobre. Produto à venda continua em Produtos.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending && !uploading) save();
        }}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* ---------------- slides ---------------- */}
        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="h-slides">
          <div>
            <h2 id="h-slides" className="text-lg">
              Slides do topo
            </h2>
            <p className="adm-help !mt-1">
              As fotos e frases que ficam passando no começo do site (até 5). Trocam sozinhas a cada 6 segundos.
            </p>
          </div>
          {errors.heroSlides && <p className="adm-error !mt-0">{errors.heroSlides}</p>}

          <ol className="flex flex-col gap-4">
            {form.heroSlides.map((s, i) => {
              const err = (k: string) => errors[`heroSlides.${i}.${k}`];
              return (
                <li key={i} className="rounded-2xl border border-espresso/10 p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">Slide {i + 1}</span>
                    <div className="flex items-center">
                      <button type="button" className="icon-btn" onClick={() => moveSlide(i, -1)} disabled={i === 0} aria-label={`Subir slide ${i + 1}`}>
                        <ArrowUp size={17} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => moveSlide(i, 1)}
                        disabled={i === form.heroSlides.length - 1}
                        aria-label={`Descer slide ${i + 1}`}
                      >
                        <ArrowDown size={17} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn hover:!text-danger"
                        onClick={() => set("heroSlides", form.heroSlides.filter((_, k) => k !== i))}
                        disabled={form.heroSlides.length === 1}
                        aria-label={`Remover slide ${i + 1}`}
                      >
                        <Trash size={17} />
                      </button>
                    </div>
                  </div>

                  {/* prévia */}
                  <div className="satin mb-4 flex items-center gap-4 rounded-xl px-4 py-4" aria-hidden>
                    <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10">
                      {s.image ? (
                        <img src={s.image.url} alt="" className={s.image.cutout ? "h-14 w-14 object-contain" : "h-full w-full object-cover"} />
                      ) : (
                        <Sparkle size={20} className="text-gold-soft" />
                      )}
                    </span>
                    <span className="min-w-0 leading-none">
                      {s.kicker && <span className="block truncate text-[0.6rem] uppercase tracking-[0.4em] text-champagne/85">{s.kicker}</span>}
                      <span className="title-caps mt-1 block truncate text-xl text-champagne-soft">{s.title || "Linha grande"}</span>
                      {s.script && <span className="script block truncate text-3xl text-gold-soft">{s.script}</span>}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field id={`s-k-${i}`} label="Linha fina" max={30} value={s.kicker} error={err("kicker")}>
                      <input
                        id={`s-k-${i}`}
                        className="adm-input"
                        value={s.kicker}
                        onChange={(e) => setSlide(i, { kicker: e.target.value })}
                        placeholder="Sua beleza"
                        maxLength={40}
                        aria-invalid={!!err("kicker") || undefined}
                      />
                    </Field>
                    <Field id={`s-t-${i}`} label="Linha grande" max={30} value={s.title} error={err("title")}>
                      <input
                        id={`s-t-${i}`}
                        className="adm-input"
                        value={s.title}
                        onChange={(e) => setSlide(i, { title: e.target.value })}
                        placeholder="Elevada ao"
                        maxLength={40}
                        aria-invalid={!!err("title") || undefined}
                      />
                    </Field>
                    <Field id={`s-s-${i}`} label="Letra cursiva" max={24} value={s.script} error={err("script")}>
                      <input
                        id={`s-s-${i}`}
                        className="adm-input"
                        value={s.script}
                        onChange={(e) => setSlide(i, { script: e.target.value })}
                        placeholder="Extraordinário"
                        maxLength={34}
                        aria-invalid={!!err("script") || undefined}
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <Field id={`s-x-${i}`} label="Texto" max={200} value={s.text} error={err("text")}>
                      <textarea
                        id={`s-x-${i}`}
                        className="adm-input"
                        value={s.text}
                        onChange={(e) => setSlide(i, { text: e.target.value })}
                        rows={2}
                        maxLength={220}
                        aria-invalid={!!err("text") || undefined}
                      />
                    </Field>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[11rem_1fr]">
                    <div>
                      <span className="adm-label">Foto</span>
                      <ImageManager
                        single
                        images={s.image ? [s.image] : []}
                        onChange={(imgs) => setSlide(i, { image: imgs[0] ?? null })}
                        onBusyChange={setUploading}
                        error={err("image")}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className="adm-help !mt-0 sm:pt-7">
                        PNG <strong>sem fundo</strong> fica flutuando com brilho. Foto normal aparece num quadro com cantos
                        arredondados.
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field id={`s-c-${i}`} label="Texto do botão" max={24} value={s.cta} error={err("cta")}>
                          <input
                            id={`s-c-${i}`}
                            className="adm-input"
                            value={s.cta}
                            onChange={(e) => setSlide(i, { cta: e.target.value })}
                            placeholder="Comprar agora"
                            maxLength={34}
                            aria-invalid={!!err("cta") || undefined}
                          />
                        </Field>
                        <div>
                          <label htmlFor={`s-l-${i}`} className="adm-label">
                            O botão leva pra
                          </label>
                          <select
                            id={`s-l-${i}`}
                            className="adm-input"
                            value={linkKnown(s.link) ? s.link : "#catalogo"}
                            onChange={(e) => setSlide(i, { link: e.target.value })}
                            aria-invalid={!!err("link") || undefined}
                          >
                            {links.map((l) => (
                              <option key={l.value} value={l.value}>
                                {l.label}
                              </option>
                            ))}
                          </select>
                          {err("link") && <p className="adm-error">{err("link")}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {form.heroSlides.length < 5 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm self-start"
              onClick={() => set("heroSlides", [...form.heroSlides, { ...NEW_SLIDE }])}
            >
              <Plus size={17} />
              Adicionar slide
            </button>
          )}
        </section>

        {/* ---------------- frases do meio ---------------- */}
        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="h-meio">
          <div>
            <h2 id="h-meio" className="text-lg">
              Frases do meio
            </h2>
            <p className="adm-help !mt-1">Os títulos das categorias e do catálogo.</p>
          </div>
          <Field id="h-categoriesTitle" label="Título das categorias" max={40} value={form.categoriesTitle} error={errors.categoriesTitle}>
            <input {...input("categoriesTitle", 40, "Compre por categoria")} />
          </Field>
          <Field id="h-catalogTitle" label="Título do catálogo" max={40} value={form.catalogTitle} error={errors.catalogTitle}>
            <input {...input("catalogTitle", 40, "Nossos queridinhos")} />
          </Field>
          <Field id="h-catalogText" label="Frase do catálogo" max={200} value={form.catalogText} error={errors.catalogText}>
            <textarea {...input("catalogText", 200, "Uma seleção com pronta-entrega...")} rows={2} />
          </Field>
        </section>

        {/* ---------------- sobre ---------------- */}
        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="h-sobre">
          <div>
            <h2 id="h-sobre" className="text-lg">
              Sobre a loja
            </h2>
            <p className="adm-help !mt-1">A faixa de cetim vinho no meio da página, com a sua história.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="h-storyTitle" label="Título (caixa alta)" max={60} value={form.storyTitle} error={errors.storyTitle}>
              <input {...input("storyTitle", 60, "Realce")} />
            </Field>
            <Field
              id="h-storyHighlight"
              label="Destaque (letra cursiva)"
              max={40}
              value={form.storyHighlight}
              error={errors.storyHighlight}
            >
              <input {...input("storyHighlight", 40, "sua essência")} />
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
                      onChange={(e) => set("storyPoints", form.storyPoints.map((p, k) => (k === i ? e.target.value : p)))}
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
                <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => set("storyPoints", [...form.storyPoints, ""])}>
                  <Plus size={17} />
                  Adicionar item
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- club ---------------- */}
        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="h-club">
          <div>
            <h2 id="h-club" className="text-lg">
              Beauty V Club
            </h2>
            <p className="adm-help !mt-1">
              A faixa com a coroa que leva pro seu grupo VIP. Só aparece no site depois que você colar o link do grupo.
            </p>
          </div>
          <Field
            id="h-clubLink"
            label="Link do grupo VIP"
            max={300}
            value={form.clubLink}
            error={errors.clubLink}
            help="Ex.: o link de convite do grupo no WhatsApp (https://chat.whatsapp.com/...)."
          >
            <input {...input("clubLink", 300, "https://chat.whatsapp.com/...")} type="url" inputMode="url" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="h-clubTitle" label="Título" max={40} value={form.clubTitle} error={errors.clubTitle}>
              <input {...input("clubTitle", 40, "Beauty V Club")} />
            </Field>
            <Field id="h-clubText" label="Frase" max={200} value={form.clubText} error={errors.clubText}>
              <input {...input("clubText", 200, "Mais vantagens e exclusividades.")} />
            </Field>
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
