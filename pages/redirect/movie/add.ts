import { getCookies } from "../../../deps.ts";
import {
  addMovieInfo,
  Convert,
  getUrlParams,
  isInvalidAccount,
  redirectResponse,
} from "../../../core.ts";

/**
 * 鑑賞作品データ追加
 * @param req Request
 * @returns リダイレクトレスポンス
 */
export const AddMovieRedirect = async (req: Request): Promise<Response> => {
  const body = await getUrlParams(req);
  const cookie = getCookies(req.headers);

  if (!isInvalidAccount(cookie.username, cookie.password)) {
    const convert = new Convert();

    addMovieInfo({
      table: "tbl_movieinfo",
      inserts: {
        title: body.get("title"),
        is_dubbed: convert.isFormToDatabase(body.get("is_dubbed")),
        is_domestic: convert.isFormToDatabase(body.get("is_domestic")),
        is_live_action: convert.isFormToDatabase(body.get("is_live_action")),
        theater: body.get("theater"),
        view_date: Intl.DateTimeFormat("ja-JP").format(
          new Date(body.get("view_date") ?? ""),
        ),
        view_start_time: body.get("view_start_time"),
        view_end_time: body.get("view_end_time"),
        accompanier: convert.nullish(body.get("accompanier")),
        rating: convert.nullish(body.get("rating")),
        comment: convert.nullish(body.get("comment")),
      },
    });
  }

  return redirectResponse("/");
};
