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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <Reveal as="article" key={cat.id} delay={i * 70}>
            <a
              href={`#cat-${cat.id}`}
              className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl p-5 sm:h-80"
            >
              <img
                src={cat.image}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
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
                <h3 className="font-display text-2xl text-champagne-soft">
                  {cat.label}
                </h3>
                <p className="mt-1 max-w-[15rem] text-sm leading-snug text-champagne/85">
                  {cat.blurb}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-soft">
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
