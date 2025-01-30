import { type Handler } from "$fresh/server.ts";
import { Hono } from "$hono/mod.ts";
import { cors } from "$hono/middleware.ts";
import { Status } from "$std/http/http_status.ts";
import { desc, sql } from "drizzle-orm";
import { getApiCode } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { movieTable } from "~/db/schema.ts";
import type { PickApiMovie } from "~/db/model.ts";
import type { CommonApiResponse } from "~/model.ts";

const app = new Hono().basePath("/api");

app.use("*", cors({ origin: "*", allowHeaders: ["X-API-KEY"] }));

app.get(async (ctx) => {
  const { limit, distinct } = ctx.req.query();
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
  }).from(movieTable).orderBy(
    desc(movieTable.view_start_datetime),
  );

  const removeDuplicatesMovie = (
    array: PickApiMovie[],
    movieKey: keyof PickApiMovie,
  ): PickApiMovie[] => {
    const uniqueKeys = new Set();
    const result: PickApiMovie[] = [];
    for (const item of array) {
      const key = item[movieKey];
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(item);
      }
    }
    return result;
  };

  if (distinct && limit) {
    return ctx.json<Array<PickApiMovie>>(
      removeDuplicatesMovie(movies, "title").slice(0, Number(limit)),
    );
  } else if (distinct) {
    return ctx.json<Array<PickApiMovie>>(
      removeDuplicatesMovie(movies, "title"),
    );
  } else if (limit) {
    return ctx.json<Array<PickApiMovie>>(movies.slice(0, Number(limit)));
  } else {
    return ctx.json<Array<PickApiMovie>>(movies);
  }
});

export const handler: Handler = (req) => app.fetch(req);
