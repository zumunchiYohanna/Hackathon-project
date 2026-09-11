import type { FastifyInstance } from "fastify";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { successResponse } from "../../utils/api-response";
import {
  deliveryIdParamsSchema,
  orderIdParamsSchema,
  paymentIdParamsSchema,
  pickupCredentialSchema,
  providerPaymentSchema,
  deliveryOtpSchema
} from "./lifecycle.schemas";
import {
  acceptBusinessOrder,
  confirmDelivery,
  issueDeliveryOtp,
  listBusinessOrders,
  markBusinessReady,
  processProviderPayment,
  updateRiderDeliveryStatus,
  verifyPickup
} from "./lifecycle.service";

export async function lifecycleRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/business/orders",
    { preHandler: [authenticate, authorize("BUSINESS_USER")] },
    async (request) => successResponse(
      await listBusinessOrders(request.user.id),
      request.id
    )
  );

  app.post(
    "/business/orders/:orderId/accept",
    { preHandler: [authenticate, authorize("BUSINESS_USER")] },
    async (request) => {
      const { orderId } = orderIdParamsSchema.parse(request.params);
      return successResponse(
        await acceptBusinessOrder(request.user.id, orderId),
        request.id
      );
    }
  );

  app.post(
    "/business/orders/:orderId/ready",
    { preHandler: [authenticate, authorize("BUSINESS_USER")] },
    async (request) => {
      const { orderId } = orderIdParamsSchema.parse(request.params);
      return successResponse(
        await markBusinessReady(request.user.id, orderId),
        request.id
      );
    }
  );

  app.post(
    "/payments/:paymentId/provider-event",
    { preHandler: [authenticate, authorize("ADMIN")] },
    async (request) => {
      const { paymentId } = paymentIdParamsSchema.parse(request.params);
      const input = providerPaymentSchema.parse(request.body);
      return successResponse(
        await processProviderPayment(request.user.id, paymentId, input),
        request.id
      );
    }
  );

  app.post(
    "/deliveries/:deliveryId/pickup/verify",
    { preHandler: [authenticate, authorize("RIDER")] },
    async (request) => {
      const { deliveryId } = deliveryIdParamsSchema.parse(request.params);
      const { credential } = pickupCredentialSchema.parse(request.body);
      return successResponse(
        await verifyPickup(request.user.id, deliveryId, credential),
        request.id
      );
    }
  );

  app.post(
    "/deliveries/:deliveryId/in-transit",
    { preHandler: [authenticate, authorize("RIDER")] },
    async (request) => {
      const { deliveryId } = deliveryIdParamsSchema.parse(request.params);
      return successResponse(
        await updateRiderDeliveryStatus(request.user.id, deliveryId, "IN_TRANSIT"),
        request.id
      );
    }
  );

  app.post(
    "/deliveries/:deliveryId/arrived",
    { preHandler: [authenticate, authorize("RIDER")] },
    async (request) => {
      const { deliveryId } = deliveryIdParamsSchema.parse(request.params);
      return successResponse(
        await updateRiderDeliveryStatus(request.user.id, deliveryId, "ARRIVED"),
        request.id
      );
    }
  );

  app.post(
    "/deliveries/:deliveryId/otp",
    { preHandler: [authenticate, authorize("CUSTOMER")] },
    async (request) => {
      const { deliveryId } = deliveryIdParamsSchema.parse(request.params);
      return successResponse(
        await issueDeliveryOtp(request.user.id, deliveryId),
        request.id
      );
    }
  );

  app.post(
    "/deliveries/:deliveryId/confirm",
    { preHandler: [authenticate, authorize("CUSTOMER")] },
    async (request) => {
      const { deliveryId } = deliveryIdParamsSchema.parse(request.params);
      const { otp } = deliveryOtpSchema.parse(request.body);
      return successResponse(
        await confirmDelivery(request.user.id, deliveryId, otp),
        request.id
      );
    }
  );
}
