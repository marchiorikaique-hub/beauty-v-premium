// Configuração central da Beauty V Premium.
// Dados reais coletados do Instagram @beauty_vpremium.

export const site = {
  name: "Beauty V Premium",
  shortName: "Beauty V",
  tagline: "Make, skincare e perfumaria com pronta-entrega.",
  city: "São Paulo, SP",
  instagramHandle: "beauty_vpremium",
  instagramUrl: "https://www.instagram.com/beauty_vpremium/",
  // WhatsApp oficial (bio do Instagram): +55 11 99959-8625
  whatsappNumber: "5511999598625",
  whatsappDisplay: "(11) 99959-8625",
} as const;

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const waGeneral = whatsappLink(
  "Oi! Vim pelo site da Beauty V Premium e quero ver as novidades. ✨",
);

export function waProduct(name: string, brand?: string): string {
  const marca = brand ? ` (${brand})` : "";
  return whatsappLink(
    `Oi! Vim pelo site da Beauty V Premium e me interessei pelo ${name}${marca}. Ainda tem pronta-entrega?`,
  );
}

export function waCategory(label: string): string {
  return whatsappLink(
    `Oi! Vim pelo site da Beauty V Premium e quero ver as opções de ${label}. O que tem de novidade?`,
  );
}
