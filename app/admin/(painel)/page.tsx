import { ProductList } from "@/components/admin/ProductList";
import { requireUser } from "@/lib/auth";
import { listAdminProducts, listCategories } from "@/lib/repo";

export const metadata = { title: "Produtos" };

export default async function ProductsPage() {
  await requireUser();
  const products = listAdminProducts();
  const categories = listCategories().map((c) => ({ id: c.id, name: c.name }));
  const trashCount = listAdminProducts({ trash: true }).length;
  return <ProductList products={products} categories={categories} trashCount={trashCount} />;
}
