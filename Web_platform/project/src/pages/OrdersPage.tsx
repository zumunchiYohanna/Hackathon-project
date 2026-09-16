import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
      <p className="text-sm text-gray-500 mb-6">Track orders using backend-confirmed lifecycle state.</p>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Package className="h-6 w-6 text-gray-400" />
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Order history unavailable</h2>
            <p className="mt-1 text-sm text-gray-600">
              The current backend exposes order creation and delivery lifecycle actions, but no authenticated customer order list endpoint.
            </p>
            <Link to="/browse" className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
