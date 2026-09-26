// Preparo da foto no navegador, antes do envio:
// gira pela orientação da câmera, reduz, detecta fundo transparente (recorte),
// apara bordas vazias do recorte e comprime em WebP (ou JPG/PNG se o navegador não gera WebP).

export interface PreparedImage {
  blob: Blob;
  width: number;
  height: number;
  cutout: boolean;
}

const MAX_SIDE = 1600;

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // alguns navegadores não aceitam a opção; tenta pelo <img>
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      await img.decode();
      return await createImageBitmap(img);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) {
    throw new Error("Esse arquivo não é uma foto.");
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await decode(file);
  } catch {
    throw new Error("Não consegui abrir essa foto. Envie em JPG ou PNG.");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  let w = Math.max(1, Math.round(bitmap.width * scale));
  let h = Math.max(1, Math.round(bitmap.height * scale));
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  // Recorte = foto com uma parte relevante transparente (PNG/WebP sem fundo).
  let cutout = false;
  if (file.type !== "image/jpeg") {
    const data = ctx.getImageData(0, 0, w, h).data;
    let transparent = 0;
    let total = 0;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const a = data[(y * w + x) * 4 + 3]!;
        total += 1;
        if (a < 245) transparent += 1;
        if (a > 12) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    cutout = total > 0 && transparent / total > 0.03 && maxX >= 0;
    if (cutout) {
      // apara a borda vazia deixando um respiro de 4%
      const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
      const sx = Math.max(0, minX - pad);
      const sy = Math.max(0, minY - pad);
      const sw = Math.min(w, maxX + pad + 2) - sx;
      const sh = Math.min(h, maxY + pad + 2) - sy;
      if (sw > 8 && sh > 8 && (sw < w || sh < h)) {
        const trimmed = document.createElement("canvas");
        trimmed.width = sw;
        trimmed.height = sh;
        trimmed.getContext("2d")!.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        canvas = trimmed;
        ctx = trimmed.getContext("2d")!;
        w = sw;
        h = sh;
      }
    }
  }

  let blob = await toBlob(canvas, "image/webp", cutout ? 0.9 : 0.85);
  if (!blob || blob.type !== "image/webp") {
    blob = cutout ? await toBlob(canvas, "image/png") : await toBlob(canvas, "image/jpeg", 0.88);
  }
  if (!blob) throw new Error("Não consegui preparar essa foto. Tente outra.");
  return { blob, width: w, height: h, cutout };
}

export interface UploadedImage {
  url: string;
  cutout: boolean;
  width: number | null;
  height: number | null;
}

/** Envia com barra de progresso. */
export function uploadImage(img: PreparedImage, onProgress?: (pct: number) => void): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    const ext = img.blob.type === "image/png" ? "png" : img.blob.type === "image/jpeg" ? "jpg" : "webp";
    form.append("file", img.blob, `foto.${ext}`);
    form.append("cutout", img.cutout ? "1" : "0");
    form.append("width", String(img.width));
    form.append("height", String(img.height));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body: { url?: string; error?: string; cutout?: boolean; width?: number | null; height?: number | null } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* resposta vazia */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.url) {
        resolve({ url: body.url, cutout: !!body.cutout, width: body.width ?? null, height: body.height ?? null });
      } else {
        reject(new Error(body.error || "Falha ao enviar a foto. Verifique a internet e tente de novo."));
      }
    };
    xhr.onerror = () => reject(new Error("Sem conexão. Verifique a internet e tente de novo."));
    xhr.send(form);
  });
}
