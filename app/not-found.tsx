export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-offwhite px-5 text-center">
      <img src="/brand/badge.webp" alt="Beauty V Premium" width={72} height={72} className="rounded-full" />
      <h1 className="font-display text-4xl text-ink">Página não encontrada</h1>
      <p className="max-w-sm text-espresso/75">O endereço pode estar errado ou a página mudou de lugar.</p>
      <a href="/" className="btn btn-primary">
        Voltar pra loja
      </a>
    </main>
  );
}
