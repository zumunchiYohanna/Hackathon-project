import type { FastifyInstance } from "fastify";

import { AppError } from "../utils/app-error";

export function registerNotFoundHandler(app: FastifyInstance): void {
  app.setNotFoundHandler((request) => {
    throw new AppError(
      `Route ${request.method} ${request.url} not found.`,
      404,
      "NOT_FOUND"
    );
  });
}