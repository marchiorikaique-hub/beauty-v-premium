import { SITE_NAME } from "@/lib/site";

interface LogoProps {
  /** "mark": monograma BV + nome (cabeçalho); "badge": o brasão redondo da logo */
  variant?: "mark" | "badge";
  size?: "md" | "lg";
  className?: string;
}

/** Assinatura da marca, com a logo nova de 05/10 (vinho profundo e rose gold). */
export function Logo({ variant = "mark", size = "md", className = "" }: LogoProps) {
  if (variant === "badge") {
    const px = size === "lg" ? 96 : 56;
    return (
      <img
        src="/brand/badge.webp"
        width={px}
        height={px}
        alt={SITE_NAME}
        className={`rounded-full shadow-[0_14px_30px_-14px_rgba(20,2,8,0.8)] ${className}`}
        style={{ width: px, height: px }}
      />
    );
  }
  const lg = size === "lg";
  return (
    <span className={`flex items-center gap-3 sm:gap-3.5 ${className}`}>
      <img
        src="/brand/monogram.webp"
        alt=""
        width={lg ? 58 : 46}
        height={lg ? 53 : 42}
        className={lg ? "h-[53px] w-auto" : "h-[32px] w-auto sm:h-[44px]"}
      />
      <span className="flex flex-col items-center leading-none">
        <span
          className={`title-caps whitespace-nowrap text-champagne-soft ${lg ? "text-[2rem]" : "text-[1.22rem] sm:text-[1.75rem]"}`}
          style={{ letterSpacing: "0.08em" }}
        >
          Beauty V
        </span>
        <span className="mt-1 flex w-full items-center gap-2 text-gold-soft sm:mt-1.5">
          <span aria-hidden className="h-px flex-1 bg-gold-soft/60" />
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.42em] sm:text-[0.6rem]">Premium</span>
          <span aria-hidden className="h-px flex-1 bg-gold-soft/60" />
        </span>
      </span>
      <span className="sr-only">{SITE_NAME}</span>
    </span>
  );
}
