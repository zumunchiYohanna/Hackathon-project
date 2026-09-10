import type { FastifyInstance } from "fastify";

import {
  authenticate
} from "../../middleware/authenticate";

import {
  authorize
} from "../../middleware/authorize";

import {
  successResponse
} from "../../utils/api-response";

import {
  createInventoryAdjustmentSchema,
  createInventorySchema,
  updateInventorySchema
} from "./inventory.schemas";

import {
  adjustInventoryForOwner,
  createInventoryForOwner,
  getInventoryAdjustmentsForOwner,
  getInventoryForOwner,
  getInventoryItemForOwner,
  updateInventoryForOwner
} from "./inventory.service";

export async function inventoryRoutes(
  app: FastifyInstance
) {
  app.addHook(
    "preHandler",
    authenticate
  );

  app.addHook(
    "preHandler",
    authorize("BUSINESS_USER")
  );

  /**
   * Get all inventory records
   * belonging to the authenticated
   * business owner.
   */
  app.get(
    "/me",
    async (request, reply) => {
      const inventory =
        await getInventoryForOwner(
          request.user.id
        );

      return successResponse(
        inventory,
        request.id
      );
    }
  );

  /**
   * Get a single inventory record.
   */
  app.get<{
    Params: {
      inventoryId: string;
    };
  }>(
    "/me/:inventoryId",
    async (request, reply) => {
      const inventory =
        await getInventoryItemForOwner(
          request.user.id,
          request.params.inventoryId
        );

      return successResponse(
        inventory,
        request.id
      );
    }
  );

  /**
   * Configure inventory for a business
   * catalog product.
   */
  app.post(
    "/me",
    async (request, reply) => {
      const input =
        createInventorySchema.parse(
          request.body
        );

      const inventory =
        await createInventoryForOwner(
          request.user.id,
          input
        );

      reply.code(201);

      return successResponse(
        inventory,
        request.id
      );
    }
  );

  /**
   * Update inventory configuration.
   *
   * quantityReserved is intentionally
   * not exposed here. Reservations are
   * controlled by the fulfillment system.
   */
  app.put<{
    Params: {
      inventoryId: string;
    };
  }>(
    "/me/:inventoryId",
    async (request, reply) => {
      const input =
        updateInventorySchema.parse(
          request.body
        );

      const inventory =
        await updateInventoryForOwner(
          request.user.id,
          request.params.inventoryId,
          input
        );

      return successResponse(
        inventory,
        request.id
      );
    }
  );

  /**
   * Apply an inventory adjustment.
   *
   * This creates an audit record for
   * the stock movement.
   */
  app.post<{
    Params: {
      inventoryId: string;
    };
  }>(
    "/me/:inventoryId/adjustments",
    async (request, reply) => {
      const input =
        createInventoryAdjustmentSchema.parse(
          request.body
        );

      const inventory =
        await adjustInventoryForOwner(
          request.user.id,
          request.params.inventoryId,
          input
        );

      return successResponse(
        inventory,
        request.id
      );
    }
  );

  /**
   * Get inventory adjustment history.
   */
  app.get<{
    Params: {
      inventoryId: string;
    };
  }>(
    "/me/:inventoryId/adjustments",
    async (request, reply) => {
      const adjustments =
        await getInventoryAdjustmentsForOwner(
          request.user.id,
          request.params.inventoryId
        );

      return successResponse(
        adjustments,
        request.id
      );
    }
  );
}