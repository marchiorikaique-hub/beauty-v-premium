import { ProductForm } from "@/components/admin/ProductForm";
import { requireUser } from "@/lib/auth";
import { categoryChoices } from "@/lib/repo";

export const metadata = { title: "Novo produto" };

export default async function NewProductPage() {
  await requireUser();
  const categories = categoryChoices();
  return <ProductForm product={null} categories={categories} />;
}
