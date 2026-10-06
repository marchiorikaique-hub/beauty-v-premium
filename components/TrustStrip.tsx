import { BagHeart, Calendar, Card, ChatHeart } from "./icons";

// Só o que é verdade na loja dela (sem prometer frete grátis ou parcelamento).
const items = [
  { icon: BagHeart, label: "Pronta-entrega" },
  { icon: Calendar, label: "Novidades toda semana" },
  { icon: ChatHeart, label: "Atendimento no WhatsApp" },
  { icon: Card, label: "Várias formas de pagamento" },
];

export function TrustStrip() {
  return (
    <section aria-label="Por que comprar com a gente" className="border-b border-gold/20 bg-champagne-soft/70">
      <ul className="shell grid grid-cols-2 gap-x-4 gap-y-5 py-6 sm:py-7 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center justify-center gap-3 text-left">
            <Icon size={26} className="shrink-0 text-vinho" />
            <span className="max-w-[9rem] text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.16em] text-espresso">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
