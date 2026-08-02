import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import JsonLd, { generateProductJsonLd, generateBreadcrumbJsonLd } from '../components/seo/JsonLd';
import { SITE_URL } from '../lib/siteUrl';

export default function ProductPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const baseUrl = SITE_URL;

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await fetch(`/api/v1/catalog/products/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-alert">{t('error.loadingFailed')}</p>
      </div>
    );
  }

  const { product, related } = productData?.data || {};

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-400">{t('product.notFound')}</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Accueil', url: '/fr' },
    { name: product.category_name || 'Catégorie', url: `/fr/categorie/${product.category_slug}` },
    { name: product.name, url: `/fr/produit/${product.slug}` },
  ];

  return (
    <div className="min-h-screen py-8">
      {/* JSON-LD Structured Data */}
      <JsonLd data={generateProductJsonLd(product, baseUrl)} />
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbItems, baseUrl)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="aspect-square bg-bone-200 rounded"></div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-ink mb-4 font-display">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-signal mb-4">
              MAD {product.price.toFixed(2)}
            </p>
            <p className="text-ink-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded text-sm ${
                product.stock_quantity > 0
                  ? 'bg-moss-100 text-moss'
                  : 'bg-alert-100 text-alert'
              }`}>
                {product.stock_quantity > 0 ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>

            <Button
              onClick={() => addItem(product)}
              disabled={product.stock_quantity === 0}
              className="w-full"
            >
              {product.stock_quantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </Button>

            {/* Specs */}
            <div className="mt-8 border-t border-ink-200 pt-6">
              <h3 className="font-semibold text-ink mb-4">Spécifications</h3>
              <dl className="space-y-2">
                {product.brand && (
                  <div className="flex justify-between">
                    <dt className="text-ink-400">Marque</dt>
                    <dd className="text-ink">{product.brand}</dd>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between">
                    <dt className="text-ink-400">SKU</dt>
                    <dd className="text-ink">{product.sku}</dd>
                  </div>
                )}
                {product.weight_kg && (
                  <div className="flex justify-between">
                    <dt className="text-ink-400">Poids</dt>
                    <dd className="text-ink">{product.weight_kg} kg</dd>
                  </div>
                )}
                {product.warranty_months > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-400">Garantie</dt>
                    <dd className="text-ink">{product.warranty_months} mois</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6 font-display">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {related.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-bone-200"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ink mb-2">{relatedProduct.name}</h3>
                      <p className="text-signal font-bold">MAD {relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
