import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Package className="h-6 w-6 text-gray-400" />
          <div>
            <h1 className="font-display text-lg font-bold text-gray-900">Order tracking unavailable</h1>
            <p className="mt-1 text-sm text-gray-600">
              Order {orderId ? `#${orderId.slice(-6).toUpperCase()}` : ''} cannot be loaded because the backend does not currently expose a customer order detail endpoint.
            </p>
            <p className="mt-2 text-sm text-gray-600">No delivery status or OTP state is simulated locally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
