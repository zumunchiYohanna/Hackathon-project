import { apiRequest } from './client';
import type { ApiSingleResponse } from '@/types';

export interface LifecycleResult {
  deliveryId: string;
  orderId?: string;
  status: string;
  riderId?: string;
  pickupCredential?: string;
}

export const lifecycleApi = {
  acceptBusinessOrder: (orderId: string) =>
    apiRequest<ApiSingleResponse<LifecycleResult>>(
      `/api/v1/business/orders/${orderId}/accept`,
      { method: 'POST' }
    ),
  markBusinessReady: (orderId: string) =>
    apiRequest<ApiSingleResponse<LifecycleResult>>(
      `/api/v1/business/orders/${orderId}/ready`,
      { method: 'POST' }
    ),
  verifyPickup: (deliveryId: string, credential: string) =>
    apiRequest<ApiSingleResponse<LifecycleResult>>(
      `/api/v1/deliveries/${deliveryId}/pickup/verify`,
      { method: 'POST', body: { credential } }
    ),
  markInTransit: (deliveryId: string) =>
    apiRequest<ApiSingleResponse<LifecycleResult>>(
      `/api/v1/deliveries/${deliveryId}/in-transit`,
      { method: 'POST' }
    ),
  markArrived: (deliveryId: string) =>
    apiRequest<ApiSingleResponse<LifecycleResult>>(
      `/api/v1/deliveries/${deliveryId}/arrived`,
      { method: 'POST' }
    ),
  issueDeliveryOtp: (deliveryId: string) =>
    apiRequest<ApiSingleResponse<{ deliveryId: string; otp: string; expiresInMinutes: number }>>(
      `/api/v1/deliveries/${deliveryId}/otp`,
      { method: 'POST' }
    ),
  confirmDelivery: (deliveryId: string, otp: string) =>
    apiRequest<ApiSingleResponse<LifecycleResult>>(
      `/api/v1/deliveries/${deliveryId}/confirm`,
      { method: 'POST', body: { otp } }
    ),
};