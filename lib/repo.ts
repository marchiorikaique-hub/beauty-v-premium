import { db, tx } from "./db";
import { slugify } from "./format";
import { seedSettings } from "./seed-data";
import type {
  Category,
  CategoryNode,
  HomeContent,
  Product,
  ProductFlag,
  ProductImage,
  ProductVariant,
  StoreSettings,
} from "./types";

type Row = Record<string, unknown>;
const NOW = "strftime('%Y-%m-%dT%H:%M:%fZ','now')";

const num = (v: unknown) => (v == null ? null : Number(v));
const bool = (v: unknown) => Number(v) === 1;
const str = (v: unknown) => (v == null ? "" : String(v));

/* ------------------------------------------------------------------ */
/* Configurações da loja                                               */
/* ------------------------------------------------------------------ */

export function getSettings(): StoreSettings {
  const rows = db().prepare("SELECT key, value FROM settings").all() as Row[];
  const out: StoreSettings = {
    ...seedSettings,
    announcements: [...seedSettings.announcements],
    home: {
      ...seedSettings.home,
      heroSlides: seedSettings.home.heroSlides.map((x) => ({ ...x })),
      storyPoints: [...seedSettings.home.storyPoints],
    },
  };
  for (const r of rows) {
    const key = str(r.key) as keyof StoreSettings;
    if (!(key in out)) continue;
    try {
      const value = JSON.parse(str(r.value));
      // campos novos da home ganham o padrão até a dona salvar
      if (key === "home") out.home = { ...out.home, ...(value as Partial<HomeContent>) };
      else (out as unknown as Record<string, unknown>)[key] = value;
    } catch {
      /* valor corrompido: fica o padrão */
    }
  }
  return out;
}

export function saveSettings(s: Omit<StoreSettings, "home">) {
  tx((conn) => {
    const stmt = conn.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    );
    stmt.run("whatsapp", JSON.stringify(s.whatsapp));
    stmt.run("instagram", JSON.stringify(s.instagram));
    stmt.run("city", JSON.stringify(s.city));
    stmt.run("announcements", JSON.stringify(s.announcements));
  });
}

export function saveHome(home: HomeContent) {
  db()
    .prepare("INSERT INTO settings (key, value) VALUES ('home', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .run(JSON.stringify(home));
}

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

function mapCategory(r: Row): Category {
  return {
    id: Number(r.id),
    slug: str(r.slug),
    name: str(r.name),
    blurb: str(r.blurb),
    image: str(r.image),
    position: Number(r.position),
    visible: bool(r.visible),
    parentId: num(r.parent_id),
    productCount: Number(r.product_count ?? 0),
  };
}

const CATEGORY_ORDER = `ORDER BY COALESCE(p0.position, c.position) ASC, COALESCE(p0.id, c.id) ASC,
  c.parent_id IS NOT NULL, c.position ASC, c.id ASC`;

/** Principais na ordem, cada uma seguida das subcategorias dela. */
export function listCategories(opts: { onlyVisible?: boolean } = {}): Category[] {
  const rows = db()
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.deleted_at IS NULL) AS product_count
       FROM categories c LEFT JOIN categories p0 ON p0.id = c.parent_id
       ${opts.onlyVisible ? "WHERE c.visible = 1 AND (p0.id IS NULL OR p0.visible = 1)" : ""}
       ${CATEGORY_ORDER}`,
    )
    .all() as Row[];
  return rows.map(mapCategory);
}

/** Árvore pra loja (menu, filtros). Só o que está visível. */
export function categoryTree(categories: Category[]): CategoryNode[] {
  const roots = categories.filter((c) => c.parentId == null);
  return roots.map((r) => ({
    slug: r.slug,
    name: r.name,
    children: categories.filter((c) => c.parentId === r.id).map((c) => ({ slug: c.slug, name: c.name })),
  }));
}

export function getCategory(id: number): Category | null {
  const r = db()
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.deleted_at IS NULL) AS product_count
       FROM categories c WHERE c.id = ?`,
    )
    .get(id) as Row | undefined;
  return r ? mapCategory(r) : null;
}

function uniqueSlug(table: "products" | "categories", base: string, excludeId?: number): string {
  const root = slugify(base);
  const check = db().prepare(`SELECT id FROM ${table} WHERE slug = ? AND id IS NOT ?`);
  let slug = root;
  let n = 2;
  while (check.get(slug, excludeId ?? null)) {
    slug = `${root}-${n++}`;
  }
  return slug;
}

export interface CategoryInput {
  name: string;
  blurb: string;
  image: string;
  visible: boolean;
  parentId: number | null;
}

export function countChildren(id: number): number {
  const r = db().prepare("SELECT COUNT(*) AS n FROM categories WHERE parent_id = ?").get(id) as Row;
  return Number(r.n);
}

