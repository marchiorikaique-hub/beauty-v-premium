# Beauty V Premium

Loja de beleza e cosméticos (make, skincare, perfumaria) com pronta-entrega e
pedidos pelo WhatsApp, **com painel pra dona gerenciar tudo** pelo celular.

- Loja: https://beautyvpremium.com.br
- Painel: https://beautyvpremium.com.br/admin

Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + SQLite nativo do Node
(`node:sqlite`), rodando como serviço Docker Swarm no VPS `systembill-vps`.

## O que o painel faz

- **Produtos**: criar, editar, duplicar, mandar pra lixeira (restaura em até 30 dias),
  várias fotos (capa, reordenar, remover), preço e preço "de" (mostra desconto),
  ligar/desligar "na loja", "em estoque" (vira "Esgotado" + botão "Avise-me"),
  "destaque" (vai pro topo) e "novidade" (selo Novo), ordem manual.
- **Categorias**: criar, editar, foto, esconder, reordenar, excluir (bloqueia se tiver produto).
- **Loja**: WhatsApp de vendas, Instagram, cidade, frases da barra de avisos.
- **Conta**: trocar senha (desconecta os outros aparelhos), sair de todos os aparelhos.

As fotos são preparadas no próprio celular antes de subir (gira pela câmera, reduz,
converte pra WebP, detecta PNG sem fundo e apara as bordas). A loja lê o banco a cada
acesso: o que ela salva aparece na hora.

## Segurança

- Senha guardada só como hash scrypt; sessão em cookie httpOnly, token com hash no banco.
- Login limita 8 tentativas erradas por IP a cada 15 min.
- Upload só logado e só do próprio site (Origin), tipo conferido pelo conteúdo, nome aleatório.
- `/admin` e `/api` com `noindex`, `no-store` e `X-Frame-Options: DENY`.
- **Nenhuma senha no código nem no git.** Usuários são criados pelo CLI com a senha pela entrada padrão.

## Usuários do painel (no VPS)

```bash
# listar
ssh systembill-vps 'docker exec $(docker ps -q -f name=beauty-v-app) node scripts/admin.mjs list'
# redefinir senha se ela esquecer (pede a senha nova escondida; desconecta tudo)
ssh -t systembill-vps 'docker exec -it $(docker ps -q -f name=beauty-v-app) node scripts/admin.mjs set-password --email vicck.aguilar@gmail.com'
# criar outro usuário
ssh -t systembill-vps 'docker exec -it $(docker ps -q -f name=beauty-v-app) node scripts/admin.mjs create --email alguem@x.com --name "Nome"'
```

## Dados e backup

Volume Docker `beauty-v-app-data` montado em `/data`:
`app.db` (banco), `uploads/` (fotos enviadas), `backups/app-AAAA-MM-DD.db` (1 por dia,
guarda 14). A cada 6 h o app também esvazia a lixeira com mais de 30 dias e apaga fotos
que ninguém usa (com 24 h de folga). O VPS ainda tem o backup semanal da Hostinger.

## Rodar local

```bash
pnpm install
node_modules/.bin/next build
# servidor de produção local com dados em .data/local (fora do git)
DATA_DIR=$PWD/.data/local PORT=3210 INSECURE_COOKIES=1 PUBLIC_BASE_URL=http://localhost:3210 \
  node .next/standalone/server.js   # (copie .next/static e public pra dentro de .next/standalone antes)
# usuário de teste local
DATA_DIR=$PWD/.data/local node scripts/admin.mjs create --email teste@beautyv.local
```

## Deploy

```bash
git commit ...            # o deploy sobe só o que está commitado
bash deploy/deploy.sh     # build no VPS + troca sem derrubar (start-first + healthcheck)
```

Rollback: `ssh systembill-vps 'docker service rollback beauty-v-app'`.

Rota do Traefik: `deploy/traefik-beauty-v.yaml` → `/etc/easypanel/traefik/config/beauty-v.yaml`
(serviço fora do EasyPanel, mesmo padrão do convite do Bernardo). Se um certificado
falhar (ex.: DNS ainda propagando), remova e recoloque o arquivo pra forçar novo pedido.

## Estrutura

```
app/(site)/        loja: home, /produto/[slug], not-found
app/admin/         painel: login, (painel)/produtos|categorias|loja|conta|lixeira, actions.ts
app/api/admin/     upload de fotos
app/media/         serve as fotos enviadas
components/        loja + components/admin (painel)
lib/               banco (db-core.mjs, db.ts, repo.ts), auth, validação (zod), mídia, manutenção
scripts/admin.mjs  CLI de usuários
deploy/            Traefik + script de deploy
```

Veja `PRODUCT.md` (contexto de marca) e `DESIGN.md` (sistema visual).
