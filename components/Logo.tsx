import { site } from "@/lib/site";

interface LogoProps {
  tone?: "dark" | "light";
  badge?: number;
  className?: string;
  stacked?: boolean;
}

/** Lockup da marca: brasão real (BV) + assinatura Beauty V Premium. */
export function Logo({
  tone = "dark",
  badge = 46,
  className = "",
  stacked = false,
}: LogoProps) {
  const nameColor = tone === "dark" ? "text-ink" : "text-champagne-soft";
  const subColor = tone === "dark" ? "text-taupe-deep" : "text-champagne";
  return (
    <span
      className={`flex items-center gap-3 ${stacked ? "flex-col text-center gap-2.5" : ""} ${className}`}
    >
      <img
        src="/brand/badge.webp"
        width={badge}
        height={badge}
        alt={`Brasão da ${site.name}`}
        className="rounded-full ring-1 ring-gold/40 shadow-[0_10px_24px_-16px_rgba(85,21,32,0.7)]"
        style={{ width: badge, height: badge }}
      />
      <span className="leading-none">
        <span
          className={`block font-display text-[1.28rem] font-medium tracking-[0.02em] ${nameColor}`}
        >
          Beauty V
        </span>
        <span
          className={`mt-1 block text-[0.6rem] font-medium uppercase tracking-[0.42em] ${subColor}`}
        >
          Premium
        </span>
      </span>
    </span>
  );
}
