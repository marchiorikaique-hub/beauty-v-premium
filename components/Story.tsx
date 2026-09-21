import { Reveal } from "./Reveal";
import { Sparkle } from "./icons";

const highlights = [
  "Curadoria de marcas queridinhas",
  "Pronta-entrega de verdade",
  "Atendimento de gente pra gente",
];

export function Story() {
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
              Beleza é cuidado, e cuidado
              <span className="italic text-rosa"> mora no detalhe.</span>
            </h2>
            <p className="mt-6 text-champagne/85">
              A Beauty V Premium nasceu pra deixar a sua rotina de beleza mais
              fácil e mais gostosa. A gente garimpa maquiagem, skincare e
              perfumaria das marcas queridinhas e deixa tudo em pronta-entrega,
              pra chegar rápido na sua mão.
            </p>
            <p className="mt-4 text-champagne/85">
              Nada de robô: o atendimento é de gente pra gente, direto no
              WhatsApp. Você escolhe, tira dúvida de cor e de aroma, e a gente
              combina o melhor jeito de pagar e receber.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {highlights.map((h) => (
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
              <img
                src="/lifestyle/cereja.webp"
                alt="Linha de sabonetes corporais Cereja e Avelã da Beauty V Premium"
                width={585}
                height={640}
                className="h-full w-full object-cover"
              />
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
