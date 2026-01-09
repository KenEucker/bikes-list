import Fastify from "fastify";
import { randomUUID } from "crypto";

export const buildServer = () =>
  Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info"
    },
    requestIdHeader: "x-request-id",
    genReqId: () => randomUUID()
  });
