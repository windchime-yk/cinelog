import { getCookies, setCookie } from "@std/http/cookie";
import { createHmac, timingSafeEqual } from "node:crypto";

/** セッションCookieの名前 */
const SESSION_COOKIE_NAME = "session";

/** セッションの有効期間（秒） */
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * 署名鍵を組み立てる
 *
 * パスワードから導出しているため、パスワードを変更すると発行済みのセッションは
 * すべて無効になる
 */
const getSigningKey = (): string =>
  `${Deno.env.get("USERNAME")}:${Deno.env.get("PASSWORD")}`;

/**
 * 署名を生成する
 * @param payload 署名対象
 */
const sign = (payload: string): string =>
  createHmac("sha256", getSigningKey()).update(payload).digest("base64url");

/**
 * 署名同士を時間差の出ない方法で比較する
 * @param actual Cookieから受け取った署名
 * @param expected サーバー側で計算した署名
 */
const isSameSignature = (actual: string, expected: string): boolean => {
  const encoder = new TextEncoder();
  const actualBytes = encoder.encode(actual);
  const expectedBytes = encoder.encode(expected);

  // timingSafeEqualは長さが異なると例外を投げるため、先に長さで弾く
  if (actualBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(actualBytes, expectedBytes);
};

/**
 * セッショントークンを発行する
 *
 * 有効期限と、その署名だけで構成する。パスワードそのものは載せない
 * @param now 現在時刻（UNIX時間・ミリ秒）
 */
export const createSessionToken = (now: number = Date.now()): string => {
  const expiresAt = String(Math.floor(now / 1000) + SESSION_MAX_AGE);
  return `${expiresAt}.${sign(expiresAt)}`;
};

/**
 * セッショントークンが有効か
 * @param token セッショントークン
 * @param now 現在時刻（UNIX時間・ミリ秒）
 */
export const isValidSessionToken = (
  token: string | undefined,
  now: number = Date.now(),
): boolean => {
  if (!token) return false;

  const [expiresAt, signature, ...rest] = token.split(".");
  if (rest.length !== 0 || !signature || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) * 1000 <= now) return false;

  return isSameSignature(signature, sign(expiresAt));
};

/**
 * セッションCookieを発行する
 * @param headers レスポンスヘッダ
 */
export const setSessionCookie = (headers: Headers): void => {
  setCookie(headers, {
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(),
    path: "/",
    httpOnly: true,
    // ローカル開発はHTTPで動かすため、本番のみSecureを付ける
    secure: !Deno.env.get("DEVELOP"),
    sameSite: "Lax",
    maxAge: SESSION_MAX_AGE,
  });
};

/**
 * ログイン済みのリクエストか
 * @param req Request
 */
export const isLoggedIn = (req?: Request): boolean => {
  if (!req) return false;
  return isValidSessionToken(getCookies(req.headers)[SESSION_COOKIE_NAME]);
};
