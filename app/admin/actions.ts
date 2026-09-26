"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clientIp,
  endAllSessions,
  endSession,
  findUserByEmail,
  getPasswordHash,
  requireUser,
  setPassword,
  startSession,
} from "@/lib/auth";
import { burnTime, hashPassword, verifyPassword } from "@/lib/password.mjs";
import { blockedFor, hit, reset } from "@/lib/rate-limit";
import {
  createCategory,
  createProduct,
  deleteCategory,
  destroyProduct,
  duplicateProduct,
  getCategory,
  getProduct,
  moveCategory,
  moveProduct,
  restoreProduct,
  saveSettings,
  setProductFlag,
  trashProduct,
  updateCategory,
  updateProduct,
} from "@/lib/repo";
import { categorySchema, fieldErrors, passwordSchema, productSchema, settingsSchema } from "@/lib/validation";
import type { ProductFlag } from "@/lib/types";

export type ActionResult =
  | { ok: true; id?: number; message?: string }
  | { ok: false; error: string; fields?: Record<string, string> };

const INVALID = "Confira os campos destacados.";

function refresh() {
  revalidatePath("/", "layout");
}

/* ------------------------------ Login ------------------------------ */

export type LoginState = { error?: string; email?: string };

const WINDOW = 15 * 60_000;

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const next = String(form.get("next") ?? "");

  if (!email || !password) return { error: "Preencha e-mail e senha.", email };

  const ip = await clientIp();
  const ipKey = `login:ip:${ip}`;
  const emailKey = `login:email:${email}`;
  const wait = Math.max(blockedFor(ipKey, 8, WINDOW), blockedFor(emailKey, 20, WINDOW));
  if (wait) return { error: `Muitas tentativas. Tente de novo em ${wait} min.`, email };

  const user = findUserByEmail(email);
  const ok = user ? await verifyPassword(password, user.passwordHash) : (await burnTime(password), false);
  if (!user || !ok) {
    hit(ipKey);
    hit(emailKey);
    return { error: "E-mail ou senha incorretos.", email };
  }

  reset(emailKey);
  await startSession(user.id);
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

export async function logoutAllAction() {
  const user = await requireUser();
  await endAllSessions(user.id);
  redirect("/admin/login?saiu=todos");
}

/* ----------------------------- Produtos ----------------------------- */

export async function saveProductAction(id: number | null, input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: INVALID, fields: fieldErrors(parsed.error) };
  const data = parsed.data;
  if (data.categoryId != null && !getCategory(data.categoryId)) {
    return { ok: false, error: INVALID, fields: { categoryId: "Essa categoria não existe mais." } };
  }
  if (id == null) {
    const newId = createProduct(data);
    refresh();
    return { ok: true, id: newId, message: "Produto criado." };
  }
  const current = getProduct(id);
  if (!current || current.deletedAt) return { ok: false, error: "Esse produto não existe mais (pode ter ido pra lixeira)." };
  updateProduct(id, data);
  refresh();
  return { ok: true, id, message: "Alterações salvas." };
}

const FLAGS: ProductFlag[] = ["visible", "inStock", "featured", "isNew"];

export async function setProductFlagAction(id: number, flag: ProductFlag, value: boolean): Promise<ActionResult> {
  await requireUser();
  if (!FLAGS.includes(flag)) return { ok: false, error: "Opção inválida." };
  const p = getProduct(id);
  if (!p || p.deletedAt) return { ok: false, error: "Produto não encontrado." };
  if (flag === "visible" && value && p.images.length === 0) {
    return { ok: false, error: "Adicione uma foto antes de mostrar esse produto na loja." };
  }
  if (flag === "visible" && value && p.categoryId == null) {
    return { ok: false, error: "Escolha uma categoria antes de mostrar esse produto na loja." };
  }
  setProductFlag(id, flag, Boolean(value));
  refresh();
  return { ok: true };
}

export async function moveProductAction(id: number, dir: -1 | 1): Promise<ActionResult> {
  await requireUser();
  moveProduct(id, dir === -1 ? -1 : 1);
  refresh();
  return { ok: true };
}

export async function duplicateProductAction(id: number): Promise<ActionResult> {
  await requireUser();
  const newId = duplicateProduct(id);
  if (!newId) return { ok: false, error: "Produto não encontrado." };
  refresh();
  return { ok: true, id: newId, message: "Cópia criada (oculta até você revisar)." };
}

export async function trashProductAction(id: number): Promise<ActionResult> {
  await requireUser();
  trashProduct(id);
  refresh();
  return { ok: true, message: "Produto movido pra lixeira." };
}

export async function restoreProductAction(id: number): Promise<ActionResult> {
  await requireUser();
  restoreProduct(id);
  refresh();
  return { ok: true, message: "Produto restaurado." };
}

export async function destroyProductAction(id: number): Promise<ActionResult> {
  await requireUser();
  destroyProduct(id);
  refresh();
  return { ok: true, message: "Produto excluído de vez." };
}

/* ---------------------------- Categorias ---------------------------- */

export async function saveCategoryAction(id: number | null, input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: INVALID, fields: fieldErrors(parsed.error) };
  if (id == null) {
    const newId = createCategory(parsed.data);
    refresh();
    return { ok: true, id: newId, message: "Categoria criada." };
  }
  if (!getCategory(id)) return { ok: false, error: "Categoria não encontrada." };
  updateCategory(id, parsed.data);
  refresh();
  return { ok: true, id, message: "Categoria salva." };
}

export async function deleteCategoryAction(id: number): Promise<ActionResult> {
  await requireUser();
  const res = deleteCategory(id);
  if (!res.ok) return { ok: false, error: res.reason };
  refresh();
  return { ok: true, message: "Categoria excluída." };
}

export async function moveCategoryAction(id: number, dir: -1 | 1): Promise<ActionResult> {
  await requireUser();
  moveCategory(id, dir === -1 ? -1 : 1);
  refresh();
  return { ok: true };
}

/* ------------------------------- Loja ------------------------------- */

export async function saveSettingsAction(input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: INVALID, fields: fieldErrors(parsed.error) };
  saveSettings(parsed.data);
  refresh();
  return { ok: true, message: "Configurações salvas." };
}

/* ------------------------------ Conta ------------------------------ */

export async function changePasswordAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: INVALID, fields: fieldErrors(parsed.error) };

  const key = `pwd:${user.id}`;
  const wait = blockedFor(key, 6, WINDOW);
  if (wait) return { ok: false, error: `Muitas tentativas. Tente de novo em ${wait} min.` };

  const stored = getPasswordHash(user.id);
  if (!stored || !(await verifyPassword(parsed.data.current, stored))) {
    hit(key);
    return { ok: false, error: INVALID, fields: { current: "Senha atual incorreta." } };
  }
  reset(key);
  await setPassword(user.id, await hashPassword(parsed.data.next));
  refresh();
  return { ok: true, message: "Senha alterada. Os outros aparelhos foram desconectados." };
}
