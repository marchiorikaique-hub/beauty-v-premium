import { Hero } from "@/components/Hero";
import { CategoryTiles } from "@/components/CategoryTiles";
import { Catalog } from "@/components/Catalog";
import { Story } from "@/components/Story";
import { HowToBuy } from "@/components/HowToBuy";
import { InstagramStrip } from "@/components/InstagramStrip";
import { categoryTree, getSettings, listCategories, listPublicProducts } from "@/lib/repo";
import { baseUrl } from "@/lib/site";

export default function Home() {
  const settings = getSettings();
  const categories = listCategories({ onlyVisible: true });
  const products = listPublicProducts();
  const heroProduct = products.find((p) => p.slug === settings.home.heroProductSlug) ?? null;
  return (
    <>
      <Hero home={settings.home} product={heroProduct} whatsapp={settings.whatsapp} />
      <CategoryTiles categories={categories.filter((c) => c.parentId == null)} />
      <Catalog products={products} tree={categoryTree(categories)} whatsapp={settings.whatsapp} siteUrl={baseUrl()} />
      <Story home={settings.home} />
      <HowToBuy whatsapp={settings.whatsapp} />
      <InstagramStrip instagram={settings.instagram} />
    </>
  );
}
