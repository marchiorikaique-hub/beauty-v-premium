import { getCurrentUser } from "@/lib/auth";
import { saveUpload, sniffImage } from "@/lib/media";
import { blockedFor, hit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;

function error(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const hosts = [req.headers.get("host"), req.headers.get("x-forwarded-host")].filter(Boolean);
  return hosts.includes(originHost);
}

function dim(v: FormDataEntryValue | null): number | null {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 && n <= 20000 ? n : null;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return error(401, "Sua sessão expirou. Entre de novo.");
  if (!sameOrigin(req)) return error(403, "Envio bloqueado.");

  const key = `upload:${user.id}`;
  if (blockedFor(key, 300, 3600_000)) return error(429, "Muitos envios em pouco tempo. Aguarde alguns minutos.");
  hit(key);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return error(400, "Não consegui ler o arquivo. Tente de novo.");
  }
  const file = form.get("file");
  if (!(file instanceof File)) return error(400, "Nenhuma foto enviada.");
  if (file.size > MAX_BYTES) return error(413, "Foto grande demais (máximo 8 MB).");

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniffImage(buf);
  if (!kind) return error(415, "Formato não suportado. Envie JPG, PNG ou WEBP.");

  const url = saveUpload(buf, kind);
  return Response.json({
    url,
    cutout: form.get("cutout") === "1" && kind.ext !== "jpg",
    width: dim(form.get("width")),
    height: dim(form.get("height")),
  });
}
