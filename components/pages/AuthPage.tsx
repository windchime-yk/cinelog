/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { setCookie } from "../../deps.ts";
import { isInvalidAccount, redirectResponse } from "../../core.ts";

/**
 * 認証画面
 * @param req Request
 * @returns JSX
 */
export const AuthPage = async (req: Request): Promise<Response> => {
  const bodyReader = await req.body?.getReader().read();
  const bodyReaderValue = bodyReader?.value;
  const decoder = new TextDecoder();
  const body = new URLSearchParams(decoder.decode(bodyReaderValue));

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
