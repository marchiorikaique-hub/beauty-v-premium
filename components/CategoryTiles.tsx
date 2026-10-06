import { SectionTitle } from "./SectionTitle";
import { Sparkle } from "./icons";
import type { Category } from "@/lib/types";

/** Categorias principais em círculo, como no mockup da dona. */
export function CategoryTiles({ categories, title }: { categories: Category[]; title: string }) {
  if (categories.length === 0) return null;
  return (
    <section className="shell pt-9 sm:pt-20" aria-labelledby="cat-title">
      <SectionTitle id="cat-title" title={title} center />
      <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-8 sm:overflow-visible sm:px-0">
        {categories.map((cat) => (
          <li key={cat.id} className="w-[5.4rem] shrink-0 snap-start sm:w-[9.5rem]">
            <a href={`#cat-${cat.slug}`} className="group flex flex-col items-center text-center">
              <span className="relative block aspect-square w-full rounded-full" style={{ background: "linear-gradient(140deg, #f3cdbb, #c58a73 55%, #f0c2ae)" }}>
                <span className="absolute inset-[3px] overflow-hidden rounded-full bg-cream">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                    />
                  ) : (
                    <span className="satin grid h-full w-full place-items-center">
                      <Sparkle size={22} className="text-gold-soft/80" />
                    </span>
                  )}
                </span>
              </span>
              <span className="title-caps mt-2 text-[0.78rem] leading-tight text-ink transition-colors group-hover:text-vinho sm:mt-3.5 sm:text-lg">
                {cat.name}
              </span>
              <span className="mt-1 hidden text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-taupe-deep sm:block">Ver produtos</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
