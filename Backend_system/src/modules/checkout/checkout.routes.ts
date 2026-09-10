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
  checkoutPreviewSchema
} from "./checkout.schemas";

import {
  previewCheckout
} from "./checkout.service";

export async function checkoutRoutes(
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

  app.post(
    "/preview",
    async (request) => {
      const input =
        checkoutPreviewSchema.parse(
          request.body
        );

      const checkout =
        await previewCheckout(
          request.user.id,
          input
        );

      return successResponse(
        checkout,
        request.id
      );
    }
  );
}