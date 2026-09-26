"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Alert, Check, Close } from "../icons";

type Tone = "success" | "error";
type ToastItem = { id: number; tone: Tone; text: string };

const Ctx = createContext<(text: string, tone?: Tone) => void>(() => {});

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (text: string, tone: Tone = "success") => {
      const id = ++seq.current;
      setItems((l) => [...l.slice(-2), { id, tone, text }]);
      setTimeout(() => dismiss(id), tone === "error" ? 6000 : 3500);
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-[0_18px_40px_-18px_rgba(44,35,32,0.55)] ${
              t.tone === "error" ? "bg-danger text-white" : "bg-ink text-champagne-soft"
            }`}
          >
            {t.tone === "error" ? <Alert size={18} className="mt-px shrink-0" /> : <Check size={18} className="mt-px shrink-0" />}
            <span className="flex-1">{t.text}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar aviso"
              className="-m-1 rounded-lg p-1 opacity-70 hover:opacity-100"
            >
              <Close size={16} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
