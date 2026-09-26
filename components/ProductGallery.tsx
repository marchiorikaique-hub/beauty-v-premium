"use client";

import { useState } from "react";
import { ProductImageView } from "./ProductImageView";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name, soldOut }: { images: ProductImage[]; name: string; soldOut: boolean }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-espresso/8 shadow-[var(--shadow-card)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "radial-gradient(78% 70% at 50% 42%, var(--color-champagne-soft) 0%, var(--color-cream) 72%)",
          }}
        />
        {current && (
          <ProductImageView
            key={current.url}
            image={current}
            alt={images.length > 1 ? `${name}, foto ${index + 1} de ${images.length}` : name}
            eager
            className={soldOut ? "opacity-80 grayscale-[30%]" : ""}
          />
        )}
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2.5 overflow-x-auto pb-1" aria-label="Fotos do produto">
          {images.map((img, i) => (
            <li key={img.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === index}
                className={`relative block h-20 w-20 overflow-hidden rounded-2xl border-2 bg-champagne-soft transition-colors ${
                  i === index ? "border-vinho" : "border-transparent hover:border-espresso/25"
                }`}
              >
                <ProductImageView image={img} alt="" className={img.cutout ? "!p-1.5" : ""} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
