import { lifecycleApi } from './lifecycle';

export const riderApi = {
  verifyPickup: lifecycleApi.verifyPickup,
  markInTransit: lifecycleApi.markInTransit,
  markArrived: lifecycleApi.markArrived,
};
