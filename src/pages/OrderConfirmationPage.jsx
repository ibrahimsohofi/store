import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Loader } from '../components/ui/Loader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const { number } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', number],
    queryFn: async () => {
      const res = await fetch(`/api/v1/checkout/orders/${number}`);
      if (!res.ok) throw new Error('Failed to fetch order');
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
        <Button onClick={() => (window.location.href = '/fr')} className="mt-4">
          {t('nav.home')}
        </Button>
      </div>
    );
  }

  const orderData = order?.data;

  if (!orderData) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-400">{t('order.notFound')}</p>
        <Button onClick={() => (window.location.href = '/fr')} className="mt-4">
          {t('nav.home')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-moss-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2 font-display">
            {t('order.confirmationTitle')}
          </h1>
          <p className="text-ink-600">{t('order.thankYou')}</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-ink mb-4">{t('order.orderDetails')}</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-ink-400">{t('order.orderNumber')}</span>
                <span className="text-ink font-semibold">{orderData.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">{t('order.date')}</span>
                <span className="text-ink">{new Date(orderData.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">{t('order.status')}</span>
                <span className="text-ink">{t(`order.statuses.${orderData.status}`)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">{t('order.paymentMethod')}</span>
                <span className="text-ink">{orderData.payment_method}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-ink mb-4">{t('order.shippingAddress')}</h2>
            <div className="text-ink">
              <p>{orderData.shipping_address?.first_name} {orderData.shipping_address?.last_name}</p>
              <p>{orderData.shipping_address?.address_line1}</p>
              <p>{orderData.shipping_address?.city}, {orderData.shipping_address?.postal_code}</p>
              <p>{orderData.shipping_address?.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-ink mb-4">{t('order.orderSummary')}</h2>
            <div className="space-y-2 mb-4">
              {orderData.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink-600">
                    {item.name} x{item.qty}
                  </span>
                  <span className="text-ink">
                    MAD {(item.unit_price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-ink-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-400">{t('cart.subtotal')}</span>
                <span className="text-ink">MAD {orderData.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">{t('cart.shipping')}</span>
                <span className="text-ink">
                  {orderData.shipping_cost === 0 ? 'Free' : `MAD ${orderData.shipping_cost?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">TVA (20%)</span>
                <span className="text-ink">MAD {orderData.vat_amount?.toFixed(2)}</span>
              </div>
              <div className="border-t border-ink-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-ink">{t('cart.total')}</span>
                  <span className="text-ink">MAD {orderData.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-ink mb-4">{t('order.nextSteps')}</h2>
            <ul className="space-y-2 text-ink-600">
              <li>• {t('order.step1')}</li>
              <li>• {t('order.step2')}</li>
              <li>• {t('order.step3')}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={() => (window.location.href = '/fr')}>
            {t('nav.home')}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/fr/compte/commandes')}>
            {t('order.viewOrders')}
          </Button>
          <Button variant="outline" onClick={() => window.open(`/api/v1/invoices/${orderData.order_number}`, '_blank')}>
            {t('order.downloadInvoice')}
          </Button>
        </div>
      </div>
    </div>
  );
}
