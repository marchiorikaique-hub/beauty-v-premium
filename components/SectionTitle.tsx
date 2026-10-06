import { ArrowRight, Sparkle } from "./icons";

interface SectionTitleProps {
  id?: string;
  title: string;
  /** texto de apoio embaixo, opcional */
  text?: string;
  action?: { href: string; label: string };
  tone?: "dark" | "light";
  center?: boolean;
}

/** Título em caixa alta com o fio e a estrelinha da marca (detalhe pedido pela dona). */
export function SectionTitle({ id, title, text, action, tone = "dark", center = false }: SectionTitleProps) {
  const color = tone === "dark" ? "text-ink" : "text-champagne-soft";
  const sub = tone === "dark" ? "text-espresso/75" : "text-champagne/80";
  return (
    <div className={`mb-5 sm:mb-11 ${center ? "text-center" : ""}`}>
      <div className={`flex items-center gap-5 ${center ? "flex-col gap-3" : ""}`}>
        <h2 id={id} className={`title-caps text-[1.55rem] sm:text-[2.6rem] ${color}`}>
          {title}
        </h2>
        <span aria-hidden className={`items-center gap-2 ${center ? "flex w-48" : "hidden max-w-56 flex-1 sm:flex"}`}>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold" />
          <Sparkle size={16} className="shrink-0 text-gold" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold" />
        </span>
        {action && !center && (
          <a
            href={action.href}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-vinho hover:underline hover:underline-offset-4"
          >
            {action.label}
            <ArrowRight size={15} />
          </a>
        )}
      </div>
      {text && <p className={`mt-2 max-w-xl text-sm sm:mt-3 sm:text-base ${center ? "mx-auto" : ""} ${sub}`}>{text}</p>}
    </div>
  );
}
