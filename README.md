# Beauty V Premium

Site vitrine de beleza e cosméticos (make, skincare, perfumaria) com
pronta-entrega. Catálogo que leva a cliente direto pro WhatsApp com a mensagem
pronta. Primeira versão.

Feito com **Next.js 15 + TypeScript + Tailwind v4**, exportado como **site
estático** (`output: "export"`), ou seja: sobe em qualquer VPS ou hospedagem
estática, sem precisar de Node rodando no servidor.

## Rodar local

```bash
pnpm install
pnpm dev
# abre em http://localhost:3000
```

## Gerar a versão pra publicar

```bash
pnpm build
# GitHub Pages, sob o caminho do repositório:
NEXT_PUBLIC_BASE_PATH=/beauty-v-premium pnpm build
```

Isso gera a pasta **`out/`** com o site pronto (HTML, CSS, JS e imagens).
É essa pasta que vai pro servidor.

## Subir no VPS

O conteúdo de `out/` é o site inteiro. Alguns caminhos:

**Nginx / Apache (servir arquivos estáticos):** aponte a raiz do site pra pasta
`out/` (ou copie o conteúdo dela pra dentro de `/var/www/beautyv`, por exemplo).

```bash
# exemplo copiando do seu Mac pro VPS
rsync -avz --delete out/ usuario@SEU_VPS:/var/www/beautyv/
```

Nginx mínimo:

```nginx
server {
  listen 80;
  server_name beautyvpremium.com.br www.beautyvpremium.com.br;
  root /var/www/beautyv;
  index index.html;
  location / { try_files $uri $uri/ $uri.html /index.html; }
}
```

Depois é só apontar o domínio (quando comprar) pro IP do VPS e ativar o HTTPS
(Let's Encrypt / Certbot).

> Dica: como está com `trailingSlash`, cada rota vira uma pasta com `index.html`,
> o que funciona bem em qualquer servidor estático.

## Editar o conteúdo

- **Catálogo de produtos:** `lib/products.ts` (nome, marca, categoria, descrição,
  detalhe e imagem de cada produto). As imagens ficam em `public/products/`.
- **WhatsApp, Instagram, cidade, nome:** `lib/site.ts`.
- **Textos das seções** (hero, "Sobre", como comprar): nos componentes em
  `components/` (`Hero.tsx`, `Story.tsx`, `HowToBuy.tsx`).
- **Cores e fontes:** tokens em `app/globals.css` (bloco `@theme`).
- **Logo:** `public/brand/badge.webp` / `badge.png` (o favicon é `app/icon.png`).

## Estrutura

```
app/            layout, página e estilos globais
components/      seções e UI (Header, Hero, Catalog, ProductCard, Footer, ...)
lib/            dados (products.ts) e config (site.ts)
public/
  brand/        logo (badge)
  products/     recortes dos produtos (fundo removido)
  lifestyle/    fotos de ambiente pras categorias e Instagram
```

## Observações

- **Preços não aparecem no site** de propósito: a venda é pelo WhatsApp. Os cards
  dizem "Valores e cores combinados no WhatsApp".
- As **imagens dos produtos** foram recortadas dos posts do Instagram. Quando a
  cliente tiver fotos em fundo neutro, é só trocar os arquivos em
  `public/products/` mantendo os mesmos nomes.
- Veja `PRODUCT.md` (contexto de marca) e `DESIGN.md` (sistema visual) pra
  entender as decisões.
