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
  addCartItemSchema,
  updateCartItemSchema
} from "./cart.schemas";

import {
  addItemToCustomerCart,
  clearCustomerCart,
  getCustomerCart,
  removeCustomerCartItem,
  updateCustomerCartItem
} from "./cart.service";

export async function cartRoutes(
  app: FastifyInstance
) {
  app.addHook(
    "preHandler",
    authenticate
  );

  app.addHook(
    "preHandler",
    authorize("CUSTOMER", "BUSINESS_USER")
  );

  app.get(
    "/",
    async (request) => {
      const cart =
        await getCustomerCart(
          request.user.id
        );

      return successResponse(
        cart,
        request.id
      );
    }
  );

  app.post(
    "/items",
    async (request, reply) => {
      const input =
        addCartItemSchema.parse(
          request.body
        );

      const cart =
        await addItemToCustomerCart(
          request.user.id,
          input
        );

      return successResponse(
        cart,
        request.id
      );
    }
  );

  app.put<{
    Params: {
      itemId: string;
    };
  }>(
    "/items/:itemId",
    async (request) => {
      const input =
        updateCartItemSchema.parse(
          request.body
        );

      const cart =
        await updateCustomerCartItem(
          request.user.id,
          request.params.itemId,
          input
        );

      return successResponse(
        cart,
        request.id
      );
    }
  );

  app.delete<{
    Params: {
      itemId: string;
    };
  }>(
    "/items/:itemId",
    async (request) => {
      const cart =
        await removeCustomerCartItem(
          request.user.id,
          request.params.itemId
        );

      return successResponse(
        cart,
        request.id
      );
    }
  );

  app.delete(
    "/",
    async (request) => {
      const cart =
        await clearCustomerCart(
          request.user.id
        );

      return successResponse(
        cart,
        request.id
      );
    }
  );
}