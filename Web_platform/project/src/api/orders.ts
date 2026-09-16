import { apiRequest } from './client';
import type {
  CheckoutPreview,
  ApiSingleResponse,
} from '@/types';

export interface PlacedOrderResponse {
  orderId: string;
  status: string;
  fulfillment: {
    fulfillmentId: string;
    businessId: string;
    businessName: string;
    status: string;
  };
  pricing: {
    currency: string;
    subtotalAmount: number;
    deliveryFeeAmount: number;
    totalAmount: number;
  };
  items: CheckoutPreview['items'];
}

export interface CheckoutPreviewPayload {
  deliveryAddressLine: string;
  deliveryCity: string;
  deliveryState: string;
  latitude: number;
  longitude: number;
}

export interface CreateOrderPayload {
  deliveryAddressLine: string;
  deliveryCity: string;
  deliveryState: string;
  latitude: number;
  longitude: number;
}

export const checkoutApi = {
  preview: (payload: CheckoutPreviewPayload) =>
    apiRequest<ApiSingleResponse<CheckoutPreview>>('/api/v1/checkout/preview', {
      method: 'POST',
      body: payload,
    }),
};

export const ordersApi = {
  create: (payload: CreateOrderPayload, idempotencyKey: string) =>
    apiRequest<ApiSingleResponse<PlacedOrderResponse>>('/api/v1/orders', {
      method: 'POST',
      body: payload,
      headers: { 'Idempotency-Key': idempotencyKey },
    }),

};
