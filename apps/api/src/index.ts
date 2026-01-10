import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifySchema, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { buildServer } from "./server.js";
import { prisma } from "./prisma.js";
import type { AuthProvider, Module, Role, RoleAssignment, Session, User } from "@prisma/client";
import net from "net";

declare module "fastify" {
  interface FastifyRequest {
    user?: User | null;
    session?: Session | null;
    roleAssignments?: RoleAssignment[];
  }
}

const server = buildServer();

const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3001";

const buildSchema = <T extends FastifySchema>(schema: T) => schema;

await server.register(swagger, {
  openapi: {
    info: {
      title: "BikesList API",
      description: "Public API for BikesList city and admin data.",
      version: "1.0.0"
    },
    servers: [{ url: publicBaseUrl }],
    tags: [{ name: "default" }, { name: "admin" }],
    components: {
      securitySchemes: {
        sessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "bl_session"
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    },
    security: [{ sessionCookie: [] }, { bearerAuth: [] }]
  }
});

server.get("/openapi.json", async (_request, reply) => reply.send(server.swagger()));

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

const sessionCookieName = "bl_session";

const parseCookies = (cookieHeader?: string) =>
  (cookieHeader ?? "")
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, pair) => {
      const [key, ...rest] = pair.split("=");
      if (!key) {
        return acc;
      }
      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});

const getSessionToken = (request: FastifyRequest) => {
  const authHeader = request.headers.authorization ?? "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }
  const cookies = parseCookies(request.headers.cookie);
  return cookies[sessionCookieName];
};

const setSessionCookie = (reply: FastifyReply, token: string, expiresAt: Date) => {
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  reply.header(
    "set-cookie",
    `${sessionCookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.max(
      maxAge,
      0
    )}`
  );
};

