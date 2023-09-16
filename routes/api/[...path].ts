import { type Handler } from "$fresh/server.ts";
import { Hono } from "$hono/mod.ts";
import { cors } from "$hono/middleware.ts";
import { Status } from "$std/http/http_status.ts";
import { desc, sql } from "drizzle-orm";
import { getApiCode } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { movieTable, type PickApiMovie } from "~/db/schema/movie.ts";
import type { CommonApiResponse } from "~/model.ts";

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

  const movies = await db.select({
    title: movieTable.title,
    view_date: sql<
      string
    >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
  }).from(movieTable).orderBy(desc(movieTable.view_start_datetime)).limit(
    Number(limit),
  );

  return ctx.json<Array<PickApiMovie>>(movies);
});

export const handler: Handler = (req) => app.fetch(req);
