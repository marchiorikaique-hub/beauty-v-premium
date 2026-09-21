// Catálogo — produtos reais extraídos do Instagram @beauty_vpremium.
// Descrições baseadas nas embalagens/legendas; valores são combinados
// pelo WhatsApp (a loja trabalha com pronta-entrega).

export type CategoryId = "maquiagem" | "skincare" | "perfumaria" | "acessorios";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  image: string; // imagem de vitrine (lifestyle)
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  blurb: string;
  detail: string; // tamanho / variante
  image: string;
  featured?: boolean;
}

export const categories: Category[] = [
  {
    id: "maquiagem",
    label: "Maquiagem",
    blurb: "Glosses, batons e os queridinhos que viralizam.",
    image: "/lifestyle/gloss.webp",
  },
  {
    id: "skincare",
    label: "Skincare",
    blurb: "Proteção, limpeza e hidratação para a sua rotina.",
    image: "/lifestyle/cereja.webp",
  },
  {
    id: "perfumaria",
    label: "Perfumaria",
    blurb: "Body splashes e colônias que ficam na pele.",
    image: "/lifestyle/glow.webp",
  },
  {
    id: "acessorios",
    label: "Acessórios",
    blurb: "Mimos e novidades que chegam toda semana.",
    image: "/lifestyle/colonia.webp",
  },
];

export const products: Product[] = [
  {
    id: "gloss-snow",
    name: "Gloss Snow",
    brand: "Miamake",
    category: "maquiagem",
    blurb: "Gloss labial com brilho intenso e chaveiro pompom. Efeito glossy e lábios hidratados.",
    detail: "Vários tons",
    image: "/products/p04.webp",
    featured: true,
  },
  {
    id: "duo-lip-pocket",
    name: "Duo Lip Pocket",
    brand: "Vivai",
    category: "maquiagem",
    blurb: "Duo de batom líquido em cores que combinam entre si. Do tamanho certo pra viver na bolsa.",
    detail: "2 cores por kit",
    image: "/products/p11.webp",
    featured: true,
  },
  {
    id: "tinted-balm-feels",
    name: "Tinted Balm Feels Mood",
    brand: "Ruby Rose",
    category: "maquiagem",
    blurb: "Bálsamo labial com cor que hidrata e deixa um toque natural nos lábios.",
    detail: "Cor + hidratação",
    image: "/products/p12.webp",
    featured: true,
  },
  {
    id: "fresh-lips",
    name: "Gloss Fresh Lips",
    brand: "Dapop",
    category: "maquiagem",
    blurb: "Gloss labial de acabamento brilhante e toque leve, sem grudar.",
    detail: "Vários tons",
    image: "/products/p06.webp",
  },
  {
    id: "gloss-vivai",
    name: "Gloss Vivai",
    brand: "Vivai",
    category: "maquiagem",
    blurb: "O gloss queridinho das clientes: brilho na medida e chaveiro pra chamar de seu.",
    detail: "Vários tons",
    image: "/products/p09.webp",
  },
  {
    id: "protetor-dermachem-60",
    name: "Protetor Facial FPS 60",
    brand: "DermaChem",
    category: "skincare",
    blurb: "Proteção total com niacinamida, toque seco e sem cor. Uso diário pro rosto.",
    detail: "FPS 60 · sem cor",
    image: "/products/p02.webp",
    featured: true,
  },
  {
    id: "sabonete-cereja-avela",
    name: "Sabonete Corporal Cereja e Avelã",
    brand: "SIS",
    category: "skincare",
    blurb: "Limpa a pele com suavidade e deixa um perfume gostoso. Corpo e rosto.",
    detail: "200 ml",
    image: "/products/p07.webp",
    featured: true,
  },
  {
    id: "hidratante-fenzza",
    name: "Hidratante Corporal",
    brand: "Fenzza",
    category: "skincare",
    blurb: "Hidratação com óleo de coco e extrato de mirtilo. Pele macia e perfumada o dia todo.",
    detail: "Corpo",
    image: "/products/p01.webp",
  },
  {
    id: "lencos-vitamina-c",
    name: "Lenços de Limpeza Vitamina C",
    brand: "",
    category: "skincare",
    blurb: "Lenços umedecidos pra limpeza facial com vitamina C e ação firmadora.",
    detail: "Praticidade diária",
    image: "/products/p08.webp",
  },
  {
    id: "body-splash-glow",
    name: "Body Splash Glow",
    brand: "Glow",
    category: "perfumaria",
    blurb: "Body splash hidratante em fragrâncias marcantes pro dia a dia.",
    detail: "200 ml · vários aromas",
    image: "/products/p03.webp",
    featured: true,
  },
  {
    id: "body-splash-bakery",
    name: "Body Splash Bakery Glow",
    brand: "Rebelle",
    category: "perfumaria",
    blurb: "Notas doces e aconchegantes que ficam na pele. Aquele cheirinho de sobremesa.",
    detail: "200 ml",
    image: "/products/p05.webp",
  },
  {
    id: "colonia-soul-todo-dia",
    name: "Colônia Soul Todo Dia",
    brand: "Soul",
    category: "perfumaria",
    blurb: "Desodorante colônia com refrescância e perfume pra usar todo dia.",
    detail: "200 ml",
    image: "/products/p10.webp",
  },
];

export function productsByCategory(id: CategoryId): Product[] {
  return products.filter((p) => p.category === id);
}
