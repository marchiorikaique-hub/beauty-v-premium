import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { ToastProvider } from "@/components/admin/Toast";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <ToastProvider>
      <div className="admin min-h-screen bg-offwhite lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <AdminNav email={user.email} />
        <main className="px-4 pb-36 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
