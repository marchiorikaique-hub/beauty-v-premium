import { CategoryManager } from "@/components/admin/CategoryManager";
import { requireUser } from "@/lib/auth";
import { listCategories } from "@/lib/repo";

export const metadata = { title: "Categorias" };

export default async function CategoriesPage() {
  await requireUser();
  return <CategoryManager categories={listCategories()} />;
}
