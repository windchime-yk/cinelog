import { Status } from "std/http/http_status.ts";
import type { ApiCodeOptions } from "../model.ts";

/**
 * APIコードを生成する
 * @param options.api API名
 * @param options.method HTTPメソッド
 * @param options.status ステータスコード
 */
export const getApiCode = (options: ApiCodeOptions): string => {
  const { api = "common", method, status = Status.OK } = options;
  return `${api}-${method.toLowerCase()}-${status}`;
};

/**
 * JSONのResponseを返却する
 * @param data HTML文字列
 * @param status ステータスコード
 */
export const jsonResponse = <T extends Record<never, never>>(
  data: T,
  status: Status = Status.OK,
): Response =>
  new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-API-KEY",
    },
    status,
  });

/**
 * リダイレクトのResponseを返却する
 * @param path リダイレクト先
 */
export const redirectResponse = (path: `/${string}`): Response =>
  new Response(null, {
    headers: {
      "Location": path,
    },
    status: Status.MovedPermanently,
  });

/**
 * URLパラメータ取得関数を取得する
 * @param req Request
 */
export const getUrlParams = async (req: Request) => {
  const bodyReader = await req.body?.getReader().read();
  const bodyReaderValue = bodyReader?.value;
  const decoder = new TextDecoder();

  return new URLSearchParams(decoder.decode(bodyReaderValue));
};
