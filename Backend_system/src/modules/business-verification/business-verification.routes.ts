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
  businessVerificationStatusSchema,
  businessIdParamsSchema,
  updateBusinessVerificationSchema
} from "./business-verification.schemas";

import {
  getBusinessVerification,
  listBusinessVerifications,
  reviewBusinessVerification
} from "./business-verification.service";

export async function businessVerificationRoutes(
  app: FastifyInstance
) {
  app.addHook(
    "preHandler",
    authenticate
  );

  app.addHook(
    "preHandler",
    authorize("ADMIN")
  );

  app.get(
    "/",
    async (request) => {
      const query =
        request.query as {
          status?: string;
        };

      const status =
        query.status
          ? businessVerificationStatusSchema.parse(
              query.status
            )
          : undefined;

      const verifications =
        await listBusinessVerifications(
          status
        );

      return successResponse(
        verifications,
        request.id
      );
    }
  );

  app.get(
    "/:businessId",
    async (request) => {
      const params = businessIdParamsSchema.parse(
        request.params
      );

      const result =
        await getBusinessVerification(
          params.businessId
        );

      return successResponse(
        result,
        request.id
      );
    }
  );

  app.put(
    "/:businessId",
    async (request) => {
      const params = businessIdParamsSchema.parse(
        request.params
      );

      const input =
        updateBusinessVerificationSchema.parse(
          request.body
        );

      const verification =
        await reviewBusinessVerification(
          params.businessId,
          request.user.id,
          input
        );

      return successResponse(
        verification,
        request.id
      );
    }
  );
}