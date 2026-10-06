// Conteúdo inicial do banco (roda uma única vez, no primeiro boot).
// Produtos reais extraídos do Instagram @beauty_vpremium; as fotos recortadas
// ficam em public/products. Depois disso tudo é editado pelo painel /admin.
import type { StoreSettings } from "./types";

export const seedSettings: StoreSettings = {
  whatsapp: "5511999598625",
  instagram: "beauty_vpremium",
  city: "São Paulo, SP",
  announcements: [
    "Pronta-entrega",
    "Novidades toda semana",
    "Marcas queridinhas",
    "Atendimento no WhatsApp",
    "Várias formas de pagamento",
  ],
  home: {
    heroSlides: [
      {
        kicker: "Sua beleza",
        title: "Elevada ao",
        script: "Extraordinário",
        text: "Maquiagem, skincare, perfumaria e os queridinhos que viralizam, com pronta-entrega e novidades toda semana.",
        image: { url: "/lifestyle/mulher-make.webp", cutout: false, width: null, height: null },
        cta: "Comprar agora",
        link: "#catalogo",
      },
      {
        kicker: "Perfumes que",
        title: "Deixam marca",
        script: "na pele",
        text: "Body splashes e colônias pra usar todo dia e sair cheirosa por onde passar.",
        image: { url: "/products/p05.webp", cutout: true, width: 1000, height: 1000 },
        cta: "Ver perfumaria",
        link: "/#cat-perfumaria",
      },
      {
        kicker: "Lábios",
        title: "Brilho que",
        script: "encanta",
        text: "Glosses, tintas e balms das marcas queridinhas, em várias cores.",
        image: { url: "/lifestyle/mulher-batom.webp", cutout: false, width: null, height: null },
        cta: "Ver maquiagem",
        link: "/#cat-maquiagem",
      },
    ],
    categoriesTitle: "Compre por categoria",
    catalogTitle: "Nossos queridinhos",
    catalogText: "Uma seleção com pronta-entrega. Coloca no carrinho o que quiser e finaliza o pedido pelo WhatsApp.",
    storyTitle: "Realce",
    storyHighlight: "sua essência",
    storyText1:
      "A Beauty V Premium nasceu pra deixar a sua rotina de beleza mais fácil e mais gostosa. A gente garimpa maquiagem, skincare e perfumaria das marcas queridinhas e deixa tudo em pronta-entrega, pra chegar rápido na sua mão.",
    storyText2:
      "Nada de robô: o atendimento é de gente pra gente, direto no WhatsApp. Você escolhe, tira dúvida de cor e de aroma, e a gente combina o melhor jeito de pagar e receber.",
    storyImage: "/lifestyle/boca-vermelha.webp",
    storyPoints: ["Curadoria de marcas queridinhas", "Pronta-entrega de verdade", "Atendimento de gente pra gente"],
    clubTitle: "Beauty V Club",
    clubText: "Mais vantagens e exclusividades. Entre no grupo VIP e saiba dos lançamentos e promoções antes de todo mundo.",
    clubLink: "",
  },
};

export const seedCategories = [
  { slug: "maquiagem", name: "Maquiagem", blurb: "Glosses, batons e os queridinhos que viralizam.", image: "/lifestyle/gloss.webp" },
  { slug: "skincare", name: "Skincare", blurb: "Proteção, limpeza e hidratação para a sua rotina.", image: "/lifestyle/cereja.webp" },
  { slug: "perfumaria", name: "Perfumaria", blurb: "Body splashes e colônias que ficam na pele.", image: "/lifestyle/glow.webp" },
  { slug: "acessorios", name: "Acessórios", blurb: "Mimos e novidades que chegam toda semana.", image: "/lifestyle/colonia.webp" },
];

export const seedProducts = [
  { slug: "gloss-snow", name: "Gloss Snow", brand: "Miamake", category: "maquiagem", blurb: "Gloss labial com brilho intenso e chaveiro pompom. Efeito glossy e lábios hidratados.", detail: "Vários tons", image: "/products/p04.webp" },
  { slug: "duo-lip-pocket", name: "Duo Lip Pocket", brand: "Vivai", category: "maquiagem", blurb: "Duo de batom líquido em cores que combinam entre si. Do tamanho certo pra viver na bolsa.", detail: "2 cores por kit", image: "/products/p11.webp" },
  { slug: "tinted-balm-feels", name: "Tinted Balm Feels Mood", brand: "Ruby Rose", category: "maquiagem", blurb: "Bálsamo labial com cor que hidrata e deixa um toque natural nos lábios.", detail: "Cor + hidratação", image: "/products/p12.webp" },
  { slug: "fresh-lips", name: "Gloss Fresh Lips", brand: "Dapop", category: "maquiagem", blurb: "Gloss labial de acabamento brilhante e toque leve, sem grudar.", detail: "Vários tons", image: "/products/p06.webp" },
  { slug: "gloss-vivai", name: "Gloss Vivai", brand: "Vivai", category: "maquiagem", blurb: "O gloss queridinho das clientes: brilho na medida e chaveiro pra chamar de seu.", detail: "Vários tons", image: "/products/p09.webp" },
  { slug: "protetor-dermachem-60", name: "Protetor Facial FPS 60", brand: "DermaChem", category: "skincare", blurb: "Proteção total com niacinamida, toque seco e sem cor. Uso diário pro rosto.", detail: "FPS 60 · sem cor", image: "/products/p02.webp" },
  { slug: "sabonete-cereja-avela", name: "Sabonete Corporal Cereja e Avelã", brand: "SIS", category: "skincare", blurb: "Limpa a pele com suavidade e deixa um perfume gostoso. Corpo e rosto.", detail: "200 ml", image: "/products/p07.webp" },
  { slug: "hidratante-fenzza", name: "Hidratante Corporal", brand: "Fenzza", category: "skincare", blurb: "Hidratação com óleo de coco e extrato de mirtilo. Pele macia e perfumada o dia todo.", detail: "Corpo", image: "/products/p01.webp" },
  { slug: "lencos-vitamina-c", name: "Lenços de Limpeza Vitamina C", brand: "", category: "skincare", blurb: "Lenços umedecidos pra limpeza facial com vitamina C e ação firmadora.", detail: "Praticidade diária", image: "/products/p08.webp" },
  { slug: "body-splash-glow", name: "Body Splash Glow", brand: "Glow", category: "perfumaria", blurb: "Body splash hidratante em fragrâncias marcantes pro dia a dia.", detail: "200 ml · vários aromas", image: "/products/p03.webp" },
  { slug: "body-splash-bakery", name: "Body Splash Bakery Glow", brand: "Rebelle", category: "perfumaria", blurb: "Notas doces e aconchegantes que ficam na pele. Aquele cheirinho de sobremesa.", detail: "200 ml", image: "/products/p05.webp" },
  { slug: "colonia-soul-todo-dia", name: "Colônia Soul Todo Dia", brand: "Soul", category: "perfumaria", blurb: "Desodorante colônia com refrescância e perfume pra usar todo dia.", detail: "200 ml", image: "/products/p10.webp" },
];
