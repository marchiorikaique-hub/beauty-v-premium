export interface Category {
  id: number;
  slug: string;
  name: string;
  blurb: string;
  image: string;
  position: number;
  visible: boolean;
  /** produtos ativos (fora da lixeira) nessa categoria */
  productCount: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  /** só dígitos, com DDI, ex. 5511999598625 */
  whatsapp: string;
  /** sem @ */
  instagram: string;
  city: string;
  announcements: string[];
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  passwordChangedAt: string | null;
}

export type ProductFlag = "visible" | "inStock" | "featured" | "isNew";
