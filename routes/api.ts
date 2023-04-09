import { Status } from "std/http/http_status.ts";
import { getApiCode, jsonResponse } from "../core/api.ts";
import { fetchMovieInfo } from "../core/ps.ts";
import { isInvalidAccount } from "../core/util.ts";
import type { CommonApiResponse, MovieInfo } from "../model.ts";

/**
 * CineLogの鑑賞作品データ出力
 * @param req Request
 * @returns 鑑賞作品データの配列
 */
export const handler = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);

  if (
    req.method !== "OPTIONS" &&
    isInvalidAccount(req.headers.get("username"), req.headers.get("password"))
  ) {
    return jsonResponse<CommonApiResponse>({
      code: getApiCode({
        method: req.method,
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
    limit: Number(searchParams.get("limit")),
  });

  return jsonResponse<Array<MovieInfo>>(movies);
};
