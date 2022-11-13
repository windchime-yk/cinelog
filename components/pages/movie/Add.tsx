/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { getCookies } from "../../../deps.ts";
import { isInvalidAccount, redirectResponse } from "../../../core.ts";

/**
 * データ追加画面
 * @returns JSX
 */
export const AddMoviePage = async (req: Request): Promise<Response> => {
  const bodyReader = await req.body?.getReader().read();
  const bodyReaderValue = bodyReader?.value;
  const decoder = new TextDecoder();
  const body = new URLSearchParams(decoder.decode(bodyReaderValue));
  const cookie = getCookies(req.headers);

  if (!isInvalidAccount(cookie.username, cookie.password)) {
    console.log(body);
  }

  return redirectResponse("/");
};
