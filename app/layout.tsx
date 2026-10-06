import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { baseUrl } from "@/lib/site";

// Tipografia escolhida pela dona (05/10): Cormorant Garamond nos títulos, Montserrat no texto
// e uma caligráfica só pro acento ("Extraordinário"). Arquivos locais em app/fonts (ver README lá).
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const montserrat = localFont({
  src: "./fonts/montserrat.woff2",
  weight: "300 600",
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const script = localFont({
  src: "./fonts/great-vibes.woff2",
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: "Beauty V Premium · Make, skincare e perfumaria com pronta-entrega",
    template: "%s · Beauty V Premium",
  },
  description:
    "Loja de beleza e cosméticos com pronta-entrega: maquiagem, skincare, perfumaria e novidades toda semana. Atendimento e pedidos pelo WhatsApp.",
  openGraph: { siteName: "Beauty V Premium", locale: "pt_BR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#3d0716",
};

const DIRECTION_CONTRACT = `<!--
Beauty V Premium — direction contract (impeccable), redesign 05/10/2026 pinned by the owner
THESIS: A feminine, elegant beauty boutique in deep wine satin and rose gold, the world of her new logo. Not a loud drugstore grid.
OWN-WORLD: Deep wine satin fields (header, hero, club, footer) with subtle pink sheen, blush/off-white ground for products, rose-gold metal for type accents and buttons. Cormorant Garamond display (caps, spaced), Montserrat body, Great Vibes script only for one accent word. Four-point sparkle with hairlines as the section ornament.
STORY: Visitor lands on a satin slideshow ("Sua beleza elevada ao extraordinário"), browses round category tiles and the catalog, fills the cart (heart bag) and finishes the order on WhatsApp.
FORM: E-commerce boutique home following the owner's own mockup. Admin is an Operate surface in the same world.
-->`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${montserrat.variable} ${script.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-offwhite">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        {children}
      </body>
    </html>
  );
}
