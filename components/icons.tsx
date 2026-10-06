import type { ReactNode, SVGProps } from "react";

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

/* ------------------------- ícones do painel ------------------------- */
function Stroke({ size = 20, children, ...props }: IconProps & { size?: number; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden {...props} {...stroke}>
      {children}
    </svg>
  );
}

export const Plus = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M12 5v14M5 12h14" />
  </Stroke>
);
export const Pencil = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="m14.5 7.5 2 2" />
  </Stroke>
);
export const Trash = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a1.5 1.5 0 0 0 1.5 1.4h7A1.5 1.5 0 0 0 17 19l1-12M9 7V4.5h6V7" />
  </Stroke>
);
export const Copy = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2.2" />
    <path d="M16 8V5.8A1.8 1.8 0 0 0 14.2 4H5.8A1.8 1.8 0 0 0 4 5.8v8.4A1.8 1.8 0 0 0 5.8 16H8" />
  </Stroke>
);
export const ArrowUp = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Stroke>
);
export const ArrowDown = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Stroke>
);
export const ArrowLeft = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </Stroke>
);
export const Eye = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Stroke>
);
export const EyeOff = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M4 4l16 16M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.2 7.6A15.6 15.6 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.1-1" />
    <path d="M10 10.2a3 3 0 0 0 4 4" />
  </Stroke>
);
export const Search = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Stroke>
);
export const Photo = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.8" />
    <path d="m4 18 5.5-5.5 4 4 2.5-2.5L21 19" />
  </Stroke>
);
export const Logout = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M14 4h3.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </Stroke>
);
export const Store = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M4 9.5 5.3 5h13.4L20 9.5a2.6 2.6 0 0 1-5.3 0 2.6 2.6 0 0 1-5.4 0 2.6 2.6 0 0 1-5.3 0Z" />
    <path d="M5.5 12v7.5h13V12M10 19.5V15h4v4.5" />
  </Stroke>
);
export const Tag = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.6 6.6a1.4 1.4 0 0 1-2 0Z" />
    <circle cx="8" cy="8" r="1.4" />
  </Stroke>
);
export const Box = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M12 3 20 7v10l-8 4-8-4V7l8-4Z" />
    <path d="m4 7 8 4 8-4M12 11v10" />
  </Stroke>
);
export const User = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Stroke>
);
export const Check = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Stroke>
);
export const Restore = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5" />
    <path d="M4 4v4.5h4.5" />
  </Stroke>
);
export const ExternalLink = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </Stroke>
);
export const Upload = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
  </Stroke>
);
export const Alert = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M12 4 2.8 19.5h18.4L12 4Z" />
    <path d="M12 10v4.5M12 17.2v.3" />
  </Stroke>
);
export const Star = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6L12 16.6l-5.1 2.6 1-5.6-4-3.9 5.6-.8L12 3.8Z" />
  </Stroke>
);
export const Minus = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M5 12h14" />
  </Stroke>
);
export const ChevronDown = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="m6 9 6 6 6-6" />
  </Stroke>
);
/** Sacola com coração dentro (pedido da dona pro carrinho). */
export const BagHeart = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M6 8h12l-.8 11.2a1.6 1.6 0 0 1-1.6 1.5H8.4a1.6 1.6 0 0 1-1.6-1.5L6 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    <path d="M12 17.4s-2.6-1.5-2.6-3.3a1.3 1.3 0 0 1 2.6-.4 1.3 1.3 0 0 1 2.6.4c0 1.8-2.6 3.3-2.6 3.3Z" />
  </Stroke>
);
export const Crown = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M4.5 17.5 3.5 8l5 4 3.5-6 3.5 6 5-4-1 9.5h-15Z" />
    <path d="M5 20.5h14" />
  </Stroke>
);
export const Diamond = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M7 4h10l4 5-9 11L3 9l4-5Z" />
    <path d="M3 9h18M9.5 9 12 20l2.5-11M7 4l2.5 5L12 4l2.5 5L17 4" />
  </Stroke>
);
export const ArrowLeftLine = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Stroke>
);
export const ArrowRightLine = (p: IconProps & { size?: number }) => (
  <Stroke {...p}>
    <path d="m9 5 7 7-7 7" />
  </Stroke>
);