export function createCategory(input: CategoryInput): number {
  return tx((conn) => {
    const max = conn
      .prepare("SELECT COALESCE(MAX(position), 0) AS m FROM categories WHERE parent_id IS ?")
      .get(input.parentId) as Row;
    const res = conn
      .prepare(
        "INSERT INTO categories (slug, name, blurb, image, position, visible, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        uniqueSlug("categories", input.name),
        input.name,
        input.blurb,
        input.image,
        Number(max.m) + 1,
        input.visible ? 1 : 0,
        input.parentId,
      );
    return Number(res.lastInsertRowid);
  });
}

export function updateCategory(id: number, input: CategoryInput) {
  tx((conn) => {
    const cur = conn.prepare("SELECT parent_id FROM categories WHERE id = ?").get(id) as Row | undefined;
    const moved = cur != null && num(cur.parent_id) !== input.parentId;
    // mudou de lugar: entra no fim da lista nova
    const pos = moved
      ? Number(
          (conn.prepare("SELECT COALESCE(MAX(position), 0) AS m FROM categories WHERE parent_id IS ?").get(input.parentId) as Row).m,
        ) + 1
      : null;
    conn
      .prepare(
        `UPDATE categories SET name = ?, blurb = ?, image = ?, visible = ?, parent_id = ?,
          position = COALESCE(?, position), updated_at = ${NOW} WHERE id = ?`,
      )
      .run(input.name, input.blurb, input.image, input.visible ? 1 : 0, input.parentId, pos, id);
  });
}

/** Só apaga categoria sem produtos ativos e sem subcategorias. Produtos da lixeira ficam sem categoria. */
export function deleteCategory(id: number): { ok: true } | { ok: false; reason: string } {
  const cat = getCategory(id);
  if (!cat) return { ok: false, reason: "Categoria não encontrada." };
  const children = countChildren(id);
  if (children > 0) {
    return {
      ok: false,
      reason: `Essa categoria tem ${children} subcategoria(s). Exclua ou mova as subcategorias antes.`,
    };
  }
  if (cat.productCount > 0) {
    return {
      ok: false,
      reason: `Essa categoria ainda tem ${cat.productCount} produto(s). Mova ou exclua os produtos antes.`,
    };
  }
  db().prepare("DELETE FROM categories WHERE id = ?").run(id);
  return { ok: true };
}

/** Troca de lugar com a vizinha do mesmo nível (principais entre si, subs dentro da mesma principal). */
export function moveCategory(id: number, dir: -1 | 1) {
  tx((conn) => {
    const me = conn.prepare("SELECT parent_id FROM categories WHERE id = ?").get(id) as Row | undefined;
    if (!me) return;
    const rows = conn
      .prepare("SELECT id FROM categories WHERE parent_id IS ? ORDER BY position ASC, id ASC")
      .all(num(me.parent_id)) as Row[];
    const ids = rows.map((r) => Number(r.id));
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    const set = conn.prepare("UPDATE categories SET position = ? WHERE id = ?");
    ids.forEach((cid, idx) => set.run(idx + 1, cid));
  });
}

/* ------------------------------------------------------------------ */
/* Produtos                                                            */
/* ------------------------------------------------------------------ */

