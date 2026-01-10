import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifySchema } from "fastify";
import { buildServer } from "./server.js";
import { prisma } from "./prisma.js";

const server = buildServer();

const publicBaseUrl = process.env.PUBLIC_BASE_URL ?? "http://localhost:3001";

const buildSchema = <T extends FastifySchema>(schema: T) => schema;

await server.register(swagger, {
  openapi: {
    info: {
      title: "BikesList API",
      description: "Public API for BikesList city and admin data.",
      version: "1.0.0"
    },
    servers: [{ url: publicBaseUrl }],
    tags: [{ name: "default" }]
  }
});

server.get("/openapi.json", async (_request, reply) => reply.send(server.swagger()));
server.get("/docs/json", async (_request, reply) => reply.send(server.swagger()));

server.addHook("onRequest", async (request, reply) => {
  if (request.raw.url === "/docs") {
    return reply.redirect(302, "/docs/");
  }
});

await server.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    url: "/docs/json"
  }
});

server.addContentTypeParser(["text/csv", "application/csv"], { parseAs: "string" }, (_req, body, done) => {
  if (typeof body === "string") {
    done(null, body);
    return;
  }
  done(new Error("Invalid CSV payload"));
});

const adminGuard = async (request: { headers: Record<string, string | undefined> }) => {
  const isAdmin = request.headers["x-admin"] === "true";
  if (!isAdmin) {
    const error = new Error("Admin access required");
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }
};

const parseCsv = (payload: string) => {
  const rows = payload
    .trim()
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].split(",").map((header) => header.trim());

  return rows.slice(1).map((row) => {
    const values = row.split(",").map((value) => value.trim());
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
};

server.get(
  "/health",
  {
    schema: buildSchema({
      tags: ["default"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            requestId: { type: "string" }
          },
          required: ["status", "requestId"]
        }
      }
    })
  },
  async (request) => ({
    status: "ok",
    requestId: request.id
  })
);

server.get("/", async (request) => ({
  status: "ok",
  requestId: request.id,
  service: "api",
  message: "BikesList API is online",
  docs: "/docs"
}));

server.get("/cities", async () => {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
  return { cities };
});

server.get("/cities/:slug", async (request, reply) => {
  const { slug } = request.params as { slug: string };
  const city = await prisma.city.findUnique({ where: { slug } });

  if (!city) {
    reply.code(404);
    return { message: "City not found" };
  }

  return { city };
});

server.post("/admin/cities", async (request, reply) => {
  await adminGuard(request);
  const body = request.body as {
    country_code: string;
    region?: string | null;
    name: string;
    slug: string;
    timezone: string;
    is_active?: boolean;
  };

  if (!body?.country_code || !body?.name || !body?.slug || !body?.timezone) {
    reply.code(400);
    return { message: "Missing required fields" };
  }

  const city = await prisma.city.create({
    data: {
      country_code: body.country_code,
      region: body.region ?? null,
      name: body.name,
      slug: body.slug,
      timezone: body.timezone,
      is_active: body.is_active ?? true
    }
  });

  reply.code(201);
  return { city };
});

server.patch("/admin/cities/:id", async (request, reply) => {
  await adminGuard(request);
  const { id } = request.params as { id: string };
  const body = request.body as { is_active?: boolean };

  if (typeof body?.is_active !== "boolean") {
    reply.code(400);
    return { message: "is_active must be provided" };
  }

  const city = await prisma.city.update({
    where: { id },
    data: { is_active: body.is_active }
  });

  return { city };
});

server.post("/admin/cities/import", async (request, reply) => {
  await adminGuard(request);

  const contentType = request.headers["content-type"] ?? "application/json";
  const payload = request.body;

  const normalizeIsActive = (value: unknown) => {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return true;
  };

  const records = Array.isArray(payload)
    ? payload
    : typeof payload === "string" && contentType.includes("csv")
      ? parseCsv(payload)
      : [];

  if (!records.length) {
    reply.code(400);
    return { message: "No city data provided" };
  }

  const created = [] as unknown[];
  for (const record of records) {
    const city = await prisma.city.create({
      data: {
        country_code: record.country_code,
        region: record.region || null,
        name: record.name,
        slug: record.slug,
        timezone: record.timezone,
        is_active: normalizeIsActive(record.is_active)
      }
    });
    created.push(city);
  }

  reply.code(201);
  return { cities: created };
});

server.get("/admin/cities/export", async (request, reply) => {
  await adminGuard(request);
  const format = (request.query as { format?: string }).format ?? "json";
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  if (format === "csv") {
    const headers = ["country_code", "region", "name", "slug", "timezone", "is_active"].join(","
    );
    const rows = cities
      .map((city) =>
        [
          city.country_code,
          city.region ?? "",
          city.name,
          city.slug,
          city.timezone,
          city.is_active ? "true" : "false"
        ].join(",")
      )
      .join("\n");
    reply.header("content-type", "text/csv");
    return `${headers}\n${rows}`;
  }

  return { cities };
});

const port = Number(process.env.PORT ?? 3001);

server.listen({ host: "0.0.0.0", port }).catch((error) => {
  server.log.error({ error }, "Failed to start server");
  process.exit(1);
});
