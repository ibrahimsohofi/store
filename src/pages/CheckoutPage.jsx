import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useCartStore } from '../stores/cartStore';

const MOROCCAN_CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'];

export default function CheckoutPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { items: localItems } = useCartStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Casablanca',
    postalCode: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const { data: quote, isLoading } = useQuery({
    queryKey: ['checkout-quote'],
    queryFn: async () => {
      const res = await fetch('/api/v1/checkout/quote');
      if (!res.ok) throw new Error('Failed to fetch quote');
      return res.json();
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/v1/checkout/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return res.json();
    },
    onSuccess: (data) => {
      window.location.href = `/fr/order-confirmation/${data.data.order_number}`;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrderMutation.mutate({
      shippingAddress: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        address_line1: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
      },
      billingAddress: null, // Same as shipping
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  const items = quote?.data?.items || localItems;
  const subtotal = quote?.data?.subtotal || 0;
  const shipping = quote?.data?.shipping || 50;
  const vat = quote?.data?.vat || 0;
  const total = quote?.data?.total || subtotal + shipping + vat;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-ink-400">{t('cart.empty')}</p>
          <Button onClick={() => (window.location.href = '/fr/cart')} className="mt-4)">
            {t('cart.title')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ink mb-8 font-display">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-ink">{t('checkout.contactInfo')}</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('checkout.firstName')}</Label>
                      <Input
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{t('checkout.lastName')}</Label>
                      <Input
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{t('checkout.phone')}</Label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{t('checkout.email')}</Label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-ink">{t('checkout.shippingAddress')}</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>{t('checkout.address')}</Label>
                      <Input
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{t('checkout.city')}</Label>
                        <select
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2 border rounded bg-white text-ink"
                        >
                          {MOROCCAN_CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>{t('checkout.postalCode')}</Label>
                        <Input
                          required
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-ink">{t('checkout.paymentMethod')}</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-ink-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-semibold text-ink">{t('checkout.cod')}</div>
                        <div className="text-sm text-ink-400">{t('checkout.codDesc')}</div>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-ink">{t('checkout.notes')}</h2>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border rounded bg-white text-ink"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-ink">{t('cart.summary')}</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-ink-600">
                          {item.name || item.product?.name} x{ item.qty}
                        </span>
                        <span className="text-ink">
                          MAD {((item.unit_price_snapshot || item.price) * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-ink-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-ink-600">{t('cart.subtotal')}</span>
                      <span className="text-ink">MAD {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-600">{t('cart.shipping')}</span>
                      <span className="text-ink">{shipping === 0 ? 'Free' : `MAD ${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-600">TVA (20%)</span>
                      <span className="text-ink">MAD {vat.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-ink-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-ink">{t('cart.total')}</span>
                        <span className="text-ink">MAD {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={createOrderMutation.isLoading}
                  >
                    {createOrderMutation.isLoading ? t('checkout.processing') : t('checkout.placeOrder')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
