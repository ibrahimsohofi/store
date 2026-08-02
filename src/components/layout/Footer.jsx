import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCALE, path } from '@shared/constants.js';

export default function Footer() {
  const { t } = useTranslation();
  const locale = DEFAULT_LOCALE;

  return (
    <footer className="bg-ink border-t border-ink-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 font-display">SOHOFI BRICO</h3>
            <p className="text-ink-400 text-sm">
              Your trusted hardware store in Morocco. Quality tools and materials for every project.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.shop')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to={path(locale, 'category')} className="text-ink-400 hover:text-white text-sm">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to={path(locale, 'search')} className="text-ink-400 hover:text-white text-sm">
                  {t('nav.search')}
                </Link>
              </li>
              <li>
                <Link to={path(locale, 'cart')} className="text-ink-400 hover:text-white text-sm">
                  {t('nav.cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to={path(locale, 'page', 'contact')} className="text-ink-400 hover:text-white text-sm">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to={path(locale, 'page', 'shipping')} className="text-ink-400 hover:text-white text-sm">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link to={path(locale, 'page', 'returns')} className="text-ink-400 hover:text-white text-sm">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link to={path(locale, 'page', 'faq')} className="text-ink-400 hover:text-white text-sm">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to={path(locale, 'page', 'cgv')} className="text-ink-400 hover:text-white text-sm">
                  {t('footer.cgv')}
                </Link>
              </li>
              <li>
                <Link to={path(locale, 'page', 'privacy')} className="text-ink-400 hover:text-white text-sm">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-700 mt-8 pt-8 text-center">
          <p className="text-ink-400 text-sm">
            © {new Date().getFullYear()} SOHOFI BRICO. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
