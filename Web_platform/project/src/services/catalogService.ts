import { catalogApi, type ProductQueryParams } from '@/api/catalog';
import type { CatalogCategory, Product } from '@/types';

export type CatalogSource = 'backend';

export interface CatalogResult {
  products: Product[];
  source: CatalogSource;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeProduct(raw: Partial<Product> & { categoryName?: string; categoryId?: string }): Product {
  const categoryName = raw.categoryName || raw.category || raw.categoryId || undefined;
  const category = raw.category || (categoryName ? slugify(categoryName) : undefined);

  return {
    id: raw.id ?? '',
    name: raw.name ?? 'Untitled product',
    description: raw.description ?? undefined,
    price: typeof raw.price === 'number' ? raw.price : undefined,
    currency: raw.currency ?? 'NGN',
    imageUrl: raw.imageUrl ?? undefined,
    category,
    categoryId: raw.categoryId,
    categoryName: raw.categoryName,
    unit: raw.unit ?? undefined,
    inStock: raw.inStock ?? raw.available ?? true,
    available: raw.available ?? raw.inStock ?? true,
    featured: !!raw.featured,
    popular: !!raw.popular,
    tags: raw.tags ?? [],
  };
}

function mapCategory(raw: Partial<CatalogCategory>): CatalogCategory {
  const name = raw.name ?? 'Category';
  return {
    id: raw.id ?? name,
    name,
    slug: raw.slug ?? slugify(name),
    icon: raw.icon ?? 'Tag',
    description: raw.description ?? `Browse ${name.toLowerCase()} products.`,
  };
}

function sortProducts(products: Product[], sort?: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-low':
      return sorted.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    case 'price-high':
      return sorted.sort((a, b) => (b.price ?? Number.MIN_SAFE_INTEGER) - (a.price ?? Number.MIN_SAFE_INTEGER));
    case 'popular':
      return sorted.sort((a, b) => Number(b.popular) - Number(a.popular));
    case 'recommended':
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.popular) - Number(a.popular));
  }
}

export const catalogService = {
  categoriesCache: [] as CatalogCategory[],

  async refreshCategories(): Promise<CatalogCategory[]> {
    try {
      const res = await catalogApi.getCategories();
      const categories = Array.isArray(res.data) ? res.data : [];
      this.categoriesCache = categories.map(mapCategory);
      return this.categoriesCache;
    } catch {
      this.categoriesCache = [];
      return [];
    }
  },

  getCategories(): CatalogCategory[] {
    return this.categoriesCache;
  },

  async list(params?: ProductQueryParams): Promise<CatalogResult> {
    try {
      const [productsResponse] = await Promise.all([
        catalogApi.list(params),
        this.refreshCategories(),
      ]);

      let products = Array.isArray(productsResponse.data) ? productsResponse.data.map(normalizeProduct) : [];

      if (params?.search) {
        const q = params.search.toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(q) ||
            product.description?.toLowerCase().includes(q) ||
            product.category?.toLowerCase().includes(q) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      }

      if (params?.category && params.category !== 'all') {
        products = products.filter((product) => product.category === params.category);
      }

      if (params?.availability === 'in-stock') {
        products = products.filter((product) => product.available !== false && product.inStock !== false);
      }

      return { products: sortProducts(products, params?.sort), source: 'backend' };
    } catch {
      return { products: [], source: 'backend' };
    }
  },

  async getById(id: string): Promise<{ product: Product | null; source: CatalogSource; related: Product[] }> {
    try {
      const res = await catalogApi.list();
      const products = Array.isArray(res.data) ? res.data.map(normalizeProduct) : [];
      const product = products.find((item) => item.id === id) ?? null;
      return { product, source: 'backend', related: [] };
    } catch {
      return { product: null, source: 'backend', related: [] };
    }
  },
};
