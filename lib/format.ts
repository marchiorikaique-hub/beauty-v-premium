const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 1990 -> "R$ 19,90" */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, " ");
}

/** Desconto inteiro em % quando existe preço "de" maior que o "por". */
export function discountPercent(priceCents: number | null, compareAtCents: number | null): number | null {
  if (priceCents == null || compareAtCents == null || compareAtCents <= priceCents) return null;
  const pct = Math.round((1 - priceCents / compareAtCents) * 100);
  return pct > 0 ? pct : null;
}

/** "Gloss Snow Rosé!" -> "gloss-snow-rose" */
export function slugify(input: string): string {
  const base = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return base || "item";
}

/** Só os dígitos do telefone. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** "5511999598625" -> "(11) 99959-8625" */
export function formatPhoneBR(digits: string): string {
  const d = onlyDigits(digits).replace(/^55(?=\d{10,11}$)/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}
