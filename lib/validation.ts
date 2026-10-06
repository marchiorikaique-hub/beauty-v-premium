import { z } from "zod";
import { mediaExists } from "./media";
import { onlyDigits } from "./format";

const text = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres.`);

const IMAGE_URL = /^\/(media|products|lifestyle)\/[A-Za-z0-9/_.-]+\.(webp|png|jpe?g)$/;

const imageUrl = z
  .string()
  .regex(IMAGE_URL, "Imagem inválida.")
  .refine((u) => !u.startsWith("/media/") || mediaExists(u), "Essa imagem não existe mais. Envie de novo.");

const imageSchema = z.object({
  url: imageUrl,
  cutout: z.boolean(),
  width: z.number().int().positive().max(20000).nullable(),
  height: z.number().int().positive().max(20000).nullable(),
});

const money = z.number().int().min(0, "Valor inválido.").max(10_000_000, "Valor alto demais.").nullable();

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Dê um nome com pelo menos 2 letras.").max(80, "Use no máximo 80 caracteres."),
    brand: text(40),
    categoryId: z.number({ invalid_type_error: "Escolha uma categoria." }).int().positive("Escolha uma categoria.").nullable(),
    blurb: text(180),
    description: text(2000),
    detail: text(60),
    priceCents: money,
    compareAtCents: money,
    visible: z.boolean(),
    inStock: z.boolean(),
    featured: z.boolean(),
    isNew: z.boolean(),
    images: z.array(imageSchema).max(8, "No máximo 8 fotos por produto."),
    variantLabel: z.string().trim().max(20, "Use no máximo 20 caracteres."),
    variants: z
      .array(
        z.object({
          name: z.string().trim().min(1, "Dê um nome pra cada opção.").max(40, "Use no máximo 40 caracteres."),
          color: z.union([z.literal(""), z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida.")]),
          image: z.string(),
          inStock: z.boolean(),
        }),
      )
      .max(40, "No máximo 40 opções por produto."),
  })
  .superRefine((v, ctx) => {
    if (v.variants.length > 0 && !v.variantLabel) {
      ctx.addIssue({ code: "custom", path: ["variantLabel"], message: "Diga o que muda entre as opções, ex.: Cor." });
    }
    const seen = new Set<string>();
    v.variants.forEach((opt, i) => {
      const key = opt.name.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({ code: "custom", path: ["variants", i, "name"], message: `A opção “${opt.name}” está repetida.` });
      }
      seen.add(key);
      if (opt.image && !v.images.some((img) => img.url === opt.image)) {
        ctx.addIssue({ code: "custom", path: ["variants", i, "image"], message: "Essa foto saiu do produto. Escolha outra." });
      }
    });
    if (v.categoryId == null) {
      ctx.addIssue({ code: "custom", path: ["categoryId"], message: "Escolha uma categoria." });
    }
    if (v.compareAtCents != null && (v.priceCents == null || v.compareAtCents <= v.priceCents)) {
      ctx.addIssue({
        code: "custom",
        path: ["compareAtCents"],
        message: 'O preço "de" precisa ser maior que o preço de venda.',
      });
    }
    if (v.visible && v.images.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "Adicione pelo menos uma foto pra mostrar na loja (ou desligue “Aparecer na loja” por enquanto).",
      });
    }
  });

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Dê um nome com pelo menos 2 letras.").max(40, "Use no máximo 40 caracteres."),
  blurb: text(120),
  image: z.union([z.literal(""), imageUrl]),
  visible: z.boolean(),
  parentId: z.number().int().positive().nullable(),
});

const line = (min: number, max: number, what: string) =>
  z.string().trim().min(min, `Escreva ${what}.`).max(max, `Use no máximo ${max} caracteres.`);

const internalLink = z
  .string()
  .trim()
  .regex(/^(#[a-z0-9-]+|\/(#cat-[a-z0-9-]+|produto\/[a-z0-9-]+)?)$/, "Escolha pra onde o botão leva.");

export const homeSchema = z.object({
  heroSlides: z
    .array(
      z.object({
        kicker: z.string().trim().max(30, "Use no máximo 30 caracteres."),
        title: line(2, 30, "a linha grande"),
        script: z.string().trim().max(24, "Use no máximo 24 caracteres."),
        text: z.string().trim().max(200, "Use no máximo 200 caracteres."),
        image: imageSchema.nullable(),
        cta: line(2, 24, "o texto do botão"),
        link: internalLink,
      }),
    )
    .min(1, "Deixe pelo menos um slide.")
    .max(5, "No máximo 5 slides."),
  categoriesTitle: line(2, 40, "o título"),
  catalogTitle: line(2, 40, "o título"),
  catalogText: z.string().trim().max(200, "Use no máximo 200 caracteres."),
  storyTitle: line(2, 60, "o título"),
  storyHighlight: z.string().trim().max(40, "Use no máximo 40 caracteres."),
  storyText1: line(10, 600, "o primeiro parágrafo"),
  storyText2: z.string().trim().max(600, "Use no máximo 600 caracteres."),
  storyImage: z.union([z.literal(""), imageUrl]),
  storyPoints: z
    .array(z.string().trim().min(1, "Escreva algo ou remova o item.").max(60, "Use no máximo 60 caracteres."))
    .max(5, "No máximo 5 itens."),
  clubTitle: line(2, 40, "o título"),
  clubText: z.string().trim().max(200, "Use no máximo 200 caracteres."),
  clubLink: z.union([
    z.literal(""),
    z.string().trim().url("Cole o link completo, começando com https://").startsWith("https://", "O link precisa começar com https://"),
  ]),
});

export const settingsSchema = z.object({
  whatsapp: z
    .string()
    .transform((v) => {
      const d = onlyDigits(v);
      return d.length === 10 || d.length === 11 ? `55${d}` : d;
    })
    .refine((d) => /^55\d{10,11}$/.test(d), "Informe o WhatsApp com DDD, ex.: (11) 99959-8625."),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@+/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, ""))
    .refine((v) => /^[A-Za-z0-9._]{1,30}$/.test(v), "Informe só o usuário, ex.: beauty_vpremium."),
  city: text(60),
  announcements: z
    .array(z.string().trim().min(1, "Escreva algo ou remova a frase.").max(50, "Use no máximo 50 caracteres."))
    .min(1, "Deixe pelo menos uma frase na barra de avisos.")
    .max(8, "No máximo 8 frases."),
});

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Digite sua senha atual."),
    next: z.string().min(8, "A nova senha precisa ter pelo menos 8 caracteres.").max(200),
    confirm: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.next !== v.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "As senhas não são iguais." });
    if (v.next === v.current)
      ctx.addIssue({ code: "custom", path: ["next"], message: "Escolha uma senha diferente da atual." });
  });

/** { campo: "mensagem" } a partir do erro do zod. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    const root = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
    if (!out[root]) out[root] = issue.message;
  }
  return out;
}