const clearSessionCookie = (reply: FastifyReply) => {
  reply.header(
    "set-cookie",
    `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
};

const loadSession = async (request: FastifyRequest) => {
  const token = getSessionToken(request);
  if (!token) {
    return null;
  }
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) {
    return null;
  }

  if (session.revoked_at || session.expires_at.getTime() < Date.now()) {
    return null;
  }

  return session;
};

const loadRoleAssignments = async (userId?: string) => {
  if (!userId) {
    return [];
  }
  return prisma.roleAssignment.findMany({
    where: { user_id: userId }
  });
};

const normalizeRole = (role: string) => role.toUpperCase() as Role;
const normalizeModule = (module: string) => module.toUpperCase() as Module;

const hasRole = (
  assignments: RoleAssignment[],
  role: Role,
  options?: { cityId?: string | null; module?: Module | null }
) => {
  return assignments.some((assignment) => {
    if (assignment.role !== role) {
      return false;
    }
    if (options?.cityId && assignment.city_id !== options.cityId) {
      return false;
    }
    if (options?.module && assignment.module !== options.module) {
      return false;
    }
    return true;
  });
};

const requireRoles =
  (roles: Role[], options?: { allowSelf?: boolean }) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const session = await loadSession(request);
    if (!session) {
      reply.code(401);
      return reply.send({ message: "Authentication required" });
    }

    const assignments = await loadRoleAssignments(session.user_id);
    request.session = session;
    request.user = session.user;
    request.roleAssignments = assignments;

    const hasAny =
      roles.some((role) => hasRole(assignments, role)) || hasRole(assignments, "SUPER_ADMIN");
    if (!hasAny) {
      reply.code(403);
      return reply.send({ message: "Insufficient permissions" });
    }
  };

server.addHook("preHandler", async (request) => {
  const session = await loadSession(request);
  if (!session) {
    request.user = null;
    request.session = null;
    request.roleAssignments = [];
    return;
  }
  request.user = session.user;
  request.session = session;
  request.roleAssignments = await loadRoleAssignments(session.user_id);
});

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

const sessionDurationDays = 30;
const magicLinkDurationMinutes = 30;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM;

const canSendEmail = Boolean(smtpHost && smtpPort && smtpFrom);

const waitForResponse = (socket: net.Socket) =>
  new Promise<string>((resolve) => {
    const onData = (chunk: Buffer) => {
      const response = chunk.toString();
      socket.off("data", onData);
      resolve(response);
    };
    socket.on("data", onData);
  });

const sendCommand = async (socket: net.Socket, command: string) => {
  socket.write(`${command}\r\n`);
  return waitForResponse(socket);
};

const sendMagicLinkEmail = async (email: string, link: string) => {
  if (!canSendEmail || !smtpHost || !smtpPort || !smtpFrom) {
    return false;
  }

  const socket = net.createConnection({ host: smtpHost, port: smtpPort });
  const cleanup = () => {
    socket.end();
    socket.destroy();
  };

  const payload = [
    `From: ${smtpFrom}`,
    `To: ${email}`,
    "Subject: Your BikesList magic link",
    "Content-Type: text/plain; charset=utf-8",
    "",
    `Use this link to sign in: ${link}`,
    ""
  ].join("\r\n");

  try {
    await waitForResponse(socket);
    await sendCommand(socket, "EHLO bikeslist.local");

    if (smtpUser && smtpPass) {
      const authToken = Buffer.from(`\u0000${smtpUser}\u0000${smtpPass}`).toString("base64");
      await sendCommand(socket, "AUTH PLAIN");
      await sendCommand(socket, authToken);
    }

    await sendCommand(socket, `MAIL FROM:<${smtpFrom}>`);
    await sendCommand(socket, `RCPT TO:<${email}>`);
    await sendCommand(socket, "DATA");
    socket.write(`${payload}\r\n.\r\n`);
    await waitForResponse(socket);
    await sendCommand(socket, "QUIT");
    cleanup();
    return true;
  } catch (error) {
    cleanup();
    throw error;
  }
};

const createSession = async (
  user: User,
  provider: AuthProvider,
  request: FastifyRequest
) => {
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + sessionDurationDays);

  const session = await prisma.session.create({
    data: {
      user_id: user.id,
      token,
      provider,
      expires_at: expiresAt,
      ip_address: request.ip,
      user_agent: request.headers["user-agent"] ?? null
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { last_login_at: new Date() }
  });

  return session;
};

const findOrCreateUser = async (email: string, data?: Partial<User>) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        display_name: data?.display_name ?? existing.display_name,
        avatar_url: data?.avatar_url ?? existing.avatar_url,
        discord_id: data?.discord_id ?? existing.discord_id,
        google_id: data?.google_id ?? existing.google_id
      }
    });
  }
  return prisma.user.create({
    data: {
      email,
      display_name: data?.display_name ?? null,
      avatar_url: data?.avatar_url ?? null,
      discord_id: data?.discord_id ?? null,
      google_id: data?.google_id ?? null
    }
  });
};

const ensureSuperAdmin = async (user: User) => {
  const configured = process.env.SUPER_ADMIN_EMAILS ?? "";
  const emails = configured
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!emails.includes(user.email.toLowerCase())) {
    return;
  }
  await prisma.roleAssignment.upsert({
    where: {
      user_id_role_city_id_module: {
        user_id: user.id,
        role: "SUPER_ADMIN",
        city_id: null,
        module: null
      }
    },
    update: {},
    create: {
      user_id: user.id,
      role: "SUPER_ADMIN",
      city_id: null,
      module: null
    }
  });
};

const normalizeUrl = (value: string) => {
  if (!value) {
    return "http://localhost:3001";
  }
  return value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
};

const buildRedirectUri = (value: string | undefined, fallback: string) => {
  const base = normalizeUrl(value ?? fallback);
  const url = new URL(base);
  if (url.pathname === "/" || url.pathname === "") {
    const fallbackUrl = new URL(normalizeUrl(fallback));
    url.pathname = fallbackUrl.pathname;
  }
  return url.toString();
};

const buildRequestOrigin = (request: FastifyRequest) => {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"];
  const host = forwardedHost ?? request.headers.host;
  const protocol = typeof forwardedProto === "string" ? forwardedProto : "http";
  if (!host) {
    return normalizeUrl(publicBaseUrl);
  }
  return `${protocol}://${host}`;
};

const buildRequestAuthBase = (request: FastifyRequest) => {
  const origin = buildRequestOrigin(request);
  const forwardedPrefix = request.headers["x-forwarded-prefix"];
  const hasForwardedPrefix = typeof forwardedPrefix === "string" && forwardedPrefix.length > 0;
  const requestPath = request.url ?? "";
  const inferredPrefix = requestPath.startsWith("/api/") ? "/api" : "";
  const prefix = hasForwardedPrefix ? forwardedPrefix : inferredPrefix;
  return `${origin}${prefix}`;
};

const sendSessionResponse = async (
  request: FastifyRequest,
  reply: FastifyReply,
  session: Session
) => {
  setSessionCookie(reply, session.token, session.expires_at);
  const user = await prisma.user.findUnique({
    where: { id: session.user_id }
  });
  const roles = await prisma.roleAssignment.findMany({
    where: { user_id: session.user_id },
    include: { city: true }
  });
  const queryRedirect = (request.query as { redirect?: string }).redirect;
  const redirect = queryRedirect ?? getOauthRedirectCookie(request);
  if (redirect) {
    reply.redirect(302, redirect);
    return;
  }
  const accept = request.headers.accept ?? "";
  if (accept.includes("text/html")) {
    reply.redirect(302, "/");
    return;
  }
  reply.send({ user, roles });
};

const buildOauthState = () => randomUUID();

const oauthStateCookieName = "bl_oauth_state";
const oauthRedirectCookieName = "bl_oauth_redirect";

const setOauthStateCookie = (reply: FastifyReply, state: string) => {
  reply.header(
    "set-cookie",
    `${oauthStateCookieName}=${encodeURIComponent(state)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900`
  );
};

const setOauthRedirectCookie = (reply: FastifyReply, redirect: string) => {
  reply.header(
    "set-cookie",
    `${oauthRedirectCookieName}=${encodeURIComponent(redirect)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900`
  );
};

const getOauthStateCookie = (request: FastifyRequest) => {
  const cookies = parseCookies(request.headers.cookie);
  return cookies[oauthStateCookieName];
};

const getOauthRedirectCookie = (request: FastifyRequest) => {
  const cookies = parseCookies(request.headers.cookie);
  return cookies[oauthRedirectCookieName];
};

const validateOauthState = (request: FastifyRequest, state: string | null) => {
  const stored = getOauthStateCookie(request);
  return Boolean(state && stored && state === stored);
};

const fetchDiscordProfile = async (code: string, redirectUri: string) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Discord OAuth environment variables are missing.");
  }

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = (await tokenResponse.json().catch(() => ({}))) as {
    access_token?: string;
    token_type?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    const details = tokenData.error
      ? `${tokenData.error}${tokenData.error_description ? `: ${tokenData.error_description}` : ""}`
      : `status ${tokenResponse.status}`;
    throw new Error(`Failed to fetch Discord access token (${details}).`);
  }

  const profileResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { authorization: `${tokenData.token_type ?? "Bearer"} ${tokenData.access_token}` }
  });
  const profile = (await profileResponse.json()) as {
    id: string;
    email?: string;
    username?: string;
    avatar?: string | null;
  };

  return {
    providerId: profile.id,
    email: profile.email,
    displayName: profile.username,
    avatarUrl: profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      : null
  };
};

