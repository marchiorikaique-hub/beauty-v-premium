import { Reveal } from "./Reveal";
import { Sparkle, ArrowRight, WhatsApp, Bag, Calendar, ChatHeart } from "./icons";
import { waGeneral } from "@/lib/site";
import type { HomeContent, Product } from "@/lib/types";

const trust = [
  { icon: Bag, label: "Pronta-entrega" },
  { icon: Calendar, label: "Novidades toda semana" },
  { icon: ChatHeart, label: "Atendimento no WhatsApp" },
];

export function Hero({ home, product, whatsapp }: { home: HomeContent; product: Product | null; whatsapp: string }) {
  const img = home.heroImage;
  const cardImg = product?.images[0];
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14"
      aria-labelledby="hero-title"
    >
      {/* campos de cor de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 85% 0%, var(--color-champagne-soft) 0%, var(--color-offwhite) 46%, var(--color-offwhite) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-40 -z-10 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--color-rosa-soft)" }}
      />

      <div className="shell grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        {/* coluna de texto */}
        <div className="max-w-xl">
          <Reveal>
            <h1
              id="hero-title"
              className="font-display text-[2.9rem] font-medium leading-[1.02] text-ink sm:text-6xl"
            >
              {home.heroTitle}
              {home.heroHighlight && (
                <>
                  <br />
                  <span className="italic text-vinho">{home.heroHighlight}</span>
                </>
              )}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-md text-[1.06rem] leading-relaxed text-espresso/85">{home.heroText}</p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/#catalogo" className="btn btn-primary">
                Ver catálogo
                <ArrowRight size={18} />
              </a>
              <a
                href={waGeneral(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <WhatsApp size={18} />
                Falar no WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {trust.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm text-espresso/80"
                >
                  <Icon size={19} className="text-vinho" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* painel visual */}
        <Reveal delay={160}>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/6]"
              style={{
                background:
                  "linear-gradient(160deg, var(--color-vinho) 0%, var(--color-vinho-deep) 100%)",
                boxShadow: "var(--shadow-panel)",
              }}
            >
              {/* brilho radial + anel girando */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 55% at 50% 36%, rgba(231,200,184,0.34) 0%, transparent 62%)",
                }}
              />
              <div
                aria-hidden
                className="slow-spin absolute left-1/2 top-[38%] h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16]"
                style={{
                  border: "1px dashed var(--color-gold-soft)",
                  maskImage:
                    "radial-gradient(circle, transparent 40%, black 41%)",
                }}
              />

              <Sparkle
                size={26}
                className="absolute right-8 top-8 text-gold-soft/80"
              />
              <Sparkle
                size={15}
                className="absolute left-9 top-24 text-champagne/70"
              />

              {/* foto do quadro: PNG sem fundo flutua; foto normal preenche */}
              {img && img.cutout && (
                <img
                  src={img.url}
                  alt=""
                  width={520}
                  height={520}
                  className="absolute left-1/2 top-[34%] max-h-[62%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_30px_50px_rgba(40,15,20,0.5)]"
                />
              )}
              {img && !img.cutout && (
                <>
                  <img src={img.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(60,14,22,0.55) 0%, rgba(60,14,22,0) 45%)" }}
                  />
                </>
              )}
              {!img && (
                <img
                  src="/brand/badge.webp"
                  alt=""
                  width={220}
                  height={220}
                  className="absolute left-1/2 top-[38%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 shadow-[0_30px_60px_-20px_rgba(40,15,20,0.8)]"
                />
              )}

              {/* etiqueta pronta-entrega */}
              <div className="absolute right-6 top-1/2 flex items-center gap-2 rounded-full bg-offwhite/95 px-4 py-2 shadow-lg backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-vinho" />
                <span className="text-xs font-medium text-espresso">
                  Pronta-entrega
                </span>
              </div>

              {/* card de produto flutuante */}
              {product && (
                <a
                  href={`/produto/${product.slug}`}
                  className="absolute bottom-5 left-5 flex max-w-[calc(100%-2.5rem)] items-center gap-3 rounded-2xl bg-cream/95 p-3 pr-5 shadow-[0_20px_40px_-20px_rgba(40,15,20,0.7)] backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
                >
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-champagne-soft">
                    {cardImg && (
                      <img
                        src={cardImg.url}
                        alt=""
                        width={64}
                        height={64}
                        className={cardImg.cutout ? "h-14 w-14 object-contain" : "h-full w-full object-cover"}
                      />
                    )}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate font-display text-base text-ink">{product.name}</p>
                    <p className="truncate text-xs text-taupe-deep">{product.detail || product.brand || "Ver produto"}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
