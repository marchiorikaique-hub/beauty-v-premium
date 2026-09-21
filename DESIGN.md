# Beauty V Premium — Sistema de Design

> Documentado a partir do build (impeccable). Descreve o mundo visual como ele
> foi construído, não uma intenção. Fonte: `app/`, `components/`, `app/globals.css`.

## Tese

Uma **boutique de beleza editorial**, não uma prateleira de farmácia gritante. A
paleta vinho/champanhe da marca preenche campos inteiros, os produtos aparecem
recortados como objetos numa vitrine, e o WhatsApp é o checkout. Recusa o rosa
berrante padrão da categoria e a página genérica de cards de feature.

## Modo

**Persuade** (vitrine que precisa fazer o produto desejável e levar à ação no
WhatsApp).

## Cor

Estratégia: **paleta cheia** sobre base clara (loja navegada no celular, à luz
do dia). Tokens em `@theme` (`app/globals.css`):

| Papel | Token | Hex |
|---|---|---|
| Base | `offwhite` | `#F8F5F2` |
| Base clara (cards) | `cream` | `#FCFAF8` |
| Campo quente | `champagne` / `champagne-soft` | `#E7C8B8` / `#F1E2D8` |
| Destaque delicado | `rosa` / `rosa-soft` | `#D8A7B1` / `#ECCFD4` |
| Secundário / linhas | `taupe` / `taupe-deep` | `#B8A99A` / `#8A7A6B` |
| Texto | `espresso` / `ink` | `#4B3C35` / `#2C2320` |
| Marca / ação | `vinho` / `vinho-deep` | `#6B1D2A` / `#551520` |
| Metal / fios | `gold` / `gold-soft` | `#C69A7E` / `#DCB79C` |

Vinho carrega regiões inteiras (announcement bar, painel do hero, band "Sobre",
rodapé, botões e FAB). Champanhe/rosa são campos suaves; taupe é apoio.

## Tipografia

- **Display**: `Bodoni Moda` (Didone, ar de revista de moda/beleza). Títulos,
  nome da marca, nomes de produto. Itálico como acento (ex.: "em pronta-entrega").
- **Texto/UI**: `Jost` (grotesca geométrica). Corpo, nav, botões, labels.
- Carregadas via `next/font/google` (self-host automático, sem layout shift).
- Títulos: `letter-spacing: -0.02em`, `text-wrap: balance`, `line-height 1.04`.
- Labels de apoio: caixa alta, `tracking` largo (`0.2em`–`0.42em`).

## Componentes (linguagem)

- **Cantos**: generosos e macios (`rounded-2xl`/`3xl`; painéis `2rem`).
- **Sombras**: sempre com offset + blur (tokens `--shadow-card/lift/panel`),
  nunca halo. Cards sobem no hover (`-translate-y-1.5` + sombra maior).
- **Botões** (`.btn`): pill. Primário vinho sobre champanhe; ghost com borda
  fina que vira vinho no hover. (Definidos em `@layer components` pra utilitários
  do Tailwind, ex. `hidden`, sobrescreverem quando preciso.)
- **Produtos**: PNG/webp recortados (fundo removido via rembg) com sombra de
  contato sutil, sobre card champanhe radial.
- **Ícones**: SVG desenhados em traço 1.6 consistente (`components/icons.tsx`),
  incluindo o WhatsApp e o Instagram. Nada de emoji como ícone.
- **Assinatura da marca**: estrela de 4 pontas (do logo), recorrente.

## Composição / ritmo

Claro (hero, categorias, catálogo) → **band vinho escuro "Sobre"** (momento
editorial dramático) → claro (como comprar, Instagram) → **rodapé vinho escuro**
(âncora). Mais espaço acima de um título do que abaixo.

## Movimento

- Um momento autoral: entrada suave em revelação no scroll (`components/Reveal.tsx`,
  `IntersectionObserver`), ease-out exponencial, respeitando `prefers-reduced-motion`.
- Marquee lento na announcement bar; anel pontilhado girando devagar no hero.
- Hovers refinados (lift de card, zoom de imagem, sublinhado que cresce).

## Superfícies do navegador (temadas)

Seleção (vinho/champanhe), scrollbar (taupe→vinho), foco `:focus-visible`
(contorno vinho), `caret-color` vinho. Em `@layer base`.

## Estrutura da página

`AnnouncementBar` · `Header` (sticky, muda no scroll, menu mobile) · `Hero`
(coluna Bodoni + painel vinho com produtos) · `CategoryTiles` (tiles editoriais)
· `Catalog` (filtro client-side por categoria via hash + empty state de
Acessórios) · `Story` (band vinho) · `HowToBuy` (stepper numerado) ·
`InstagramStrip` · `Footer` · `WhatsAppFab`.

## Acessibilidade

`lang="pt-BR"`, landmarks semânticos, `aria-label` em botões de ícone, skip-link
pro catálogo, foco visível, alt real nas imagens de produto. Contrastes de texto
acima do piso (texto sobre vinho usa champanhe; secundário é tingido da paleta,
nunca cinza puro).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
`output: "export"` (site estático em `out/`, hospedável em qualquer lugar).
