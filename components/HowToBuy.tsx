import { Reveal } from "./Reveal";
import { Bag, WhatsApp, ChatHeart, Sparkle } from "./icons";
import { waGeneral } from "@/lib/site";

const steps = [
  {
    icon: Bag,
    title: "Escolha o produto",
    text: "Navegue pelo catálogo e separe os queridinhos que você quer.",
  },
  {
    icon: WhatsApp,
    title: "Chame no WhatsApp",
    text: "Toque em comprar e a mensagem já vai com o produto certinho.",
  },
  {
    icon: ChatHeart,
    title: "Combine tudo",
    text: "Tire dúvida de cor e aroma e escolha a forma de pagamento.",
  },
  {
    icon: Sparkle,
    title: "Receba rapidinho",
    text: "Como é pronta-entrega, o seu pedido sai voando pra você.",
  },
];

export function HowToBuy() {
  return (
    <section
      className="bg-champagne py-16 sm:py-24"
      aria-labelledby="how-title"
    >
      <div className="shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="how-title"
            className="font-display text-4xl text-ink sm:text-5xl"
          >
            Comprar é rapidinho
          </h2>
          <p className="mt-4 text-espresso/75">
            Do toque no produto ao seu pedido a caminho, tudo acontece numa
            conversa de WhatsApp.
          </p>
        </div>

        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* linha conectora (desktop) */}

          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 90} className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-vinho text-champagne-soft shadow-[0_16px_30px_-16px_rgba(85,21,32,0.85)]">
                  <Icon size={24} />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-cream font-display text-sm font-semibold text-vinho shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl text-ink">{title}</h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-espresso/75">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <a
            href={waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <WhatsApp size={18} />
            Começar meu pedido
          </a>
        </div>
      </div>
    </section>
  );
}
