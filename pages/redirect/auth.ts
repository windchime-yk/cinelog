import { setCookie } from "../../deps.ts";
import { getUrlParams, redirectResponse } from "../../core/api.ts";
import { isInvalidAccount } from "../../core/util.ts";
/**
 * アカウント認証
 * @param req Request
 * @returns リダイレクトレスポンス
 */
export const AuthRedirect = async (req: Request): Promise<Response> => {
  const body = await getUrlParams(req);
  const response = redirectResponse("/");

  if (!isInvalidAccount(body.get("username"), body.get("password"))) {
    setCookie(response.headers, {
      name: "username",
      value: body.get("username") || "",
    });
    setCookie(response.headers, {
      name: "password",
      value: body.get("password") || "",
    });
  }

  return response;
};
