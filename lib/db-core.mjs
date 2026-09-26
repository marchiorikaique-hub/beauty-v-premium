// Abertura do SQLite (node:sqlite, nativo do Node >= 22) e migrações.
// JS puro porque também é usado pelo CLI scripts/admin.mjs dentro do container.
import { mkdirSync } from "node:fs";
import path from "node:path";

/** Pasta de dados persistentes (volume no container). */
export function dataDir() {
  return process.env.DATA_DIR || path.join(process.cwd(), ".data");
}

export function uploadsDir() {
  return path.join(dataDir(), "uploads");
}

export function backupsDir() {
  return path.join(dataDir(), "backups");
}

const NOW = "strftime('%Y-%m-%dT%H:%M:%fZ','now')";

/** Cada item roda uma vez, em ordem; o índice + 1 vira o PRAGMA user_version. */
const MIGRATIONS = [
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    password_changed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    updated_at TEXT NOT NULL DEFAULT (${NOW})
  );
  CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    expires_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL DEFAULT (${NOW}),
    user_agent TEXT NOT NULL DEFAULT '',
    ip TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX sessions_user ON sessions(user_id);
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    blurb TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0,
    visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    updated_at TEXT NOT NULL DEFAULT (${NOW})
  );
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '',
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    blurb TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    detail TEXT NOT NULL DEFAULT '',
    price_cents INTEGER,
    compare_at_cents INTEGER,
    visible INTEGER NOT NULL DEFAULT 1,
    in_stock INTEGER NOT NULL DEFAULT 1,
    featured INTEGER NOT NULL DEFAULT 0,
    is_new INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    updated_at TEXT NOT NULL DEFAULT (${NOW})
  );
  CREATE INDEX products_category ON products(category_id);
  CREATE INDEX products_deleted ON products(deleted_at);
  CREATE TABLE product_images (
    id INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    cutout INTEGER NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    position INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX product_images_product ON product_images(product_id);
  CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  `,
];

/** @param {string} [file] */
export function openDatabase(file) {
  const dir = dataDir();
  mkdirSync(dir, { recursive: true });
  const { DatabaseSync } = process.getBuiltinModule("node:sqlite");
  const db = new DatabaseSync(file || path.join(dir, "app.db"));
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA busy_timeout = 5000");
  db.exec("PRAGMA synchronous = NORMAL");
  migrate(db);
  return db;
}

/** @param {import('node:sqlite').DatabaseSync} db */
export function migrate(db) {
  const row = /** @type {{ user_version: number }} */ (db.prepare("PRAGMA user_version").get());
  let version = Number(row.user_version) || 0;
  while (version < MIGRATIONS.length) {
    db.exec("BEGIN IMMEDIATE");
    try {
      db.exec(MIGRATIONS[version]);
      version += 1;
      db.exec(`PRAGMA user_version = ${version}`);
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }
}
