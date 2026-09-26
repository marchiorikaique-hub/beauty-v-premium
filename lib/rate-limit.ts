// Limite de tentativas em memória (um único processo Node atrás do Traefik).
type Bucket = number[];
type Globals = typeof globalThis & { __bvRate?: Map<string, Bucket> };

function store(): Map<string, Bucket> {
  const g = globalThis as Globals;
  if (!g.__bvRate) g.__bvRate = new Map();
  return g.__bvRate;
}

function recent(key: string, windowMs: number): Bucket {
  const now = Date.now();
  const list = (store().get(key) ?? []).filter((t) => now - t < windowMs);
  store().set(key, list);
  return list;
}

/** Quantos minutos faltam pra liberar, ou 0 se ainda pode tentar. */
export function blockedFor(key: string, max: number, windowMs: number): number {
  const list = recent(key, windowMs);
  if (list.length < max) return 0;
  const oldest = list[0]!;
  return Math.max(1, Math.ceil((oldest + windowMs - Date.now()) / 60000));
}

export function hit(key: string) {
  const list = store().get(key) ?? [];
  list.push(Date.now());
  store().set(key, list);
}

export function reset(key: string) {
  store().delete(key);
}
