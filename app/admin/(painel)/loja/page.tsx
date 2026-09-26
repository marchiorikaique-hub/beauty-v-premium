import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/repo";

export const metadata = { title: "Loja" };

export default async function StoreSettingsPage() {
  await requireUser();
  return <SettingsForm settings={getSettings()} />;
}