const PRODUCT_SELECT = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name,
    pc.slug AS parent_category_slug, pc.name AS parent_category_name
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN categories pc ON pc.id = c.parent_id`;

const PUBLIC_WHERE = `p.visible = 1 AND p.deleted_at IS NULL AND (p.category_id IS NULL OR c.visible = 1)
  AND (pc.id IS NULL OR pc.visible = 1)`;
const ORDER = `ORDER BY p.featured DESC, p.position ASC, p.id DESC`;

function attachImages(rows: Row[]): Product[] {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => Number(r.id));
  const imgRows = db()
    .prepare(
      `SELECT product_id, url, cutout, width, height FROM product_images
       WHERE product_id IN (${ids.map(() => "?").join(",")}) ORDER BY position ASC, id ASC`,
    )
    .all(...ids) as Row[];
  const byProduct = new Map<number, ProductImage[]>();
  for (const r of imgRows) {
    const pid = Number(r.product_id);
    const list = byProduct.get(pid) ?? [];
    list.push({ url: str(r.url), cutout: bool(r.cutout), width: num(r.width), height: num(r.height) });
    byProduct.set(pid, list);
  }
  const varRows = db()
    .prepare(
      `SELECT product_id, name, color, image, in_stock FROM product_variants
       WHERE product_id IN (${ids.map(() => "?").join(",")}) ORDER BY position ASC, id ASC`,
    )
    .all(...ids) as Row[];
  const variants = new Map<number, ProductVariant[]>();
  for (const r of varRows) {
    const pid = Number(r.product_id);
    const list = variants.get(pid) ?? [];
    list.push({ name: str(r.name), color: str(r.color), image: str(r.image), inStock: bool(r.in_stock) });
    variants.set(pid, list);
  }
  return rows.map((r) => ({
    id: Number(r.id),
    slug: str(r.slug),
    name: str(r.name),
    brand: str(r.brand),
    categoryId: num(r.category_id),
    categorySlug: r.category_slug == null ? null : str(r.category_slug),
    categoryName: r.category_name == null ? null : str(r.category_name),
    parentCategorySlug: r.parent_category_slug == null ? null : str(r.parent_category_slug),
    parentCategoryName: r.parent_category_name == null ? null : str(r.parent_category_name),
    blurb: str(r.blurb),
    description: str(r.description),
    detail: str(r.detail),
    priceCents: num(r.price_cents),
    compareAtCents: num(r.compare_at_cents),
    visible: bool(r.visible),
    inStock: bool(r.in_stock),
    featured: bool(r.featured),
    isNew: bool(r.is_new),
    position: Number(r.position),
    deletedAt: r.deleted_at == null ? null : str(r.deleted_at),
    images: byProduct.get(Number(r.id)) ?? [],
    variantLabel: str(r.variant_label),
    variants: variants.get(Number(r.id)) ?? [],
    createdAt: str(r.created_at),
    updatedAt: str(r.updated_at),
  }));
}

/** Produtos que aparecem na loja. */
export function listPublicProducts(): Product[] {
  const rows = db().prepare(`${PRODUCT_SELECT} WHERE ${PUBLIC_WHERE} ${ORDER}`).all() as Row[];
  return attachImages(rows);
}

export function getPublicProduct(slug: string): Product | null {
  const rows = db().prepare(`${PRODUCT_SELECT} WHERE p.slug = ? AND ${PUBLIC_WHERE}`).all(slug) as Row[];
  return attachImages(rows)[0] ?? null;
}

/** Painel: ativos (inclui ocultos) ou lixeira. */
export function listAdminProducts(opts: { trash?: boolean } = {}): Product[] {
  const where = opts.trash ? "p.deleted_at IS NOT NULL" : "p.deleted_at IS NULL";
  const order = opts.trash ? "ORDER BY p.deleted_at DESC" : ORDER;
  const rows = db().prepare(`${PRODUCT_SELECT} WHERE ${where} ${order}`).all() as Row[];
  return attachImages(rows);
}

export function getProduct(id: number): Product | null {
  const rows = db().prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).all(id) as Row[];
  return attachImages(rows)[0] ?? null;
}

export interface ProductInput {
  name: string;
  brand: string;
  categoryId: number | null;
  blurb: string;
  description: string;
  detail: string;
  priceCents: number | null;
  compareAtCents: number | null;
  visible: boolean;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  images: ProductImage[];
  variantLabel: string;
  variants: ProductVariant[];
}

function writeVariants(productId: number, variants: ProductVariant[]) {
  const conn = db();
  conn.prepare("DELETE FROM product_variants WHERE product_id = ?").run(productId);
  const ins = conn.prepare(
    "INSERT INTO product_variants (product_id, name, color, image, in_stock, position) VALUES (?, ?, ?, ?, ?, ?)",
  );
  variants.forEach((v, i) => ins.run(productId, v.name, v.color, v.image, v.inStock ? 1 : 0, i));
}

function writeImages(productId: number, images: ProductImage[]) {
  const conn = db();
  conn.prepare("DELETE FROM product_images WHERE product_id = ?").run(productId);
  const ins = conn.prepare(
    "INSERT INTO product_images (product_id, url, cutout, width, height, position) VALUES (?, ?, ?, ?, ?, ?)",
  );
  images.forEach((img, i) => ins.run(productId, img.url, img.cutout ? 1 : 0, img.width, img.height, i));
}

/** Produto novo entra no topo da lista (novidade aparece primeiro). */
export function createProduct(input: ProductInput): number {
  return tx((conn) => {
    const min = conn.prepare("SELECT COALESCE(MIN(position), 10) AS m FROM products").get() as Row;
    const res = conn
      .prepare(
        `INSERT INTO products (slug, name, brand, category_id, blurb, description, detail, price_cents,
          compare_at_cents, visible, in_stock, featured, is_new, position, variant_label)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        uniqueSlug("products", input.name),
        input.name,
        input.brand,
        input.categoryId,
        input.blurb,
        input.description,
        input.detail,
        input.priceCents,
        input.compareAtCents,
        input.visible ? 1 : 0,
        input.inStock ? 1 : 0,
        input.featured ? 1 : 0,
        input.isNew ? 1 : 0,
        Number(min.m) - 10,
        input.variants.length ? input.variantLabel : "",
      );
    const id = Number(res.lastInsertRowid);
    writeImages(id, input.images);
    writeVariants(id, input.variants);
    return id;
  });
}

