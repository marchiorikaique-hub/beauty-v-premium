"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { cartWhatsappLink } from "@/lib/cart";
import { formatBRL } from "@/lib/format";
import { BagHeart, Check, Close, Minus, Plus, Sparkle, WhatsApp } from "../icons";

export function CartDrawer() {
  const cart = useCart();
  const { rows, count, cents, unpriced, open, setOpen } = cart;
  const ref = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setSent(false);
      d.showModal();
    }
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const live = rows.filter((r) => r.available);
  const soldOut = rows.filter((r) => !r.available);
  const href = cartWhatsappLink(cart.whatsapp, rows);

  return (
    <dialog
      ref={ref}
      className="cart-drawer"
      aria-labelledby="cart-title"
      onClose={() => setOpen(false)}
      onClick={(e) => {
        // clique fora do painel (no fundo escurecido) fecha
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-4 sm:px-6">
          <h2 id="cart-title" className="font-display text-2xl text-ink">
            Seu carrinho
            {count > 0 && <span className="ml-2 align-middle font-sans text-sm font-medium text-taupe-deep">{count} {count === 1 ? "item" : "itens"}</span>}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full text-espresso transition-colors hover:bg-champagne-soft hover:text-vinho"
            aria-label="Fechar carrinho"
          >
            <Close />
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-champagne-soft text-vinho">
              <BagHeart size={28} />
            </span>
            <p className="font-display text-2xl text-ink">Seu carrinho está vazio</p>
            <p className="max-w-xs text-sm text-espresso/75">
              Escolha os queridinhos no catálogo. No fim, o pedido vai prontinho pro nosso WhatsApp.
            </p>
            <a href="/#catalogo" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
              Ver catálogo
            </a>
          </div>
        ) : sent ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-vinho text-champagne-soft">
              <Check size={28} />
            </span>
            <p className="font-display text-2xl text-ink">Pedido aberto no WhatsApp</p>
            <p className="max-w-xs text-sm text-espresso/75">
              É só enviar a mensagem que a gente responde com o pagamento e a entrega. Já enviou? Pode esvaziar o carrinho.
            </p>
            <div className="mt-2 flex w-full max-w-xs flex-col gap-2.5">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  cart.clear();
                  setOpen(false);
                }}
              >
                Já enviei, esvaziar carrinho
              </button>
              <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <WhatsApp size={18} />
                Abrir de novo
              </a>
              <button type="button" className="mt-1 text-sm font-medium text-vinho hover:underline" onClick={() => setSent(false)}>
                Voltar pro carrinho
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-espresso/8 overflow-y-auto overscroll-contain px-5 sm:px-6">
              {[...live, ...soldOut].map((r) => (
                <li key={`${r.productId}-${r.variant}`} className={`flex gap-4 py-4 ${r.available ? "" : "opacity-60"}`}>
                  <a
                    href={`/produto/${r.product.slug}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl"
                    style={{ background: "radial-gradient(78% 70% at 50% 42%, var(--color-champagne-soft) 0%, var(--color-cream) 80%)" }}
                    onClick={() => setOpen(false)}
                  >
                    {r.image && (
                      <img
                        src={r.image}
                        alt=""
                        className="h-full w-full object-contain p-1.5"
                      />
                    )}
                  </a>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <a
                          href={`/produto/${r.product.slug}`}
                          onClick={() => setOpen(false)}
                          className="line-clamp-2 font-display text-lg leading-tight text-ink hover:text-vinho"
                        >
                          {r.product.name}
                        </a>
                        {r.variant && (
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-espresso/80">
                            {r.color && (
                              <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-espresso/15" style={{ background: r.color }} />
                            )}
                            {r.product.variantLabel || "Opção"}: {r.variant}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 text-right text-sm font-semibold text-ink">
                        {!r.available ? "Esgotou" : r.lineCents == null ? <span className="font-medium text-espresso/70">A confirmar</span> : formatBRL(r.lineCents)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      {r.available ? (
                        <div className="flex items-center rounded-full border border-espresso/15" role="group" aria-label={`Quantidade de ${r.product.name}`}>
                          <button
                            type="button"
                            onClick={() => cart.setQty(r, r.qty - 1)}
                            className="grid h-9 w-9 place-items-center rounded-full text-espresso hover:text-vinho"
                            aria-label={r.qty === 1 ? `Tirar ${r.product.name} do carrinho` : "Diminuir quantidade"}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-7 text-center text-sm font-medium tabular-nums text-ink" aria-live="polite">
                            {r.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQty(r, r.qty + 1)}
                            disabled={r.qty >= 20}
                            className="grid h-9 w-9 place-items-center rounded-full text-espresso hover:text-vinho disabled:opacity-40"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-espresso/80">Fora do pedido</span>
                      )}
                      <button
                        type="button"
                        onClick={() => cart.remove(r)}
                        className="text-sm text-taupe-deep underline-offset-2 hover:text-vinho hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-espresso/10 bg-cream px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-espresso">{unpriced > 0 && cents > 0 ? "Total parcial" : "Total"}</span>
                <span className="text-2xl font-semibold text-ink">{cents > 0 || unpriced === 0 ? formatBRL(cents) : "A confirmar"}</span>
              </div>
              {unpriced > 0 && (
                <p className="mt-1 text-sm text-espresso/75">
                  {unpriced === 1 ? "1 item tem" : `${unpriced} itens têm`} valor confirmado no WhatsApp.
                </p>
              )}
              <p className="mt-2 flex items-start gap-2 text-sm text-espresso/75">
                <Sparkle size={14} className="mt-0.5 shrink-0 text-gold" />
                Pagamento e entrega você combina com a gente no WhatsApp.
              </p>
              {live.length > 0 ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSent(true)}
                  className="btn btn-primary mt-4 w-full py-4 text-base"
                >
                  <WhatsApp size={20} />
                  Finalizar pedido no WhatsApp
                </a>
              ) : (
                <p className="mt-4 rounded-2xl bg-champagne-soft px-4 py-3 text-sm text-espresso">
                  Os itens do carrinho esgotaram. Remova e escolha outros.
                </p>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-center text-sm font-medium text-vinho hover:underline"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
