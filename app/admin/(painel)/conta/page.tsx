import { AccountPanel } from "@/components/admin/AccountPanel";
import { countSessions, requireUser } from "@/lib/auth";

export const metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const user = await requireUser();
  return <AccountPanel user={user} sessions={countSessions(user.id)} />;
}
