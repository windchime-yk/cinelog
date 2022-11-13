import { statusCode, type StatusCodeNumber } from "./deps.ts";
import testJson from "./assets/test.json" assert { type: "json" };
import { config } from "./config.ts";
import type { ApiCodeOptions, MovieInfo } from "./model.ts";

/**
 * ユーザー名かパスワードがシステム側に保存されているものと一致するか
 * @param username ユーザー名
 * @param password パスワード
 * @returns
 */
export const isInvalidAccount = (
  username: string | null,
  password: string | null,
): boolean => username !== config.username || password !== config.password;

/**
 * APIコードを生成する
 * @param options.api API名
 * @param options.method HTTPメソッド
 * @param options.status ステータスコード
 */
export const getApiCode = (options: ApiCodeOptions): string => {
  const { api = "common", method, status = statusCode.ok } = options;
  return `${api}-${method.toLowerCase()}-${status}`;
};

/**
 * JSONのResponseを返却する
 * @param data HTML文字列
 * @param status ステータスコード
 */
export const jsonResponse = <T extends Record<never, never>>(
  data: T,
  status: StatusCodeNumber = statusCode.ok,
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
    status: statusCode.movedPermanently,
  });

/**
 * 鑑賞作品データの配列を返却する
 */
export const fetchMovieInfo = (): MovieInfo[] => {
  // TODO: Local Storageの取得処理を入れる
  // TODO: SurrealDBの取得処理を入れる
  // TODO: limitの引数を追加して鑑賞作品データの出力数を絞る処理を入れる
  return testJson;
};

/**
 * 上映開始時間と終了時間から上映時間を算出する
 * @param startTime 上映開始時間
 * @param lastTime 上映終了時間
 */
export const caliculateShowtimes = (
  startTime: string,
  lastTime: string,
): number => {
  const diff = new Date(lastTime).getTime() - new Date(startTime).getTime();
  // TODO: もしdiffがマイナスだったらlastTimeを分解して次の日にしてから再計算させる
  return diff / 60_000;
};
