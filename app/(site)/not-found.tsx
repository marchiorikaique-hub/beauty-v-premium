import { Sparkle } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <Sparkle size={30} className="text-gold" />
      <h1 className="font-display text-4xl text-ink sm:text-5xl">Esse produto saiu da vitrine</h1>
      <p className="max-w-md text-espresso/75">
        Pode ter esgotado ou mudado de lugar. Dá uma olhada no catálogo, tem muita coisa linda por lá.
      </p>
      <a href="/#catalogo" className="btn btn-primary mt-2">
        Ver o catálogo
      </a>
    </div>
  );
}
