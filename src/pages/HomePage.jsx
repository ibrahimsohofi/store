import { useTranslation } from 'react-i18next';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import JsonLd, { generateOrganizationJsonLd, generateWebSiteJsonLd } from '../components/seo/JsonLd';
import { SITE_URL } from '../lib/siteUrl';

export default function HomePage() {
  const { t } = useTranslation();
  const baseUrl = SITE_URL;

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <JsonLd data={generateOrganizationJsonLd(baseUrl)} />
      <JsonLd data={generateWebSiteJsonLd(baseUrl)} />

      {/* Hero Section */}
      <section className="bg-ink text-bone py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl mb-8 text-ink-400">
            {t('home.heroSubtitle')}
          </p>
          <Button variant="primary" size="lg">
            {t('home.cta')}
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-ink mb-8 font-display">
            {t('home.categories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Outils', 'Électricité', 'Plomberie', 'Peinture'].map((cat) => (
              <Card key={cat} className="hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="font-semibold text-ink">{cat}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-bone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-ink mb-8 font-display">
            {t('home.featured')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square bg-bone-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-ink mb-2">Produit {i}</h3>
                    <p className="text-signal font-bold">MAD 199.00</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-t border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold text-ink">{t('home.trust.delivery')}</h3>
              <p className="text-sm text-ink-400">{t('home.trust.deliveryDesc')}</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💵</div>
              <h3 className="font-semibold text-ink">{t('home.trust.cod')}</h3>
              <p className="text-sm text-ink-400">{t('home.trust.codDesc')}</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-ink">{t('home.trust.guarantee')}</h3>
              <p className="text-sm text-ink-400">{t('home.trust.guaranteeDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
