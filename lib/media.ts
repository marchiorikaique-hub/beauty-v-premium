import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { uploadsDir } from "./db-core.mjs";

export type ImageKind = { ext: "jpg" | "png" | "webp"; mime: string };

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Descobre o tipo pelo conteúdo (não confia na extensão nem no navegador). */
export function sniffImage(buf: Buffer): ImageKind | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return { ext: "png", mime: "image/png" };
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return { ext: "webp", mime: "image/webp" };
  return null;
}

/** Grava em uploads/AAAA/MM/<aleatório>.<ext> e devolve a URL pública /media/... */
export function saveUpload(buf: Buffer, kind: ImageKind): string {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dir = path.join(uploadsDir(), yyyy, mm);
  mkdirSync(dir, { recursive: true });
  const name = `${randomBytes(12).toString("hex")}.${kind.ext}`;
  writeFileSync(path.join(dir, name), buf, { flag: "wx" });
  return `/media/${yyyy}/${mm}/${name}`;
}

const SEGMENT = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9]+)?$/;

/** Converte /media/... em caminho no disco, recusando qualquer coisa fora da pasta. */
export function mediaPathFromUrl(url: string): string | null {
  if (!url.startsWith("/media/")) return null;
  const parts = url.slice("/media/".length).split("/");
  return mediaPathFromParts(parts);
}

export function mediaPathFromParts(parts: string[]): string | null {
  if (parts.length === 0 || parts.length > 4) return null;
  if (!parts.every((p) => SEGMENT.test(p))) return null;
  const root = path.resolve(uploadsDir());
  const full = path.resolve(root, ...parts);
  if (!full.startsWith(root + path.sep)) return null;
  return full;
}

export function mediaExists(url: string): boolean {
  const p = mediaPathFromUrl(url);
  return !!p && existsSync(p);
}

/**
 * Apaga arquivos enviados que não são usados por nenhum produto/categoria.
 * Só mexe em arquivos com mais de `graceMs` (quem está no meio de um cadastro
 * não perde a foto que acabou de subir).
 */
export function sweepOrphans(referenced: Set<string>, graceMs = 24 * 3600_000): number {
  const root = uploadsDir();
  if (!existsSync(root)) return 0;
  let removed = 0;
  const walk = (dir: string, rel: string[]) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, [...rel, entry.name]);
        continue;
      }
      const url = `/media/${[...rel, entry.name].join("/")}`;
      if (referenced.has(url)) continue;
      if (Date.now() - statSync(full).mtimeMs < graceMs) continue;
      unlinkSync(full);
      removed += 1;
    }
  };
  walk(root, []);
  return removed;
}
