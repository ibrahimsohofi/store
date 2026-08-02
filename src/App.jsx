import { Routes, Route, Navigate } from 'react-router-dom';
import { LOCALES, DEFAULT_LOCALE, path } from '@shared/constants.js';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
        {LOCALES.map((locale) => (
          <Route key={locale} path={`/${locale}`} element={<HomePage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'category', ':slug')} element={<CategoryPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'product', ':slug')} element={<ProductPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'search')} element={<SearchPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'cart')} element={<CartPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'checkout')} element={<CheckoutPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'order-confirmation', ':number')} element={<OrderConfirmationPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'login')} element={<LoginPage />} />
        ))}
        {LOCALES.map((locale) => (
          <Route key={locale} path={path(locale, 'register')} element={<RegisterPage />} />
        ))}
        <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
