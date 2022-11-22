/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { getCookies } from "../../../deps.ts";
import {
  getUrlParams,
  isInvalidAccount,
  redirectResponse,
} from "../../../core.ts";

/**
 * データ追加画面
 * @returns JSX
 */
export const AddMoviePage = async (req: Request): Promise<Response> => {
  const body = await getUrlParams(req);
  const cookie = getCookies(req.headers);

  if (!isInvalidAccount(cookie.username, cookie.password)) {
    console.log(body);
  }

  return redirectResponse("/");
};
