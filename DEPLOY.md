# Hospedagem Beauty V Premium

Publicação em 22/09/2026 na VPS Hostinger existente (72.61.77.153).

- Serviço Docker Swarm: `beauty-v-site`, rede `easypanel`.
- Site estático Nginx, limite de 64 MB de memória e 0,25 CPU.
- Artefatos: `/opt/beauty-v/releases/20260922`, montados somente para leitura.
- Rotas Traefik: `/etc/easypanel/traefik/config/beauty-v.yaml`.
- Link provisório com HTTPS validado: https://beauty-v.ahzuil.easypanel.host
- Domínios preparados: beautyvpremium.com.br e www.beautyvpremium.com.br.
- DNS Hostinger: A @ = 72.61.77.153, TTL 300; CNAME www = beautyvpremium.com.br, TTL 300.
- Nameservers existentes preservados: lunar.dns-parking.com e solar.dns-parking.com.

## Build para VPS

```sh
NEXT_PUBLIC_SITE_URL=https://beautyvpremium.com.br pnpm build
```

Não definir NEXT_PUBLIC_BASE_PATH para este destino. GitHub Pages permanece
independente, com seu build anterior e prefixo /beauty-v-premium.

## Pendência externa

Na publicação, a Hostinger ainda informava registro do domínio em andamento.
O DNS público retornava NXDOMAIN. Após a ativação, confirmar resolução do domínio
e certificado HTTPS (resolver letsencrypt já configurado no Traefik).
Se a emissão inicial falhar enquanto não houver DNS, reaplicar apenas a rota
beauty-v-domain após a ativação, sem reiniciar o proxy dos demais sites.
