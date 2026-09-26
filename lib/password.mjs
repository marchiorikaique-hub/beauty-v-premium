// Hash de senha com scrypt (nativo do Node). Usado pelo app e pelo CLI
// scripts/admin.mjs, por isso é JS puro. Formato guardado no banco:
//   scrypt$N$r$p$<salt base64url>$<hash base64url>
// A senha em texto nunca é gravada em lugar nenhum.
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";

const N = 32768;
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 128 * N * R * 2;

/** @param {string} password @param {Buffer} salt @param {number} n @param {number} r @param {number} p */
function derive(password, salt, n, r, p) {
  return new Promise((resolve, reject) => {
    scryptCb(password.normalize("NFKC"), salt, KEYLEN, { N: n, r, p, maxmem: MAXMEM }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

/** @param {string} password @returns {Promise<string>} */
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = /** @type {Buffer} */ (await derive(password, salt, N, R, P));
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

/** @param {string} password @param {string} stored @returns {Promise<boolean>} */
export async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, "base64url");
  const key = /** @type {Buffer} */ (
    await derive(password, Buffer.from(saltB64, "base64url"), Number(n), Number(r), Number(p))
  );
  return key.length === expected.length && timingSafeEqual(key, expected);
}

// Hash fixo pra gastar o mesmo tempo quando o e-mail não existe (evita
// descobrir quais e-mails têm conta pelo tempo de resposta).
let dummy = "";
/** @param {string} password */
export async function burnTime(password) {
  if (!dummy) dummy = await hashPassword("placeholder-nao-usado");
  await verifyPassword(password, dummy);
}

export const PASSWORD_MIN = 8;
