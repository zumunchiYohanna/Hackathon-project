import { apiRequest } from './client';
import type {
  Business,
  ApiResponseEnvelope,
} from '@/types';

export interface UpdateBusinessVerificationPayload {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  notes?: string | null;
}

export const adminApi = {
  listBusinesses: () =>
    apiRequest<ApiResponseEnvelope<unknown[]>>('/api/v1/admin/business-verifications'),

  getBusiness: (businessId: string) =>
    apiRequest<ApiResponseEnvelope<unknown>>(`/api/v1/admin/business-verifications/${businessId}`),

  updateVerification: (businessId: string, payload: UpdateBusinessVerificationPayload) =>
    apiRequest<ApiResponseEnvelope<unknown>>(
      `/api/v1/admin/business-verifications/${businessId}`,
      { method: 'PUT', body: payload }
    ),
};
