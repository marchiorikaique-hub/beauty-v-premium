import { TrashList } from "@/components/admin/TrashList";
import { requireUser } from "@/lib/auth";
import { listAdminProducts } from "@/lib/repo";

export const metadata = { title: "Lixeira" };

export default async function TrashPage() {
  await requireUser();
  return <TrashList products={listAdminProducts({ trash: true })} />;
}
