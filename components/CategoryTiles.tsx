import { asset } from "@/lib/assets";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "./icons";
import { categories } from "@/lib/products";

export function CategoryTiles() {
  return (
    <section className="shell py-16 sm:py-24" aria-labelledby="cat-title">
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="cat-title"
          className="max-w-lg font-display text-4xl text-ink sm:text-5xl"
        >
          Encontre pela sua vibe
        </h2>
        <p className="max-w-sm text-espresso/75">
          Do gloss que todo mundo quer ao skincare da rotina, tudo separadinho
          pra você achar rápido.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <Reveal as="article" key={cat.id} delay={i * 70}>
            <a
              href={`#cat-${cat.id}`}
              className="group relative flex h-60 flex-col justify-end overflow-hidden rounded-xl p-4 sm:h-80 sm:p-5"
            >
              <img
                src={asset(cat.id === "acessorios" ? "/brand/badge.webp" : cat.image)}
                loading="lazy"
                width={400}
                height={480}
                alt=""
                aria-hidden
                className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${cat.id === "acessorios" ? "bg-rosa object-contain p-9 pb-28" : "object-cover"}`}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(60,14,22,0.86) 0%, rgba(60,14,22,0.3) 44%, rgba(60,14,22,0.05) 72%)",
                }}
              />
              <div className="relative">
                <h3 className="font-display text-2xl text-offwhite">
                  {cat.label}
                </h3>
                <p className="mt-1 max-w-[15rem] text-sm leading-snug text-offwhite">
                  {cat.blurb}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-offwhite">
                  Ver produtos
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
