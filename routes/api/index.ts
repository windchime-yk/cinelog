import { STATUS_CODE } from "@std/http";
import { desc, sql } from "drizzle-orm";
import { define } from "~/utils.ts";
import { getApiCode } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { movieTable } from "~/db/schema.ts";
import type { PickApiMovie } from "~/db/model.ts";
import type { CommonApiResponse } from "~/model.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const limit = url.searchParams.get("limit");
    const distinct = url.searchParams.get("distinct");
    const username = ctx.req.headers.get("username") ?? "";
    const password = ctx.req.headers.get("password") ?? "";

    const method = ctx.req.method;
    if (isInvalidAccount(username, password)) {
      return Response.json<CommonApiResponse>({
        code: getApiCode({ method, status: STATUS_CODE.Unauthorized }),
        message: "ログイン時のユーザー名とパスワードで認証してください",
      }, { status: STATUS_CODE.Unauthorized });
    }

    const movies = await db.select({
      title: movieTable.title,
      view_date: sql<string>`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
    }).from(movieTable).orderBy(desc(movieTable.view_start_datetime));

    const removeDuplicates = (arr: PickApiMovie[]): PickApiMovie[] => {
      const seen = new Set<string>();
      return arr.filter((m) => {
        if (seen.has(m.title)) return false;
        seen.add(m.title);
        return true;
      });
    };

    let result = movies as PickApiMovie[];
    if (distinct) result = removeDuplicates(result);
    if (limit) result = result.slice(0, Number(limit));

    return Response.json<PickApiMovie[]>(result);
  },
});
