import { lifecycleApi } from './lifecycle';

export const deliveryApi = {
  verifyPickup: lifecycleApi.verifyPickup,
  markInTransit: lifecycleApi.markInTransit,
  markArrived: lifecycleApi.markArrived,
  issueOtp: lifecycleApi.issueDeliveryOtp,
  confirmDelivery: lifecycleApi.confirmDelivery,
};
