import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { cartApi } from '@/api/cart';
import { checkoutApi, ordersApi } from '@/api/orders';
import { useCart } from '@/hooks/useCart';
import { formatPrice, cn } from '@/utils/format';
import type { CheckoutPreview, OrderItem } from '@/types';

const defaultAddress = {
  deliveryAddressLine: '1 Lagos Street',
  deliveryCity: 'Lagos',
  deliveryState: 'Lagos State',
  latitude: 6.5244,
  longitude: 3.3792,
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState(defaultAddress);
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const deliveryFee = preview?.pricing.deliveryFeeAmount ?? 0;
  const total = preview?.pricing.totalAmount ?? subtotal;

  const loadPreview = useCallback(async () => {
    if (items.length === 0) return;

    try {
      const response = await checkoutApi.preview(form);
      setPreview(response.data);
      setPreviewError(null);
    } catch (error) {
      setPreview(null);
      setPreviewError(
        error instanceof Error ? error.message : 'Unable to confirm delivery availability.'
      );
    }
  }, [form, items.length]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'latitude' || name === 'longitude' ? Number(value) : value,
    }));
  };

  const handlePlaceOrder = useCallback(async () => {
    if (placingOrder || items.length === 0) return;

    try {
      setPlacingOrder(true);
      const response = await ordersApi.create(
        form,
        crypto.randomUUID()
      );

      const orderId = response.data.orderId;
      setPlacedOrderId(orderId);
      setOrderPlaced(true);
      await cartApi.clear();
      await clearCart();
      setTimeout(() => navigate(`/orders/${orderId}`), 1200);
    } catch (error) {
      setPreviewError(
        error instanceof Error ? error.message : 'Unable to place your order right now.'
      );
    } finally {
      setPlacingOrder(false);
    }
  }, [clearCart, form, items.length, navigate, placingOrder]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced && !placingOrder) {
      navigate('/cart');
    }
  }, [items.length, orderPlaced, placingOrder, navigate]);

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  const orderItems: OrderItem[] = preview?.items.map((item) => ({
    productId: item.productId,
    name: item.productName,
    quantity: item.quantity,
    price: item.unitPriceAmount,
    subtotal: item.subtotalAmount,
  })) ?? items.map((i) => ({
    productId: i.productId,
    name: i.name,
    quantity: i.quantity,
    price: i.price,
    subtotal: i.price * i.quantity,
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Checkout</h1>
        <p className="text-sm text-gray-500 mb-8">Review your order before placing it.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Delivery Details</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="md:col-span-2 text-sm font-medium text-gray-700">
                  Address line
                  <input
                    name="deliveryAddressLine"
                    value={form.deliveryAddressLine}
                    onChange={handleFieldChange}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  City
                  <input
                    name="deliveryCity"
                    value={form.deliveryCity}
                    onChange={handleFieldChange}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  State
                  <input
                    name="deliveryState"
                    value={form.deliveryState}
                    onChange={handleFieldChange}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Latitude
                  <input
                    name="latitude"
                    type="number"
                    min={-90}
                    max={90}
                    step="0.0001"
                    value={form.latitude}
                    onChange={handleFieldChange}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Longitude
                  <input
                    name="longitude"
                    type="number"
                    min={-180}
                    max={180}
                    step="0.0001"
                    value={form.longitude}
                    onChange={handleFieldChange}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </label>
              </div>

              {previewError && (
                <p className="mt-4 text-sm font-medium text-error-700">{previewError}</p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary + Place Order */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="text-gray-700">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Additional charges</span>
                  <span className="text-gray-500">Included in backend total</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-display text-xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !!previewError}
                className={cn(
                  'mt-6 flex w-full items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold text-white transition-colors',
                  placingOrder || previewError
                    ? 'bg-primary-400'
                    : 'bg-primary-600 hover:bg-primary-700'
                )}
              >
                {placingOrder ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Prices, fulfillment, and delivery availability are confirmed by the backend before order placement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {orderPlaced && (
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 p-5">
            <Check className="h-5 w-5 text-success-600" />
            <p className="text-sm font-semibold text-success-800">
              Order placed successfully! Redirecting to order tracking...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
