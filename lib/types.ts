export interface Category {
  id: number;
  slug: string;
  name: string;
  blurb: string;
  image: string;
  position: number;
  visible: boolean;
  /** null = categoria principal; senão é subcategoria dessa */
  parentId: number | null;
  /** produtos ativos (fora da lixeira) nessa categoria */
  productCount: number;
}

/** Categoria principal com as subcategorias dela (menu e filtros da loja). */
export interface CategoryNode {
  slug: string;
  name: string;
  children: { slug: string; name: string }[];
}

/** Uma opção do produto, ex.: a cor "Pêssego" de um gloss. */
export interface ProductVariant {
  name: string;
  /** #rrggbb pra bolinha de cor; vazio = mostra só o nome */
  color: string;
  /** foto do produto que mostra essa opção (uma das fotos dele) */
  image: string;
  inStock: boolean;
}

export interface ProductImage {
  url: string;
  /** PNG/WebP com fundo transparente: aparece recortado sobre o card */
  cutout: boolean;
  width: number | null;
  height: number | null;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categoryId: number | null;
  categorySlug: string | null;
  categoryName: string | null;
  /** categoria principal quando o produto está numa subcategoria */
  parentCategorySlug: string | null;
  parentCategoryName: string | null;
  blurb: string;
  description: string;
  detail: string;
  priceCents: number | null;
  compareAtCents: number | null;
  visible: boolean;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  position: number;
  deletedAt: string | null;
  images: ProductImage[];
  /** nome do grupo de opções, ex.: "Cor" */
  variantLabel: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

/** Textos e fotos da página inicial, editáveis no painel. */
export interface HomeContent {
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroImage: ProductImage | null;
  /** produto do cartãozinho no quadro vinho; vazio = sem cartão */
  heroProductSlug: string;
  storyTitle: string;
  storyHighlight: string;
  storyText1: string;
  storyText2: string;
  storyImage: string;
  storyPoints: string[];
}

export interface StoreSettings {
  /** só dígitos, com DDI, ex. 5511999598625 */
  whatsapp: string;
  /** sem @ */
  instagram: string;
  city: string;
  announcements: string[];
  home: HomeContent;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  passwordChangedAt: string | null;
}

export type ProductFlag = "visible" | "inStock" | "featured" | "isNew";
