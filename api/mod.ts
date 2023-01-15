import { statusCode } from "../deps.ts";
import {
  fetchMovieInfo,
  getApiCode,
  isInvalidAccount,
  jsonResponse,
} from "../core.ts";
import { CommonApiResponse, MovieInfo } from "../model.ts";

/**
 * CineLogの鑑賞作品データ出力
 * @param req Request
 * @returns 鑑賞作品データの配列
 */
export const cinelogApi = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);

  if (
    req.method !== "OPTIONS" &&
    isInvalidAccount(req.headers.get("username"), req.headers.get("password"))
  ) {
    return jsonResponse<CommonApiResponse>({
      code: getApiCode({
        method: req.method,
        status: statusCode.unauthorized,
      }),
      message: "ログイン時のユーザー名とパスワードで認証してください",
    }, statusCode.unauthorized);
  }

  const movies = await fetchMovieInfo({
    table: "tbl_movieinfo",
    distinct: Boolean(searchParams.get("distinct")),
    fields: ["id", "title", "view_date"],
    order: {
      target: "view_date",
      sort: "desc",
    },
    limit: Number(searchParams.get("limit")),
  });

  return jsonResponse<Array<MovieInfo>>(movies);
};
