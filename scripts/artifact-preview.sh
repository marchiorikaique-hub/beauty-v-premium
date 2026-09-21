#!/bin/bash
# Gera ./preview a partir de ./out com caminhos RELATIVOS e sem pastas/arquivos
# começando com "_" (o serviço de Artifact do Claude reserva "_" e só serve
# caminhos relativos). Use só pra publicar a prévia no Claude; pro VPS use out/.
set -e
cd "$(dirname "$0")/.."

rm -rf preview
cp -r out preview
mv preview/_next preview/next

# HTML: caminhos absolutos -> relativos, e _next -> next
find preview -name '*.html' -print0 | xargs -0 sed -i '' \
  -e 's#/_next/#next/#g' \
  -e 's#"/products/#"products/#g' \
  -e 's#"/brand/#"brand/#g' \
  -e 's#"/lifestyle/#"lifestyle/#g' \
  -e 's#"/icon.png#"icon.png#g'

# remove o <script> do polyfills (contém byte inválido e não é preciso em browser moderno)
find preview -name '*.html' -print0 | xargs -0 sed -i '' -E 's#<script[^>]*polyfills-[a-f0-9]+\.js[^>]*></script>##g'

# JS: publicPath e strings _next/ -> next/  (não toca __next_f, que não tem barra)
find preview/next -name '*.js' -print0 | xargs -0 sed -i '' -e 's#/_next/#next/#g' -e 's#_next/#next/#g'

# CSS: url() da fonte relativo ao arquivo CSS (next/static/css -> ../media)
find preview/next -name '*.css' -print0 | xargs -0 sed -i '' -e 's#/_next/static/media/#../media/#g' -e 's#_next/static/media/#../media/#g'

# arquivos com "_" no nome (outras rotas) não vão pro Artifact; remove pra não confundir
rm -f preview/next/static/*/_buildManifest.js preview/next/static/*/_ssgManifest.js
rm -f preview/next/static/chunks/pages/_app-*.js preview/next/static/chunks/pages/_error-*.js
rm -rf preview/next/static/chunks/app/_not-found
rm -f preview/next/static/chunks/polyfills-*.js

echo "preview/ pronto (relativo). Sobra algum caminho absoluto?"
grep -roE '"/(_next|products|brand|lifestyle|icon)' preview/index.html || echo "OK: nenhum caminho absoluto no index.html"
