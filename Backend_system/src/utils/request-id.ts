import { randomUUID } from "node:crypto";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function requestIdMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const incomingRequestId = request.headers["x-request-id"];

  const requestId =
    typeof incomingRequestId === "string" && incomingRequestId.length <= 128
      ? incomingRequestId
      : randomUUID();

  request.id = requestId;

  reply.header("x-request-id", requestId);
}