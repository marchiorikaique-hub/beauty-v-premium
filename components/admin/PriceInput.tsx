"use client";

import { formatBRL } from "@/lib/format";

interface PriceInputProps {
  id: string;
  value: number | null;
  onChange: (cents: number | null) => void;
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
}

/** Digita só números e o valor vai se formando da direita pra esquerda: 1290 -> R$ 12,90. */
export function PriceInput({ id, value, onChange, invalid, describedBy, placeholder = "R$ 0,00" }: PriceInputProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className="adm-input tabular-nums"
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      value={value == null ? "" : formatBRL(value)}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 8);
        onChange(digits ? Number(digits) : null);
      }}
    />
  );
}
