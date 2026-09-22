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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://marchiorikaique-hub.github.io/beauty-v-premium/"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${jost.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-offwhite">
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
