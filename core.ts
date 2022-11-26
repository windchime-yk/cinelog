import { connect, statusCode, type StatusCodeNumber } from "./deps.ts";
import { config } from "./config.ts";
import type { ApiCodeOptions, CombineSqlOptions, MovieInfo } from "./model.ts";

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
  options: CombineSqlOptions,
): Promise<MovieInfo[]> => {
  const conn = connect({
    host: config.ps_host,
    username: config.ps_username,
    password: config.ps_password,
  });

  const sql = new CombineSql();
  const result = await conn.execute(sql.generateSelectSql({
    table: options.table,
    fields: options.fields,
    where: options.where,
    like: options.like,
    order: {
      target: options.order?.target ?? "view_date",
      sort: options.order?.sort ?? "desc",
    },
    limit: options.limit,
  }));

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

/** SQL文の断片を1つにまとめて文字列として生成する */
export class CombineSql {
  /**
   * フィールドを指定するSQL断片を生成
   * @param fields フィールド名
   */
  private getFields(fields: CombineSqlOptions["fields"]): string {
    if (!fields) return "*";
    return fields.join(",");
  }

  /**
   * テーブルを指定するSQL断片を生成
   * @param table テーブル名
   */
  private getTable(table: CombineSqlOptions["table"]) {
    return `FROM ${table}`;
  }

  /**
   * 検索条件を指定するSQL断片を生成
   * @param where 検索条件
   * @param like 曖昧検索条件
   */
  private getWhere(
    where: CombineSqlOptions["where"],
    like: CombineSqlOptions["like"],
  ): string {
    if (!where) return "";
    if (like) return `WHERE ${where} LIKE '%${like}%'`;
    return `WHERE ${where}`;
  }

  /**
   * 並び替え順を指定するSQL断片を生成
   * @param order 並び替え順
   */
  private getOrder(order: CombineSqlOptions["order"]): string {
    if (!order) return "";
    return `ORDER BY ${order.target} ${order.sort}`;
  }

  /**
   * 出力データ数を指定するSQL断片を生成
   * @param limit 出力データ数
   */
  private getLimit(limit: CombineSqlOptions["limit"]): string {
    if (!limit) return "";
    return `LIMIT ${limit}`;
  }

  /**
   * SQL断片を1つのSQL文に結合する
   * @param sql SQL文の断片の配列
   */
  private joinSqlFragment(sql: string[]): string {
    return sql.join(" ").trim().replace(/ {2,}/g, " ");
  }

  /**
   * SELECT文の生成
   * @param options テーブル名やフィールド名などの条件
   */
  public generateSelectSql(options: CombineSqlOptions): string {
    const sql = [
      this.getFields(options.fields),
      this.getTable(options.table),
      this.getWhere(options.where, options.like),
      this.getOrder(options.order),
      this.getLimit(options.limit),
    ];

    return `SELECT ${this.joinSqlFragment(sql)}`;
  }
}
