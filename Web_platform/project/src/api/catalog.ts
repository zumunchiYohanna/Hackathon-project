import { apiRequest } from './client';
import type { Product, CatalogCategory, ApiListResponse } from '@/types';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  availability?: 'in-stock' | 'all';
}

export const catalogApi = {
  list: (params?: ProductQueryParams) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.sort) query.set('sort', params.sort);
    if (params?.availability === 'in-stock') query.set('availability', 'in-stock');
    const qs = query.toString();
    return apiRequest<ApiListResponse<Product>>(
      `/api/v1/catalog/products${qs ? `?${qs}` : ''}`
    );
  },

  getCategories: () =>
    apiRequest<ApiListResponse<CatalogCategory>>('/api/v1/catalog/categories'),
};
