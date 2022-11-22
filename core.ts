import { connect, statusCode, type StatusCodeNumber } from "./deps.ts";
import { config } from "./config.ts";
import type {
  ApiCodeOptions,
  FetchMovieInfoOptions,
  MovieInfo,
} from "./model.ts";

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
export const fetchMovieInfo = async (
  options?: FetchMovieInfoOptions,
): Promise<MovieInfo[]> => {
  const conn = connect({
    host: config.ps_host,
    username: config.ps_username,
    password: config.ps_password,
  });
  const fieldset = options?.fields?.join(",");
  const sort = options?.sort ?? "desc";
  let sql: string;
  if (options?.limit) {
    sql =
      `SELECT ${fieldset} FROM tbl_movieinfo ORDER BY view_date ${sort} LIMIT ${options?.limit}`;
  } else if (options?.fields && options?.fields.length > 0) {
    sql = `SELECT ${fieldset} FROM tbl_movieinfo ORDER BY view_date ${sort}`;
  } else sql = `SELECT * FROM tbl_movieinfo ORDER BY view_date ${sort}`;
  const result = await conn.execute(sql);
  return result.rows;
};

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

/**
 * 経過時間か"不明"を表示する
 * @param movie 鑑賞作品データ
 */
export const elapsedTime = (movie: MovieInfo) =>
  movie.view_start_time === null || movie.view_end_time === null
    ? "不明"
    : `${
      caliculateShowtimes(
        `${movie.view_date} ${movie.view_start_time}`,
        `${movie.view_date} ${movie.view_end_time}`,
      )
    }分`;
