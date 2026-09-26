"use client";

import { useState, useTransition } from "react";
import { changePasswordAction, logoutAction, logoutAllAction } from "@/app/admin/actions";
import type { AdminUser } from "@/lib/types";
import { Alert, Eye, EyeOff, Logout } from "../icons";
import { useToast } from "./Toast";

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  help,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete: string;
  help?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="adm-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="adm-input !pr-12"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={!!error || undefined}
          maxLength={200}
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
      {error ? <p className="adm-error">{error}</p> : help ? <p className="adm-help">{help}</p> : null}
    </div>
  );
}

export function AccountPanel({ user, sessions }: { user: AdminUser; sessions: number }) {
  const toast = useToast();
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const [changed, setChanged] = useState(false);

  function submit() {
    start(async () => {
      const res = await changePasswordAction(pwd);
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast(res.error, "error");
        return;
      }
      setErrors({});
      setPwd({ current: "", next: "", confirm: "" });
      setChanged(true);
      toast(res.message ?? "Senha alterada.");
    });
  }

  const showBanner = !user.passwordChangedAt && !changed;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-[1.75rem]">Minha conta</h1>
        <p className="mt-1 text-sm text-taupe-deep">{user.email}</p>
      </div>

      {showBanner && (
        <div className="mb-5 flex gap-3 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3.5 text-sm text-warning">
          <Alert size={20} className="mt-px shrink-0" />
          <p>
            <strong className="font-semibold">Troque sua senha.</strong> Ela foi criada por outra pessoa e enviada por
            mensagem. Escolha uma só sua, que ninguém mais saiba.
          </p>
        </div>
      )}

      <section className="adm-card p-5 sm:p-6" aria-labelledby="a-senha">
        <h2 id="a-senha" className="text-lg">
          Trocar senha
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!pending) submit();
          }}
          className="mt-4 flex flex-col gap-4"
          noValidate
        >
          <input type="email" name="username" autoComplete="username" value={user.email} readOnly hidden />
          <PasswordField
            id="p-current"
            label="Senha atual"
            value={pwd.current}
            onChange={(v) => setPwd({ ...pwd, current: v })}
            error={errors.current}
            autoComplete="current-password"
          />
          <PasswordField
            id="p-next"
            label="Nova senha"
            value={pwd.next}
            onChange={(v) => setPwd({ ...pwd, next: v })}
            error={errors.next}
            autoComplete="new-password"
            help="Pelo menos 8 caracteres. Uma frase curta fica forte e fácil de lembrar."
          />
          <PasswordField
            id="p-confirm"
            label="Repita a nova senha"
            value={pwd.confirm}
            onChange={(v) => setPwd({ ...pwd, confirm: v })}
            error={errors.confirm}
            autoComplete="new-password"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary btn-sm min-w-[9rem]"
              disabled={pending || !pwd.current || !pwd.next || !pwd.confirm}
            >
              {pending ? "Salvando..." : "Trocar senha"}
            </button>
          </div>
        </form>
      </section>

      <section className="adm-card mt-5 p-5 sm:p-6" aria-labelledby="a-aparelhos">
        <h2 id="a-aparelhos" className="text-lg">
          Aparelhos conectados
        </h2>
        <p className="mt-1.5 text-sm text-espresso/80">
          Sua conta está aberta em {sessions} {sessions === 1 ? "aparelho" : "aparelhos"}. O login dura 30 dias em cada um.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <form action={logoutAction}>
            <button type="submit" className="btn btn-ghost btn-sm">
              <Logout size={17} />
              Sair deste aparelho
            </button>
          </form>
          {sessions > 1 && (
            <form action={logoutAllAction}>
              <button type="submit" className="btn btn-ghost btn-sm">
                Sair de todos os aparelhos
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
