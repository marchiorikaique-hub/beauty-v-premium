import { ProductForm } from "@/components/admin/ProductForm";
import { requireUser } from "@/lib/auth";
import { listCategories } from "@/lib/repo";

export const metadata = { title: "Novo produto" };

export default async function NewProductPage() {
  await requireUser();
  const categories = listCategories().map((c) => ({ id: c.id, name: c.name }));
  return <ProductForm product={null} categories={categories} />;
}
