import { HomeForm } from "@/components/admin/HomeForm";
import { requireUser } from "@/lib/auth";
import { categoryChoices, getSettings, listPublicProducts, listCategories } from "@/lib/repo";

export const metadata = { title: "Página inicial" };

export default async function HomeContentPage() {
  await requireUser();
  const slugs = new Map(listCategories().map((c) => [c.id, c.slug]));
  const links = [
    { value: "#catalogo", label: "Catálogo inteiro" },
    ...categoryChoices().map((c) => ({ value: `/#cat-${slugs.get(c.id)}`, label: `Categoria: ${c.name}` })),
    ...listPublicProducts().map((p) => ({ value: `/produto/${p.slug}`, label: `Produto: ${p.name}` })),
  ];
  return <HomeForm home={getSettings().home} links={links} />;
}
