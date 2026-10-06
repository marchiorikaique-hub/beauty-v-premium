import { Sparkle } from "./icons";

export function AnnouncementBar({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  // repete o bastante pra faixa nunca ficar vazia, mesmo com uma frase só
  const base = items.length < 4 ? [...items, ...items, ...items, ...items].slice(0, Math.max(4, items.length)) : items;
  const loop = [...base, ...base];
  return (
    <div className="satin-night">
      <div className="relative overflow-hidden py-2.5">
        <div className="marquee-track" aria-label={items.join(" · ")}>
          {loop.map((item, i) => (
            <span key={i} className="flex items-center" aria-hidden={i >= base.length || undefined}>
              <span className="px-5 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-gold-soft">{item}</span>
              <Sparkle size={10} className="text-rosa/80" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
