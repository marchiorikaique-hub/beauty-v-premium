import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/lib/site";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Beauty V Premium · Make, skincare e perfumaria com pronta-entrega",
  description:
    "Loja de beleza e cosméticos com pronta-entrega: maquiagem, skincare, perfumaria e novidades toda semana. Atendimento e pedidos pelo WhatsApp.",
  keywords: [
    "beauty v premium",
    "cosméticos",
    "maquiagem",
    "skincare",
    "perfumaria",
    "body splash",
    "pronta-entrega",
  ],
  openGraph: {
    title: "Beauty V Premium",
    description:
      "Make, skincare e perfumaria com pronta-entrega. Novidades toda semana.",
    type: "website",
    locale: "pt_BR",
  },
  metadataBase: new URL("https://beautyvpremium.com.br"),
};

const DIRECTION_CONTRACT = `<!--
Beauty V Premium — direction contract (impeccable)
THESIS: An editorial beauty boutique, not a loud drugstore grid. Her muted wine/champagne palette carries whole fields; products sit like objects on a shelf; WhatsApp is the checkout. Refuses the bright-pink category default and the generic feature-card page.
OWN-WORLD: Off-white ground, deep vinho panels + footer, champagne/rosa soft fields, espresso text, rose-gold hairlines. Bodoni Moda (Didone) display + Jost geometric sans. Four-point sparkle mark. Real cut-out product photography with contact shadows.
STORY: Visitor sees a curated premium selection with pronta-entrega, browses by category, taps Comprar no WhatsApp to order.
FIRST VIEWPORT: Left, Bodoni H1 "Beleza premium com pronta-entrega" + subline + primary Ver catálogo and WhatsApp CTA + trust row; right, a deep vinho panel with floating product cutouts, badge and sparkles.
FORM: E-commerce boutique home (Ruby Rose structure); brief-pinned visual world (client palette + brand + reference), so the concept roll is skipped by the pinned direction and the user's request to deliver. No seed key.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${jost.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-offwhite">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <a
          href="#catalogo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-vinho focus:px-5 focus:py-2 focus:text-sm focus:text-champagne-soft"
        >
          Pular para o catálogo
        </a>
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
