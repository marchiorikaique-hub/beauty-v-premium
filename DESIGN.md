# Beauty V Premium — Sistema de Design

> Redesign de 05/10/2026 pedido pela dona, a partir da logo nova e de um mockup que ela
> mandou ("mais elegante e feminino"). Substitui o mundo anterior (Bodoni + vinho apagado).

## Tese

Boutique de beleza feminina e elegante em **cetim vinho profundo com rose gold**, o mundo
da logo nova. Campos escuros de cetim (topo, slides, faixa Sobre, Beauty V Club, rodapé)
alternam com fundo claro rosado onde ficam os produtos.

## Cor (tokens em `app/globals.css`)

| Papel | Token | Hex |
|---|---|---|
| Fundo | `offwhite` / `cream` | `#FBF5F2` / `#FFFAF8` |
| Campo claro | `champagne-soft` / `rosa-soft` | `#F7E6DE` / `#F6DBE2` |
| Vinho (ação, marca) | `vinho` / `vinho-deep` / `vinho-night` | `#7A1434` / `#4A0A1E` / `#2C0511` |
| Toque de pink | `pink` / `rosa` | `#C2436E` / `#E8A6B8` |
| Rose gold | `gold` / `gold-soft` | `#C58A73` / `#EBBFA8` |
| Texto | `ink` / `espresso` / `taupe-deep` | `#2B0A13` / `#4A262C` / `#8C6466` |

Classes de superfície: `.satin` (cetim vinho com brilho rosado), `.satin-night` (faixa de
avisos), `.satin-sheen` (brilho que passa devagar), `.btn-rose` (botão rose gold metálico),
`.btn-outline-rose`, `.btn-caps`.

## Tipografia (arquivos locais em `app/fonts`)

- **Cormorant Garamond** (escolha da dona): títulos, quase sempre em caixa alta espaçada
  (`.title-caps`). Nomes de produto em caixa normal, peso 600.
- **Montserrat** (escolha da dona): texto e interface; rótulos em caixa alta com tracking.
- **Great Vibes**: só a palavra de acento em letra cursiva rose gold (`.script`), ex.
  "Extraordinário", "sua essência".
- Fontes locais porque `next/font/google` gerava classe diferente no servidor e no CSS.

## Marca

`public/brand/badge.*` (brasão redondo da logo nova, com transparência, também ícone do
site) e `public/brand/monogram.*` (só o BV rose gold, usado no cabeçalho ao lado de
"BEAUTY V / PREMIUM"). Assinatura: estrela de 4 pontas entre dois fios (`SectionTitle`).

## Estrutura da home

Faixa de avisos → cabeçalho em cetim (monograma, menu em caixa alta, mega menu de
categorias, carrinho com coração) → **slides** (até 5, editáveis, trocam a cada 6,5s,
pausam no hover/foco, arrastam no celular) → faixa de confiança (só fatos da loja) →
**categorias em círculo** com aro rose gold → catálogo → faixa **Realce sua essência** →
como comprar → **Beauty V Club** (só com link) → Instagram → rodapé em cetim.

## Painel (/admin): superfície de operação

Mesma marca, outro modo (**Operate**): a dona está numa tarefa, quase sempre no celular.

- **Tipografia**: só Jost (classe `.admin` troca os títulos pra Jost semibold). Bodoni só
  na assinatura "Beauty V" da barra lateral e no login.
- **Cor**: restrita. Vinho só pra ação primária, item ativo e interruptor ligado. Estados
  semânticos fora da paleta de marca de propósito: `danger` #b42318, `success` #1f7a4d,
  `warning` #8a5a00 (e versões `-soft`). Segunda camada neutra `panel` #f3ece6 na barra lateral.
- **Componentes** (em `@layer components`): `.adm-card`, `.adm-input` (hover, foco vinho,
  `aria-invalid` vermelho, disabled), `.adm-label/.adm-help/.adm-error`, `.btn-sm`,
  `.btn-danger`, `.icon-btn`, `<dialog class="adm-dialog">` nativo. Interruptor
  `role="switch"`. Toast com `aria-live`.
- **Navegação**: barra lateral no computador; no celular, barra de cima + abas embaixo
  (Produtos, Categorias, Loja, Conta). Lixeira fica dentro de Produtos.
- **Formulários**: barra de salvar fixa embaixo com estado ("Alterações não salvas" /
  "Tudo salvo"), aviso ao sair sem salvar, resumo de erros no topo + erro por campo,
  contador de caracteres. Edição de categoria inline (sem modal); modal só pra confirmar
  ação destrutiva.
- **Movimento**: 150 a 250 ms, só pra estado (interruptor, hover, toast). Sem animação de entrada.
- **Vazios** ensinam o próximo passo (catálogo vazio, lixeira vazia, filtro sem resultado).
