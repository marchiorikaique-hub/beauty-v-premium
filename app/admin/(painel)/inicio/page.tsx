import { HomeForm } from "@/components/admin/HomeForm";
import { requireUser } from "@/lib/auth";
import { getSettings, listPublicProducts } from "@/lib/repo";

export const metadata = { title: "Página inicial" };

export default async function HomeContentPage() {
  await requireUser();
  const products = listPublicProducts().map((p) => ({ slug: p.slug, name: p.name }));
  return <HomeForm home={getSettings().home} products={products} />;
}
