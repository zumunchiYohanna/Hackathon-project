import type { FastifyInstance } from "fastify";

import { AppError } from "../utils/app-error";
import { errorResponse } from "../utils/api-response";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(
        errorResponse(
          error.code,
          error.message,
          undefined,
          request.id
        )
      );
    }

    request.log.error(error);

    return reply.status(500).send(
      errorResponse(
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred.",
        undefined,
        request.id
      )
    );
  });
}