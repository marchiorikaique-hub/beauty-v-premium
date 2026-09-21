import { Logo } from "./Logo";
import { WhatsApp, Instagram } from "./icons";
import { site, waGeneral } from "@/lib/site";

const categorias = [
  { label: "Maquiagem", href: "#cat-maquiagem" },
  { label: "Skincare", href: "#cat-skincare" },
  { label: "Perfumaria", href: "#cat-perfumaria" },
  { label: "Acessórios", href: "#cat-acessorios" },
];

const navegacao = [
  { label: "Catálogo", href: "#catalogo" },
  { label: "Sobre a marca", href: "#sobre" },
  { label: "Início", href: "#top" },
];

export function Footer() {
  const year = 2026;
  return (
    <footer className="bg-vinho-deep text-champagne/80">
      <div className="shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo tone="light" badge={48} />
          <p className="mt-5 text-sm leading-relaxed text-champagne/70">
            Beleza e cosméticos com pronta-entrega. Make, skincare, perfumaria e
            novidades toda semana, com atendimento pelo WhatsApp.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={waGeneral}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-champagne/10 text-champagne-soft transition-colors hover:bg-champagne/20"
            >
              <WhatsApp size={19} />
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir o Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-champagne/10 text-champagne-soft transition-colors hover:bg-champagne/20"
            >
              <Instagram size={19} />
            </a>
          </div>
        </div>

        <nav aria-label="Categorias">
          <h3 className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-gold-soft">
            Categorias
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {categorias.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-champagne/75 transition-colors hover:text-champagne-soft"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Navegação">
          <h3 className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-gold-soft">
            Navegar
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {navegacao.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-champagne/75 transition-colors hover:text-champagne-soft"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-gold-soft">
            Contato
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <a
                href={waGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne/75 transition-colors hover:text-champagne-soft"
              >
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne/75 transition-colors hover:text-champagne-soft"
              >
                @{site.instagramHandle}
              </a>
            </li>
            <li className="text-champagne/60">{site.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-champagne/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-champagne/55 sm:flex-row">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <p>Pedidos e pagamento combinados no WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}
