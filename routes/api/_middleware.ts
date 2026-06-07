import { define } from "~/utils.ts";

export const handler = define.middleware(async (ctx) => {
  if (ctx.req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  const resp = await ctx.next();
  const headers = new Headers(resp.headers);
  for (const [k, v] of Object.entries(corsHeaders())) {
    headers.set(k, v);
  }
  return new Response(resp.body, { status: resp.status, headers });
});

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-API-KEY",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}
