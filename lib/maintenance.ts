import { existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { backupsDir } from "./db-core.mjs";
import { db } from "./db";
import { purgeExpiredSessions } from "./auth";
import { purgeTrash, referencedMedia } from "./repo";
import { sweepOrphans } from "./media";

const KEEP_BACKUPS = 14;

/** Cópia consistente do banco (VACUUM INTO), uma por dia, guarda as 14 últimas. */
function dailyBackup() {
  const dir = backupsDir();
  mkdirSync(dir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  const file = path.join(dir, `app-${day}.db`);
  if (!existsSync(file)) {
    db().prepare("VACUUM INTO ?").run(file);
  }
  const all = readdirSync(dir)
    .filter((f) => /^app-\d{4}-\d{2}-\d{2}\.db$/.test(f))
    .sort();
  for (const old of all.slice(0, Math.max(0, all.length - KEEP_BACKUPS))) {
    unlinkSync(path.join(dir, old));
  }
}

export function runMaintenance() {
  const log: string[] = [];
  const steps: [string, () => unknown][] = [
    ["lixeira", () => purgeTrash(30)],
    ["sessoes", () => purgeExpiredSessions()],
    ["orfas", () => sweepOrphans(referencedMedia())],
    ["backup", () => dailyBackup()],
  ];
  for (const [name, fn] of steps) {
    try {
      const out = fn();
      log.push(`${name}=${out ?? "ok"}`);
    } catch (err) {
      log.push(`${name}=ERRO`);
      console.error(`[manutencao] ${name}`, err);
    }
  }
  console.log(`[manutencao] ${log.join(" ")}`);
}

type Globals = typeof globalThis & { __bvMaint?: boolean };

export function startMaintenance() {
  const g = globalThis as Globals;
  if (g.__bvMaint) return;
  g.__bvMaint = true;
  setTimeout(runMaintenance, 60_000).unref();
  setInterval(runMaintenance, 6 * 3600_000).unref();
}
