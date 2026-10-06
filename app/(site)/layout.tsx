import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddedToast } from "@/components/cart/AddedToast";
import { categoryTree, getSettings, listCategories, listPublicProducts } from "@/lib/repo";
import { toCartProduct } from "@/lib/cart";

// A loja lê o banco a cada acesso: o que a dona muda no painel aparece na hora.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  const tree = categoryTree(listCategories({ onlyVisible: true }));
  const catalog = listPublicProducts().map(toCartProduct);
  return (
    <CartProvider catalog={catalog} whatsapp={settings.whatsapp}>
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-vinho focus:px-5 focus:py-2 focus:text-sm focus:text-champagne-soft"
      >
        Pular para o catálogo
      </a>
      <AnnouncementBar items={settings.announcements} />
      <Header categories={tree} whatsapp={settings.whatsapp} />
      <AddedToast />
      <main>{children}</main>
      <Footer categories={tree.map((c) => ({ slug: c.slug, name: c.name }))} settings={settings} />
      <WhatsAppFab whatsapp={settings.whatsapp} />
      <CartDrawer />
    </CartProvider>
  );
}
