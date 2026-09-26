import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";
import { MIME_BY_EXT, mediaPathFromParts } from "@/lib/media";

export const dynamic = "force-dynamic";

const notFound = () => new Response("Não encontrado", { status: 404 });

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const file = mediaPathFromParts(parts);
  if (!file) return notFound();
  let size = 0;
  try {
    const st = statSync(file);
    if (!st.isFile()) return notFound();
    size = st.size;
  } catch {
    return notFound();
  }
  const mime = MIME_BY_EXT[file.split(".").pop()!.toLowerCase()];
  if (!mime) return notFound();
  const body = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new Response(body, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(size),
      // nome do arquivo é aleatório e nunca é reaproveitado: pode guardar em cache pra sempre
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
