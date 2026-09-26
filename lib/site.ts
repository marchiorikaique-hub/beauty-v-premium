// Links de WhatsApp e URL pública. O número vem das configurações da loja
// (editável no painel), não fica fixo no código.

export const SITE_NAME = "Beauty V Premium";

export function baseUrl(): string {
  return (process.env.PUBLIC_BASE_URL || "https://beautyvpremium.com.br").replace(/\/+$/, "");
}

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function waGeneral(number: string): string {
  return whatsappLink(number, "Oi! Vim pelo site da Beauty V Premium e quero ver as novidades. ✨");
}

export function waProduct(number: string, p: { name: string; brand?: string; url?: string; inStock?: boolean }): string {
  const marca = p.brand ? ` (${p.brand})` : "";
  const link = p.url ? `\n${p.url}` : "";
  const msg =
    p.inStock === false
      ? `Oi! Vi no site da Beauty V Premium que o ${p.name}${marca} está esgotado. Me avisa quando chegar?${link}`
      : `Oi! Vim pelo site da Beauty V Premium e me interessei pelo ${p.name}${marca}. Ainda tem pronta-entrega?${link}`;
  return whatsappLink(number, msg);
}

export function waCategory(number: string, label: string): string {
  return whatsappLink(
    number,
    `Oi! Vim pelo site da Beauty V Premium e quero ver as opções de ${label.toLowerCase()}. O que tem de novidade?`,
  );
}

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
