import { WhatsApp } from "./icons";
import { waGeneral } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={waGeneral}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Beauty V Premium no WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-vinho py-3.5 pl-4 pr-4 text-champagne-soft shadow-[0_18px_40px_-16px_rgba(85,21,32,0.9)] ring-1 ring-gold/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-vinho-deep hover:pr-5 sm:bottom-7 sm:right-7"
    >
      <WhatsApp size={24} className="shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-2.5 group-hover:max-w-[10rem] group-hover:opacity-100">
        Fale com a gente
      </span>
    </a>
  );
}
