import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent } from '../components/ui/Card';

export default function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: filters, isLoading: filtersLoading } = useQuery({
    queryKey: ['filters', slug],
    queryFn: async () => {
      const res = await fetch(`/api/v1/catalog/filters?category=${slug}`);
      if (!res.ok) throw new Error('Failed to fetch filters');
      return res.json();
    },
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', slug, selectedBrands, priceRange, inStockOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('category', slug);
      selectedBrands.forEach((b) => params.append('brand', b));
      if (priceRange.min > 0) params.append('min', priceRange.min);
      if (priceRange.max < 10000) params.append('max', priceRange.max);
      if (inStockOnly) params.append('inStock', 'true');
      
      const res = await fetch(`/api/v1/catalog/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  if (isLoading && !products) {
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

  const availableFilters = filters?.data || { brands: [], priceRange: { min: 0, max: 10000 }, stock: { inStock: 0, outOfStock: 0 } };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ink mb-8 font-display">
          {slug}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Faceted Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-ink mb-4">{t('category.filters')}</h2>

                {/* Brands */}
                {availableFilters.brands.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-ink mb-3">{t('category.brands')}</h3>
                    <div className="space-y-2">
                      {availableFilters.brands.map((brand) => (
                        <label key={brand.name} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.name)}
                            onChange={() => toggleBrand(brand.name)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-ink">
                            {brand.name} ({brand.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold text-ink mb-3">{t('category.priceRange')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ink-400">MAD</span>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder={availableFilters.priceRange.min}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ink-400">MAD</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder={availableFilters.priceRange.max}
                      />
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-ink">{t('category.inStockOnly')}</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 10000 });
                    setInStockOnly(false);
                  }}
                  className="text-sm text-signal hover:text-signal-600"
                >
                  {t('category.clearFilters')}
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products?.data?.products?.length === 0 ? (
              <p className="text-ink-400 text-center py-12">{t('category.noProducts')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products?.data?.products?.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-bone-200"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-ink mb-2">{product.name}</h3>
                        <p className="text-signal font-bold">MAD {product.price.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
