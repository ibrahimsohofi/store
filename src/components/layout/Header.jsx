import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LOCALES, DEFAULT_LOCALE, path, isRtl } from '@shared/constants.js';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentLocale = location.pathname.split('/')[1] || DEFAULT_LOCALE;

  return (
    <header className="sticky top-0 z-50 bg-ink border-b border-ink-700" dir={isRtl(currentLocale) ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${currentLocale}`} className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white font-display">SOHOFI BRICO</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={path(currentLocale, 'category')} className="text-ink-400 hover:text-white transition">
              {t('nav.categories')}
            </Link>
            <Link to={path(currentLocale, 'guides')} className="text-ink-400 hover:text-white transition">
              {t('nav.guides')}
            </Link>
            <Link to={path(currentLocale, 'page', 'about')} className="text-ink-400 hover:text-white transition">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              {LOCALES.map((locale) => (
                <button
                  key={locale}
                  onClick={() => {
                    const pathWithoutLocale = location.pathname.split('/').slice(2).join('/');
                    window.location.href = `/${locale}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`;
                  }}
                  className={`text-sm px-2 py-1 rounded ${
                    currentLocale === locale
                      ? 'bg-signal text-white'
                      : 'text-ink-400 hover:text-white'
                  }`}
                >
                  {locale.toUpperCase()}
                </button>
              ))}
            </div>

            <button className="text-ink-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>

            <button className="text-ink-400 hover:text-white">
              <User className="w-5 h-5" />
            </button>

            <Link to={path(currentLocale, 'cart')} className="text-ink-400 hover:text-white relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-signal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            <button className="md:hidden text-ink-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
