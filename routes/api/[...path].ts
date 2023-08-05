import { type Handler } from "$fresh/server.ts";
import { Hono } from "$hono/mod.ts";
import { cors } from "$hono/middleware.ts";
import { Status } from "std/http/http_status.ts";
import { getApiCode } from "../../core/api.ts";
import { fetchMovieInfo } from "../../core/ps.ts";
import { isInvalidAccount } from "../../core/util.ts";
import type { CommonApiResponse, MovieInfo } from "../../model.ts";

const app = new Hono().basePath("/api");

app.use("*", cors({ origin: "*", allowHeaders: ["X-API-KEY"] }));

app.get(async (ctx) => {
  const { limit } = ctx.req.query();
  const { username, password } = ctx.req.header();

  const method = ctx.req.method;
  if (method !== "OPTIONS" && isInvalidAccount(username, password)) {
    return ctx.json<CommonApiResponse>({
      code: getApiCode({
        method,
        status: Status.Unauthorized,
      }),
      message: "ログイン時のユーザー名とパスワードで認証してください",
    }, Status.Unauthorized);
  }

  const movies = await fetchMovieInfo({
    table: "tbl_movieinfo",
    fields: ["id", "title", "view_date", "view_start_time", "view_end_time"],
    order: {
      target: "view_date",
      sort: "desc",
    },
    limit: Number(limit),
  });

  return ctx.json<Array<MovieInfo>>(movies);
});

export const handler: Handler = (req) => app.fetch(req);
