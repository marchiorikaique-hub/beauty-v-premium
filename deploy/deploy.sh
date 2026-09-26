#!/bin/bash
# Deploy do commit atual (HEAD) no VPS systembill-vps (Docker Swarm, fora do EasyPanel).
# Uso: bash deploy/deploy.sh
# Sobe só o que está commitado (git archive), builda no VPS com prioridade baixa
# e troca a imagem do serviço sem derrubar (start-first + healthcheck).
set -euo pipefail
cd "$(dirname "$0")/.."
TAG="$(date +%Y%m%d-%H%M)-$(git rev-parse --short HEAD)"
echo ">> enviando commit $(git rev-parse --short HEAD) pro VPS"
git archive --format=tar HEAD | ssh systembill-vps "rm -rf /tmp/beauty-v-build && mkdir -p /tmp/beauty-v-build && tar -x -C /tmp/beauty-v-build"
echo ">> build da imagem beauty-v-app:$TAG"
ssh systembill-vps "cd /tmp/beauty-v-build && nice -n 15 docker build -q -t beauty-v-app:$TAG ."
echo ">> atualizando o serviço"
ssh systembill-vps "docker service update --detach=false --update-order start-first --image beauty-v-app:$TAG beauty-v-app"
echo ">> ok: beauty-v-app:$TAG no ar (rollback: docker service rollback beauty-v-app)"
