import { ArrowRight, Crown, Sparkle } from "./icons";

/** Beauty V Club: leva pro grupo VIP. Só aparece quando a dona cola o link no painel. */
export function Club({ title, text, link }: { title: string; text: string; link: string }) {
  if (!link) return null;
  return (
    <section className="satin relative overflow-hidden" aria-labelledby="club-title">
      <div aria-hidden className="satin-sheen pointer-events-none absolute inset-0" />
      <div className="shell relative flex flex-col items-center py-16 text-center sm:py-20">
        <span className="grid h-20 w-20 place-items-center rounded-full border border-gold-soft/50 text-gold-soft">
          <Crown size={34} />
        </span>
        <h2 id="club-title" className="title-caps mt-6 text-[2.2rem] tracking-[0.14em] text-champagne-soft sm:text-5xl">
          {title}
        </h2>
        <div aria-hidden className="mt-4 flex w-44 items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-soft" />
          <Sparkle size={14} className="text-gold-soft" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-soft" />
        </div>
        {text && <p className="mt-5 max-w-lg text-champagne/85">{text}</p>}
        <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-rose btn-caps mt-8 px-8 py-4">
          Quero entrar
          <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}
