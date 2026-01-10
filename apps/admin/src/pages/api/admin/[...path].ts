import type { APIRoute } from "astro";

const apiBase = import.meta.env.PUBLIC_API_URL ?? "http://localhost:3001";

export const ALL: APIRoute = async ({ params, request }) => {
  const path = Array.isArray(params.path) ? params.path.join("/") : params.path ?? "";
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(`${apiBase}/admin/${path}`);
  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.set("x-admin", "true");
  headers.delete("host");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual"
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
};
