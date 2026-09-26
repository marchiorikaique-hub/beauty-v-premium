import type { DatabaseSync } from "node:sqlite";
import { openDatabase } from "./db-core.mjs";
import { seedCategories, seedProducts, seedSettings } from "./seed-data";

type Globals = typeof globalThis & { __bvDb?: DatabaseSync };

/** Conexão única (sobrevive ao hot reload do dev). */
export function db(): DatabaseSync {
  const g = globalThis as Globals;
  if (!g.__bvDb) {
    const conn = openDatabase();
    seedOnce(conn);
    g.__bvDb = conn;
  }
  return g.__bvDb;
}

/** Roda um bloco numa transação; desfaz tudo se der erro. */
export function tx<T>(fn: (conn: DatabaseSync) => T): T {
  const conn = db();
  conn.exec("BEGIN IMMEDIATE");
  try {
    const out = fn(conn);
    conn.exec("COMMIT");
    return out;
  } catch (err) {
    conn.exec("ROLLBACK");
    throw err;
  }
}

/**
 * Carga inicial com o catálogo que veio do Instagram. Marca `seeded_at` e nunca
 * mais roda, mesmo que a dona apague todas as categorias/produtos depois.
 */
function seedOnce(conn: DatabaseSync) {
  const done = conn.prepare("SELECT value FROM settings WHERE key = 'seeded_at'").get();
  if (done) return;

  conn.exec("BEGIN IMMEDIATE");
  try {
    const setSetting = conn.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    );
    for (const [key, value] of Object.entries(seedSettings)) {
      setSetting.run(key, JSON.stringify(value));
    }

    const insertCategory = conn.prepare(
      "INSERT INTO categories (slug, name, blurb, image, position, visible) VALUES (?, ?, ?, ?, ?, 1)",
    );
    const categoryIds = new Map<string, number>();
    seedCategories.forEach((c, i) => {
      const res = insertCategory.run(c.slug, c.name, c.blurb, c.image, i + 1);
      categoryIds.set(c.slug, Number(res.lastInsertRowid));
    });

    const insertProduct = conn.prepare(
      `INSERT INTO products (slug, name, brand, category_id, blurb, detail, position, visible, in_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)`,
    );
    const insertImage = conn.prepare(
      "INSERT INTO product_images (product_id, url, cutout, width, height, position) VALUES (?, ?, 1, 1000, 1000, 0)",
    );
    seedProducts.forEach((p, i) => {
      const res = insertProduct.run(
        p.slug,
        p.name,
        p.brand,
        categoryIds.get(p.category) ?? null,
        p.blurb,
        p.detail,
        (i + 1) * 10,
      );
      insertImage.run(Number(res.lastInsertRowid), p.image);
    });

    setSetting.run("seeded_at", JSON.stringify(new Date().toISOString()));
    conn.exec("COMMIT");
  } catch (err) {
    conn.exec("ROLLBACK");
    throw err;
  }
}
