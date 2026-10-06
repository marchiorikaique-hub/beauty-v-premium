// Carrinho da loja. Guarda só produto + opção + quantidade no aparelho da cliente;
// nome, preço e foto vêm sempre do catálogo atual (servidor), então nunca fica preço velho.
import { formatBRL } from "./format";
import { whatsappLink } from "./site";
import type { Product } from "./types";

export interface CartLine {
  productId: number;
  /** nome da opção escolhida (ex.: "Pêssego"); vazio quando o produto não tem opções */
  variant: string;
  qty: number;
}

/** O que o carrinho precisa saber de cada produto à venda. */
export interface CartProduct {
  id: number;
  slug: string;
  name: string;
  brand: string;
  priceCents: number | null;
  inStock: boolean;
  image: string;
  cutout: boolean;
  variantLabel: string;
  variants: { name: string; color: string; image: string; inStock: boolean }[];
}

export interface CartRow extends CartLine {
  product: CartProduct;
  /** bolinha da opção, quando tem */
  color: string;
  image: string;
  available: boolean;
  lineCents: number | null;
}

export const MAX_QTY = 20;

export function toCartProduct(p: Product): CartProduct {
  const cover = p.images[0];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    priceCents: p.priceCents,
    inStock: p.inStock,
    image: cover?.url ?? "",
    cutout: cover?.cutout ?? false,
    variantLabel: p.variantLabel,
    variants: p.variants.map((v) => ({ name: v.name, color: v.color, image: v.image, inStock: v.inStock })),
  };
}

export function lineKey(l: Pick<CartLine, "productId" | "variant">) {
  return `${l.productId}::${l.variant}`;
}

/** Junta o que está salvo com o catálogo atual; some o que saiu da loja ou mudou de opção. */
export function resolveCart(lines: CartLine[], catalog: Map<number, CartProduct>): CartRow[] {
  const rows: CartRow[] = [];
  for (const l of lines) {
    const product = catalog.get(l.productId);
    if (!product) continue;
    const opt = l.variant ? product.variants.find((v) => v.name === l.variant) : undefined;
    if (l.variant && !opt) continue;
    if (!l.variant && product.variants.length > 0) continue;
    const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(l.qty) || 1));
    const available = product.inStock && (opt ? opt.inStock : true);
    rows.push({
      ...l,
      qty,
      product,
      color: opt?.color ?? "",
      image: opt?.image || product.image,
      available,
      lineCents: product.priceCents == null ? null : product.priceCents * qty,
    });
  }
  return rows;
}

export function cartTotals(rows: CartRow[]) {
  const live = rows.filter((r) => r.available);
  const cents = live.reduce((n, r) => n + (r.lineCents ?? 0), 0);
  const unpriced = live.filter((r) => r.lineCents == null).length;
  const count = live.reduce((n, r) => n + r.qty, 0);
  return { cents, unpriced, count };
}

/** Mensagem pronta pro WhatsApp da loja, com tudo que a cliente escolheu. */
export function cartMessage(rows: CartRow[]): string {
  const live = rows.filter((r) => r.available);
  const { cents, unpriced } = cartTotals(rows);
  const lines = live.map((r) => {
    const opt = r.variant ? ` (${r.product.variantLabel || "Opção"}: ${r.variant})` : "";
    const brand = r.product.brand ? ` · ${r.product.brand}` : "";
    const price = r.lineCents == null ? "valor a confirmar" : formatBRL(r.lineCents);
    return `• ${r.qty}x ${r.product.name}${opt}${brand}\n   ${price}`;
  });
  const total =
    unpriced === 0
      ? `*Total: ${formatBRL(cents)}*`
      : cents > 0
        ? `*Total parcial: ${formatBRL(cents)}* (+ ${unpriced === 1 ? "1 item" : `${unpriced} itens`} a confirmar)`
        : "*Valores a confirmar*";
  return [
    "Oi! Montei meu pedido no site da Beauty V Premium ✨",
    "",
    ...lines,
    "",
    total,
    "",
    "Como fica o pagamento e a entrega?",
  ].join("\n");
}

export function cartWhatsappLink(number: string, rows: CartRow[]) {
  return whatsappLink(number, cartMessage(rows));
}
