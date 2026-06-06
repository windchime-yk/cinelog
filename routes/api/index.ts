import { STATUS_CODE } from "@std/http";
import { desc, max, sql } from "drizzle-orm";
import { define } from "~/utils.ts";
import { getApiCode } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { movieTable } from "~/db/schema.ts";
import type { PickApiMovie } from "~/db/model.ts";
import type { CommonApiResponse } from "~/model.ts";

const isInvalidApiKey = (key: string | null): boolean =>
  key !== Deno.env.get("API_KEY");

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const limit = url.searchParams.get("limit");
    const distinct = url.searchParams.get("distinct");
    const apiKey = ctx.req.headers.get("X-API-KEY");

    const method = ctx.req.method;
    if (isInvalidApiKey(apiKey)) {
      return Response.json<CommonApiResponse>({
        code: getApiCode({ method, status: STATUS_CODE.Unauthorized }),
        message: "有効なAPIキーをX-API-KEYヘッダに指定してください",
      }, { status: STATUS_CODE.Unauthorized });
    }

    let result: PickApiMovie[];

    if (distinct) {
      result = await db.select({
        title: movieTable.title,
        view_date: sql<
          string
        >`DATE_FORMAT(DATE(MAX(${movieTable.view_start_datetime})), '%Y/%m/%d')`,
      }).from(movieTable).groupBy(movieTable.title).orderBy(
        desc(max(movieTable.view_start_datetime)),
      );
    } else {
      result = await db.select({
        title: movieTable.title,
        view_date: sql<
          string
        >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
      }).from(movieTable).orderBy(desc(movieTable.view_start_datetime));
    }

    if (limit) result = result.slice(0, Number(limit));

    return Response.json<PickApiMovie[]>(result);
  },
});
