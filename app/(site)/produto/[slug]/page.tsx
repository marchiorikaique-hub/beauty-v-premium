import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { BuyButtons, MobileBuyBar, ProductSelection, VariantPicker } from "@/components/ProductBuy";
import { ShareButton } from "@/components/ShareButton";
import { Bag, ChatHeart, Card } from "@/components/icons";
import { getPublicProduct, getSettings, listPublicProducts } from "@/lib/repo";
import { baseUrl } from "@/lib/site";
import { discountPercent, formatBRL } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getPublicProduct(slug);
  if (!p) return { title: "Produto não encontrado" };
  const price = p.priceCents != null ? ` · ${formatBRL(p.priceCents)}` : "";
  const description = `${p.blurb || p.name}${price}. Pronta-entrega, peça pelo WhatsApp.`;
  const image = p.images[0]?.url;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/produto/${p.slug}` },
    openGraph: {
      title: `${p.name}${p.brand ? ` · ${p.brand}` : ""}`,
      description,
      url: `/produto/${p.slug}`,
      images: image ? [{ url: image, alt: p.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = getPublicProduct(slug);
  if (!p) notFound();

  const settings = getSettings();
  const siteUrl = baseUrl();
  const url = `${siteUrl}/produto/${p.slug}`;
  const off = discountPercent(p.priceCents, p.compareAtCents);
  const buyProduct = {
    id: p.id,
    name: p.name,
    brand: p.brand,
    priceCents: p.priceCents,
    inStock: p.inStock,
    variantLabel: p.variantLabel,
    variants: p.variants,
  };

  const others = listPublicProducts().filter((o) => o.id !== p.id);
  const related = [
    ...others.filter((o) => o.categoryId === p.categoryId),
    ...others.filter((o) => o.categoryId !== p.categoryId),
  ].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || p.blurb,
    image: p.images.map((i) => `${siteUrl}${i.url}`),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.priceCents != null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: (p.priceCents / 100).toFixed(2),
            availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url,
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="shell pb-32 pt-6 sm:pt-10 lg:pb-24">
        <nav aria-label="Você está em" className="mb-6 text-sm text-taupe-deep sm:mb-8">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <a href="/" className="hover:text-vinho">
                Início
              </a>
            </li>
            {p.parentCategoryName && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <a href={`/#cat-${p.parentCategorySlug}`} className="hover:text-vinho">
                    {p.parentCategoryName}
                  </a>
                </li>
              </>
            )}
            {p.categoryName && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <a href={`/#cat-${p.categorySlug}`} className="hover:text-vinho">
                    {p.categoryName}
                  </a>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-espresso">
              {p.name}
            </li>
          </ol>
        </nav>

        <ProductSelection product={buyProduct}>
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <ProductGallery images={p.images} name={p.name} soldOut={!p.inStock} />
          </div>

          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-taupe-deep">
              {p.parentCategoryName ? `${p.parentCategoryName} · ` : ""}
              {p.categoryName ?? "Beauty V"}
              {p.brand ? ` · ${p.brand}` : ""}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">{p.name}</h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  p.inStock ? "bg-champagne-soft text-espresso" : "bg-espresso text-champagne-soft"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.inStock ? "bg-vinho" : "bg-champagne"}`} />
                {p.inStock ? "Pronta-entrega" : "Esgotado no momento"}
              </span>
              {p.isNew && (
                <span className="rounded-full bg-vinho px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-champagne-soft">
                  Novo
                </span>
              )}
              {p.detail && (
                <span className="rounded-full border border-espresso/15 px-3 py-1 text-xs font-medium text-espresso/80">
                  {p.detail}
                </span>
              )}
            </div>

            <div className="mt-6">
              {p.priceCents != null ? (
                <p className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-semibold text-ink">{formatBRL(p.priceCents)}</span>
                  {p.compareAtCents != null && off && (
                    <>
                      <span className="text-lg text-taupe-deep line-through">{formatBRL(p.compareAtCents)}</span>
                      <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-sm font-semibold text-ink">
                        -{off}%
                      </span>
                    </>
                  )}
                </p>
              ) : (
                <p className="text-lg font-medium text-espresso/80">Valor sob consulta no WhatsApp</p>
              )}
            </div>

            {p.blurb && <p className="mt-5 max-w-prose text-lg leading-relaxed text-espresso/85">{p.blurb}</p>}

            <VariantPicker />

            <BuyButtons whatsapp={settings.whatsapp} url={url}>
              <ShareButton url={url} title={p.name} />
            </BuyButtons>
            <div className="mt-6 lg:hidden">
              <ShareButton url={url} title={p.name} />
            </div>

            <ul className="mt-9 grid gap-3 border-t border-espresso/10 pt-7 text-sm text-espresso/80 sm:grid-cols-3">
              <li className="flex items-center gap-2.5">
                <Bag size={19} className="text-vinho" />
                Pronta-entrega
              </li>
              <li className="flex items-center gap-2.5">
                <ChatHeart size={19} className="text-vinho" />
                Atendimento no WhatsApp
              </li>
              <li className="flex items-center gap-2.5">
                <Card size={19} className="text-vinho" />
                Várias formas de pagamento
              </li>
            </ul>

            {p.description && (
              <section className="mt-10" aria-labelledby="detalhes">
                <h2 id="detalhes" className="font-display text-2xl text-ink">
                  Detalhes
                </h2>
                <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-espresso/85">{p.description}</p>
              </section>
            )}
          </div>
        </div>

        <MobileBuyBar whatsapp={settings.whatsapp} url={url} />
        </ProductSelection>

        {related.length > 0 && (
          <section className="mt-20 sm:mt-28" aria-labelledby="relacionados">
            <h2 id="relacionados" className="mb-8 font-display text-3xl text-ink sm:text-4xl">
              Você também pode gostar
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} whatsapp={settings.whatsapp} siteUrl={siteUrl} />
              ))}
            </div>
          </section>
        )}
      </div>

    </>
  );
}
