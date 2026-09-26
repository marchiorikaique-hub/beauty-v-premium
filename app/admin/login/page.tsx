import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ next?: string; saiu?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (await getCurrentUser()) redirect("/admin");
  const { next = "", saiu } = await searchParams;
  const notice = saiu === "todos" ? "Pronto: você saiu de todos os aparelhos." : undefined;

  return (
    <main
      className="admin flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(110% 70% at 50% 0%, var(--color-champagne-soft) 0%, var(--color-offwhite) 60%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/brand/badge.webp" alt="Beauty V Premium" width={72} height={72} className="h-[72px] w-[72px] rounded-full shadow-[0_14px_30px_-16px_rgba(85,21,32,0.8)]" />
          <h1 className="mt-4 text-2xl">Painel Beauty V</h1>
          <p className="mt-1 text-sm text-taupe-deep">Entre pra cuidar dos produtos da loja.</p>
        </div>
        <div className="adm-card p-6">
          <LoginForm next={next} notice={notice} />
        </div>
        <p className="mt-5 text-center text-sm text-taupe-deep">
          Esqueceu a senha? Peça pra quem criou seu acesso redefinir.
        </p>
        <p className="mt-3 text-center">
          <a href="/" className="text-sm font-medium text-vinho underline-offset-4 hover:underline">
            Voltar pra loja
          </a>
        </p>
      </div>
    </main>
  );
}
