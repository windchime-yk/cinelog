import { define } from "~/utils.ts";

export const handler = define.middleware((ctx) => {
  if (ctx.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  const resp = ctx.next();
  return resp.then((r) => {
    const headers = new Headers(r.headers);
    for (const [k, v] of Object.entries(corsHeaders())) {
      headers.set(k, v);
    }
    return new Response(r.body, { status: r.status, headers });
  });
});

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-API-KEY, username, password",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}
