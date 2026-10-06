import { Reveal } from "./Reveal";
import { Sparkle } from "./icons";
import type { HomeContent } from "@/lib/types";

export function Story({ home }: { home: HomeContent }) {
  return (
    <section
      id="sobre"
      className="scroll-mt-24 bg-vinho text-champagne-soft"
      aria-labelledby="story-title"
    >
      <div className="shell grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal>
          <div className="max-w-xl">
            <Sparkle size={22} className="mb-6 text-gold-soft" />
            <h2
              id="story-title"
              className="font-display text-4xl leading-[1.06] text-champagne-soft sm:text-[3.1rem]"
            >
              {home.storyTitle}
              {home.storyHighlight && <span className="italic text-rosa"> {home.storyHighlight}</span>}
            </h2>
            <p className="mt-6 whitespace-pre-line text-champagne/85">{home.storyText1}</p>
            {home.storyText2 && <p className="mt-4 whitespace-pre-line text-champagne/85">{home.storyText2}</p>}

            <ul className="mt-8 flex flex-col gap-3">
              {home.storyPoints.map((h) => (
                <li key={h} className="flex items-center gap-3 text-champagne">
                  <Sparkle size={13} className="shrink-0 text-gold-soft" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="overflow-hidden rounded-[1.75rem]"
              style={{ boxShadow: "0 50px 90px -50px rgba(0,0,0,0.7)" }}
            >
              {home.storyImage ? (
                <img
                  src={home.storyImage}
                  alt=""
                  width={585}
                  height={640}
                  className="aspect-[585/640] h-full w-full object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="grid aspect-[585/640] place-items-center"
                  style={{ background: "radial-gradient(90% 80% at 50% 30%, var(--color-rosa) 0%, var(--color-vinho-deep) 80%)" }}
                >
                  <Sparkle size={56} className="text-champagne/40" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl bg-champagne-soft px-4 py-3 shadow-xl sm:-left-6">
              <img
                src="/brand/badge.webp"
                width={44}
                height={44}
                alt=""
                aria-hidden
                className="h-11 w-11 rounded-full"
              />
              <p className="text-left text-xs font-medium uppercase leading-tight tracking-[0.14em] text-espresso/75">
                Novidades
                <br />
                toda semana
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
