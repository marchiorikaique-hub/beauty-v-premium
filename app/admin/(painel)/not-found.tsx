export default function AdminNotFound() {
  return (
    <div className="adm-card mx-auto flex max-w-lg flex-col items-center gap-3 px-6 py-14 text-center">
      <h1 className="text-xl">Não encontrado</h1>
      <p className="text-sm text-espresso/75">Esse produto não existe mais ou está na lixeira.</p>
      <div className="mt-2 flex gap-2.5">
        <a href="/admin" className="btn btn-primary btn-sm">Ver produtos</a>
        <a href="/admin/lixeira" className="btn btn-ghost btn-sm">Abrir lixeira</a>
      </div>
    </div>
  );
}
