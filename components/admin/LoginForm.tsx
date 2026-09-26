"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Alert, Eye, EyeOff } from "../icons";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      {notice && !state.error && (
        <p role="status" className="rounded-xl bg-success-soft px-3.5 py-2.5 text-sm text-success">
          {notice}
        </p>
      )}
      {state.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          <Alert size={18} className="mt-px shrink-0" />
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="l-email" className="adm-label">
          E-mail
        </label>
        <input
          id="l-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          defaultValue={state.email ?? ""}
          className="adm-input"
          aria-invalid={!!state.error || undefined}
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="l-pass" className="adm-label">
          Senha
        </label>
        <div className="relative">
          <input
            id="l-pass"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            className="adm-input !pr-12"
            aria-invalid={!!state.error || undefined}
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-taupe-deep hover:text-vinho"
            aria-label={show ? "Esconder senha" : "Mostrar senha"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <Submit />
    </form>
  );
}
