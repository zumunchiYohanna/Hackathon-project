import { apiRequest } from './client';
import type { ApiResponseEnvelope } from '@/types';

export const inventoryApi = {
  listMine: () =>
    apiRequest<ApiResponseEnvelope<unknown[]>>('/api/v1/inventory/me'),
};