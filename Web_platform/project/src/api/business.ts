import { apiRequest } from './client';
import type {
  Order,
  ApiResponseEnvelope,
  Business,
} from '@/types';
import type { LifecycleResult } from './lifecycle';

export interface BusinessOrderSummary {
  orderId: string;
  status: Order['status'];
  fulfillmentStatus: string;
  createdAt: string;
}

export interface RegisterBusinessPayload {
  name: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  addressLine: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  minimumOrderAmount: number;
}

export const businessApi = {
  register: (payload: RegisterBusinessPayload) =>
    apiRequest<ApiResponseEnvelope<Business>>('/api/v1/businesses/', {
      method: 'POST',
      body: payload,
    }),

  getMe: () => apiRequest<ApiResponseEnvelope<Business>>('/api/v1/businesses/me'),

  listOrders: () =>
    apiRequest<ApiResponseEnvelope<BusinessOrderSummary[]>>('/api/v1/business/orders'),

  getReadiness: () =>
    apiRequest<ApiResponseEnvelope<unknown>>('/api/v1/businesses/me/readiness'),

  getOperatingHours: () =>
    apiRequest<ApiResponseEnvelope<unknown[]>>('/api/v1/businesses/me/operating-hours'),

  getCatalog: () =>
    apiRequest<ApiResponseEnvelope<unknown[]>>('/api/v1/businesses/me/catalog'),

  acceptOrder: (orderId: string) =>
    apiRequest<ApiResponseEnvelope<LifecycleResult>>(
      `/api/v1/business/orders/${orderId}/accept`,
      { method: 'POST' }
    ),

  markOrderReady: (orderId: string) =>
    apiRequest<ApiResponseEnvelope<LifecycleResult>>(
      `/api/v1/business/orders/${orderId}/ready`,
      { method: 'POST' }
    ),
};
