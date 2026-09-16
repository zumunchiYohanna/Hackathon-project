import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ClipboardList,
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';
import { formatDate } from '@/utils/format';
import { businessApi } from '@/api/business';
import type { OrderStatus } from '@/types';
import type { BusinessOrderSummary } from '@/api/business';
import type { Business } from '@/types';

const statusVariants: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PREPARING: 'info',
  READY_FOR_PICKUP: 'warning',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export function BusinessDashboard() {
  const [orders, setOrders] = useState<BusinessOrderSummary[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [readiness, setReadiness] = useState<unknown>(null);
  const [operatingHours, setOperatingHours] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        const [ordersResponse, businessResponse, readinessResponse, hoursResponse] = await Promise.all([
          businessApi.listOrders(),
          businessApi.getMe(),
          businessApi.getReadiness(),
          businessApi.getOperatingHours(),
        ]);
        if (!ignore) {
          setOrders(ordersResponse.data ?? []);
          setBusiness(businessResponse.data);
          setReadiness(readinessResponse.data);
          setOperatingHours(hoursResponse.data ?? []);
          setError(null);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || 'Unable to load business orders.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      ignore = true;
    };
  }, []);

  const stats = {
    pending: orders.filter((o) => o.status === 'PENDING').length,
    active: orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PREPARING').length,
    ready: orders.filter((o) => o.status === 'READY_FOR_PICKUP').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Business Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Manage your orders, catalogue, and business operations.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Business</p>
          <p className="mt-1 font-semibold text-gray-900">{business?.name ?? 'Unavailable'}</p>
          <p className="text-xs text-gray-500">Verification: {business?.verificationStatus ?? 'Unavailable'}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Readiness</p>
          <p className="mt-1 text-sm text-gray-700">{readiness ? 'Loaded from backend' : 'Unavailable'}</p>
          <p className="text-xs text-gray-500">Read-only owner view</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Operating hours</p>
          <p className="mt-1 font-semibold text-gray-900">{operatingHours.length} entries</p>
          <p className="text-xs text-gray-500">Loaded from backend</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
          Loading business orders…
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-warning-100 text-warning-700" />
        <StatCard icon={Package} label="Active" value={stats.active} color="bg-accent-100 text-accent-700" />
        <StatCard icon={Store} label="Ready for Pickup" value={stats.ready} color="bg-secondary-100 text-secondary-700" />
        <StatCard icon={CheckCircle2} label="Delivered" value={stats.delivered} color="bg-success-100 text-success-700" />
      </div>

      {/* Revenue + product count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 text-success-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gray-900">Unavailable</p>
              <p className="text-xs text-gray-500">Revenue is not returned by the business order endpoint.</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-xs text-gray-500">Orders in queue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link
            to="/business/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-7 w-7" />}
            title="No orders yet"
            description="When customers place orders with your business, they will appear here."
          />
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.orderId}
                    to={`/business/orders/${order.orderId}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      #{order.orderId.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariants[order.status]}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Clock;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
