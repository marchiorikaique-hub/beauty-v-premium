import { Hero } from "@/components/Hero";
import { CategoryTiles } from "@/components/CategoryTiles";
import { Catalog } from "@/components/Catalog";
import { Story } from "@/components/Story";
import { HowToBuy } from "@/components/HowToBuy";
import { InstagramStrip } from "@/components/InstagramStrip";
import { getSettings, listCategories, listPublicProducts } from "@/lib/repo";
import { baseUrl } from "@/lib/site";

export default function Home() {
  const settings = getSettings();
  const categories = listCategories({ onlyVisible: true });
  const products = listPublicProducts();
  return (
    <>
      <Hero whatsapp={settings.whatsapp} />
      <CategoryTiles categories={categories} />
      <Catalog
        products={products}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        whatsapp={settings.whatsapp}
        siteUrl={baseUrl()}
      />
      <Story />
      <HowToBuy whatsapp={settings.whatsapp} />
      <InstagramStrip instagram={settings.instagram} />
    </>
  );
}
