import { asset } from "@/lib/assets";
import { Reveal } from "./Reveal";
import { Instagram, ArrowUpRight } from "./icons";
import { site } from "@/lib/site";

const shots = [
  { src: "/lifestyle/glow.webp", alt: "Body splash Glow em vários aromas" },
  { src: "/lifestyle/gloss.webp", alt: "Glosses Gloss Snow com pompom" },
  { src: "/lifestyle/bakery.webp", alt: "Body splash Bakery Glow" },
  { src: "/lifestyle/colonia.webp", alt: "Colônia Soul Todo Dia" },
  { src: "/lifestyle/cereja.webp", alt: "Sabonete corporal Cereja e Avelã" },
];

export function InstagramStrip() {
  return (
    <section className="shell py-16 sm:py-24" aria-labelledby="ig-title">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-lg">
          <h2 id="ig-title" className="font-display text-4xl text-ink sm:text-5xl">
            Todo dia tem novidade
          </h2>
          <p className="mt-3 text-espresso/75">
            Acompanhe os lançamentos, os combos e os queridinhos no nosso
            Instagram.
          </p>
        </div>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost shrink-0"
        >
          <Instagram size={18} />@{site.instagramHandle}
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {shots.map((shot, i) => (
          <Reveal key={shot.src} delay={i * 60}>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl"
              aria-label={`Ver no Instagram: ${shot.alt}`}
            >
              <img
                src={asset(shot.src)}
                loading="lazy"
                width={400}
                height={400}
                alt={shot.alt}
                className="h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-vinho/0 opacity-0 transition-all duration-[400ms] group-hover:bg-vinho/45 group-hover:opacity-100">
                <Instagram size={26} className="text-champagne-soft" />
              </div>
              <ArrowUpRight
                size={16}
                className="absolute right-2.5 top-2.5 text-champagne-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
