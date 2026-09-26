#!/usr/bin/env node
// CLI de usuários do painel. A senha SEMPRE entra pela entrada padrão
// (digitada escondida no terminal ou via pipe), nunca como argumento:
// argumento fica no histórico do shell e na lista de processos.
//
//   node scripts/admin.mjs list
//   node scripts/admin.mjs create --email ela@x.com --name "Vick"     (pede a senha)
//   node scripts/admin.mjs set-password --email ela@x.com             (redefine; desloga tudo)
//   node scripts/admin.mjs verify --email ela@x.com                   (confere senha, não loga)
//   node scripts/admin.mjs logout-all --email ela@x.com
//
// No container: docker exec -it <ctr> node scripts/admin.mjs ...
import { openDatabase } from "../lib/db-core.mjs";
import { hashPassword, verifyPassword, PASSWORD_MIN } from "../lib/password.mjs";

const [, , cmd, ...rest] = process.argv;
const args = {};
for (let i = 0; i < rest.length; i += 2) {
  if (rest[i]?.startsWith("--")) args[rest[i].slice(2)] = rest[i + 1] ?? "";
}

function fail(msg) {
  console.error(`erro: ${msg}`);
  process.exit(1);
}

async function readPassword(prompt) {
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    return Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
  }
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    let value = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n" || ch === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        process.exit(130);
      } else if (ch === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    process.stdin.on("data", onData);
  });
}

async function newPassword() {
  const pw = await readPassword("Senha: ");
  if (pw.length < PASSWORD_MIN) fail(`a senha precisa ter pelo menos ${PASSWORD_MIN} caracteres`);
  if (process.stdin.isTTY) {
    const again = await readPassword("Repita a senha: ");
    if (again !== pw) fail("as senhas não conferem");
  }
  return pw;
}

const db = openDatabase();
const email = (args.email || "").trim().toLowerCase();
const findUser = () => db.prepare("SELECT id, email, name FROM users WHERE email = ?").get(email);

switch (cmd) {
  case "list": {
    const rows = db
      .prepare(
        `SELECT u.email, u.name, u.created_at, u.password_changed_at,
          (SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id) AS sessions
         FROM users u ORDER BY u.id`,
      )
      .all();
    if (rows.length === 0) console.log("(nenhum usuário)");
    for (const r of rows) {
      console.log(
        `${r.email}  nome="${r.name}"  criado=${r.created_at}  senha_trocada_pela_dona=${r.password_changed_at ? "sim" : "não"}  sessoes=${r.sessions}`,
      );
    }
    break;
  }
  case "create": {
    if (!email.includes("@")) fail("informe --email");
    if (findUser()) fail("já existe usuário com esse e-mail (use set-password)");
    const hash = await hashPassword(await newPassword());
    db.prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)").run(email, (args.name || "").trim(), hash);
    console.log(`ok: usuário ${email} criado`);
    break;
  }
  case "set-password": {
    const user = findUser();
    if (!user) fail("usuário não encontrado");
    const hash = await hashPassword(await newPassword());
    db.prepare("UPDATE users SET password_hash = ?, password_changed_at = NULL, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(hash, user.id);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
    console.log(`ok: senha de ${email} redefinida e todas as sessões encerradas`);
    break;
  }
  case "verify": {
    const row = db.prepare("SELECT password_hash FROM users WHERE email = ?").get(email);
    if (!row) fail("usuário não encontrado");
    const ok = await verifyPassword(await readPassword("Senha: "), row.password_hash);
    console.log(ok ? "ok: senha confere" : "FALHOU: senha não confere");
    process.exit(ok ? 0 : 2);
    break;
  }
  case "logout-all": {
    const user = findUser();
    if (!user) fail("usuário não encontrado");
    const res = db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
    console.log(`ok: ${res.changes} sessão(ões) encerrada(s)`);
    break;
  }
  default:
    console.log("uso: node scripts/admin.mjs <list|create|set-password|verify|logout-all> [--email x] [--name y]");
    process.exit(cmd ? 1 : 0);
}
