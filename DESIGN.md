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
| Secundário / linhas | `taupe` / `taupe-deep` | `#B8A99A` / `#726155` |
| Texto | `espresso` / `ink` | `#4B3C35` / `#4B3C35` |
| Marca / ação | `vinho` / `vinho-deep` | `#6B1D2A` / `#551520` |
| Metal / fios | `gold` / `gold-soft` | `#C69A7E` / `#DCB79C` |

Rosa antigo preenche o painel do hero. Champanhe ancora sua legenda e a seção de compra. Vinho marca ações, faixa superior, Sobre e rodapé. Espresso é o texto principal. As imagens do catálogo usam campos por categoria: rosa para maquiagem, taupe claro para skincare e champanhe para perfumaria.

## Tipografia

- **Display**: `Bodoni Moda` (Didone, ar de revista de moda/beleza). Títulos,
  nome da marca, nomes de produto. Itálico como acento (ex.: "em pronta-entrega").
- **Texto/UI**: `Jost` (grotesca geométrica). Corpo, nav, botões, labels.
- Carregadas via `next/font/google` (self-host automático, sem layout shift).
- Títulos: `letter-spacing: -0.02em`, `text-wrap: balance`, `line-height 1.04`.
- Labels de apoio: caixa alta, `tracking` largo (`0.2em`–`0.42em`).

## Componentes (linguagem)

- Painel principal e imagens de produto com raio de 12px, sem cartões encaixotando todo o conteúdo.
- Botão principal vinho, contatos secundários discretos; compra por produto com contorno vinho e área mínima de 44px.
- Catálogo em duas colunas no celular e três a partir de 768px, com informações e ações alinhadas.
- Busca local por produto ou marca, sem distinguir acentos, com contador anunciado e recuperação do estado vazio.
- Filtros são botões com aria-pressed, acessíveis por Tab, Enter e Espaço.
- Menu fechado usa hidden e inert; Escape fecha e devolve o foco ao botão; mudança para desktop fecha o menu.
- Fotos reais existentes preservadas. Acessórios usa a marca no lugar da foto incorreta de uma colônia.

## Composição / ritmo

Claro (hero, categorias, catálogo) → **band vinho escuro "Sobre"** (momento
editorial dramático) → claro (como comprar, Instagram) → **rodapé vinho escuro**
(âncora). Mais espaço acima de um título do que abaixo.

## Movimento

Conteúdo visível desde o HTML inicial, sem depender de animação ou JavaScript para aparecer. Faixa superior estática. Transições discretas em controles e imagens; reduced-motion desativa movimento e rolagem suave.

## Superfícies do navegador (temadas)

Seleção (vinho/champanhe), scrollbar (taupe→vinho), foco `:focus-visible`
(contorno vinho), `caret-color` vinho. Em `@layer base`.

## Estrutura da página

`AnnouncementBar` · `Header` (sticky, muda no scroll, menu mobile) · `Hero`
(coluna Bodoni + painel rosa com produtos) · `CategoryTiles` (tiles editoriais)
· `Catalog` (busca local, filtro por categoria via hash + empty state de
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
