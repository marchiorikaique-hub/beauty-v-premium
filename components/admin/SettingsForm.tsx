"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettingsAction } from "@/app/admin/actions";
import type { StoreSettings } from "@/lib/types";
import { formatPhoneBR } from "@/lib/format";
import { ArrowDown, ArrowUp, Close, ExternalLink, Plus, Sparkle, WhatsApp } from "../icons";
import { useToast } from "./Toast";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const router = useRouter();
  const toast = useToast();
  const initial = useMemo(
    () => ({ ...settings, whatsapp: formatPhoneBR(settings.whatsapp), announcements: [...settings.announcements] }),
    [settings],
  );
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  function setAnnouncement(i: number, value: string) {
    const list = [...form.announcements];
    list[i] = value;
    setForm({ ...form, announcements: list });
  }

  function moveAnnouncement(i: number, dir: -1 | 1) {
    const list = [...form.announcements];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j]!, list[i]!];
    setForm({ ...form, announcements: list });
  }

  function save() {
    start(async () => {
      const res = await saveSettingsAction(form);
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast(res.error, "error");
        return;
      }
      setErrors({});
      setSaved(form);
      toast(res.message ?? "Salvo.");
      router.refresh();
    });
  }

  const digits = form.whatsapp.replace(/\D/g, "");
  const testNumber = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-[1.75rem]">Loja</h1>
        <p className="mt-1 text-sm text-taupe-deep">
          Contato e avisos que aparecem no site inteiro. As frases e fotos da home ficam em{" "}
          <a href="/admin/inicio" className="font-medium text-vinho underline underline-offset-2">
            Página inicial
          </a>
          .
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending) save();
        }}
        className="flex flex-col gap-5"
        noValidate
      >
        <section className="adm-card flex flex-col gap-5 p-5 sm:p-6" aria-labelledby="s-contato">
          <h2 id="s-contato" className="text-lg">
            Contato
          </h2>
          <div>
            <label htmlFor="s-wa" className="adm-label">
              WhatsApp de vendas <span className="text-danger">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="s-wa"
                type="tel"
                inputMode="tel"
                className="adm-input"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                onBlur={() => setForm((f) => ({ ...f, whatsapp: formatPhoneBR(f.whatsapp) }))}
                placeholder="(11) 99999-9999"
                aria-invalid={!!errors.whatsapp || undefined}
              />
              <a
                href={`https://wa.me/${testNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm shrink-0"
                title="Abrir esse número no WhatsApp pra testar"
              >
                <WhatsApp size={17} />
                Testar
              </a>
            </div>
            {errors.whatsapp ? (
              <p className="adm-error">{errors.whatsapp}</p>
            ) : (
              <p className="adm-help">Todos os botões “Comprar no WhatsApp” da loja abrem conversa com esse número.</p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="s-ig" className="adm-label">
                Instagram
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso/60">@</span>
                <input
                  id="s-ig"
                  className="adm-input !pl-8"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value.replace(/^@+/, "") })}
                  placeholder="beauty_vpremium"
                  aria-invalid={!!errors.instagram || undefined}
                />
              </div>
              {errors.instagram && <p className="adm-error">{errors.instagram}</p>}
            </div>
            <div>
              <label htmlFor="s-city" className="adm-label">
                Cidade
              </label>
              <input
                id="s-city"
                className="adm-input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="São Paulo, SP"
                aria-invalid={!!errors.city || undefined}
              />
              {errors.city ? <p className="adm-error">{errors.city}</p> : <p className="adm-help">Aparece no rodapé.</p>}
            </div>
          </div>
        </section>

        <section className="adm-card flex flex-col gap-4 p-5 sm:p-6" aria-labelledby="s-avisos">
          <div>
            <h2 id="s-avisos" className="text-lg">
              Barra de avisos
            </h2>
            <p className="adm-help !mt-1">As frases que passam na faixa vinho do topo do site.</p>
          </div>

          <div className="overflow-hidden rounded-xl bg-vinho py-2.5 text-champagne-soft" aria-hidden>
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4 text-[0.7rem] font-medium uppercase tracking-[0.2em]">
              {form.announcements.filter(Boolean).map((a, i) => (
                <span key={i} className="flex items-center gap-3">
                  {a}
                  <Sparkle size={10} className="text-gold-soft" />
                </span>
              ))}
            </div>
          </div>

          <ol className="flex flex-col gap-2">
            {form.announcements.map((a, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <input
                  className="adm-input"
                  value={a}
                  onChange={(e) => setAnnouncement(i, e.target.value)}
                  aria-label={`Frase ${i + 1}`}
                  aria-invalid={!!errors[`announcements.${i}`] || undefined}
                  maxLength={60}
                />
                <button type="button" className="icon-btn hidden shrink-0 sm:inline-flex" onClick={() => moveAnnouncement(i, -1)} disabled={i === 0} aria-label={`Subir frase ${i + 1}`}>
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  className="icon-btn hidden shrink-0 sm:inline-flex"
                  onClick={() => moveAnnouncement(i, 1)}
                  disabled={i === form.announcements.length - 1}
                  aria-label={`Descer frase ${i + 1}`}
                >
                  <ArrowDown size={17} />
                </button>
                <button
                  type="button"
                  className="icon-btn shrink-0 hover:!text-danger"
                  onClick={() => setForm({ ...form, announcements: form.announcements.filter((_, idx) => idx !== i) })}
                  disabled={form.announcements.length === 1}
                  aria-label={`Remover frase ${i + 1}`}
                >
                  <Close size={17} />
                </button>
              </li>
            ))}
          </ol>
          {(errors.announcements || Object.keys(errors).some((k) => k.startsWith("announcements."))) && (
            <p className="adm-error">
              {errors.announcements ?? Object.entries(errors).find(([k]) => k.startsWith("announcements."))?.[1]}
            </p>
          )}
          {form.announcements.length < 8 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm self-start"
              onClick={() => setForm({ ...form, announcements: [...form.announcements, ""] })}
            >
              <Plus size={17} />
              Adicionar frase
            </button>
          )}
        </section>

        <div className="sticky bottom-20 z-30 -mx-4 flex items-center justify-between gap-3 border-t border-espresso/10 bg-offwhite/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:bottom-0 lg:mx-0 lg:rounded-2xl lg:border lg:px-5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-vinho">
            Ver a loja
            <ExternalLink size={15} />
          </a>
          <button type="submit" className="btn btn-primary btn-sm min-w-[9rem]" disabled={pending || !dirty}>
            {pending ? "Salvando..." : dirty ? "Salvar" : "Tudo salvo"}
          </button>
        </div>
      </form>
    </div>
  );
}
