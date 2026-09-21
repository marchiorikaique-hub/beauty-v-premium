import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Estrela de 4 pontas — assinatura da marca (aparece no logo). */
export function Sparkle({ size = 16, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props}>
      <path
        d="M12 2c.5 4.8 2.2 6.5 7 7-4.8.5-6.5 2.2-7 7-.5-4.8-2.2-6.5-7-7 4.8-.5 6.5-2.2 7-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRight({ size = 18, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ size = 18, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function Menu({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function WhatsApp({ size = 20, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.11.82.83-3.04-.2-.31a8.05 8.05 0 0 1-1.24-4.28c0-4.46 3.63-8.09 8.1-8.09Zm-4.5 4.68c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.12 3.64.58.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.32-.75-1.8-.19-.44-.39-.44-.54-.45l-.46-.01Z"
      />
    </svg>
  );
}

export function Instagram({ size = 20, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Escudo com check — proteção/skincare. */
export function Shield({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="M12 3 5 6v5.5c0 4 2.8 6.9 7 8.5 4.2-1.6 7-4.5 7-8.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Sacola de compras — pronta-entrega. */
export function Bag({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="M6 8h12l-.8 11.2a1.6 1.6 0 0 1-1.6 1.5H8.4a1.6 1.6 0 0 1-1.6-1.5L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

/** Calendário — novidades toda semana. */
export function Calendar({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <rect x="4" y="5" width="16" height="16" rx="2.4" />
      <path d="M4 9.5h16M8 3.5v3M16 3.5v3" />
      <path d="M12 13.5v3.2M10.4 15.1h3.2" />
    </svg>
  );
}

/** Cartão — várias formas de pagamento. */
export function Card({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="M3 9.5h18M6.5 14.5h4" />
    </svg>
  );
}

/** Coração de conversa — atendimento humano. */
export function ChatHeart({ size = 22, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
      <path d="M12 12.4 9.8 10.3a1.4 1.4 0 0 1 2-2l.2.2.2-.2a1.4 1.4 0 0 1 2 2L12 12.4Z" />
    </svg>
  );
}