/** O link do produto (slug) não muda ao editar, pra não quebrar o que já foi compartilhado. */
export function updateProduct(id: number, input: ProductInput) {
  tx((conn) => {
    conn
      .prepare(
        `UPDATE products SET name = ?, brand = ?, category_id = ?, blurb = ?, description = ?, detail = ?,
          price_cents = ?, compare_at_cents = ?, visible = ?, in_stock = ?, featured = ?, is_new = ?,
          variant_label = ?, updated_at = ${NOW}
         WHERE id = ?`,
      )
      .run(
        input.name,
        input.brand,
        input.categoryId,
        input.blurb,
        input.description,
        input.detail,
        input.priceCents,
        input.compareAtCents,
        input.visible ? 1 : 0,
        input.inStock ? 1 : 0,
        input.featured ? 1 : 0,
        input.isNew ? 1 : 0,
        input.variants.length ? input.variantLabel : "",
        id,
      );
    writeImages(id, input.images);
    writeVariants(id, input.variants);
  });
}

const FLAG_COLUMN: Record<ProductFlag, string> = {
  visible: "visible",
  inStock: "in_stock",
  featured: "featured",
  isNew: "is_new",
};

export function setProductFlag(id: number, flag: ProductFlag, value: boolean) {
  db()
    .prepare(`UPDATE products SET ${FLAG_COLUMN[flag]} = ?, updated_at = ${NOW} WHERE id = ? AND deleted_at IS NULL`)
    .run(value ? 1 : 0, id);
}

/** Troca de lugar com o vizinho (na mesma ordem da loja). Destaques só trocam entre si. */
export function moveProduct(id: number, dir: -1 | 1) {
  tx((conn) => {
    const rows = conn
      .prepare("SELECT id, featured FROM products WHERE deleted_at IS NULL ORDER BY featured DESC, position ASC, id DESC")
      .all() as Row[];
    const list = rows.map((r) => ({ id: Number(r.id), featured: Number(r.featured) }));
    const i = list.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length || list[j]!.featured !== list[i]!.featured) return;
    [list[i], list[j]] = [list[j]!, list[i]!];
    const set = conn.prepare("UPDATE products SET position = ? WHERE id = ?");
    list.forEach((p, idx) => set.run((idx + 1) * 10, p.id));
  });
}

export function duplicateProduct(id: number): number | null {
  const src = getProduct(id);
  if (!src) return null;
  return createProduct({
    name: `${src.name} (cópia)`.slice(0, 80),
    brand: src.brand,
    categoryId: src.categoryId,
    blurb: src.blurb,
    description: src.description,
    detail: src.detail,
    priceCents: src.priceCents,
    compareAtCents: src.compareAtCents,
    visible: false,
    inStock: src.inStock,
    featured: false,
    isNew: src.isNew,
    images: src.images,
    variantLabel: src.variantLabel,
    variants: src.variants,
  });
}

export function trashProduct(id: number) {
  db().prepare(`UPDATE products SET deleted_at = ${NOW}, updated_at = ${NOW} WHERE id = ?`).run(id);
}

export function restoreProduct(id: number) {
  db().prepare(`UPDATE products SET deleted_at = NULL, updated_at = ${NOW} WHERE id = ?`).run(id);
}

/** Exclusão definitiva: só pra quem já está na lixeira. */
export function destroyProduct(id: number) {
  db().prepare("DELETE FROM products WHERE id = ? AND deleted_at IS NOT NULL").run(id);
}

/** Apaga de vez o que está na lixeira há mais de `days` dias. */
export function purgeTrash(days = 30): number {
  const res = db()
    .prepare("DELETE FROM products WHERE deleted_at IS NOT NULL AND deleted_at < strftime('%Y-%m-%dT%H:%M:%fZ','now', ?)")
    .run(`-${days} days`);
  return Number(res.changes);
}

/** Todas as URLs de imagem em uso (produtos, inclusive lixeira, categorias e home). */
export function referencedMedia(): Set<string> {
  const rows = db()
    .prepare("SELECT url AS u FROM product_images UNION SELECT image AS u FROM categories")
    .all() as Row[];
  const out = new Set(rows.map((r) => str(r.u)));
  const home = getSettings().home;
  for (const slide of home.heroSlides) if (slide.image) out.add(slide.image.url);
  if (home.storyImage) out.add(home.storyImage);
  return out;
}

/** Pro painel: "Maquiagem › Boca" na ordem do menu. */
export function categoryChoices(): { id: number; name: string; parentId: number | null }[] {
  const all = listCategories();
  const byId = new Map(all.map((c) => [c.id, c.name]));
  return all.map((c) => ({
    id: c.id,
    name: c.parentId ? `${byId.get(c.parentId) ?? ""} › ${c.name}` : c.name,
    parentId: c.parentId,
  }));
}
