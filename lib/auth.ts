import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import type { AdminUser } from "./types";

export const SESSION_COOKIE = "bv_session";
const SESSION_DAYS = 30;

type Row = Record<string, unknown>;

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function secureCookies(): boolean {
  return process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1";
}

export function clientIpFrom(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim().slice(0, 64);
  return (h.get("x-real-ip") ?? "local").slice(0, 64);
}

export async function clientIp(): Promise<string> {
  return clientIpFrom(await headers());
}

function mapUser(r: Row): AdminUser {
  return {
    id: Number(r.id),
    email: String(r.email),
    name: String(r.name ?? ""),
    passwordChangedAt: r.password_changed_at == null ? null : String(r.password_changed_at),
  };
}

export function findUserByEmail(email: string): (AdminUser & { passwordHash: string }) | null {
  const r = db().prepare("SELECT * FROM users WHERE email = ?").get(email.trim()) as Row | undefined;
  return r ? { ...mapUser(r), passwordHash: String(r.password_hash) } : null;
}

export function getPasswordHash(userId: number): string | null {
  const r = db().prepare("SELECT password_hash FROM users WHERE id = ?").get(userId) as Row | undefined;
  return r ? String(r.password_hash) : null;
}

/** Cria a sessão e grava o cookie. Só pode ser chamado em Server Action / Route Handler. */
export async function startSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  db()
    .prepare("INSERT INTO sessions (id, user_id, expires_at, user_agent, ip) VALUES (?, ?, ?, ?, ?)")
    .run(tokenHash(token), userId, expires.toISOString(), (h.get("user-agent") ?? "").slice(0, 200), clientIpFrom(h));
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: "lax",
    path: "/",
    expires,
  });
}

async function currentSessionId(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? tokenHash(token) : null;
}

/** Usuário logado (ou null). Pode ser usado em qualquer lugar do servidor. */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const sid = await currentSessionId();
  if (!sid) return null;
  const r = db()
    .prepare(
      `SELECT u.*, s.expires_at, s.last_seen_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?`,
    )
    .get(sid) as Row | undefined;
  if (!r) return null;
  if (new Date(String(r.expires_at)).getTime() < Date.now()) {
    db().prepare("DELETE FROM sessions WHERE id = ?").run(sid);
    return null;
  }
  if (Date.now() - new Date(String(r.last_seen_at)).getTime() > 10 * 60_000) {
    db().prepare("UPDATE sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(sid);
  }
  return mapUser(r);
}

/** Protege páginas e ações do painel: sem sessão, volta pro login. */
export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function endSession() {
  const sid = await currentSessionId();
  if (sid) db().prepare("DELETE FROM sessions WHERE id = ?").run(sid);
  (await cookies()).delete(SESSION_COOKIE);
}

/** Troca a senha e derruba as outras sessões (fica só este aparelho logado). */
export async function setPassword(userId: number, passwordHash: string) {
  const sid = await currentSessionId();
  const conn = db();
  conn
    .prepare(
      "UPDATE users SET password_hash = ?, password_changed_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?",
    )
    .run(passwordHash, userId);
  conn.prepare("DELETE FROM sessions WHERE user_id = ? AND id IS NOT ?").run(userId, sid);
}

export async function endAllSessions(userId: number) {
  db().prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  (await cookies()).delete(SESSION_COOKIE);
}

export function countSessions(userId: number): number {
  const r = db()
    .prepare("SELECT COUNT(*) AS n FROM sessions WHERE user_id = ? AND expires_at > strftime('%Y-%m-%dT%H:%M:%fZ','now')")
    .get(userId) as Row;
  return Number(r.n);
}

export function purgeExpiredSessions() {
  db().prepare("DELETE FROM sessions WHERE expires_at < strftime('%Y-%m-%dT%H:%M:%fZ','now')").run();
}
