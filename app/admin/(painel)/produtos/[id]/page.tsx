import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireUser } from "@/lib/auth";
import { getProduct, categoryChoices } from "@/lib/repo";

export const metadata = { title: "Editar produto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const product = /^\d+$/.test(id) ? getProduct(Number(id)) : null;
  if (!product || product.deletedAt) notFound();
  const categories = categoryChoices();
  return <ProductForm key={product.updatedAt} product={product} categories={categories} />;
}
