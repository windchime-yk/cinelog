/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { setCookie } from "../../deps.ts";
import {
  getUrlParams,
  isInvalidAccount,
  redirectResponse,
} from "../../core.ts";

/**
 * 認証画面
 * @param req Request
 * @returns JSX
 */
export const AuthPage = async (req: Request): Promise<Response> => {
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
