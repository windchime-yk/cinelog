import { STATUS_CODE } from "$std/http/status.ts";
import type { ApiCodeOptions } from "~/model.ts";

/**
 * APIコードを生成する
 * @param options.api API名
 * @param options.method HTTPメソッド
 * @param options.status ステータスコード
 */
export const getApiCode = (options: ApiCodeOptions): string => {
  const { api = "common", method, status = STATUS_CODE.OK } = options;
  return `${api}-${method.toLowerCase()}-${status}`;
};

/**
 * リダイレクトのResponseを返却する
 * @param path リダイレクト先
 */
export const redirectResponse = (path: `/${string}`): Response =>
  new Response(null, {
    headers: {
      "Location": path,
    },
    status: STATUS_CODE.Found,
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
