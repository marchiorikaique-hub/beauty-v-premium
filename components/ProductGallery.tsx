"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImageView } from "./ProductImageView";
import { useProductSelection } from "./ProductBuy";
import { ArrowLeftLine, ArrowRightLine, Close } from "./icons";
import type { ProductImage } from "@/lib/types";

/**
 * Fotos do produto: arrasta pro lado (como app de compra), toca pra abrir em tela cheia
 * e lá dá pra passar as fotos e dar zoom (toque duplo ou botão) pra ver detalhe.
 */
export function ProductGallery({ images, name, soldOut }: { images: ProductImage[]; name: string; soldOut: boolean }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const count = images.length;

  const goTo = useCallback((i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(i, el.children.length - 1));
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
    setIndex(n);
  }, []);

  // escolheu uma cor que tem foto: a galeria vai pra ela
  const target = useProductSelection()?.variant?.image;
  useEffect(() => {
    if (!target) return;
    const i = images.findIndex((img) => img.url === target);
    if (i >= 0) goTo(i);
  }, [target, images, goTo]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative -mx-5 overflow-hidden border-espresso/8 sm:mx-0 sm:rounded-[2rem] sm:border sm:shadow-[var(--shadow-card)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "radial-gradient(78% 70% at 50% 42%, var(--color-champagne-soft) 0%, var(--color-cream) 72%)",
          }}
        />
        <div
          ref={track}
          className="no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(i);
          }}
          aria-roledescription="carrossel"
          aria-label={`Fotos de ${name}`}
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => {
                setIndex(i);
                setViewer(true);
              }}
              className="relative aspect-square w-full shrink-0 snap-center cursor-zoom-in"
              aria-label={`Ampliar foto ${i + 1} de ${count}`}
            >
              <ProductImageView
                image={img}
                alt={count > 1 ? `${name}, foto ${i + 1} de ${count}` : name}
                eager={i === 0}
                className={soldOut ? "opacity-80 grayscale-[30%]" : ""}
              />
            </button>
          ))}
        </div>

        {count > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-vinho" : "w-1.5 bg-espresso/25"}`}
                />
              ))}
            </div>
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium tabular-nums text-champagne-soft">
              {index + 1}/{count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="no-scrollbar hidden gap-2.5 overflow-x-auto pb-1 sm:flex" aria-label="Escolher foto">
          {images.map((img, i) => (
            <li key={img.url} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
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

      {viewer && (
        <Viewer
          images={images}
          name={name}
          start={index}
          onClose={(i) => {
            setViewer(false);
            goTo(i, false);
          }}
        />
      )}
    </div>
  );
}

/** Tela cheia: passa as fotos com o dedo ou setas; toque duplo (ou botão) dá zoom e arrasta pra olhar o detalhe. */
function Viewer({
  images,
  name,
  start,
  onClose,
}: {
  images: ProductImage[];
  name: string;
  start: number;
  onClose: (index: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const [zoom, setZoom] = useState(false);
  // ponto (0 a 1) onde dar o zoom; sem toque, o meio da foto
  const focus = useRef({ x: 0.5, y: 0.5 });
  const count = images.length;

  useEffect(() => {
    if (!zoom) return;
    const box = track.current?.children[index] as HTMLElement | undefined;
    if (!box) return;
    requestAnimationFrame(() => {
      box.scrollLeft = focus.current.x * box.scrollWidth - box.clientWidth / 2;
      box.scrollTop = focus.current.y * box.scrollHeight - box.clientHeight / 2;
    });
  }, [zoom, index]);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const el = track.current;
    if (el) el.scrollLeft = start * el.clientWidth;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [start]);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(i, count - 1));
    setZoom(false);
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
    setIndex(n);
  };

  return (
    <dialog
      ref={ref}
      className="photo-viewer"
      aria-label={`Fotos de ${name}`}
      onClose={() => onClose(index)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div
        ref={track}
        className={`no-scrollbar flex h-full w-full snap-x snap-mandatory ${zoom ? "overflow-hidden" : "overflow-x-auto"}`}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index) setIndex(i);
        }}
      >
        {images.map((img, i) => {
          const zoomed = zoom && i === index;
          return (
            <div
              key={img.url}
              className={`relative h-full w-full shrink-0 snap-center ${zoomed ? "overflow-auto" : "overflow-hidden"}`}
              onDoubleClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                // dá o zoom onde a pessoa tocou
                focus.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
                setZoom((z) => !z);
              }}
            >
              {zoomed ? (
                <div className="flex min-h-full w-max min-w-full items-center justify-center">
                  <img
                    src={img.url}
                    alt={count > 1 ? `${name}, foto ${i + 1} de ${count}` : name}
                    draggable={false}
                    className="block h-auto w-[250vw] max-w-none cursor-zoom-out sm:w-[160vw]"
                  />
                </div>
              ) : (
                <img
                  src={img.url}
                  alt={count > 1 ? `${name}, foto ${i + 1} de ${count}` : name}
                  draggable={false}
                  className="absolute inset-0 h-full w-full cursor-zoom-in object-contain p-4 sm:p-10"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-5">
        <span className="rounded-full bg-black/45 px-3 py-1.5 text-sm font-medium tabular-nums text-white">
          {index + 1}/{count}
        </span>
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={() => {
              focus.current = { x: 0.5, y: 0.5 };
              setZoom((z) => !z);
            }}
            className="h-11 rounded-full bg-black/45 px-4 text-sm font-medium text-white backdrop-blur hover:bg-black/60"
          >
            {zoom ? "Diminuir" : "Zoom"}
          </button>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60"
            aria-label="Fechar fotos"
            autoFocus
          >
            <Close />
          </button>
        </div>
      </div>

      {count > 1 && !zoom && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60 disabled:opacity-30 sm:grid"
            aria-label="Foto anterior"
          >
            <ArrowLeftLine size={22} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === count - 1}
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60 disabled:opacity-30 sm:grid"
            aria-label="Próxima foto"
          >
            <ArrowRightLine size={22} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
      <p className="pointer-events-none absolute inset-x-0 bottom-12 text-center text-xs text-white/60 sm:hidden">
        {zoom ? "Arraste pra olhar o detalhe" : "Toque duas vezes pra dar zoom"}
      </p>
    </dialog>
  );
}
