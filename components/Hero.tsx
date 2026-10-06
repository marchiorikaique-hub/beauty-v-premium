"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftLine, ArrowRight, ArrowRightLine, Sparkle } from "./icons";
import type { HeroSlide } from "@/lib/types";

const INTERVAL = 6500;

/** Topo da home: slides em cetim vinho que a dona troca pelo painel. */
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reduced.current) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, count, go]);

  // arrastar com o dedo no celular
  const touch = useRef<number | null>(null);

  return (
    <section
      id="top"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="satin relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touch.current;
        const end = e.changedTouches[0]?.clientX;
        touch.current = null;
        if (start == null || end == null || Math.abs(end - start) < 45) return;
        go(index + (end < start ? 1 : -1));
      }}
    >
      {/* fios de seda e brilho */}
      <div aria-hidden className="satin-sheen pointer-events-none absolute inset-0" />

      <div className="grid">
        {slides.map((s, i) => {
          const on = i === index;
          const img = s.image;
          // foto "normal" (pessoa, ambiente) ocupa a metade da faixa e se funde no cetim
          const photo = !!img && !img.cutout;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}`}
              aria-hidden={!on}
              inert={!on}
              className={`hero-slide relative [grid-area:1/1] ${on ? "is-on" : ""}`}
            >
              {photo && img && (
                <div
                  aria-hidden
                  className="hero-media photo-fade absolute inset-x-0 top-0 h-[21rem] sm:h-[25rem] lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[56%]"
                >
                  <img
                    src={img.url}
                    alt=""
                    loading={i === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
                  />
                                  </div>
              )}
              <div className="shell relative grid min-h-[34rem] items-center gap-6 pb-20 pt-8 sm:min-h-[36rem] lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-16">
                {/* foto */}
                {photo ? (
                  <div aria-hidden className="h-[15.5rem] sm:h-[19rem] lg:h-auto" />
                ) : (
                <div className="hero-media relative order-1 mx-auto aspect-square w-full max-w-[19rem] sm:max-w-sm lg:order-none lg:max-w-none">
                  {img && img.cutout && (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-[8%] rounded-full"
                        style={{
                          background:
                            "radial-gradient(closest-side, rgba(255,200,215,0.32), rgba(255,200,215,0.08) 60%, transparent)",
                        }}
                      />
                      <div aria-hidden className="absolute inset-[4%] rounded-full border border-gold-soft/25" />
                      <img
                        src={img.url}
                        alt=""
                        loading={i === 0 ? "eager" : "lazy"}
                        className="absolute inset-[6%] h-[88%] w-[88%] object-contain drop-shadow-[0_34px_50px_rgba(20,2,8,0.6)]"
                      />
                    </>
                  )}
                  {!img && (
                    <img
                      src="/brand/badge.webp"
                      alt=""
                      className="absolute inset-[14%] h-[72%] w-[72%] rounded-full shadow-[0_40px_70px_-30px_rgba(10,0,4,0.9)]"
                    />
                  )}
                  <Sparkle size={22} className="absolute right-[6%] top-[8%] text-gold-soft/80" />
                  <Sparkle size={13} className="absolute bottom-[14%] left-[4%] text-rosa/70" />
                </div>
                )}

                {/* texto */}
                <div className="hero-copy relative text-center lg:text-left">
                  {i === 0 ? (
                    <h1 className="text-champagne-soft">
                      <SlideTitle s={s} />
                    </h1>
                  ) : (
                    <h2 className="text-champagne-soft">
                      <SlideTitle s={s} />
                    </h2>
                  )}
                  {s.text && (
                    <p className="mx-auto mt-5 max-w-md text-[0.98rem] leading-relaxed text-champagne/85 lg:mx-0">{s.text}</p>
                  )}
                  <a href={s.link} className="btn btn-rose btn-caps mt-8 px-8 py-4">
                    {s.cta}
                    <ArrowRight size={17} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold-soft/40 text-gold-soft transition-colors hover:bg-white/10 md:grid xl:left-6"
          >
            <ArrowLeftLine size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Próximo slide"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold-soft/40 text-gold-soft transition-colors hover:bg-white/10 md:grid xl:right-6"
          >
            <ArrowRightLine size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ir pro slide ${i + 1}`}
                aria-current={i === index}
                className="grid h-6 place-items-center px-0.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-7 bg-gold-soft" : "w-1.5 bg-champagne/45 hover:bg-champagne/80"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function SlideTitle({ s }: { s: HeroSlide }) {
  return (
    <>
      {s.kicker && (
        <span className="block font-display text-[0.95rem] font-medium uppercase tracking-[0.5em] text-champagne/90 sm:text-lg">
          {s.kicker}
        </span>
      )}
      <span className="title-caps mt-3 block text-[2.7rem] text-champagne-soft sm:text-6xl lg:text-[4.6rem]">{s.title}</span>
      {s.script && (
        <span className="script -mt-1 block text-[3.4rem] text-gold-soft sm:text-7xl lg:-mt-2 lg:text-[5.4rem]">{s.script}</span>
      )}
    </>
  );
}
