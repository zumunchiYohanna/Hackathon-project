import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import { env } from "./config/env";
import { db } from "./db/database";

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(helmet);

  await app.register(cors, {
    origin: env.CORS_ORIGIN
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  app.get("/health", async () => {
    const result = await db.query(
      "SELECT NOW() AS database_time"
    );

    return {
      status: "ok",
      service: "delivery-system-api",
      database: "connected",
      databaseTime: result.rows[0].database_time
    };
  });

  return app;
}