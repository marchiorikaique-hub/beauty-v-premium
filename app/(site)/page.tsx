import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { CategoryTiles } from "@/components/CategoryTiles";
import { Catalog } from "@/components/Catalog";
import { Story } from "@/components/Story";
import { Club } from "@/components/Club";
import { HowToBuy } from "@/components/HowToBuy";
import { InstagramStrip } from "@/components/InstagramStrip";
import { categoryTree, getSettings, listCategories, listPublicProducts } from "@/lib/repo";
import { baseUrl } from "@/lib/site";

export default function Home() {
  const settings = getSettings();
  const home = settings.home;
  const categories = listCategories({ onlyVisible: true });
  const products = listPublicProducts();
  // foto de produto pras categorias que ainda não têm foto no painel
  const covers: Record<string, NonNullable<(typeof products)[number]["images"][number]>> = {};
  for (const p of products) {
    const img = p.images[0];
    if (!img) continue;
    for (const slug of [p.categorySlug, p.parentCategorySlug]) {
      if (slug && !covers[slug]) covers[slug] = img;
    }
  }
  return (
    <>
      <Hero slides={home.heroSlides} />
      <TrustStrip />
      <CategoryTiles categories={categories.filter((c) => c.parentId == null)} title={home.categoriesTitle} covers={covers} />
      <Catalog
        title={home.catalogTitle}
        text={home.catalogText}
        products={products}
        tree={categoryTree(categories)}
        whatsapp={settings.whatsapp}
        siteUrl={baseUrl()}
      />
      <Story home={home} />
      <HowToBuy whatsapp={settings.whatsapp} />
      <Club title={home.clubTitle} text={home.clubText} link={home.clubLink} />
      <InstagramStrip instagram={settings.instagram} />
    </>
  );
}
