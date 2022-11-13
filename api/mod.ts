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
export const cinelogApi = (req: Request): Response => {
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

  return jsonResponse<Array<MovieInfo>>(fetchMovieInfo());
};
