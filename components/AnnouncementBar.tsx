import { Sparkle } from "./icons";

const items = [
  "Pronta-entrega",
  "Novidades toda semana",
  "Marcas queridinhas",
  "Atendimento no WhatsApp",
  "Várias formas de pagamento",
];

export function AnnouncementBar() {
  const loop = [...items, ...items];
  return (
    <div className="bg-vinho text-champagne-soft">
      <div className="relative overflow-hidden py-2.5">
        <div className="marquee-track">
          {loop.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="px-4 text-[0.72rem] font-medium uppercase tracking-[0.22em]">
                {item}
              </span>
              <Sparkle size={11} className="text-gold-soft" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
