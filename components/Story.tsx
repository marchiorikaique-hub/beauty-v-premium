import { Reveal } from "./Reveal";
import { Sparkle } from "./icons";
import type { HomeContent } from "@/lib/types";

/** Faixa "Realce sua essência": foto na metade esquerda fundindo no cetim, texto do lado (como no mockup da dona). */
export function Story({ home }: { home: HomeContent }) {
  const img = home.storyImage;
  return (
    <section id="sobre" className="satin relative scroll-mt-24 overflow-hidden" aria-labelledby="story-title">
      {img && (
        <div aria-hidden className="photo-fade relative h-80 sm:h-[26rem] lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[52%]">
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
                  </div>
      )}

      <div className={`shell relative grid items-center ${img ? "pb-16 pt-2 lg:grid-cols-2 lg:py-28" : "py-20 lg:py-28"}`}>
        <Reveal className={img ? "lg:col-start-2 lg:pl-10" : "mx-auto text-center"}>
          <div className={`max-w-xl ${img ? "" : "mx-auto"}`}>
            <Sparkle size={22} className={`mb-6 text-gold-soft ${img ? "" : "mx-auto"}`} />
            <h2 id="story-title" className="text-champagne-soft">
              <span className="title-caps block text-[2.6rem] sm:text-[3.6rem]">{home.storyTitle}</span>
              {home.storyHighlight && (
                <span className="script -mt-1 block text-[3.2rem] text-gold-soft sm:text-[4.4rem]">{home.storyHighlight}</span>
              )}
            </h2>
            <p className="mt-6 max-w-prose whitespace-pre-line text-champagne/85">{home.storyText1}</p>
            {home.storyText2 && <p className="mt-4 max-w-prose whitespace-pre-line text-champagne/85">{home.storyText2}</p>}

            {home.storyPoints.length > 0 && (
              <ul className={`mt-8 flex flex-col gap-3 ${img ? "" : "items-center"}`}>
                {home.storyPoints.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-champagne">
                    <Sparkle size={13} className="shrink-0 text-gold-soft" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
