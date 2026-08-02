import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';

export default function CartPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { items: localItems, total: localTotal, updateQty, removeItem, clearCart } = useCartStore();

  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/v1/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      return res.json();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, qty }) => {
      const res = await fetch(`/api/v1/cart/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/v1/cart/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove item');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  const items = cartData?.data?.items || localItems;
  const total = cartData?.data?.total || localTotal;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <h1 className="text-3xl font-bold text-ink mb-4 font-display">{t('cart.title')}</h1>
          <p className="text-ink-400 mb-8">{t('cart.empty')}</p>
          <Button onClick={() => (window.location.href = '/')}>{t('cart.continueShopping')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ink mb-8 font-display">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-bone-200 rounded"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink mb-2">{item.name || item.product?.name}</h3>
                      <p className="text-signal font-bold mb-2">
                        MAD {(item.unit_price_snapshot || item.price).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newQty = Math.max(1, item.qty - 1);
                            updateItemMutation.mutate({ id: item.id, qty: newQty });
                            updateQty(item.id, newQty);
                          }}
                          className="w-8 h-8 border border-ink-300 rounded hover:bg-ink-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button
                          onClick={() => {
                            const newQty = Math.min(99, item.qty + 1);
                            updateItemMutation.mutate({ id: item.id, qty: newQty });
                            updateQty(item.id, newQty);
                          }}
                          className="w-8 h-8 border border-ink-300 rounded hover:bg-ink-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeItemMutation.mutate(item.id);
                        removeItem(item.id);
                      }}
                      className="text-alert hover:text-alert-600"
                    >
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-ink mb-4">{t('cart.summary')}</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-ink-600">{t('cart.subtotal')}</span>
                    <span className="text-ink">MAD {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-600">{t('cart.shipping')}</span>
                    <span className="text-ink">{total >= 600 ? 'Free' : 'MAD 50.00'}</span>
                  </div>
                  <div className="border-t border-ink-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-ink">{t('cart.total')}</span>
                      <span className="text-ink">
                        MAD {(total + (total >= 600 ? 0 : 50)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button className="w-full" onClick={() => (window.location.href = '/fr/checkout')}>
                  {t('cart.checkout')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
