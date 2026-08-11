import { STATUS_CODE } from "@std/http";
import { define } from "~/utils.ts";
import { getApiCode } from "~/core/api.ts";
import { getApiMovies } from "~/core/db.ts";
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
      const unauthorized: CommonApiResponse = {
        code: getApiCode({ method, status: STATUS_CODE.Unauthorized }),
        message: "有効なAPIキーをX-API-KEYヘッダに指定してください",
      };
      return Response.json(unauthorized, {
        status: STATUS_CODE.Unauthorized,
      });
    }

    const movies = await getApiMovies(!!distinct);
    const result: PickApiMovie[] = limit
      ? movies.slice(0, Number(limit))
      : movies;

    return Response.json(result);
  },
});
