import { Bell } from 'lucide-react';

export function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Notifications</h1>
      <p className="text-sm text-gray-500 mb-6">Backend-generated order and delivery updates.</p>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Bell className="h-6 w-6 text-gray-400" />
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Notifications unavailable</h2>
            <p className="mt-1 text-sm text-gray-600">The current backend does not expose a notifications read endpoint. No notification state is simulated locally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
