"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  /** texto de apoio embaixo do rótulo */
  description?: string;
  disabled?: boolean;
  /** esconde o rótulo visualmente (fica só pra leitor de tela) */
  compact?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled, compact }: SwitchProps) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={compact ? label : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-vinho" : "bg-taupe/60"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (compact) return control;

  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-2">
      <span className="min-w-0">
        <span className="block text-[0.95rem] font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-taupe-deep">{description}</span>}
      </span>
      {control}
    </label>
  );
}
