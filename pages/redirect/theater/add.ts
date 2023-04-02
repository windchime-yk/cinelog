import { getCookies } from "../../../deps.ts";
import { getUrlParams, redirectResponse } from "../../../core/api.ts";
import { addTheaterInfo } from "../../../core/ps.ts";
import { isInvalidAccount } from "../../../core/util.ts";

/**
 * 鑑賞作品データ追加
 * @param req Request
 * @returns リダイレクトレスポンス
 */
export const AddTheaterRedirect = async (req: Request): Promise<Response> => {
  const body = await getUrlParams(req);
  const cookie = getCookies(req.headers);

  if (!isInvalidAccount(cookie.username, cookie.password)) {
    addTheaterInfo({
      table: "tbl_theater",
      inserts: {
        name: body.get("theater") as string,
      },
    });
  }

  return redirectResponse("/dashboard");
};
