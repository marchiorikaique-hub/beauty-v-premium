import { asset } from "@/lib/assets";
import { ArrowRight, WhatsApp, Bag, Calendar, ChatHeart } from "./icons";
import { waGeneral } from "@/lib/site";

const trust = [
  { icon: Bag, label: "Pronta-entrega" },
  { icon: Calendar, label: "Novidades toda semana" },
  { icon: ChatHeart, label: "Atendimento no WhatsApp" },
];

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="shell hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title">
            Beleza premium,<br />
            <em>em pronta-entrega.</em>
          </h1>
          <p className="hero-description">
            Maquiagem, skincare, perfumaria e os queridinhos que viralizam,
            selecionados com carinho e prontinhos pra enviar. Novidades toda semana.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="btn btn-primary">
              Ver catálogo <ArrowRight size={18} />
            </a>
            <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="hero-contact">
              <WhatsApp size={18} /> Falar no WhatsApp
            </a>
          </div>
          <ul className="hero-trust">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label}><Icon size={18} /><span>{label}</span></li>
            ))}
          </ul>
        </div>
        <div className="hero-display">
          <div className="hero-product-stage">
            <span className="hero-availability">Pronta-entrega</span>
            <img src={asset("/products/p03.webp")} alt="Body Splash Glow, linha de fragrâncias da Beauty V Premium"
              width={520} height={520} fetchPriority="high" className="hero-product" />
            <a href="#cat-perfumaria" className="hero-caption">
              <span><span className="hero-product-name">Body Splash Glow</span><span>Seu próximo cheirinho favorito</span></span>
              <ArrowRight size={22} />
            </a>
          </div>
          <a href="#cat-maquiagem" className="hero-balm">
            <img src={asset("/products/p12.webp")} alt="Tinted Balm Feels Mood, Ruby Rose" width={120} height={120} />
            <span><span className="hero-balm-title">Tinted Balm</span><span>Cor + hidratação</span></span>
            <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}
