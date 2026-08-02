import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery.trim() });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['search-suggest', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      const res = await fetch(`/api/v1/catalog/search/suggest?q=${encodeURIComponent(debouncedQuery)}`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      return data.data || [];
    },
    enabled: debouncedQuery.length >= 2,
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return { data: { products: [] } };
      const res = await fetch(`/api/v1/catalog/products?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search');
      return res.json();
    },
    enabled: query.length > 0,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="pl-10"
                autoComplete="off"
              />
              
              {/* Typeahead suggestions dropdown */}
              {suggestions && suggestions.length > 0 && debouncedQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ink-200 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((product) => (
                    <a
                      key={product.id}
                      href={`/fr/product/${product.slug}`}
                      className="block px-4 py-2 hover:bg-ink-50 text-ink text-sm"
                    >
                      {product.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="bg-signal text-white px-6 py-2 rounded font-semibold hover:bg-signal-600 transition">
              {t('nav.search')}
            </button>
          </div>
        </form>

        {/* Results */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-alert">{t('error.loadingFailed')}</p>
          </div>
        )}

        {!isLoading && !error && query && (
          <>
            <h2 className="text-2xl font-bold text-ink mb-6 font-display">
              {t('search.resultsFor')} "{query}"
            </h2>

            {products?.data?.products?.length === 0 ? (
              <p className="text-ink-400 text-center py-12">{t('search.noResults')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          </>
        )}

        {!query && (
          <div className="text-center py-20">
            <p className="text-ink-400">{t('search.enterQuery')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
