import { buildServer } from "./server.js";

const server = buildServer();

server.get("/health", async (request) => ({
  status: "ok",
  requestId: request.id
}));

const port = Number(process.env.PORT ?? 3001);

server.listen({ host: "0.0.0.0", port }).catch((error) => {
  server.log.error({ error }, "Failed to start server");
  process.exit(1);
});
