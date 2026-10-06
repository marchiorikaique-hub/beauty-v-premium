import type { ProductImage } from "@/lib/types";

interface Props {
  image: ProductImage;
  alt: string;
  className?: string;
  eager?: boolean;
}

/**
 * Foto recortada (fundo transparente) flutua sobre o card com sombra de contato;
 * foto comum ocupa o quadro inteiro. As fotos originais do site já vêm com a
 * sombra "assada" no arquivo, então só as enviadas pelo painel ganham sombra por CSS.
 */
export function ProductImageView({ image, alt, className = "", eager = false }: Props) {
  const uploaded = image.url.startsWith("/media/");
  const base = "absolute inset-0 h-full w-full";
  const mode = image.cutout
    ? `object-contain p-3 sm:p-5 ${uploaded ? "drop-shadow-[0_18px_22px_rgba(58,40,34,0.22)]" : ""}`
    : "object-cover";
  return (
    <img
      src={image.url}
      alt={alt}
      width={image.width ?? 800}
      height={image.height ?? 800}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`${base} ${mode} ${className}`}
    />
  );
}
