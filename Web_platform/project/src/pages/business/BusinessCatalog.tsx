import { useEffect, useState } from 'react';
import { Store, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';
import { businessApi } from '@/api/business';
import { inventoryApi } from '@/api/inventory';

export function BusinessCatalogPage() {
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [inventory, setInventory] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([businessApi.getCatalog(), inventoryApi.listMine()])
      .then(([catalogResponse, inventoryResponse]) => {
        setProducts((catalogResponse.data ?? []) as Record<string, unknown>[]);
        setInventory((inventoryResponse.data ?? []) as Record<string, unknown>[]);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Catalogue & Inventory</h1>
          <p className="text-sm text-gray-500">Manage your products and stock levels.</p>
          <p className="mt-1 text-xs text-gray-400">{inventory.length} inventory records loaded from the backend.</p>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-error-50 p-4 text-sm text-error-700">{error}</p>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Store className="h-7 w-7" />}
          title="No products yet"
          description="Add your first product to start selling on SQUADLINK."
        />
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={String(product.id ?? product.productId ?? product.name)}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-gray-50">
                {typeof product.imageUrl === 'string' ? (
                  <img src={product.imageUrl} alt={String(product.name ?? 'Product')} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{String(product.productName ?? product.name ?? 'Product')}</p>
                <p className="text-xs text-gray-500 truncate">{String(product.description ?? '')}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{String(product.priceAmount ?? product.price ?? 'Price unavailable')}</span>
                  {typeof product.unit === 'string' && <span className="text-xs text-gray-400">/ {product.unit}</span>}
                </div>
              </div>
              <Badge variant={product.isAvailable === false ? 'error' : 'success'}>
                {product.isAvailable === false ? 'Unavailable' : 'Available'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
