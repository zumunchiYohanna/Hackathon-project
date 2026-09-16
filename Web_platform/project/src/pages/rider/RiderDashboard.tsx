import { Bike, Package } from 'lucide-react';

export function RiderDashboard() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Rider Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Your assigned deliveries and delivery workflow.</p>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-primary-900">Availability</h2>
            <p className="text-xs text-primary-700">Rider assignment is controlled automatically by the backend.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Package className="h-6 w-6 text-gray-400" />
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Assigned deliveries unavailable</h2>
            <p className="mt-1 text-sm text-gray-600">The current backend exposes rider lifecycle actions, but no authenticated rider delivery list or detail endpoint.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
