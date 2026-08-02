import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: () => {
      navigate('/fr');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold text-ink mb-6 text-center font-display">
            {t('auth.register')}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                {t('auth.firstName')}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-ink-200 rounded focus:outline-none focus:ring-2 focus:ring-signal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                {t('auth.lastName')}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-ink-200 rounded focus:outline-none focus:ring-2 focus:ring-signal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-ink-200 rounded focus:outline-none focus:ring-2 focus:ring-signal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                {t('auth.phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-ink-200 rounded focus:outline-none focus:ring-2 focus:ring-signal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-ink-200 rounded focus:outline-none focus:ring-2 focus:ring-signal"
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isLoading}
            >
              {registerMutation.isLoading ? <Loader size="sm" /> : t('auth.register')}
            </Button>
          </form>
          <p className="text-center mt-4 text-ink-600 text-sm">
            {t('auth.hasAccount')}{' '}
            <a href="/fr/compte/connexion" className="text-signal hover:underline">
              {t('auth.login')}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
