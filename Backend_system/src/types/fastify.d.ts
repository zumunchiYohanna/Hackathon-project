import type { AuthenticatedUser } from "../middleware/authenticate";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser;
  }
}

