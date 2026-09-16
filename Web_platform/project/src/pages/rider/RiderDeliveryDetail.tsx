import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

export function RiderDeliveryDetailPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/rider"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Deliveries
      </Link>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Package className="h-6 w-6 text-gray-400" />
          <div>
            <h1 className="font-display text-lg font-bold text-gray-900">Delivery details unavailable</h1>
            <p className="mt-1 text-sm text-gray-600">
              The backend does not currently expose a rider delivery detail endpoint, so lifecycle actions cannot be safely attached to this page without an assigned delivery payload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
