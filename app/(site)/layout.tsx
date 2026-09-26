import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSettings, listCategories } from "@/lib/repo";

// A loja lê o banco a cada acesso: o que a dona muda no painel aparece na hora.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  const categories = listCategories({ onlyVisible: true }).map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <>
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-vinho focus:px-5 focus:py-2 focus:text-sm focus:text-champagne-soft"
      >
        Pular para o catálogo
      </a>
      <AnnouncementBar items={settings.announcements} />
      <Header categories={categories} whatsapp={settings.whatsapp} />
      <main>{children}</main>
      <Footer categories={categories} settings={settings} />
      <WhatsAppFab whatsapp={settings.whatsapp} />
    </>
  );
}
