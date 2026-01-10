import type { APIRoute } from "astro";

const apiBase = import.meta.env.PUBLIC_API_URL ?? "http://localhost:3001";

export const ALL: APIRoute = async ({ params, request }) => {
  const path = Array.isArray(params.path) ? params.path.join("/") : params.path ?? "";
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(`${apiBase}/auth/${path}`);
  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", requestUrl.host);
  headers.set("x-forwarded-proto", requestUrl.protocol.replace(":", ""));
  headers.set("x-forwarded-prefix", "/api");
  headers.delete("host");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    ...(hasBody ? { duplex: "half" } : {}),
    redirect: "manual"
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
};