const fetchGoogleProfile = async (code: string, redirectUri: string) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth environment variables are missing.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!tokenData.access_token) {
    throw new Error("Failed to fetch Google access token.");
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${tokenData.access_token}` }
  });
  const profile = (await profileResponse.json()) as {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  return {
    providerId: profile.id,
    email: profile.email,
    displayName: profile.name,
    avatarUrl: profile.picture ?? null
  };
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

server.get("/me", async (request, reply) => {
  if (!request.user || !request.session) {
    reply.code(401);
    return { message: "Not authenticated" };
  }
  const roles = await prisma.roleAssignment.findMany({
    where: { user_id: request.user.id },
    include: { city: true }
  });
  return { user: request.user, roles };
});

server.post("/auth/logout", async (request, reply) => {
  if (request.session) {
    await prisma.session.update({
      where: { id: request.session.id },
      data: { revoked_at: new Date() }
    });
  }
  clearSessionCookie(reply);
  return { status: "ok" };
});

const createMagicLinkHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const body = request.body as { email?: string; redirect?: string };
    if (!body?.email) {
      reply.code(400);
      return { message: "Email required" };
    }

    const email = body.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      const signupUrl = `${buildRequestOrigin(request)}/signup`;
      reply.code(404);
      return { message: "User not found", signup_url: signupUrl };
    }

    const user = await findOrCreateUser(email);
    await ensureSuperAdmin(user);

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + magicLinkDurationMinutes);

    await prisma.session.create({
      data: {
        user_id: user.id,
        token,
        provider: "MAGIC_LINK",
        expires_at: expiresAt,
        ip_address: request.ip,
        user_agent: request.headers["user-agent"] ?? null
      }
    });

    const redirect = body.redirect ? `?redirect=${encodeURIComponent(body.redirect)}` : "";
    const authBase = buildRequestAuthBase(request);
    const link = `${authBase}/auth/magic-link/${token}${redirect}`;
    request.log.info({ email, link }, "Generated magic link");

    const emailSent = await sendMagicLinkEmail(email, link);
    if (emailSent) {
      request.log.info({ email }, "Magic link email sent");
    } else {
      request.log.info({ email }, "Magic link email not sent (SMTP not configured)");
    }

    return { link, expires_at: expiresAt, email_sent: emailSent };
  } catch (error) {
    request.log.error({ error }, "Failed to create magic link");
    reply.code(500);
    return {
      message: "Failed to create magic link. Check API logs for details."
    };
  }
};

server.post("/auth/magic-link", createMagicLinkHandler);
server.post("/api/auth/magic-link", createMagicLinkHandler);

const consumeMagicLinkHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { token } = request.params as { token: string };
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session || session.revoked_at || session.expires_at.getTime() < Date.now()) {
    reply.code(400);
    return { message: "Magic link expired" };
  }
  const refreshedExpiry = new Date();
  refreshedExpiry.setDate(refreshedExpiry.getDate() + sessionDurationDays);
  const refreshedSession = await prisma.session.update({
    where: { id: session.id },
    data: { last_used_at: new Date(), expires_at: refreshedExpiry }
  });
  await sendSessionResponse(request, reply, refreshedSession);
};

server.get("/auth/magic-link/:token", consumeMagicLinkHandler);
server.get("/api/auth/magic-link/:token", consumeMagicLinkHandler);

const startDiscordAuthHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = buildRedirectUri(
    process.env.DISCORD_REDIRECT_URL,
    `${buildRequestAuthBase(request)}/auth/discord/callback`
  );
  request.log.info({ redirectUri }, "Discord OAuth redirect URI");
  const missing = [];
  if (!clientId) {
    missing.push("DISCORD_CLIENT_ID");
  }
  if (!clientSecret) {
    missing.push("DISCORD_CLIENT_SECRET");
  }
  if (missing.length) {
    reply.code(500);
    return { message: "Discord OAuth not configured", missing };
  }
  const state = buildOauthState();
  setOauthStateCookie(reply, state);
  const redirect = (request.query as { redirect?: string }).redirect;
  if (redirect) {
    setOauthRedirectCookie(reply, redirect);
  }
  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "identify email",
    redirect_uri: redirectUri,
    state
  }).toString();
  reply.redirect(url.toString());
};

server.get("/auth/discord", startDiscordAuthHandler);
server.get("/api/auth/discord", startDiscordAuthHandler);

const discordCallbackHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { code, state } = request.query as { code?: string; state?: string };
  if (!code || !validateOauthState(request, state ?? null)) {
    reply.code(400);
    return { message: "Invalid OAuth state" };
  }

  const redirectUri = buildRedirectUri(
    process.env.DISCORD_REDIRECT_URL,
    `${buildRequestAuthBase(request)}/auth/discord/callback`
  );
  const profile = await fetchDiscordProfile(code, redirectUri);
  if (!profile.email) {
    reply.code(400);
    return { message: "Discord did not return an email address" };
  }

  const user = await findOrCreateUser(profile.email, {
    display_name: profile.displayName ?? null,
    avatar_url: profile.avatarUrl ?? null,
    discord_id: profile.providerId
  });
  await ensureSuperAdmin(user);

  const session = await createSession(user, "DISCORD", request);
  await sendSessionResponse(request, reply, session);
};

server.get("/auth/discord/callback", discordCallbackHandler);
server.get("/api/auth/discord/callback", discordCallbackHandler);

const startGoogleAuthHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = buildRedirectUri(
    process.env.GOOGLE_REDIRECT_URL,
    `${buildRequestAuthBase(request)}/auth/google/callback`
  );
  request.log.info({ redirectUri }, "Google OAuth redirect URI");
  const missing = [];
  if (!clientId) {
    missing.push("GOOGLE_CLIENT_ID");
  }
  if (!clientSecret) {
    missing.push("GOOGLE_CLIENT_SECRET");
  }
  if (missing.length) {
    reply.code(500);
    return { message: "Google OAuth not configured", missing };
  }
  const state = buildOauthState();
  setOauthStateCookie(reply, state);
  const redirect = (request.query as { redirect?: string }).redirect;
  if (redirect) {
    setOauthRedirectCookie(reply, redirect);
  }
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "openid email profile",
    redirect_uri: redirectUri,
    state,
    access_type: "online",
    prompt: "consent"
  }).toString();
  reply.redirect(url.toString());
};

server.get("/auth/google", startGoogleAuthHandler);
server.get("/api/auth/google", startGoogleAuthHandler);

const googleCallbackHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { code, state } = request.query as { code?: string; state?: string };
  if (!code || !validateOauthState(request, state ?? null)) {
    reply.code(400);
    return { message: "Invalid OAuth state" };
  }

  const redirectUri = buildRedirectUri(
    process.env.GOOGLE_REDIRECT_URL,
    `${buildRequestAuthBase(request)}/auth/google/callback`
  );
  const profile = await fetchGoogleProfile(code, redirectUri);
  if (!profile.email) {
    reply.code(400);
    return { message: "Google did not return an email address" };
  }

  const user = await findOrCreateUser(profile.email, {
    display_name: profile.displayName ?? null,
    avatar_url: profile.avatarUrl ?? null,
    google_id: profile.providerId
  });
  await ensureSuperAdmin(user);

  const session = await createSession(user, "GOOGLE", request);
  await sendSessionResponse(request, reply, session);
};

server.get("/auth/google/callback", googleCallbackHandler);
server.get("/api/auth/google/callback", googleCallbackHandler);

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

server.post(
  "/admin/cities",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async (request, reply) => {
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
  }
);

server.patch(
  "/admin/cities/:id",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async (request, reply) => {
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
  }
);

server.post(
  "/admin/cities/import",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async (request, reply) => {
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
  }
);

server.get("/admin/cities/export", { preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"]) }, async (request, reply) => {
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

server.get(
  "/admin/users",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async () => {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      include: {
        role_assignments: {
          include: { city: true }
        }
      }
    });
    return { users };
  }
);

server.post(
  "/admin/users",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async (request, reply) => {
    const body = request.body as { email?: string; display_name?: string | null };
    if (!body?.email) {
      reply.code(400);
      return { message: "Email required" };
    }
    const user = await findOrCreateUser(body.email.trim().toLowerCase(), {
      display_name: body.display_name ?? null
    });
    reply.code(201);
    return { user };
  }
);

server.post(
  "/admin/users/:id/roles",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      role?: string;
      city_id?: string | null;
      module?: string | null;
    };
    if (!body?.role) {
      reply.code(400);
      return { message: "Role required" };
    }
    const role = normalizeRole(body.role);
    const moduleValue = body.module ? normalizeModule(body.module) : null;
    const cityId = body.city_id && body.city_id.length ? body.city_id : null;

    const existingAssignment = await prisma.roleAssignment.findFirst({
      where: {
        user_id: id,
        role,
        city_id: cityId,
        module: moduleValue
      }
    });

    const assignment =
      existingAssignment ??
      (await prisma.roleAssignment.create({
        data: {
          user_id: id,
          role,
          city_id: cityId,
          module: moduleValue
        }
      }));
    reply.code(201);
    return { assignment };
  }
);

server.delete(
  "/admin/users/:id/roles",
  {
    schema: buildSchema({
      tags: ["admin"],
      security: [{ sessionCookie: [] }, { bearerAuth: [] }]
    }),
    preHandler: requireRoles(["ADMIN", "SUPER_ADMIN"])
  },
  async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      role?: string;
      city_id?: string | null;
      module?: string | null;
    };
    if (!body?.role) {
      reply.code(400);
      return { message: "Role required" };
    }
    const role = normalizeRole(body.role);
    const moduleValue = body.module ? normalizeModule(body.module) : null;
    const cityId = body.city_id && body.city_id.length ? body.city_id : null;
    await prisma.roleAssignment.deleteMany({
      where: {
        user_id: id,
        role,
        city_id: cityId,
        module: moduleValue
      }
    });
    return { status: "ok" };
  }
);

const port = Number(process.env.PORT ?? 3001);

server.listen({ host: "0.0.0.0", port }).catch((error) => {
  server.log.error({ error }, "Failed to start server");
  process.exit(1);
});
